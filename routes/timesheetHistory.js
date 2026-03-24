const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {getTimesheetHistory,} = require("../controller/timesheetHistoryController");

const router = express.Router();

router.get("/timesheet-history",authMiddleware,getTimesheetHistory);

module.exports = router;
