const express = require("express");
const { getZomatoItems, getItemsByRestaurant, getCategory } = require("../controllers/zomato.controller");
const router = express.Router();

router.get("/", getZomatoItems);
router.get("/restaurant/:name", getItemsByRestaurant);
router.get("/category/:category",getCategory)

module.exports = router;
