import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Hero from "../Components/Hero";
import "../css/HomePage.css";

const fixImg = (src) =>
  src && !src.startsWith("/") && !src.startsWith("http") ? `/${src}` : src;

const CATEGORIES = [
  { label: "Biryani", key: "Biryani", image: "/IMAGES/chicken_Biryani.avif" },
  { label: "Pizza", key: "Pizza", image: "/IMAGES/Margherita_Pizza.webp" },
  { label: "Burger", key: "Burger", image: "/IMAGES/burger_2.webp" },
  { label: "South Indian", key: "South Indian", image: "/IMAGES/dosa.jpg" },
  { label: "Chinese", key: "Chinese", image: "/IMAGES/Chicken_Friedrice.jpeg" },
  { label: "North Indian", key: "North Indian", image: "/IMAGES/Paneer_Butter_Masala.webp" },
];

/* ── Top dishes (static with your images) ── */
const TOP_DISHES = [
  { name: "Chicken Biryani",   img: "/IMAGES/chicken_Biryani.avif",  price: 149 },
  { name: "Butter Chicken",    img: "/IMAGES/ButterChicjen_Rm.jpg",  price: 199 },
  { name: "Margherita Pizza",  img: "/IMAGES/Margherita_Pizza.webp", price: 199 },
  { name: "Momos",             img: "/IMAGES/Momos.avif",            price: 89  },
  { name: "Veg Fried Rice",    img: "/IMAGES/Veg_friedrice.avif",    price: 99  },
  { name: "Chocolate Brownie", img: "/IMAGES/Chocolate_Brownie.webp",price: 79  },
  { name: "Mutton Biryani",    img: "/IMAGES/Mutton_Biryani.webp",   price: 249 },
  { name: "Tandoori Chicken",  img: "/IMAGES/Tandoori_chicken.jpg",  price: 219 },
];

const Home = () => {
  const [topItems, setTopItems]       = useState([]);

  useEffect(() => {
    API.get("/zomato").then((res) => {
      const sorted = [...res.data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setTopItems(sorted.slice(0, 8));
    });
  }, []);

  return (
    <div className="hp-page">

      {/* ── HERO ── */}
      <Hero />

      {/* ── CATEGORY STRIP ── */}
      <section className="hp-section hp-categories-section">
        <div className="hp-inner">
          <div className="hp-flex-head">
            <h2 className="hp-section-title">What's on your mind?</h2>
            <Link to="/category" className="hp-see-all">View all →</Link>
          </div>
          <div className="hp-cat-strip">
            {CATEGORIES.map((c) => (
              <Link
                to={`/category/${encodeURIComponent(c.key)}`}
                className="hp-cat-pill"
                key={c.key}
              >
                <img className="hp-cat-image" src={c.image} alt="" />
                <span className="hp-cat-label">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP DISHES ── */}
      <section className="hp-section hp-dishes-section">
        <div className="hp-inner">
          <div className="hp-flex-head">
            <h2 className="hp-section-title">Top Dishes Right Now</h2>
            <Link to="/category" className="hp-see-all">See all →</Link>
          </div>
          <div className="hp-dishes-grid">
            {(topItems.length ? topItems : TOP_DISHES).map((item, i) => (
              <div className="hp-dish-card" key={i}>
                <div className="hp-dish-img-wrap">
                  <img
                    src={fixImg(item.img || item.image)}
                    alt={item.name}
                    className="hp-dish-img"
                  />
                </div>
                <div className="hp-dish-info">
                  <h4 className="hp-dish-name">{item.name}</h4>
                  <div className="hp-dish-footer">
                    <span className="hp-dish-price">₹{item.price}</span>
                    {item.rating && (
                      <span className="hp-dish-rating">⭐ {item.rating}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="hp-cta">
        <h2>Ready to satisfy your cravings?</h2>
        <p>Over 1,000 restaurants. Thousands of dishes. One tap away.</p>
        <Link to="/Restaurants" className="hp-cta-btn">Order Now →</Link>
      </section>

    </div>
  );
};

export default Home;
