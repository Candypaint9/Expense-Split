import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
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
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.cookie("jwtcookie", token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
    });
  } catch (err) {
    // const user = await User.findOne({ email });
    // console.log(user);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logout = (req, res) => {
  // Clear the cookie
  res.clearCookie("jwtcookie", { httpOnly: true});

  res.status(200).json({ message: "Logged out successfully" });
};