import Zomato from "../model/zomato.model.js";
import Restaurant from "../model/restaurant.model.js";

const getPublicMenuFilter = async () => {
  const availableRestaurantIds = await Restaurant.distinct("_id", {
    approvalStatus: "approved",
    isAvailable: true,
  });
  return {
    $or: [
      { restaurantId: null },
      { restaurantId: { $in: availableRestaurantIds } },
    ],
  };
};

export const getZomatoItems = async (_req, res) => {
  try {
    const items = await Zomato.find(await getPublicMenuFilter());
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemsByRestaurant = async (req, res) => {
  try {
    const publicMenuFilter = await getPublicMenuFilter();
    const items = await Zomato.find({
      restaurant: req.params.name,
      ...publicMenuFilter,
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const publicMenuFilter = await getPublicMenuFilter();
    const items = await Zomato.find({
      category: req.params.category,
      ...publicMenuFilter,
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
