import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  city: { type: String, trim: true },
  cuisine: { type: String, trim: true },
  image: { type: String },
  openingTime: { type: String },
  closingTime: { type: String },
  isAvailable: { type: Boolean, default: false },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
