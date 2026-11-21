import mongoose from "mongoose";
import Restaurant from "../model/restaurant.model.js";
import Zomato, { MENU_CATEGORIES } from "../model/zomato.model.js";

const getApprovedRestaurant = async (req) => Restaurant.findOne({
  _id: req.user.restaurantId,
  owner: req.user.id,
  approvalStatus: "approved",
});

const parseMenuItem = (body = {}) => {
  const input = body || {};
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const category = typeof input.category === "string" ? input.category : "";
  const price = input.price === "" || input.price == null ? NaN : Number(input.price);
  const oldPrice = input.oldPrice === "" || input.oldPrice == null
    ? null
    : Number(input.oldPrice);
  const image = typeof input.image === "string" ? input.image.trim() : "";
  const time = typeof input.time === "string" ? input.time.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";

  if (!name) return { error: "Item name is required." };
  if (!MENU_CATEGORIES.includes(category)) return { error: "Select a valid category." };
  if (!Number.isFinite(price) || price <= 0) return { error: "Price must be greater than zero." };
  if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice <= 0)) {
    return { error: "Original price must be greater than zero." };
  }

  return {
    values: {
      name,
      category,
      price,
      oldPrice,
      image,
      time,
      description,
    },
  };
};

const verifyRestaurant = async (req, res) => {
  const restaurant = await getApprovedRestaurant(req);
  if (!restaurant) {
    res.status(403).json({ message: "An approved restaurant is required to manage menu items." });
    return null;
  }
  return restaurant;
};

export const getMenuCategories = (_req, res) => res.json(MENU_CATEGORIES);

export const getRestaurantMenu = async (req, res) => {
  try {
    const restaurant = await verifyRestaurant(req, res);
    if (!restaurant) return;

    const items = await Zomato.find({ restaurantId: restaurant._id }).sort({ category: 1, name: 1 });
    return res.json(items);
  } catch (error) {
    console.error("Failed to load restaurant menu:", error);
    return res.status(500).json({ message: "Unable to load restaurant menu." });
  }
};

export const createRestaurantMenuItem = async (req, res) => {
  const parsed = parseMenuItem(req.body);
  if (parsed.error) return res.status(400).json({ message: parsed.error });

  try {
    const restaurant = await verifyRestaurant(req, res);
    if (!restaurant) return;

    const item = await Zomato.create({
      ...parsed.values,
      restaurant: restaurant.name,
      restaurantId: restaurant._id,
    });
    return res.status(201).json(item);
  } catch (error) {
    console.error("Failed to add restaurant menu item:", error);
    return res.status(500).json({ message: "Unable to add menu item." });
  }
};

export const updateRestaurantMenuItem = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid menu item id." });
  }
  const parsed = parseMenuItem(req.body);
  if (parsed.error) return res.status(400).json({ message: parsed.error });

  try {
    const restaurant = await verifyRestaurant(req, res);
    if (!restaurant) return;

    const item = await Zomato.findOneAndUpdate(
      { _id: req.params.id, restaurantId: restaurant._id },
      { $set: parsed.values },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Menu item not found." });
    return res.json(item);
  } catch (error) {
    console.error("Failed to update restaurant menu item:", error);
    return res.status(500).json({ message: "Unable to update menu item." });
  }
};

export const deleteRestaurantMenuItem = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid menu item id." });
  }
  try {
    const restaurant = await verifyRestaurant(req, res);
    if (!restaurant) return;

    const result = await Zomato.deleteOne({
      _id: req.params.id,
      restaurantId: restaurant._id,
    });
    if (!result.deletedCount) return res.status(404).json({ message: "Menu item not found." });
    return res.json({ message: "Menu item deleted." });
  } catch (error) {
    console.error("Failed to delete restaurant menu item:", error);
    return res.status(500).json({ message: "Unable to delete menu item." });
  }
};
