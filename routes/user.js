const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const ExpressError = require("../utils/ExpressError.js");

//Sign up

router
.route("/signup")
.get(userController.getSignupForm)
.post(
  wrapAsync(userController.registerNewUser));

//Log in

router
  .route("/login")
  .get(userController.getLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser
  );

//Log out

router.get("/logout", userController.logoutUser);

router.get("/",(req, res, next) => {
  next(new ExpressError(404, "Page not found !"));
});


module.exports = router;
