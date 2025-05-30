const User = require("../Models/user.js");

module.exports.getSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.registerNewUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Signup was Successfull.");
        res.redirect("/listings");
      }
    });
  } catch (e) {
    req.flash("error", e.message + ".");
    res.redirect("/signup");
  }
};

module.exports.getLoginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", `Hey ${req.user.username}, welcome back to Tripzone.`);
  let redirecturl = res.locals.redirectUrl;
  if (redirecturl) res.redirect(redirecturl);
  else res.redirect("/listings");
};

module.exports.logoutUser = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "You have logged out successfully.");
      res.redirect("/listings");
    }
  });
};
