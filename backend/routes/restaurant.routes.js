import express from "express";
import {
  registerRestaurant,
} from "../controllers/restaurant.controller.js";
import {
  createRestaurantMenuItem,
  deleteRestaurantMenuItem,
  getMenuCategories,
  getRestaurantMenu,
  updateRestaurantMenuItem,
} from "../controllers/restaurant.menu.controller.js";
import { protect, restaurantOwnerOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerRestaurant);

router.use(protect, restaurantOwnerOnly);
router.get("/menu/categories", getMenuCategories);
router.get("/menu", getRestaurantMenu);
router.post("/menu", createRestaurantMenuItem);
router.put("/menu/:id", updateRestaurantMenuItem);
router.delete("/menu/:id", deleteRestaurantMenuItem);

export default router;
