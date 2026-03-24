const User=require("../model/user");
const Project=require("../model/project");

exports.assign=async (req,res) => {
    try{
        const userId=req.user.userId;
        const {projectId}=req.body;

        if (!projectId) {
      return res.status(400).json({message: "Project ID is required",});
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({message: "Invalid project ID",});
    }

    const alreadyAssigned = await User.exists({
      _id: userId,
      assignedProjects: projectId,
    });

    if (alreadyAssigned) {
      return res.status(409).json({message: "Project already assigned to this user",});
    }

    await User.findByIdAndUpdate(
      userId,
      { $push: { assignedProjects: projectId } }, // push is safe now
      { new: true }
    );

    res.status(200).json({
      message: "Project assigned successfully",
      projectId,
    });
    } catch(error){
        res.status(500).json({message: "Server error",error: error.message,});
    }
    
};




exports.deassign=async (req,res) => {
    try{
         const userId = req.user.userId;        // from auth middleware
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    // optional but recommended: check project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Invalid project ID",
      });
    }

    // check if project is actually assigned
    const result = await User.findOneAndUpdate(
      { _id: userId, assignedProjects: projectId },
      { $pull: { assignedProjects: projectId } }
    );

    if (!result) {
      return res.status(409).json({
        message: "Project is not assigned to this user",
      });
    }

    res.status(200).json({
      message: "Project deassigned successfully",
      projectId,
    });
    }
    catch(error){
        res.status(500).json({message: "Server error",error: error.message,});
    }
};



exports.getAssignedProjects = async (req, res) => {
  try {
    const userId = req.user.userId; //from authmiddleware

    const user = await User.findById(userId)
      .populate("assignedProjects"); // 🔥 IMPORTANT

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    res.status(200).json({
      assignedProjects: user.assignedProjects,
      name:user.name,
      role:user.role,
      email:user.email,
      code:user.id,
    });
   

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};