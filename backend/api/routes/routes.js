const express = require("express");
const router = express.Router();
const contrl = require("../controller/userController");
const middlware = require("../middle/authMiddleware");

// product controller

router.post("/signup", contrl.signup);
router.post("/login", contrl.login);
router.post("/login", contrl.resetPassword);

router.get("/getUsers", middlware.authMiddleware, contrl.getUsers);
router.put("/user/:userId", middlware.authMiddleware, contrl.updateUser);
router.delete("/user/:userId", middlware.authMiddleware, contrl.deleteUser);

module.exports = router;
