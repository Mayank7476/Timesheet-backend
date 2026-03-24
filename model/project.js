const mongoose=require("mongoose");
const projectSchema=new mongoose.Schema(
    {
        projectCode:{
            type :String,
            required:true,
            unique:true,
        },
        projectName:{
            type: String,
            required:true,
        },
        projectGroup:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Group",
        },],
        status:{
            type: String,
            enum:["open","closed"],
            default:"open",
        },
        

    },
    {timestamps:true}
);
module.exports =mongoose.model("Project",projectSchema);