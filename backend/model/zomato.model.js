import mongoose from "mongoose";

export const MENU_CATEGORIES = [
  "Veg",
  "Non-veg",
  "drinks",
  "salads",
  "tiffins",
  "Biryani",
  "Dosa",
  "Idli",
  "Burger",
  "Burgers",
  "Pizza",
  "Chinese",
  "North Indian",
  "South Indian",
  "Pasta",
  "Noodles",
  "Beverages",
  "Snacks",
  "Sandwiches",
  "Rolls",
  "Seafood",
  "Desserts",
  "Ice-Cream",
];

const zomatoSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  image:       { type: String },
  oldPrice:    { type: Number },
  price:       { type: Number },
  rating:      { type: Number },
  reviews:     { type: Number },
  restaurant:  { type: String },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  category: {
    type: String,
    enum: MENU_CATEGORIES,
    required: true,
  },
  time:        { type: String },
  description: { type: String },
});

export default mongoose.model("Zomato", zomatoSchema);
