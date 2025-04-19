const express = require("express");
const router = express.Router();
const authContoller = require("../controllers/authController");

router.get("/signup", authContoller.signup_get);
router.get("/login", authContoller.login_get);
router.post("/signup", authContoller.signup_post);
router.post("/login", authContoller.login_post);
router.get("/logout", authContoller.logout_get);

module.exports = router;
