import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  itemId:    { type: String },
  name:      { type: String, required: true },
  image:     { type: String },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  username:      { type: String, default: "Guest" },
  items:         [orderItemSchema],
  subtotal:      { type: Number, required: true },
  deliveryCharge:{ type: Number, default: 0 },
  gst:           { type: Number, default: 0 },
  discount:      { type: Number, default: 0 },
  totalAmount:   { type: Number, required: true },
  couponCode:    { type: String, default: "" },
  status:        { type: String, enum: ["placed", "preparing", "delivered", "cancelled"], default: "placed" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
