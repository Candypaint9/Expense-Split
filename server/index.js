import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import Group from "./models/group.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { authenticateToken } from "./middleware/authmiddleware.js";

const PORT = 5000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //Allow browsers to send cookies or authentication headers (like Authorization) from the specified origin
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect("mongodb://localhost:27017/splitwise")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
app.get("/api/groupCards", (req, res) => {
  Group.find()
    .then((groups) => res.json(groups))
    .catch((err) => res.status(500).json({ error: "Failed to fetch groups" }));
});

app.get("/api/friends", authenticateToken, (req, res) => {
  const userId = req.user.id;
  User.findById(userId)
    .select("friends")
    .populate("friends", "name email upiId")
    .then((user) => {
      if (!user) return res.status(404).end();
      res.json(user.friends);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const user = new User({
      name,
      email,
      password,
      friends: [],
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // console.log(JWT_SECRET, user._id,user.email);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "3h" }
    );
    res.cookie("jwtcookie", token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    res.status(200).json({
      message: "Login successful",
      // token,
      userId: user._id,
    });
  } catch (err) {
    // console.log(email,password);
    // const user = await User.findOne({ email });
    // console.log(user);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
