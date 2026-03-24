const Leave = require("../model/leave");

exports.markLeave = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date, isLeave } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date required" });
    }

    if (isLeave) {
      // ADD leave
      await Leave.findOneAndUpdate(
        { userId, date },
        { userId, date },
        { upsert: true }
      );
    } else {
      // REMOVE leave
      await Leave.findOneAndDelete({ userId, date });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to update leave" });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const userId = req.user.userId;

    const leaves = await Leave.find({ userId }).select("date");

    res.json({
      leaves: leaves.map((l) =>
        l.date.toISOString().split("T")[0] // VERY IMPORTANT
      ),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
};