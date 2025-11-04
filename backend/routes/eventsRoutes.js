import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getMonthEvents,
  getWeekEvents,
  getDayEvents,
} from "../controllers/eventController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getEvents);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

router.get("/month/:date", getMonthEvents);
router.get("/week/:date", getWeekEvents);
router.get("/day/:date", getDayEvents);

export default router;
