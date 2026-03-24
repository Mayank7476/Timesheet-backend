const express=require("express");
const authMiddleware=require("../middleware/authMiddleware");
const {assign,deassign,getAssignedProjects}=require("../controller/projectAssignController");

const router=express.Router();

router.post("/assign",authMiddleware,assign);
router.post("/deassign",authMiddleware,deassign);
router.get("/getAssign",authMiddleware,getAssignedProjects)
module.exports=router;