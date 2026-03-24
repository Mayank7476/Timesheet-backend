require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const passport=require("./config/passport")
const signupRoutes = require("./routes/auth");
const loginRoutes=require("./routes/auth");
const projectRoutes=require("./routes/project");
const assignRoutes=require("./routes/assign");
const loadSheet=require("./routes/timesheet");
const pendingVerification=require("./routes/pendingVerification");
const timesheetHistory = require("./routes/timesheetHistory");
const leave=require("./routes/leave");
const groupRou=require("./routes/groupRoutes");
const users=require("./routes/user");
const report=require("./routes/report");
const samlRoutes = require("./routes/saml");
const app = express();

// Connect MongoDB
connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173",
      "https://unworshiping-roaringly-ayesha.ngrok-free.dev"
    ], // frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

// GET API
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from GET request",
  });
});
app.use("/api/auth", signupRoutes);
app.use("/api/auth",loginRoutes);
app.use("/api/timesheet",loadSheet);
app.use("/api/pending-verification",pendingVerification);
app.use("/api/history", timesheetHistory);
app.use("/api/leave", leave);
app.use("/api/assignment",assignRoutes);
app.use("/api/project",projectRoutes);
app.use("/api/group",groupRou);
app.use("/api/user",users);
app.use("/api/report",report);
app.use("/auth/saml", samlRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

