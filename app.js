require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression=require("compression");
const morgan=require("morgan");
const rateLimiter=require("express-rate-limit");
const apiLimiter=rateLimiter({windowMs:15*60*1000,max:1000});
const connectDB = require("./config/db");
const helmet=require("helmet");
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

connectDB();
app.use(compression());
app.use(morgan('combined'));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use('/api',apiLimiter);
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



app.use((err, req, res, next) => {
  console.error('Global catch:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Server error' 
  });
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
module.exports=app;

