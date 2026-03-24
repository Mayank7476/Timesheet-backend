const TimeSheet = require("../model/timesheet");
const User = require("../model/user");


/* GET current week timesheet for logged-in user */
exports.saveCurrentWeekTimesheet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { entries } = req.body;

    const {monday,sunday}=req.body
    const weekStart = new Date(monday);
const weekEnd = new Date(sunday);

weekStart.setHours(0,0,0,0);
weekEnd.setHours(23,59,59,999);

    // ✅ Validate
    if (!Array.isArray(entries)) {
      return res.status(400).json({ message: "Invalid entries format" });
    }

    // ✅ Trust frontend defaults (0), just sanitize numbers
    const sanitizedEntries = entries.map((e) => ({
      projectId: e.projectId,
      hours: Array.isArray(e.hours)
        ? e.hours.map((h) => Number(h) || 0)
        : [],
    }));

    // 🔍 Find current week timesheet
    let timesheet = await TimeSheet.findOne({
      userId,
      weekStartDate: weekStart,
    });

    // ❌ Do not allow save if already submitted
    if (timesheet && timesheet.status === "submitted") {
      return res
        .status(403)
        .json({ message: "Timesheet already submitted" });
    }

    // 🔄 Update
    if (timesheet) {
      timesheet.entries = sanitizedEntries;
      await timesheet.save();

      return res.json({
        message: "Timesheet saved successfully",
        timesheet,
      });
    }

    // 🆕 Create
    timesheet = await TimeSheet.create({
      userId,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      entries: sanitizedEntries,
      status: "draft",
    });

    res.status(201).json({
      message: "Timesheet created successfully",
      timesheet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save timesheet",
    });
  }
};

exports.submitCurrentWeekTimesheet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const { monday,status } = req.body;
    

    const currentWeekStart = new Date(monday);

    // 🔎 Find last submitted week
    const lastSubmitted = await TimeSheet.findOne({
      userId,
      status: { $in: ["submitted", "approved"] },
    }).sort({ weekStartDate: -1 });
      
    // ✅ CASE 1 — No previous submission
   if (!lastSubmitted) {
  const doj = new Date(user.DOJ);
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  // const isSameDate = (d1, d2) =>
  //   d1.getFullYear() === d2.getFullYear() &&
  //   d1.getMonth() === d2.getMonth() &&
  //   d1.getDate() === d2.getDate();

  if (!(doj >= currentWeekStart && doj <= weekEnd))  {
   
    return res.status(400).json({
      message: "You can only submit your DOJ week first.",
    });
    
  }
}

    else {
      const nextAllowedWeek = new Date(lastSubmitted.weekStartDate);
      nextAllowedWeek.setDate(nextAllowedWeek.getDate() + 7);

      // ❌ Block previous week
      if (currentWeekStart < nextAllowedWeek) {
        return res.status(400).json({
          message: "You cannot submit previous weeks.",
        });
      }

      // ❌ Block skipping week
      if (currentWeekStart.getTime() !== nextAllowedWeek.getTime()) {
        return res.status(400).json({
          message: "You must submit weeks sequentially.",
        });
      }
    }

   const timesheet = await TimeSheet.findOne({
         userId,
         weekStartDate: currentWeekStart,
       });
   
       // ✅ Submit
       timesheet.status = status;
       timesheet.submittedAt = new Date(); // optional but good
       await timesheet.save();
   
       res.json({
         message: "Timesheet submitted successfully ✅",
         timesheet,
       });

    

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWeekTimesheet=async (req,res) => {
  try{
    const userId=req.user.userId;
    const {monday,sunday}=req.query; 

    if(!monday||!sunday){
      return res.status(400).json({message:"monday and sunday are required"});
    }
    
    const weekStart=new Date(monday);
    const weekEnd=new Date(sunday);

    weekStart.setHours(0,0,0,0);
    weekEnd.setHours(23,59,59,999);
    const user=await User.findById(userId).populate("assignedProjects",
      "projectName projectCode");

    const timesheet = await TimeSheet.findOne({
      userId,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
    }).populate("entries.projectId", "projectName projectCode");

    if (timesheet) {
      return res.json({
        exists: true,
        timesheet,
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        assignedProjects: user.assignedProjects,
      });
    }

    const emptyEntries = user.assignedProjects.map(p => ({
      projectId: p._id,
      hours: Array(7).fill(0),
    }));

    res.json({
      exists: false,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      assignedProjects: user.assignedProjects,
      entries: emptyEntries,
    });

  }catch(error){
    return res.status(500).json({message:"Failed to load the this week timesheet"});
  }
  
};

exports.getInitialWeek = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user || !user.DOJ) {
      return res.status(400).json({
        message: "User DOJ not found",
      });
    }

    // 🔎 Find last submitted or approved timesheet
    const lastSubmitted = await TimeSheet.findOne({
      userId,
      status: { $in: ["submitted", "approved"] },
    }).sort({ weekStartDate: -1 });

    let startWeek;

    if (!lastSubmitted) {
      // ✅ No timesheet found → go to DOJ
      startWeek = new Date(user.DOJ);
    } else {
      // ✅ Found → go to next week after last submitted
      startWeek = new Date(lastSubmitted.weekStartDate);
      startWeek.setDate(startWeek.getDate() + 7);
    }

    // 🔁 Convert to Monday of that week
    const day = startWeek.getDay();
    const diff = startWeek.getDate() - day + (day === 0 ? -6 : 1);
    startWeek.setDate(diff);
    startWeek.setHours(0, 0, 0, 0);

    res.status(200).json({
      weekStart: startWeek,
      DOJ: user.DOJ,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to determine initial week",
    });
  }
};