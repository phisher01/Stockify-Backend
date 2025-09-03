
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

const {User,Order,Stock,Transaction}  = require('./models');

const mongoose   = require('mongoose');


const transaction = async (req, res) => {
  const { userId, type, amount } = req.body;

  if (!userId || !type || amount === undefined) {
    return res.status(400).json({ error: 'userId, type, and amount are required' });
  }

  if (!['credit', 'debit'].includes(type)) {
    return res.status(400).json({ error: 'type must be either credit or debit' });
  }

  try {
    // 1. Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 2. Create transaction
    const transaction = new Transaction({ userId, type, amount });
    const savedTransaction = await transaction.save();

    // 3. Update user's balance and transactions array
    if (type === 'credit') {
      user.cashBalance += amount;
    } else if (type === 'debit') {
      if (user.cashBalance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      user.cashBalance -= amount;
    }

    user.transactions.push(savedTransaction._id);
    await user.save();

    // 4. Respond with saved transaction
    res.status(201).json(savedTransaction);
  } catch (err) {
    console.error('Transaction error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

getAllStocks = async (req, res) => {
  try {
    // Fetch every document in the stocks collection
    const stocks = await Stock.find({});

    // Respond with 200 OK and the list of stocks
    return res.status(200).json({
      success: true,
      data: stocks,
    });
  } catch (err) {
    console.error("Error fetching stocks:", err);
    // On error, send 500 with the error message
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error",
    });
  }
};


const buyStock = async (req, res) => {
  try {
    const { userId, stockId } = req.body;
    if (!userId || !stockId) {
      throw new Error("userId and stockId are required");
    }

    const user = await User.findById(userId);
    const stock = await Stock.findById(stockId);
    if (!user) throw new Error("User not found");
    if (!stock) throw new Error("Stock not found");

    // Check if already bought this stock
    if (user.holdings.includes(stockId)) {
      throw new Error("Stock already in holdings");
    }

    // Check balance
    if (user.cashBalance < stock.price) {
      throw new Error("Insufficient cash balance");
    }
    


    // Create BUY order
    const newOrder = await Order.create({
      owner: userId,
      stockId: stockId,
      stockName:stock.name,
      type: "BUY",
      price: stock.price,
      status: "FILLED",
    });

    // Update user
    user.holdings.push(stockId);
    user.orders.push(newOrder._id);
    user.cashBalance -= stock.price;
    user.totalInvested += stock.price;

    await user.save();

    return res.status(200).json({newOrder,
      message: "Stock bought successfully",
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const sellStock = async (req, res) => {
  try {
    const { userId, stockId } = req.body;
    if (!userId || !stockId ) {
      throw new Error("userId, stockId  are required");
    }

    // Find the user
    const user = await User.findById(userId);
    const stock = await Stock.findById(stockId);
    if (!user) throw new Error("User not found");
    
    // Check if stock is in user's holdings
    const index = user.holdings.indexOf(stockId);
    if(index==-1){
        throw new Error("have to buy this first")
    }
    
    
    // Get all BUY orders for this stock by user
    const buyOrder = await Order.find({
        owner: userId,
        stockId:stockId,
      
        type: "BUY",
    });
    
    if (buyOrder.length === 0) throw new Error("No BUY orders found for this stock");
    
    
    
    // Create SELL order
    const newOrder = await Order.create({
        owner: userId,
        stockId: stockId,
         stockName:stock.name,
        type: "SELL",
        price:stock.price,
        
        status: "FILLED",
    });
    console.log    ("here");
    
    // Update user: remove stock, update balances
    user.orders.push(newOrder._id);
    user.cashBalance += stock.price;
    user.totalInvested -= buyOrder[0].price;
    
    user.holdings.splice(index, 1); // remove stock from holdings

    await user.save();

    return res.status(200).json({
      message: "Stock sold successfully",
      newOrder,prevPrice:buyOrder[0].price
      
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Helper to fetch stock name



    

    
    
    
    


const signup= async (req,res)=>{
    const {username,password,email}=req.body;
    try{
        
       
       
        const user=await User.findOne({$or:[{username},{email}]});
        if(user){
            return   res.status(400).json({message:"User already exists"});
        }
        
        

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
    
   const newuser= new User({
    username,
password:hashedPassword,
email

});
await newuser.save();



const token=jwt.sign({id:newuser._id}, process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
// const token=jwt.sign({id:user.insertId}, process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
res.json({token,userId:newuser._id});






    
}catch(err){
    console.error("Error during Singup:",err.message);
    res.status(500).send("Server Error");
    
    
}
}
const login=async (req,res)=>{
    const {email,password}=req.body;
    
    try{
        const user=await User.findOne({email});
        if(!user){
           return  res.status(404).json({message:"User not found for this email"});
        }
      
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(404).json({message:"Wrong Password Enter"});
        }
        
        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
        res.json({token,userId:user._id});
        
        
    }catch(err){
        console.error("Error during login",err);
        res.status(500).send("Server Error");
    }}  
    
    const   getUserProfile=async (req,res)=>{
        
        
        const currentID=req.params.id;
        try{
            const user=await User.findById(currentID).populate("holdings").populate("orders").populate("transactions");
            if(!user){
                return res.status(404).json({message:"User not found"});
                
            }

               const userF=user.toObject();
                userF.currentValue=user.holdings.reduce((acc,s)=>{
                    return s.price+acc;

                },0)
            res.json(userF);
        }catch(err){
            console.error("Error during fetching",err);
            res.status(500).send("Server Error");   
        }
        
        
    }
    const updateUserProfile=async(req,res)=>{
        
        
        const currentID=req.params.id;
        const{email,password}=req.body;
        try{
            const user=await  User.findOne({email});
            if(user){
                return res.status(400).json({message:"Email already has been used"});

            }
            let updateFields={
                email,
            }
            if(password){
                const salt=await bcrypt.genSalt(10);
                const hashedPassword=await bcrypt.hash(password,salt);
                updateFields.password=hashedPassword;
                
                
            }
            const result=await User.findByIdAndUpdate(currentID,{$set:updateFields},{new:true});
         
            if(!result){
                
                return res.status(404).json({message:"User not found"});
            }
           
            res.send(result);
            
        }catch(err){
            
            console.error("Error during updating",err);
            res.status(500).send("Server Error");
    
            
        }
    
    
}
const deleteUserProfile=async(req,res)=>{
    const currentID=req.params.id;
    try{
            
       
        const result=await User.findByIdAndDelete(currentID);
        if(!result){
            
            return res.status(404).json({message:"User not found"});
        }
        res.json({message:"User Profile Deleted"});
        
    }catch(err){
        
        console.error("Error during deleti  ng",err);
        res.status(500).send("Server Error");

        
    }


}
module.exports={sellStock,buyStock,

   
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    
    deleteUserProfile,
    getAllStocks,transaction
}

