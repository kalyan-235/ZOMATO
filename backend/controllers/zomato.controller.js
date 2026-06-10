const Zomato = require('../model/zomato.model.js');

const getZomatoItems = async (req, res) => {
    try {
        const items = await Zomato.find();   // get all data
        res.status(200).json(items);   // send response only once
        // console.log(items);            // log data safely
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getItemsByRestaurant = async (req, res) => {
    try {
        const restaurantName = req.params.name;
        const items = await Zomato.find({ restaurant: restaurantName });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategory = async (req,res) =>{
    try{
        const categoryName = req.params.category;
        const items = await Zomato.find( {category: categoryName} )

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getZomatoItems, getItemsByRestaurant, getCategory };

