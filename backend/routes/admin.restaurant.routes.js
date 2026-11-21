import express from "express";
import {
  getRestaurantApplications,
  reviewRestaurantApplication,
} from "../controllers/restaurant.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/", getRestaurantApplications);
router.patch("/:id/status", reviewRestaurantApplication);

export default router;
