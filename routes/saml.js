const express = require("express");
const passport = require("passport");
const { ssoCallback } = require("../controller/ssoController");

const router = express.Router();

// 🔹 Start SSO
router.get("/loginsso", passport.authenticate("saml"));

// 🔹 Callback from Azure (:contentReference[oaicite:0]{index=0})
router.post(
  "/callback",
  passport.authenticate("saml", { session: false }),
  ssoCallback
);

module.exports = router;