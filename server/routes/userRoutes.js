import express from "express";
import {
    getFriends,
    getProfile,
    getGroupCards,
    getUser,
    addFriend,
    updateProfile
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/friends", getFriends);
router.get("/profile", getProfile);
router.get("/groupCards", getGroupCards);
router.get("/user", getUser);
router.post("/friends/add",authenticateToken,addFriend);
router.post("/profile/update",authenticateToken,updateProfile);
export default router;
