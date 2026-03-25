const User=require("../model/user");

exports.getAllUserDetails=async(req,res) => {
    try{
      

        const user = await User.find().select("-password") ;

      if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User details fetched successfully",
      user,
    });

    }
    catch(error){
        return res.status(500).json({
            message:"Failed to fetch user detail"
        });
    }

};

exports.updateEmp = async (req, res) => {
  try {
    const userId = req.params.id;   // id from URL
    const { id, name, email, role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // update fields
    user.id = id || user.id;
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    res.status(200).json({
      message: "Employee updated successfully",
      user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update user detail"
    });
  }
};