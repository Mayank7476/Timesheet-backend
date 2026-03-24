const mongoose=require("mongoose");
const groupSchema = new mongoose.Schema(
    {
        groupId: {
            type: String,
            required:true,
        },
        groupName:{
            type:String,
            required:true,
        },
       blocked:{
            type: String,
            enum:["yes","no"],
            default:"no",
        },
        
    },
    {timestamps:true}
);
module.exports=mongoose.model("Group",groupSchema);