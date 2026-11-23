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
import { upload } from "../config/cloudinary.js";
import { handleImageUploadError, uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/register", registerRestaurant);

router.use(protect, restaurantOwnerOnly);
router.get("/menu/categories", getMenuCategories);
router.post("/menu/image", upload.single("image"), uploadImage, handleImageUploadError);
router.get("/menu", getRestaurantMenu);
router.post("/menu", createRestaurantMenuItem);
router.put("/menu/:id", updateRestaurantMenuItem);
router.delete("/menu/:id", deleteRestaurantMenuItem);

export default router;
