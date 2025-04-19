const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const {requireAuth,checkUser} = require('./middleware/authMiddleware');

const PORT = 8001;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log("Server started on PORT ", PORT);
});
mongoose
  .connect("mongodb://localhost:27017/splitwise-test")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
//applying the checkuser middleware to all the get requests
// app.get('*',checkUser);
app.get("/", (req, res) => {
  res.render("home");
});
app.use(authRoutes);

// app.get("/set-cookies", (req, res) => {
//   // res.setHeader('Set-Cookie','newuser=true');

//   res.cookie("newUser", true);
//   //maxage refers to expiration of cookie in ms, secure means the cookie will only be sent if there is an https connection, httpOnly means we cant access the cookie from the frontend(cant access from document.cookie) only between client/server 
//   res.cookie("isEmployee", true, { maxAge: 1000 * 60 , httpOnly: true});
//   res.send("you got the cookies");
// });
// app.get("/read-cookies", (req, res) => {
  
//   const cookies= req.cookies;
//   console.log(cookies);
//   res.json(cookies);
// });
