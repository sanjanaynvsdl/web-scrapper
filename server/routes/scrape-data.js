const express = require('express');
const puppeteer = require('puppeteer-core');
const router = express.Router();

router.post("/", async (req, res) => {
    let browser;
    try {
        const url = req.body.url;
        console.log(process.env.BRIGHT_DATA_URL);
        browser = await puppeteer.connect({ browserWSEndpoint: process.env.BRIGHT_DATA_URL });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(3 * 60 * 1000); // Increase timeout

        // Navigate to the page
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Optionally, listen for navigations to diagnose unexpected reloads
        page.on('framenavigated', frame => {
            console.log(`Frame navigated to: ${frame.url()}`);
        });
        
        console.log("Control reached here to get titles");

        // Wait for the element to be present before evaluating
        await page.waitForSelector('#productTitle', { timeout: 10000 });
        const titles = await page.$$eval('#productTitle', elements => 
            elements.map(el => el.innerHTML.trim())
        );
        console.log(titles);
        
        await page.screenshot({ path: "screenshot.png", fullPage: true });
        console.log('Control reached here post titles');

        return res.status(200).json({
            message: "you did it girrll",
            titles: titles
        });

    } catch (error) {
        console.error(`Error while scraping the data: ${error}`);
        return res.status(500).json({
            message: "Internal server error while scraping data",
            error: error.message,
        });
    } finally {
        if (browser) await browser.close();
    }
});

module.exports = router;
