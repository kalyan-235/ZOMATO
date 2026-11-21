import bcrypt from "bcryptjs";
import Restaurant from "../model/restaurant.model.js";
import User from "../model/user.model.js";

export const registerRestaurant = async (req, res) => {
  const { username, email, password, restaurantName, address, phone, city, cuisine } = req.body;

  if (!username?.trim() || !email?.trim() || !password || !restaurantName?.trim() || !address?.trim()) {
    return res.status(400).json({
      message: "Owner name, email, password, restaurant name, and address are required.",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  let owner;
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingOwner = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: username.trim() }],
    });
    if (existingOwner) {
      return res.status(409).json({ message: "An account with this email or username already exists." });
    }

    owner = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role: "restaurant_owner",
    });
    const restaurant = await Restaurant.create({
      owner: owner._id,
      name: restaurantName.trim(),
      address: address.trim(),
      phone: phone?.trim(),
      city: city?.trim(),
      cuisine: cuisine?.trim(),
    });

    return res.status(201).json({
      message: "Application submitted. You can log in after admin approval.",
      application: {
        id: restaurant._id,
        restaurantName: restaurant.name,
        approvalStatus: restaurant.approvalStatus,
      },
    });
  } catch (error) {
    if (owner) {
      try {
        await User.findByIdAndDelete(owner._id);
      } catch (cleanupError) {
        console.error("Failed to remove owner account after restaurant registration error:", cleanupError);
      }
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account or restaurant application already exists." });
    }
    console.error("Restaurant registration failed:", error);
    return res.status(500).json({ message: "Unable to submit restaurant application." });
  }
};

export const getRestaurantApplications = async (_req, res) => {
  try {
    const applications = await Restaurant.find()
      .populate("owner", "username email")
      .sort({ createdAt: -1 });
    return res.json(applications);
  } catch (error) {
    console.error("Failed to load restaurant applications:", error);
    return res.status(500).json({ message: "Unable to load restaurant applications." });
  }
};

export const reviewRestaurantApplication = async (req, res) => {
  const { approvalStatus } = req.body;
  if (!["approved", "rejected"].includes(approvalStatus)) {
    return res.status(400).json({ message: "Approval status must be approved or rejected." });
  }

  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { approvalStatus, isAvailable: approvalStatus === "approved" },
      { new: true, runValidators: true }
    ).populate("owner", "username email");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant application not found." });
    }
    return res.json(restaurant);
  } catch (error) {
    console.error("Failed to review restaurant application:", error);
    return res.status(500).json({ message: "Unable to review restaurant application." });
  }
};
