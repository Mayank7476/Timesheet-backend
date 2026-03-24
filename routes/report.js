const express=require("express");
const authMiddleware=require("../middleware/authMiddleware");
const {isAdmin}=require("../middleware/roleMiddleware");
const { getReport, getReportFront } = require("../controller/reportController");
const router=express.Router();


router.post("/getReportofall",authMiddleware,isAdmin,getReport);
router.post("/getReportfron",authMiddleware,isAdmin,getReportFront);

module.exports=router;