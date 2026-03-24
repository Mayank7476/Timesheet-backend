const TimeSheet = require("../model/timesheet");

exports.getReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const timesheets = await TimeSheet.find({
  weekStartDate: { $lte: end },
  weekEndDate: { $gte: start },
  status: { 
    $in: ["approved", "partially-approved"] 
  }
})
      .populate("userId", "name id")
      .populate({
        path: "entries.projectId",
        select: "projectCode projectName"
      });

    let report = [];

    timesheets.forEach(ts => {

      ts.entries.forEach(entry => {

        entry.hours.forEach((hour, index) => {

          const currentDate = new Date(ts.weekStartDate);
          currentDate.setDate(currentDate.getDate() + index);

          if (currentDate >= start && currentDate <= end && hour > 0) {
            report.push({
              employeeCode: ts.userId.id,
              employeeName: ts.userId.name,
              projectCode: entry.projectId?.projectCode,
              projectName: entry.projectId?.projectName,
              date: currentDate,
              hours: hour
            });
          }

        });

      });

    });

    report.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(report);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReportFront = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    const start = new Date(fromDate);
    const end = new Date(toDate);

   const timesheets = await TimeSheet.find({
  weekStartDate: { $lte: end },
  weekEndDate: { $gte: start },
  status: { 
    $in: ["approved", "partially-approved"] 
  }
})
      .populate("userId", "name id")
      .populate({
        path: "entries.projectId",
        select: "projectCode projectName"
      });

    const employeeMap = {};

    timesheets.forEach(ts => {
      ts.entries.forEach(entry => {

        entry.hours.forEach((hour, index) => {

          const currentDate = new Date(ts.weekStartDate);
          currentDate.setDate(currentDate.getDate() + index);

          if (currentDate >= start && currentDate <= end && hour > 0) {

            const empId = ts.userId.id;

            if (!employeeMap[empId]) {
              employeeMap[empId] = {
                employeeCode: ts.userId.id,
                employeeName: ts.userId.name,
                totalHours: 0,
                details: []
              };
            }

            employeeMap[empId].totalHours += hour;

            employeeMap[empId].details.push({
              projectCode: entry.projectId?.projectCode,
              projectName: entry.projectId?.projectName,
              date: currentDate,
              hours: hour
            });

          }

        });

      });
    });

const result = Object.values(employeeMap);

// sort each employee's details by date
result.forEach(emp => {
  emp.details.sort((a, b) => new Date(a.date) - new Date(b.date));
});

res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};