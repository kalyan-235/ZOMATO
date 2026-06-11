import express from "express";
import { getZomatoItems, getItemsByRestaurant, getCategory } from "../controllers/zomato.controller.js";

const router = express.Router();

router.get("/", getZomatoItems);
router.get("/restaurant/:name", getItemsByRestaurant);
router.get("/category/:category", getCategory);

export default router;
