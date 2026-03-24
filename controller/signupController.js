const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/user");

exports.signup=async(req,res)=>{
    const { id,name,email, password,role,DOJ } = req.body;
    if (!id||!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole=role==="admin"?"admin":"user"
    const user = await User.create({
      id,
      name,
      email,
      password: hashedPassword,
      role:userRole,
      DOJ,
      assignedProjects:[]
    });

    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}