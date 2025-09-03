
// routes/trade.routes.js
const express    = require('express');

const Router     = express.Router();
const controllers=require("./controller");




// Buy Stock
Router.post('/buy', controllers.buyStock);

// Sell Stock
Router.post('/sell', controllers.sellStock);

Router.post("/signup",controllers.signup);

Router.put("/updateProfile/:id",controllers.updateUserProfile);
Router.delete("/deleteProfile/:id",controllers.deleteUserProfile);
Router.post("/login",controllers.login);
Router.get("/userProfile/:id",controllers.getUserProfile);
Router.get("/allStocks",controllers.getAllStocks);
Router.post("/transaction",controllers.transaction);





module.exports = Router;
