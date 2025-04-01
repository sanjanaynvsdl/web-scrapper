const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const scrapeRoute = require('./routes/scrape-data');
const cors = require('cors');


const app = express();

//middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Less go workingg!"
    })
});

app.use("/api/v1/analyze", scrapeRoute);


//for-loclal devlopment
app.listen(3000, () => {
    console.log(`Server is listening to port 3000`)
});
