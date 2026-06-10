import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Components/Card";
import "./FoodCard.css";
import { Link } from "react-router-dom";
const FoodCard = () => {
  const [items, setItems] = useState([]);
  const [activeRestaurant, setActiveRestaurant] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const [showCards, setShowCards] = useState(false);

  // 🔹 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/zomato");
        setItems(res.data);

        if (res.data.length > 0) {
          setActiveRestaurant(res.data[0].restaurant);
          setActiveCategory(res.data[0].category);
          setActiveItem(res.data[0]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  if (!activeItem) return <h2>Loading...</h2>;

  // ITEMS OF ACTIVE RESTAURANT
  const restaurantItems = items.filter(
    item => item.restaurant === activeRestaurant
  );

  // UNIQUE CATEGORIES (NO ALL)
  const categories = [
    ...new Set(restaurantItems.map(item => item.category))
  ];

  // ITEMS OF ACTIVE CATEGORY ... UNIC RESTAURANT LONI CATEGORIES
  const categoryItems = restaurantItems.filter(
    item => item.category === activeCategory
  );

  return (
    <>
      <div className="food-card">

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
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          <div className="nav-links">
          <Link to = "/menuCard2">Menu List</Link>
        </div>
        </div>

        <div className="content">

          {/* LEFT SIDE */}
          <div className="left-info">
            <h1 className="food-title">{activeItem.name}</h1>
            <h2 className="price">₹{activeItem.price}</h2>
            <p className="desc">{activeItem.description}</p>
            <div className="qty-order">
            <button className="order-btn">Add to Cart</button>
            <button className="learn-btn">Learn more...</button>
          </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="right-side">

            {/* SMALL IMAGES (VERTICAL LIST) */}
            <div className="side-carousel">
              {/* <h2>{activeCategory.toUpperCase()}</h2> */}

              {categoryItems.map(item => (
                <div
                  key={item._id}
                  className="small-item"
                  onClick={() => {setActiveItem(item);
                    setShowCards(true)
                  }}
                >
                  <img src={item.image} className="small-img"/>
                  {/* <p>{item.name}</p> */}
                </div>
              ))}
            </div>

            {/* BIG IMAGE */}
            <div className="main-img-box">
              <img src={activeItem.image}  className="main-img" alt="" />
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM CARDS */}
      <div className="bottom-card-section">
       {showCards && (
       <Card itemsData={categoryItems} />
       )}
      </div>
    </>
  );
};

export default FoodCard;
