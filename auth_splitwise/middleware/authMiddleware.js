const jwt = require("jsonwebtoken");
const SECRET = require("../.gitignore/secret");
const User = require("../models/user");

//function to check jwt cookie present or not,, else redirect to the login page
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

//check current user

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        // res.redirect("/login");
        next();
      } else {
        console.log(decodedToken);
        //the decodeed token has the id of the user(coz we used the id in the create token function),we will use that to identify the user
        let user = await User.findById(decodedToken.id);
        res.locals.user = user; //we are accessing the property user form the view and assigning it the value user(obtained above)
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
