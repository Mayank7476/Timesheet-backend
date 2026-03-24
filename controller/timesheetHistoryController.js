const TimeSheet = require("../model/timesheet");

exports.getTimesheetHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { tab } = req.query; // submitted | approved

    let filter = { userId };

    // 🔑 IMPORTANT LOGIC
    if (tab === "submitted") {
      filter.status = { 
        $in: ["submitted", "partially-submitted","approved", "partially-approved"] 
      };
    }

    if (tab === "approved") {
      filter.status = { 
        $in: ["approved", "partially-approved"] 
      };
    }

    const timesheets = await TimeSheet.find(filter)
      .sort({ weekStartDate:1 })
      .select(
        "weekStartDate weekEndDate status submittedAt approvedAt totalHours"
      );

    res.status(200).json({
      success: true,
      timesheets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch timesheet history",
    });
  }
};
