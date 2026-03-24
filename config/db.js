const mongoose=require('mongoose');

const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb atlas connect");
    }
    catch(error){
        console.error("mongodb not connected",error.message);
    }
};

module.exports=connectDB;