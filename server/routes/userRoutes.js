import express from "express";
import {
    getFriends,
    getProfile,
    getGroupCards,
    getUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/friends", getFriends);
router.get("/profile", getProfile);
router.get("/groupCards", getGroupCards);
router.get("/user", getUser);

export default router;
