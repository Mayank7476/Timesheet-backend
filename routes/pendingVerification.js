const express=require("express");
const authMiddleware=require("../middleware/authMiddleware");
const {savePopUp,popUpTimesheet,getPendingTimesheets,verifyTimesheet} =require("../controller/pendingVerficationController");
const router=express.Router();

router.get("/pending",authMiddleware,getPendingTimesheets);
router.post("/:id/verify",authMiddleware,verifyTimesheet);
router.get("/pop/:id",authMiddleware,popUpTimesheet);
router.put("/popSave/:id",authMiddleware,savePopUp);

module.exports=router;