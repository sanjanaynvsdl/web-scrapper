const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const scrapeRoute = require('./routes/scrape-data');


const app= express();

app.use(express.json());

app.get("/", (req,res)=>{
    res.json({
        message:"Less go workingg!"
    })
});

app.use("/api/v1/scrape",scrapeRoute);

app.listen(3000,()=>{
    console.log(`Server is listening to port 3000`)
})
