const express=require("express");
const { login }=require("../controller/loginController");
const { signup }=require("../controller/signupController")
const router=express.Router();

router.post("/login",login);
router.post("/signup",signup);

module.exports=router;