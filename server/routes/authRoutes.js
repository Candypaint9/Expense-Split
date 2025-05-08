import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// router.post("/logout",logout);

router.get("/check-auth",authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Authenticated' });
});

export default router;
