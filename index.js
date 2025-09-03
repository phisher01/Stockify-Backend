const express=require("express");
const dotenv=require("dotenv");

dotenv.config();
const mongoose=require("mongoose");
const cors = require('cors');

const app=express   ();
app.use(express.json());
app.use(cors());

const mainRouter=require("./routes");
const { Stock } = require("./models");
const PORT=process.env.PORT || 3002;

const uri=process.env.MONGO_URL;
// Stock.insertMany([
//   {
//     name: "ADANIENT",
//     qty: 3,
//     avg: 2100.5,
//     price: 2045.2,
//     net: "-2.63%",
//     day: "-1.02%",
//     percent: "1.02%",
//     isDown: true,
//     isLoss: true,
//   },
//   {
//     name: "DMART",
//     qty: 2,
//     avg: 3680.0,
//     price: 3725.5,
//     net: "+1.24%",
//     day: "+0.42%",
//     percent: "0.42%",
//     isDown: false,
//   },
//   {
//     name: "ZOMATO",
//     qty: 10,
//     avg: 122.0,
//     price: 138.4,
//     net: "+13.44%",
//     day: "+1.03%",
//     percent: "1.03%",
//     isDown: false,
//   },
//   {
//     name: "NYKAA",
//     qty: 6,
//     avg: 160.0,
//     price: 148.5,
//     net: "-7.19%",
//     day: "-0.67%",
//     percent: "0.67%",
//     isDown: true,
//     isLoss: true,
//   },
//   {
//     name: "DELHIVERY",
//     qty: 4,
//     avg: 415.0,
//     price: 435.2,
//     net: "+4.86%",
//     day: "+1.88%",
//     percent: "1.88%",
//     isDown: false,
//   },
//   {
//     name: "DIXON",
//     qty: 1,
//     avg: 5500.0,
//     price: 5799.9,
//     net: "+5.45%",
//     day: "-0.30%",
//     percent: "0.30%",
//     isDown: true,
//     isLoss: true,
//   },
//   {
//     name: "LTIMINDTREE",
//     qty: 2,
//     avg: 5500.0,
//     price: 5335.8,
//     net: "-2.97%",
//     day: "-0.62%",
//     percent: "0.62%",
//     isDown: true,
//     isLoss: true,
//   },
//   {
//     name: "ADANIGREEN",
//     qty: 3,
//     avg: 920.0,
//     price: 968.9,
//     net: "+5.30%",
//     day: "+1.10%",
//     percent: "1.10%",
//     isDown: false,
//   },
//   {
//     name: "IRCTC",
//     qty: 2,
//     avg: 680.0,
//     price: 715.0,
//     net: "+5.15%",
//     day: "+0.20%",
//     percent: "0.20%",
//     isDown: false,
//   },
//   {
//     name: "LICI",
//     qty: 1,
//     avg: 830.0,
//     price: 803.5,
//     net: "-3.18%",
//     day: "-0.55%",
//     percent: "0.55%",
//     isDown: true,
//     isLoss: true,
//   },
//   {
//     name: "PAYTM",
//     qty: 4,
//     avg: 630.0,
//     price: 645.4,
//     net: "+2.44%",
//     day: "+0.95%",
//     percent: "0.95%",
//     isDown: false,
//   },
//   {
//     name: "COALINDIA",
//     qty: 5,
//     avg: 330.5,
//     price: 344.8,
//     net: "+4.33%",
//     day: "-0.22%",
//     percent: "0.22%",
//     isDown: true,
//     isLoss: true,
//   },
//   {
//     name: "TITAN",
//     qty: 2,
//     avg: 3300.0,
//     price: 3455.2,
//     net: "+4.70%",
//     day: "+0.58%",
//     percent: "0.58%",
//     isDown: false,
//   }
// ])



app.use(mainRouter);

mongoose.connect(uri).then(()=>{
    console.log("Database connectivity successful");
}).catch((err)=>{
    console.log("Error in db connectivity ",err);
})









app.listen(PORT,()=>{
    console.log("server is listening on port 8080")
})

