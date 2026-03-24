const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin }=require("../middleware/roleMiddleware");
const { getAllUserDetails, updateEmp } = require("../controller/userController");
const router = express.Router();


router.get("/getAllUser", authMiddleware,isAdmin,getAllUserDetails);
router.put("/updateUser/:id",authMiddleware,isAdmin,updateEmp);
module.exports=router;