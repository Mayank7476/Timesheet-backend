const Project=require("../model/project");

exports.addProject=async(req,res)=>{
    const { projectCode,projectName,projectGroup}=req.body;
    try{
        const existingProject=await Project.findOne({projectCode});
        if (existingProject) {
        return res.status(409).json({ message: "Project already exists" });
        }
        const project=await Project.create({
            projectCode,
            projectName,
            projectGroup,
        });
        res.status(201).json({
      message: "Project created successfully",
      projectId: project._id,
    });
    }catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
exports.getProject=async(req,res)=>{
    try{
        const projects = await Project.find()
      .populate("projectGroup", "groupName");
         res.status(201).json(projects); 
    }
    catch(error){
    console.error(error);
    res.status(500).json({ message: "Server error" });
    }
}
exports.removeProject=async(req,res)=>{
    const{projectCode}=req.params;
    try{
        const project=await Project.findOne({projectCode});
        if(!project){
            return res.status(404).json({message:"project not found"});
        }

        await Project.deleteOne({projectCode});
        return res.status(200).json({message:"project deleted successfully"});

    }catch(error){
        
         res.status(500).json({ message: "Server error" });
    }
}
exports.updateProject = async (req, res) => {
  const { id } = req.params;   // project id from URL
  const { projectCode, projectName, projectGroup,status } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        projectCode,
        projectName,
        projectGroup,
        status,
      },
      { new: true } // return updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      updatedProject,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};