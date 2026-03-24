const express=require("express");
const authMiddleware=require("../middleware/authMiddleware");
const {getInitialWeek,saveCurrentWeekTimesheet,submitCurrentWeekTimesheet,getWeekTimesheet}=require("../controller/timesheetcontroller");

const router=express.Router();
router.post("/save",authMiddleware,saveCurrentWeekTimesheet);
router.post("/submit",authMiddleware,submitCurrentWeekTimesheet);
router.get("/week",authMiddleware,getWeekTimesheet);

router.get("/initial-week", authMiddleware, getInitialWeek);

module.exports=router;