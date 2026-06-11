/**
 * Run this ONCE to create the admin user:
 *   node seed-admin.js
 * Then delete or keep this file — it won't create duplicates.
 */
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./model/user.model.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: "admin@gmail.com" });

    if (existing) {
      // Update existing user to admin role
      existing.role = "admin";
      existing.password = await bcrypt.hash("admin@1234", 10);
      await existing.save();
      console.log("✅ Existing user updated to admin role.");
    } else {
      const hash = await bcrypt.hash("admin@1234", 10);
      await User.create({
        username: "admin",
        email:    "admin@gmail.com",
        password: hash,
        role:     "admin",
      });
      console.log("✅ Admin user created successfully.");
    }

    console.log("Email:    admin@gmail.com");
    console.log("Password: admin@1234");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seedAdmin();
