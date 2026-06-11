import mongoose from "mongoose";

const zomatoSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  image:       { type: String },
  oldPrice:    { type: Number },
  price:       { type: Number },
  rating:      { type: Number },
  reviews:     { type: Number },
  restaurant:  { type: String },
  category: {
    type: String,
    enum: ["Veg", "Non-veg", "drinks", "salads", "tiffins", "Biryani", "Dosa", "Idli", "Burger", "Desserts", "Ice-Cream"],
    required: true,
  },
  time:        { type: String },
  description: { type: String },
});

export default mongoose.model("Zomato", zomatoSchema);
