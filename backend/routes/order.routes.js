import express from "express";
import { placeOrder } from "../controllers/order.controller.js";

const router = express.Router();

// Public — anyone can place an order (logged in or guest)
router.post("/place", placeOrder);

export default router;
