const mongoose = require('mongoose');
const {
  
  
  ordersSchema,
  stocksSchema,
  transactionSchema,
  userSchema
} = require('./schemas');


// Define models using mongoose.model(modelName, schema)
const Stock  = mongoose.model('Stock', stocksSchema);
const User = mongoose.model('User', userSchema);
const Order    = mongoose.model('Order', ordersSchema);
const Transaction=mongoose.model('Transaction', transactionSchema);

module.exports = {
  Stock,
  User,
  Transaction,
  Order
};