import User from "../model/user.model.js";
import Zomato from "../model/zomato.model.js";
import Order from "../model/order.model.js";

/* ── DASHBOARD STATS ── */
export const getDashboardStats = async (_req, res) => {
  try {
    const totalUsers       = await User.countDocuments({ role: "user" });
    const totalItems       = await Zomato.countDocuments();
    const restaurants      = await Zomato.distinct("restaurant");
    const totalRestaurants = restaurants.length;

    // Real order stats from DB
    const totalOrders = await Order.countDocuments();
    const revenueAgg  = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    // Recent users (last 5)
    const recentUsers = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("username email createdAt");

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("username totalAmount items status createdAt");

    // Category breakdown
    const categoryStats = await Zomato.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalUsers,
      totalItems,
      totalRestaurants,
      totalOrders,
      revenue,
      recentUsers,
      recentOrders,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── GET ALL USERS ── */
export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── DELETE USER ── */
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── GET ALL FOOD ITEMS ── */
export const getAllItems = async (_req, res) => {
  try {
    const items = await Zomato.find().sort({ restaurant: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── ADD FOOD ITEM ── */
export const addItem = async (req, res) => {
  try {
    const item = new Zomato(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── UPDATE FOOD ITEM ── */
export const updateItem = async (req, res) => {
  try {
    const item = await Zomato.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── DELETE FOOD ITEM ── */
export const deleteItem = async (req, res) => {
  try {
    await Zomato.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── GET ALL RESTAURANTS (unique names) ── */
export const getRestaurants = async (_req, res) => {
  try {
    const restaurants = await Zomato.distinct("restaurant");
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
