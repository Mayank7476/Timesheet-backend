const express = require("express");
const router = express.Router();
const {addGroup,getGroups,getGroupById,deleteGroup,updateGroup} = require("../controller/groupController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

router.post("/addGroup",authMiddleware,isAdmin, addGroup);
router.get("/getGroup", authMiddleware,isAdmin,getGroups);
router.get("/getById/:id", authMiddleware,isAdmin,getGroupById);
router.put("/updateGrpById/:id",authMiddleware, isAdmin,updateGroup);
router.delete("/deleteById/:id", authMiddleware,isAdmin,deleteGroup);

module.exports = router;