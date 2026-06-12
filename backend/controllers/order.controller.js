import Order from "../model/order.model.js";

/* ── PLACE ORDER (called from Cart) ── */
export const placeOrder = async (req, res) => {
  try {
    const { userId, username, items, subtotal, deliveryCharge, gst, discount, totalAmount, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order." });
    }

    const order = new Order({
      userId:         userId   || null,
      username:       username || "Guest",
      items,
      subtotal,
      deliveryCharge: deliveryCharge || 0,
      gst:            gst      || 0,
      discount:       discount || 0,
      totalAmount,
      couponCode:     couponCode || "",
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully.", orderId: order._id });
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
