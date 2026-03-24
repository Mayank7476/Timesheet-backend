const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id:{type:String , required:true,unique:true},
    name:{type:String, required:true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true,},

    password: { type: String, required: true, minlength: 6,},

    role: { type: String, enum: ["user", "admin"], default: "user", },

    DOJ:{ type:Date},

      assignedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  {timestamps: true,}
);

module.exports = mongoose.model("User", userSchema);