import mongoose from "mongoose";
import Order from "../model/order.model.js";
import Restaurant from "../model/restaurant.model.js";
import User from "../model/user.model.js";
import Zomato from "../model/zomato.model.js";

const roundMoney = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const allocateAmount = (amount, groups, totalSubtotal) => {
  let remainingPaise = Math.round(amount * 100);
  return groups.map((group, index) => {
    const paise = index === groups.length - 1
      ? remainingPaise
      : Math.round((amount * 100) * (group.subtotal / totalSubtotal));
    remainingPaise -= paise;
    return paise / 100;
  });
};

/* ── VALID COUPONS (server-side) ── */
const COUPONS = {
  FIRST50:   { type: "percent", value: 0.5  },
  SAVE100:   { type: "flat",    value: 100  },
  FREEDEL:   { type: "flat",    value: 0    },
  WEEKEND30: { type: "percent", value: 0.3  },
  BOGO20:    { type: "percent", value: 0.2  },
  NIGHT15:   { type: "percent", value: 0.15 },
};

export const validateCoupon = (req, res) => {
  const { code, subtotal } = req.body;
  const coupon = COUPONS[code?.toUpperCase()];
  if (!coupon) return res.status(400).json({ message: "Invalid coupon code." });

  const discountAmt = coupon.type === "percent"
    ? Math.round(subtotal * coupon.value)
    : coupon.value;

  res.json({ valid: true, discountAmt, message: `✅ Coupon applied! You save ₹${discountAmt}` });
};

/* ── PLACE ORDER ── */
export const placeOrder = async (req, res) => {
  try {
    const { items, couponCode, subtotal: submittedSubtotal } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items in order." });
    }
    if (!items.every((item) => item && typeof item.itemId === "string" && item.itemId.trim())) {
      return res.status(400).json({ message: "Order contains an invalid menu item." });
    }
    if (couponCode != null && typeof couponCode !== "string") {
      return res.status(400).json({ message: "Invalid coupon code." });
    }

    const customer = await User.findById(req.user.id).select("username");
    if (!customer) {
      return res.status(401).json({ message: "Please log in to place your order." });
    }

    const itemIds = [...new Set(items.map((item) => item.itemId.trim().toLowerCase()))];
    if (!itemIds.length || itemIds.some((id) => !mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: "Order contains an invalid menu item." });
    }

    const catalogItems = await Zomato.find({ _id: { $in: itemIds } });
    const catalogById = new Map(catalogItems.map((item) => [item._id.toString().toLowerCase(), item]));
    if (catalogById.size !== itemIds.length) {
      return res.status(400).json({ message: "One or more menu items are no longer available." });
    }

    const restaurantNames = [...new Set(catalogItems.map((item) => item.restaurant).filter(Boolean))];
    const linkedRestaurantIds = [...new Set(
      catalogItems.map((item) => item.restaurantId?.toString()).filter(Boolean)
    )];
    const restaurantFilters = [];
    if (restaurantNames.length) {
      restaurantFilters.push(...restaurantNames.map((name) => ({
        name: new RegExp(`^${escapeRegex(name.trim())}$`, "i"),
      })));
    }
    if (linkedRestaurantIds.length) restaurantFilters.push({ _id: { $in: linkedRestaurantIds } });
    const restaurants = restaurantFilters.length
      ? await Restaurant.find({ $or: restaurantFilters })
      : [];
    const restaurantsById = new Map(restaurants.map((restaurant) => [restaurant._id.toString(), restaurant]));
    const restaurantsByName = new Map();
    restaurants.forEach((restaurant) => {
      const key = restaurant.name.trim().toLowerCase();
      restaurantsByName.set(key, [...(restaurantsByName.get(key) || []), restaurant]);
    });

    const groupsByKey = new Map();
    for (const requestedItem of items) {
      const catalogItem = catalogById.get(requestedItem.itemId.trim().toLowerCase());
      const quantity = Number(requestedItem.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        return res.status(400).json({ message: "Item quantities must be whole numbers between 1 and 100." });
      }
      if (!Number.isFinite(catalogItem.price) || catalogItem.price <= 0) {
        return res.status(400).json({ message: `${catalogItem.name} is not available for ordering.` });
      }
      if (!catalogItem.restaurant?.trim()) {
        return res.status(400).json({ message: `${catalogItem.name} has no restaurant assigned.` });
      }

      let restaurant = null;
      if (catalogItem.restaurantId) {
        restaurant = restaurantsById.get(catalogItem.restaurantId.toString());
        if (!restaurant) {
          return res.status(409).json({ message: `${catalogItem.name} is not linked to an active restaurant.` });
        }
      } else {
        const matches = restaurantsByName.get(catalogItem.restaurant.trim().toLowerCase()) || [];
        if (matches.length > 1) {
          return res.status(409).json({ message: "A restaurant name is ambiguous. Please contact support." });
        }
        restaurant = matches[0] || null;
      }

      if (restaurant && restaurant.approvalStatus !== "approved") {
        return res.status(403).json({ message: `${restaurant.name} is not accepting orders yet.` });
      }

      const restaurantName = restaurant?.name || catalogItem.restaurant.trim();
      const groupKey = restaurant?._id.toString() || `legacy:${restaurantName.toLowerCase()}`;
      const group = groupsByKey.get(groupKey) || {
        restaurantId: restaurant?._id || null,
        restaurantName,
        items: [],
        subtotal: 0,
      };
      group.items.push({
        itemId: catalogItem._id.toString(),
        name: catalogItem.name,
        image: catalogItem.image,
        price: catalogItem.price,
        quantity,
      });
      group.subtotal = roundMoney(group.subtotal + catalogItem.price * quantity);
      groupsByKey.set(groupKey, group);
    }

    const groups = [...groupsByKey.values()];
    const subtotal = roundMoney(groups.reduce((sum, group) => sum + group.subtotal, 0));
    if (!Number.isFinite(Number(submittedSubtotal)) || roundMoney(Number(submittedSubtotal)) !== subtotal) {
      return res.status(409).json({ message: "Menu prices changed. Refresh your cart and try again." });
    }
    const deliveryCharge = subtotal >= 499 ? 0 : 40;
    const gst = Math.round(subtotal * 0.05);
    const normalizedCouponCode = couponCode?.trim().toUpperCase() || "";
    const coupon = normalizedCouponCode ? COUPONS[normalizedCouponCode] : null;
    if (normalizedCouponCode && !coupon) {
      return res.status(400).json({ message: "Invalid coupon code." });
    }
    const discount = coupon
      ? coupon.type === "percent" ? Math.round(subtotal * coupon.value) : coupon.value
      : 0;
    const deliveryShares = allocateAmount(deliveryCharge, groups, subtotal);
    const gstShares = allocateAmount(gst, groups, subtotal);
    const discountShares = allocateAmount(discount, groups, subtotal);
    const orders = groups.map((group, index) => new Order({
      userId: customer._id,
      username: customer.username,
      restaurantId: group.restaurantId,
      restaurantName: group.restaurantName,
      items: group.items,
      subtotal: group.subtotal,
      deliveryCharge: deliveryShares[index],
      gst: gstShares[index],
      discount: discountShares[index],
      totalAmount: roundMoney(
        group.subtotal + deliveryShares[index] + gstShares[index] - discountShares[index]
      ),
      couponCode: normalizedCouponCode,
    }));

    const savedOrders = await Order.insertMany(orders);
    const io = req.app.get("io");
    if (!io) {
      console.error("Socket.IO is not available; restaurant order notification was not sent.");
    } else {
      savedOrders.forEach((order) => {
        if (order.restaurantId) {
          io.to(`restaurant:${order.restaurantId}`).emit("restaurant:new-order", order.toObject());
        }
      });
    }
    return res.status(201).json({
      message: "Order placed successfully.",
      orderIds: savedOrders.map((order) => order._id),
    });
  } catch (error) {
    console.error("Failed to place order:", error);
    res.status(500).json({ message: "Unable to place order." });
  }
};

export const getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.user.restaurantId,
      owner: req.user.id,
      approvalStatus: "approved",
    }).select("_id");
    if (!restaurant) {
      return res.status(403).json({ message: "This restaurant is not approved for dashboard access." });
    }

    const orders = await Order.find({ restaurantId: restaurant._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error("Failed to load restaurant orders:", error);
    return res.status(500).json({ message: "Unable to load restaurant orders." });
  }
};

export const updateRestaurantOrderStatus = async (req, res) => {
  const transitions = {
    placed: ["accepted", "rejected"],
    accepted: ["preparing"],
    preparing: ["ready"],
    ready: ["completed"],
  };
  const { status } = req.body;
  if (!["accepted", "rejected", "preparing", "ready", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid restaurant order status." });
  }

  try {
    const restaurant = await Restaurant.findOne({
      _id: req.user.restaurantId,
      owner: req.user.id,
      approvalStatus: "approved",
    }).select("_id");
    if (!restaurant) {
      return res.status(403).json({ message: "This restaurant is not approved for dashboard access." });
    }

    const order = await Order.findOne({ _id: req.params.id, restaurantId: restaurant._id });
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    const allowedStatuses = transitions[order.status] || [];
    if (!allowedStatuses.includes(status)) {
      return res.status(409).json({ message: `Cannot change an order from ${order.status} to ${status}.` });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id, restaurantId: restaurant._id, status: order.status },
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return res.status(409).json({ message: "Order status changed. Refresh and try again." });
    }
    return res.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update restaurant order:", error);
    return res.status(500).json({ message: "Unable to update order status." });
  }
};

/* ── GET USER'S OWN ORDERS ── */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── GET ALL ORDERS (admin) ── */
export const getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── UPDATE ORDER STATUS (admin) ── */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["placed", "accepted", "rejected", "preparing", "ready", "completed", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
