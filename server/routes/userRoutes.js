import express from "express";
import { getFriends } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/friends", authenticateToken, getFriends);

export default router;
