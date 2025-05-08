import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { authenticateToken } from "./middleware/authmiddleware.js";
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

// public routes
app.use("/api", authRoutes);

// middleware for protected routes
app.use("/api", authenticateToken);

// auth protected routes
app.use("/api", userRoutes);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
