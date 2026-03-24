const Group = require("../model/group");



// ==========================
// 1️⃣ Add Group
// ==========================
exports.addGroup = async (req, res) => {
  const { groupId, groupName} = req.body;

  try {
    // Check if group already exists
    const existingGroup = await Group.findOne({ groupId });
    if (existingGroup) {
      return res.status(409).json({ message: "Group already exists" });
    }

    const group = await Group.create({
      groupId,
      groupName,
    });

    res.status(201).json({
      message: "Group created successfully",
      data: group,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ==========================
// 2️⃣ Get All Groups
// ==========================
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ==========================
// 3️⃣ Get Single Group
// ==========================
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ==========================
// 4️⃣ Update Group
// ==========================
exports.updateGroup = async (req, res) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({
      message: "Group updated successfully",
      data: updatedGroup,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ==========================
// 5️⃣ Delete Group
// ==========================
exports.deleteGroup = async (req, res) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);

    if (!deletedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



