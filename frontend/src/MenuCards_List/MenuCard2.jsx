import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Menu_Card.css";

function MenuCard2() {
  const { restaurant } = useParams(); // 👈 restaurant from card
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [menuMap, setMenuMap] = useState({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://localhost:5000/zomato");

        // 🔹 ONLY SELECTED RESTAURANT ITEMS
        const restaurantItems = res.data.filter(
          item => item.restaurant === restaurant
        );

        // 🔹 CATEGORY-WISE GROUPING
        const categoryMap = {};
        restaurantItems.forEach(item => {
          if (!categoryMap[item.category]) {
            categoryMap[item.category] = [];
          }
          categoryMap[item.category].push(item);
        });

        setItems(restaurantItems);
        setMenuMap(categoryMap);

      } catch (err) {
        console.log(err);
      }
    };

    fetchMenu();
  }, [restaurant]);

  if (items.length === 0) return <h2>Loading menu...</h2>;

  return (
    <div className="menu-container">

      {/* DECORATIVE IMAGES */}
      <img src="/IMAGES/burger_2cGUetB.jpeg" className="top-left-img" />
      <img src="/IMAGES/biryani.png" className="top-right-img" />

      <div className="center-content">
        <button className="back-button" onClick={() => navigate('/Restaurants', { state: { restaurant } })}>← Back to Restaurants</button>
        <h1 className="title">{restaurant}</h1>
        <p className="subtitle">Our Special Menu</p>

        <div className="menu-grid">
          {Object.keys(menuMap).map(category => (
            <div className="menu-block" key={category}>
              <h2>{category.toUpperCase()}</h2>

              <div className="list-row">
                <div>
                  {menuMap[category].map(item => (
                    <p key={item._id}>{item.name}</p>
                  ))}
                </div>

                <div className="prices">
                  {menuMap[category].map(item => (
                    <p key={item._id}>₹{item.price}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* STATIC DETAILS (OPTIONAL) */}
        <h2 className="hours-title">Hours Of Operation</h2>
        <div className="hours-grid">
          <span>Monday</span><span>9AM - 10PM</span>
          <span>Tuesday</span><span>9AM - 10PM</span>
          <span>Wednesday</span><span>9AM - 10PM</span>
          <span>Thursday</span><span>9AM - 10PM</span>
          <span>Friday</span><span>9AM - 11PM</span>
          <span>Saturday</span><span>9AM - 11PM</span>
        </div>
      </div>

      <img src="/IMAGES/Cake.avif" className="bottom-left-img" />
      <img src="/IMAGES/Pasta.avif" className="bottom-right-img" />
    </div>
  );
}

export default MenuCard2;
