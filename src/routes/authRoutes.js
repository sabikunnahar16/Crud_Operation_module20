const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/authController");

const router = express.Router();
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/profile", auth, controller.profile);
router.patch("/profile", auth, controller.updateProfile);

module.exports = router;
