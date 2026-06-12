import express from "express";
import { upload } from "../config/cloudinary.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Only admins can upload images
router.post("/image", protect, adminOnly, upload.single("image"), uploadImage);

export default router;
