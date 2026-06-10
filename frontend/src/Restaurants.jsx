import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Components/Card";
import "./FoodCard.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

const FoodCard = () => {
  const [items, setItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantIndex, setRestaurantIndex] = useState(0);

  const [activeRestaurant, setActiveRestaurant] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const [showCards, setShowCards] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/zomato");

        setItems(res.data);

        const uniqueRestaurants = [
          ...new Set(res.data.map(i => i.restaurant))
        ];
        setRestaurants(uniqueRestaurants);

        // Check if coming back from menu with specific restaurant
        const targetRestaurant = location.state?.restaurant || uniqueRestaurants[0];
        const firstItem = res.data.find(
          i => i.restaurant === targetRestaurant
        );

        const targetIndex = uniqueRestaurants.indexOf(targetRestaurant);

        setRestaurantIndex(targetIndex);
        setActiveRestaurant(targetRestaurant);
        setActiveCategory(firstItem.category);
        setActiveItem(firstItem);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [location.state]);

  if (!activeItem) return <h2>Loading...</h2>;

  // 🔹 ACTIVE RESTAURANT ITEMS
  const restaurantItems = items.filter(
    i => i.restaurant === activeRestaurant
  );

  // 🔹 UNIQUE CATEGORIES
  const categories = [
    ...new Set(restaurantItems.map(i => i.category))
  ];

  // 🔹 ACTIVE CATEGORY ITEMS
  const categoryItems = restaurantItems.filter(
    i => i.category === activeCategory
  );

  // 🔹 NAVIGATION
  const nextRestaurant = () => {
    const nextIndex = (restaurantIndex + 1) % restaurants.length;
    changeRestaurant(nextIndex);
  };

  const prevRestaurant = () => {
    const prevIndex =
      (restaurantIndex - 1 + restaurants.length) % restaurants.length;
    changeRestaurant(prevIndex);
  };

  const changeRestaurant = (index) => {
    const name = restaurants[index];
    const newItems = items.filter(i => i.restaurant === name);
    const firstItem = newItems[0];

    setRestaurantIndex(index);
    setActiveRestaurant(name);
    setActiveCategory(firstItem.category);
    setActiveItem(firstItem);
    setShowCards(false);
  };
  if (restaurants.length === 0) return <h2>Loading...</h2>;


  return (
    <>
      <div className="food-card">
        <button onClick={() => navigate("/")} style={{ position: "absolute", top: "10px", left: "10px", fontSize: "16px", background: "white smoke", color: "black", border: "none", padding: "4px 8px", borderRadius: "5px", cursor: "pointer", zIndex: "10" }}>Back</button>

        {/* LEFT ARROW */}
        {restaurants.length > 0 && (
  <button className="nav-arrow left" onClick={prevRestaurant}>⬅</button>
)}


        {/* TOP BAR */}
        <div className="top-nav">
          <h2 className="restaurant-name">{activeRestaurant}</h2>

          <div className="category-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={activeCategory === cat ? "active-cat" : ""}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveItem(
                    restaurantItems.find(i => i.category === cat)
                  );
                  setShowCards(false);
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="nav-links">
            <Link to={`/menuCard2/${activeRestaurant}`}>Menu List</Link>
          </div>
        </div>

        <div className="content">
          {/* LEFT INFO */}
          <div className="left-info">
            <h1 className="food-title">{activeItem.name}</h1>
            <h2 className="price">₹{activeItem.price}</h2>
            <p className="desc">{activeItem.description}</p>
            <div className="qty-order">
            <button className="order-btn">Add to Cart</button>
            {/* <button className="learn-btn">Learn more...</button> */}
          </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="right-side">
            <div className="side-carousel">
              {categoryItems.map(item => (
                <div
                  key={item._id}
                  onClick={() => {
                    setActiveItem(item);
                    setShowCards(true);
                  }}
                >
                  <img src={item.image} className="small-img" />
                </div>
              ))}
            </div>

            <div className="main-img-box">
              <img src={activeItem.image} className="main-img" />
            </div>
          </div>
        </div>

        {/* RIGHT ARROW */}
        {restaurants.length > 0 && (
        <button className="nav-arrow right" onClick={nextRestaurant}>➡</button>
        )}

      </div>

      {showCards && (
        <div className="bottom-card-section">
          <Card itemsData={categoryItems} />
        </div>
      )}
    </>
  );
};

export default FoodCard;
