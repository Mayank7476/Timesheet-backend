const passport = require("passport");
const SamlStrategy = require("passport-saml").Strategy;

passport.use(
  new SamlStrategy(
    {
      entryPoint: process.env.SAML_ENTRY_POINT,
      issuer: process.env.SAML_ISSUER,
      callbackUrl: process.env.SAML_CALLBACK_URL,
      cert: process.env.SAML_CERT,

      identifierFormat: null, // Important for Azure
      disableRequestedAuthnContext: true, // Avoid common Azure issues
    },
    async (profile, done) => {
      try {
        // 🔍 Debug (VERY useful initially)
        console.log("SAML Profile:", profile);

        // 🔥 Extract user info safely
        const email =
          profile[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ] || profile.email;

        const name =
          profile[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] || profile.name;

        if (!email) {
          return done(new Error("Email not found in SAML response"), null);
        }

        const user = {
          email,
          name,
        };

        return done(null, user);
      } catch (error) {
        console.error("SAML Error:", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;