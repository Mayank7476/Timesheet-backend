const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  hours: {
    type: [Number], // 7 days
    required: true,
  },
});

const timeSheetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    weekStartDate: {
      type: Date,
      required: true,
    },

    weekEndDate: {
      type: Date,
      required: true,
    },

    entries: [entrySchema],

    totalHours: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "partially-submitted", "partially-approved", "submitted", "approved"],
      default: "draft",
    },

    submittedAt:{type:Date},

    approvedAt: {
      type:Date,
      default:null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null,
    },
  },
  { timestamps: true }
);

// Auto-calc total hours
timeSheetSchema.pre("save", function () {
  this.totalHours = this.entries.reduce(
    (sum, e) => sum + e.hours.reduce((a, b) => a + b, 0),
    0
  );
});

module.exports = mongoose.model("TimeSheet", timeSheetSchema);
