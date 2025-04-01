const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeAmazonProduct(url) {
    if (!url || !url.includes("amazon.in")) {
        throw new Error("Invalid Amazon India URL.");
    }

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    let page;
    try {
        page = await browser.newPage();
        
        //using this, so that amazon bot-cannot block 
         await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        );

        await page.setDefaultNavigationTimeout(180000);
        await page.goto(url, { waitUntil: 'networkidle2' });

        const getText = async (selector) => {
            try {
                return await page.$eval(selector, el => el.textContent.trim());
            } catch {
                return null;
            }
        };

        const product = {};

        // --- PRODUCT DETAILS ---
        product.name = await getText('#productTitle');

        product.rating = await page.evaluate(() => {
            const el = document.querySelector('i.a-icon-star span.a-icon-alt');
            return el ? el.textContent.trim() : null;
        });

        product.numRatings = await getText('#acrCustomerReviewText');

        product.actualPrice = await page.evaluate(() => {
            const symbol = document.querySelector('.a-price-symbol')?.textContent || '₹';
            const mrpWhole = document.querySelector('#priceblock_ourprice, .priceBlockStrikePriceString, .a-price.a-text-price .a-offscreen')?.textContent;
            if (mrpWhole) return mrpWhole.trim();
            return null;
        });

        
        product.sellingPrice = await page.evaluate(() => {
            const symbol = document.querySelector('.a-price-symbol')?.textContent || '₹';
            const whole = document.querySelector('.a-price-whole')?.textContent || '';
            const fraction = document.querySelector('.a-price-fraction')?.textContent || '00';
            return whole ? `${symbol}${whole}.${fraction}` : null;
        });

        product.discount = await getText('.savingsPercentage');

        // --- BANK OFFERS ---
        try {
            await page.waitForSelector('.a-carousel-viewport ol', { timeout: 10000 });

            let sideSheetLoaded = false;
            for (let i = 0; i < 2; i++) {
                await page.evaluate(() => {
                    const trigger = document.querySelector('#itembox-InstantBankDiscount [data-action="side-sheet"]');
                    if (trigger) {
                        trigger.scrollIntoView({ block: "center" });
                        trigger.click();
                    }
                });

                await new Promise(res => setTimeout(res, 2000)); // Wait for animation

                try {
                    await page.waitForFunction(() => {
                        const sheet = document.querySelector('#tp-side-sheet-main-section');
                        return sheet && sheet.innerText.includes('Offer');
                    }, { timeout: 8000 });

                    sideSheetLoaded = true;
                    break;
                } catch { continue; }
            }

            if (sideSheetLoaded) {
                product.bankOffers = await page.evaluate(() => {
                    const container = document.querySelector('#tp-side-sheet-main-section');
                    if (!container) return [];

                    const blocks = container.querySelectorAll('.vsx-offers-desktop-lv__item');
                    const offers = [];

                    blocks.forEach(block => {
                        const title = block.querySelector('h1')?.innerText?.trim();
                        const desc = block.querySelector('p')?.innerText?.trim();
                        if (title && desc) {
                            offers.push(`${title}: ${desc}`);
                        }
                    });

                    return offers.slice(0, 6);
                });
            } else {
                product.bankOffers = [];
                console.warn("Side sheet failed to open.");
            }
        } catch (e) {
            console.warn("Bank offers error:", e.message);
            product.bankOffers = [];
        }

        await page.waitForSelector('#reviewsMedley', { timeout: 10000 });

        product.reviews = await page.evaluate(() => {
            const reviewList = document.querySelectorAll('#cm-cr-dp-review-list .review');
            const reviews = [];

            reviewList.forEach((review, index) => {
                if (index >= 6) return; 

                const name = review.querySelector('.a-profile-name')?.innerText?.trim();
                const title = Array.from(review.querySelectorAll('[data-hook="review-title"] span'))
                    .map(span => span.innerText?.trim())
                    .filter(text => !!text && !text.includes('out of'))[0];

                const ratingText = review.querySelector('[data-hook="review-star-rating"] span')?.innerText || '';
                const rating = parseFloat(ratingText.match(/[\d.]+/)?.[0]);
                const date = review.querySelector('[data-hook="review-date"]')?.innerText?.trim();
                const body = review.querySelector('[data-hook="review-body"] span')?.innerText?.trim();

                reviews.push({ name, title, rating, date, body });
            });

            return reviews;
        });



        // --- DESCRIPTION FIELDS ---
        product.aboutThisItem = await page.$$eval('#feature-bullets ul li', els =>
            els.map(el => el.textContent.trim()).filter(Boolean)
        );

        product.productInfo = await page.$$eval('#productDetails_techSpec_section_1 tr', rows => {
            return rows.map(row => {
                const cols = row.querySelectorAll('td, th');
                return {
                    key: cols[0]?.textContent.trim(),
                    value: cols[1]?.textContent.trim()
                };
            }).filter(obj => obj.key && obj.value);
        });

        product.images = await page.evaluate(() => {
            const imgs = new Set();
            document.querySelectorAll('#altImages img').forEach(img => {
                imgs.add(img.src.replace('_SS40_', '_SL1500_'));
            });
            document.querySelectorAll('img').forEach(img => {
                if (img.closest('#fromTheManufacturer') || img.alt.toLowerCase().includes('manufacturer')) {
                    imgs.add(img.src);
                }
            });
            return Array.from(imgs);
        });

        return product;

    } catch (error) {
        console.error("Scraping failed", error);
        throw new Error("Scraping failed: " + error.message);
    } finally {
        if (browser) await browser.close();
    }
}

module.exports = { scrapeAmazonProduct };
