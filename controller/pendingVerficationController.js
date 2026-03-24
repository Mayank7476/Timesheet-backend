const TimeSheet = require("../model/timesheet");


exports.getPendingTimesheets = async (req, res) => {
  try {
    
    const userId = req.user.userId;
    

    const filter = { 
      status:{$in: ["submitted","partially-submitted"]} ,
      userId: userId,
    };



    const timesheets = await TimeSheet.find(filter)
      .populate("userId", "name id")
      .sort({ weekStartDate: 1 });

    res.json({
      count: timesheets.length,
      timesheets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch pending timesheets",
    });
  }
};




exports.verifyTimesheet = async (req, res) => {
  try {
    const { id } = req.params;
    const approverId = req.user.userId; 

    const timesheet = await TimeSheet.findById(id);

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    // ✅ Allow both statuses
    if (!["submitted", "partially-submitted"].includes(timesheet.status)) {
      return res.status(400).json({
        message: "Only submitted or partially-submitted timesheets can be approved",
      });
    }

    // ✅ Set status dynamically
    if (timesheet.status === "submitted") {
      timesheet.status = "approved";
    } else if (timesheet.status === "partially-submitted") {
      timesheet.status = "partially-approved";
    }

    timesheet.approvedAt = new Date();
    timesheet.approvedBy = approverId;

    await timesheet.save();

    res.json({
      message: "Timesheet approved successfully ✅",
      timesheet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to approve timesheet",
    });
  }
};


exports.popUpTimesheet = async (req, res) => {
  try {
    const { id } = req.params; // ✅ timesheetId from URL

    if (!id) {
      return res.status(400).json({
        message: "Timesheet ID is required",
      });
    }

    const timesheet = await TimeSheet.findById(id)
      .populate("entries.projectId", "projectName projectCode")
      .populate("userId", "id name");

    if (!timesheet) {
      return res.status(404).json({
        message: "Timesheet not found",
      });
    }

    res.status(200).json({
      timesheet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load timesheet for popup",
    });
  }
};



exports.savePopUp=async (req,res)=>{
  
   try {
    const { id } = req.params; // timesheetId

   
    const { entries } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Timesheet ID is required",
      });
    }

    if (!Array.isArray(entries)) {
      return res.status(400).json({
        message: "Invalid entries format",
      });
    }

    const timesheet = await TimeSheet.findById(id);

    if (!timesheet) {
      return res.status(404).json({
        message: "Timesheet not found",
      });
    }

    // ❌ Block ONLY if approved
    if (timesheet.status === "approved") {
      return res.status(403).json({
        message: "Approved timesheet cannot be edited",
      });
    }

    // ✅ Sanitize entries
    const sanitizedEntries = entries.map((e) => ({
      projectId: e.projectId.toString(),
      hours: Array.isArray(e.hours)
        ? e.hours.map((h) => Number(h) || 0)
        : [],
    }));

    // 🔍 Compare with existing
    const existingEntries = timesheet.entries.map((e) => ({
      projectId: e.projectId.toString(),
      hours: e.hours.map((h) => Number(h) || 0),
    }));

    const hasChanged =
      JSON.stringify(existingEntries) !==
      JSON.stringify(sanitizedEntries);

    if (!hasChanged) {
      return res.status(400).json({
        message: "No changes detected",
      });
    }

    // 🔄 Update only entries
    timesheet.entries = sanitizedEntries;

    await timesheet.save();

    res.status(200).json({
      message: "Timesheet updated successfully ✅",
      timesheet,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load timesheet for popup",
    });
  }
}
