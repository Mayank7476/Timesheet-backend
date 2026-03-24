const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { markLeave,getLeaves } = require("../controller/leaveController");

const router = express.Router();

router.post("/markleave", authMiddleware, markLeave);
router.get("/getleave",authMiddleware,getLeaves);

module.exports = router;
