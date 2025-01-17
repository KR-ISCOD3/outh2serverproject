// Import required modules
const router = require("express").Router(); // Create a router object for handling routes
const passport = require("passport");

const CLIENT_URL = "http://localhost:5173"; // Your client URL (frontend)

// Google login success route
router.get("/login/success", (req, res) => {
  console.log("Authenticated User:", req.user);  // Should log the user object
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "User has successfully authenticated",
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized: User not authenticated",
    });
  }
});



// Google login failure route
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Login failed",
  });
});

// Logout route to destroy the session
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(CLIENT_URL); // Redirect to frontend after logout
  });
});

// Google OAuth route to start authentication process
router.get("/google", passport.authenticate("google", { scope: ['profile', 'email'] }));

// Google OAuth callback route after successful login
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,  // Redirect to frontend on success
    failureRedirect: "/login/failed",  // Redirect to failure route on failure
  })
);

module.exports = router;
