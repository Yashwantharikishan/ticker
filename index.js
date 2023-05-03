const express = require("express");
const app = express();

const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://admin-yash:Test1234@cluster0.egrcbdv.mongodb.net/tickerDB');
console.log("Successfully connected to the DataBase");
const tickerSchema = new mongoose.Schema({
    base_unit: String,
    last: String,
    volume: String,
    sell: String,
    buy: String,
    name: String
});
const Ticker = new mongoose.model("ticker", tickerSchema)

app.use("/static",express.static("static"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/ticker", function(req, res){
    Ticker.find({}).then(function(foundTickers){
       res.send(foundTickers);
    });
});



app.listen(3000, function () {
    console.log("Server is runnig on port 3000.");
    Ticker.deleteMany({}).then(function () {
        console.log("Cleared all documents...");
    }).then(function(){
    fetch("https://api.wazirx.com/api/v2/tickers")
        .then(res => res.json())
        .then(function (data) {
            let topData = Object.entries(data)
                .slice(0, 10)
                .map(([k, v]) => v);
            Ticker.insertMany(topData.map(i => ({
                base_unit: i.base_unit,
                last: i.last,
                volume: i.volume,
                sell: i.sell,
                buy: i.buy,
                name: i.name
            })));
            console.log("Inserted data into database...");
        })});
})