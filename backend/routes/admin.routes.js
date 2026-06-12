import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllItems,
  addItem,
  updateItem,
  deleteItem,
  getRestaurants,
} from "../controllers/admin.controller.js";
import { getAllOrders } from "../controllers/order.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard",   getDashboardStats);
router.get("/users",       getAllUsers);
router.delete("/users/:id",deleteUser);
router.get("/items",       getAllItems);
router.post("/items",      addItem);
router.put("/items/:id",   updateItem);
router.delete("/items/:id",deleteItem);
router.get("/restaurants", getRestaurants);
router.get("/orders",      getAllOrders);

export default router;
