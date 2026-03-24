const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate leave for same day
leaveSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Leave", leaveSchema);
