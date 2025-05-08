import express from "express";
import { getFriends, getProfile, getGroupCards } from "../controllers/userController.js";

const router = express.Router();

router.get("/friends", getFriends);
router.get("/profile", getProfile);
router.get("/groupCards", getGroupCards);

export default router;
