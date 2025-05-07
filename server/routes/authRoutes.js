import express from "express";
import { signup, login } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/check-auth",authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Authenticated' });
});

export default router;
