import express from "express";
import {
  placeOrder,
  validateCoupon,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getRestaurantOrders,
  updateRestaurantOrderStatus,
} from "../controllers/order.controller.js";
import { protect, adminOnly, customerOnly, restaurantOwnerOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/place", protect, customerOnly, placeOrder);
router.post("/validate-coupon", validateCoupon);        // public
router.get("/my-orders",        protect, getUserOrders);// logged-in users
router.get("/restaurant", protect, restaurantOwnerOnly, getRestaurantOrders);
router.patch("/restaurant/:id/status", protect, restaurantOwnerOnly, updateRestaurantOrderStatus);
router.get("/all",              protect, adminOnly, getAllOrders);
router.put("/:id/status",       protect, adminOnly, updateOrderStatus);

export default router;
