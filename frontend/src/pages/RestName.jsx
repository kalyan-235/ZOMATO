import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../Components/Card";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../css/FoodCard.css";

const RestName = () => {
  const [items, setItems]                   = useState([]);
  const [restaurants, setRestaurants]       = useState([]);
  const [restaurantIndex, setRestaurantIndex] = useState(0);
  const [activeRestaurant, setActiveRestaurant] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeItem, setActiveItem]         = useState(null);
  const [showCards, setShowCards]           = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { name }  = useParams();          // comes from /restname/:name

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/zomato");
        setItems(res.data);

        const uniqueRestaurants = [...new Set(res.data.map(i => i.restaurant))];
        setRestaurants(uniqueRestaurants);

        // Use :name param OR location.state OR first restaurant
        const targetRestaurant =
          name || location.state?.restaurant || uniqueRestaurants[0];

        const firstItem = res.data.find(i => i.restaurant === targetRestaurant);
        const targetIndex = uniqueRestaurants.indexOf(targetRestaurant);

        setRestaurantIndex(targetIndex);
        setActiveRestaurant(targetRestaurant);
        setActiveCategory(firstItem?.category || "");
        setActiveItem(firstItem || null);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [name, location.state]);

  if (!activeItem) return <h2 style={{ textAlign: "center", marginTop: "60px" }}>Loading...</h2>;
  if (restaurants.length === 0) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  // ── derived state ──
  const restaurantItems = items.filter(i => i.restaurant === activeRestaurant);
  const categories      = [...new Set(restaurantItems.map(i => i.category))];
  const categoryItems   = restaurantItems.filter(i => i.category === activeCategory);

  // ── navigation ──
  const changeRestaurant = (index) => {
    const rname    = restaurants[index];
    const newItems = items.filter(i => i.restaurant === rname);
    const first    = newItems[0];
    setRestaurantIndex(index);
    setActiveRestaurant(rname);
    setActiveCategory(first.category);
    setActiveItem(first);
    setShowCards(false);
  };

  const nextRestaurant = () => changeRestaurant((restaurantIndex + 1) % restaurants.length);
  const prevRestaurant = () => changeRestaurant((restaurantIndex - 1 + restaurants.length) % restaurants.length);

  return (
    <>
      <div className="food-card">

        {/* Back button */}
        <button
          onClick={() => navigate("/Restaurants")}
          style={{
            position: "absolute", top: "10px", left: "10px",
            fontSize: "16px", background: "whitesmoke", color: "black",
            border: "none", padding: "4px 8px", borderRadius: "5px",
            cursor: "pointer", zIndex: "10"
          }}
        >
          ← Back
        </button>

        {/* Left arrow */}
        <button className="nav-arrow left" onClick={prevRestaurant}>⬅</button>

        {/* Top bar */}
        <div className="top-nav">
          <h2 className="restaurant-name">{activeRestaurant}</h2>

          <div className="category-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={activeCategory === cat ? "active-cat" : ""}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveItem(restaurantItems.find(i => i.category === cat));
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

        {/* Content */}
        <div className="content">

          {/* Left info */}
          <div className="left-info">
            <h1 className="food-title">{activeItem.name}</h1>
            <h2 className="price">₹{activeItem.price}</h2>
            <p className="desc">{activeItem.description}</p>
            <div className="qty-order">
              <button className="order-btn">Add to Cart</button>
            </div>
          </div>

          {/* Right side */}
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
                  <img src={item.image} className="small-img" alt={item.name} />
                </div>
              ))}
            </div>

            <div className="main-img-box">
              <img src={activeItem.image} className="main-img" alt={activeItem.name} />
            </div>
          </div>
        </div>

        {/* Right arrow */}
        <button className="nav-arrow right" onClick={nextRestaurant}>➡</button>
      </div>

      {showCards && (
        <div className="bottom-card-section">
          <Card itemsData={categoryItems} />
        </div>
      )}
    </>
  );
};

export default RestName;
