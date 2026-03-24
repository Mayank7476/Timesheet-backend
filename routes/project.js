const express=require("express");
const {addProject,removeProject,getProject, updateProject}=require("../controller/projectController");
const authMiddleware=require("../middleware/authMiddleware");
const {isAdmin}=require("../middleware/roleMiddleware");
const router=express.Router();

router.post("/addProject",authMiddleware,isAdmin,addProject);
router.get("/find",authMiddleware,getProject);
router.delete("/del/:projectCode",authMiddleware,isAdmin,removeProject);
router.put("/updateProject/:id",authMiddleware,isAdmin,updateProject);
module.exports=router;