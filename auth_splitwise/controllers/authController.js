const User = require("../models/user");
const jwt = require("jsonwebtoken");
const SECRET = require("../.gitignore/secret");

//handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code); //msg contains error info, code is triggered only for violating the unique constraint
  let errors = { name: "", email: "", password: "" };

  //incorrect email
  if (err.message == "Incorrect email") {
    errors.email = "Email not registered";
    // return errors;
  }
  if (err.message == "Incorrect password") {
    errors.password = "Incorrect password";
    // return errors;
  }

  //duplicate error
  if (err.code == 11000) {
    errors.email = "email is already registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("User validation failed")) {
    //here the error is in which part is tored as key value pairs in the err.erros part(array of pbjects) and we are the only accesing the values of that array(not the keys)
    Object.values(err.errors).forEach((er) => {
      // console.log(er.properties);
      errors[er.properties["path"]] = er.properties["message"];
    });
  }
  return errors;
};
//maxAge in jwt is in s, in cookies its in ms
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;
  const upiId = "";
  const friends = [];
  try {
    const user = await User.create({ name, email, password, upiId, friends });
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    // console.log(errors);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    console.log(user);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

  // console.log(email, password);
  // res.send("new login");
};

module.exports.logout_get = (req, res) => {
  //we are not deleting the cookie but instead replacing it with empty string that has a very short expiration date
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect('/');
};
