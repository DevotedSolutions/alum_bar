const express = require("express");
const router = express.Router();
const contrl = require("../controller/userController");
const eventContrl = require("../controller/eventController");
const middlware = require("../middle/authMiddleware");

// product controller

router.post("/signup", contrl.signup);
router.post("/login", contrl.login);
router.post("/reset", contrl.resetPassword);

router.get("/getUsers", middlware.authMiddleware, contrl.getUsers);
router.put("/user/:userId", middlware.authMiddleware, contrl.updateUser);
router.delete("/user/:userId", middlware.authMiddleware, contrl.deleteUser);

router.get(
  "/getEventsByCountry/:country",
  middlware.authMiddleware,
  eventContrl.getEventsByCountry
);
router.get(
  "/getMarkersByCountry/:country",
  middlware.authMiddleware,
  eventContrl.getMarkersByCountry
);
router.post(
  "/addEventByCountry",
  middlware.authMiddleware,
  eventContrl.addEventByCountry
);
router.delete(
  "/deleteEvent/:_id",
  middlware.authMiddleware,
  eventContrl.deleteEvent
);
router.post("/updateEvent", middlware.authMiddleware, eventContrl.editEvent);

router.post("/getLeaves", middlware.authMiddleware, eventContrl.getLeaves);
router.post("/addLeave", middlware.authMiddleware, eventContrl.addLeave);
router.post("/editLeave", middlware.authMiddleware, eventContrl.editLeave);

module.exports = router;
