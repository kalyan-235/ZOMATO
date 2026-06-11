import Zomato from "../model/zomato.model.js";

export const getZomatoItems = async (_req, res) => {
  try {
    const items = await Zomato.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemsByRestaurant = async (req, res) => {
  try {
    const items = await Zomato.find({ restaurant: req.params.name });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const items = await Zomato.find({ category: req.params.category });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
