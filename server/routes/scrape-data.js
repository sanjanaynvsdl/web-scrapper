const express = require('express');
const router = express.Router();
const { scrapeAmazonProduct } = require('../controllers/scrape-product')
const summarizeReviews= require('../controllers/summarizer');

router.post("/", async (req, res) => {
    try {
        const { url } = req.body;
        const scrapedProduct = await scrapeAmazonProduct(url);
        const summary = await summarizeReviews(scrapedProduct.reviews);

        return res.status(200).json({
            message: "Scraped and summarized successfully",
            data: {
                ...scrapedProduct,
                summary
            }
        });

    } catch (err) {
        console.error("Error in /analyze:", err.message);
        return res.status(500).json({
            message: "Failed to process product",
            error: err.message
        });
    }
});

module.exports = router;
