const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.ssoCallback = async (req, res) => {
  try {
    const samlUser = req.user;

    // 🔍 Debug (remove later)
    console.log("SSO User:", samlUser);

    if (!samlUser || !samlUser.email) {
      return res.status(400).json({ message: "Invalid SSO response" });
    }

    // 🔥 Find user in DB
    let user = await User.findOne({ email: samlUser.email });

    // 🆕 Create user if not exists
    if (!user) {
      user = await User.create({
        email: samlUser.email,
        name: samlUser.name,
        role: "user", // default role
        authType: "sso",
      });
    }

    // 🔐 Generate SAME JWT as your normal login
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        DOJ: user.DOJ,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔁 Redirect to frontend with token
    return res.redirect(
      `${process.env.FRONTEND_URL}/sso-success?token=${token}`
    );
  } catch (error) {
    console.error("SSO Error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  }
};