

 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  ],
  holdings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock'
    }
  ],
  cashBalance: {
    type: Number,
    default: 4000
  },
  totalInvested: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});



const stocksSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,




    },
    qty:Number,
    avg:Number,
    price:Number,
    percent:String,
    isDown:Boolean,
    net:String,
    day:String,
    


})


const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);




const   ordersSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true
  },
  stockName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
 
  price: {
    // the executed price per unit
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'FILLED', 'CANCELLED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});



module.exports={stocksSchema , ordersSchema,userSchema,transactionSchema};



