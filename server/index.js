import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import Group from "./models/group.js";

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect("mongodb://localhost:27017/splitwise")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.get("/api/groupCards", (req, res) => {
  Group.find()
    .then((groups) => res.json(groups))
    .catch((err) => res.status(500).json({ error: "Failed to fetch groups" }));
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
