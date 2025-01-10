// Import required modules
const router = require("express").Router(); // Create a router object for handling routes
const passport = require("passport");

const CLIENT_URL = "http://localhost:5173";

router.get("/login/success", async (req, res) => {
  if (req.user) {
    try {
      const user = await User.findById(req.user); // Fetch user from MongoDB
      res.status(200).json({
        success: true,
        message: "Login successful",
        user, // Send the user object to the frontend
      });
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
});


router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(CLIENT_URL);
  });
});

router.get("/google", passport.authenticate("google", { scope: ['profile','email'] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

module.exports = router;
