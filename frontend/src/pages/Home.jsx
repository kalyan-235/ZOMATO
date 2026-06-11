import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import Hero from "../Components/Hero";
import "../css/HomePage.css";

const fixImg = (src) =>
  src && !src.startsWith("/") && !src.startsWith("http") ? `/${src}` : src;

/* ── Static category pills ── */
const CATEGORIES = [
  { label: "Biryani",   icon: "🍛", key: "Biryani" },
  { label: "Burgers",   icon: "🍔", key: "Burger" },
  { label: "Pizza",     icon: "🍕", key: "Pizza" },
  { label: "Dosa",      icon: "🥞", key: "Dosa" },
  { label: "Desserts",  icon: "🍰", key: "Desserts" },
  { label: "Ice Cream", icon: "🍦", key: "Ice-Cream" },
  { label: "Veg",       icon: "🥗", key: "Veg" },
  { label: "Non-Veg",   icon: "🍗", key: "Non-veg" },
];

/* ── Why choose us ── */
const WHY = [
  { icon: "⚡", title: "Lightning Fast",  desc: "Average delivery in under 30 minutes, every time." },
  { icon: "✅", title: "Quality Assured", desc: "Every restaurant is hygiene-verified and quality-checked." },
  { icon: "💰", title: "Best Prices",     desc: "Unbeatable deals, daily offers and free delivery options." },
  { icon: "🔒", title: "100% Safe",       desc: "Secure payments and contactless delivery guaranteed." },
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
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [topItems, setTopItems]       = useState([]);

  useEffect(() => {
    API.get("/zomato").then((res) => {
      // Featured restaurants
      const map = {};
      res.data.forEach((item) => {
        if (!map[item.restaurant]) {
          map[item.restaurant] = {
            name:   item.restaurant,
            image:  fixImg(item.image),
            rating: (4 + Math.random()).toFixed(1),
            time:   `${20 + Math.floor(Math.random() * 20)}-${35 + Math.floor(Math.random() * 15)} min`,
            tag:    ["Pure Veg", "North Indian", "South Indian", "Fast Food", "Multi Cuisine"][
                      Math.floor(Math.random() * 5)
                    ],
          };
        }
      });
      setRestaurants(Object.values(map).slice(0, 6));

      // Top rated items
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
          <h2 className="hp-section-title">What's on your mind?</h2>
          <div className="hp-cat-strip">
            {CATEGORIES.map((c) => (
              <Link
                to={`/category`}
                className="hp-cat-pill"
                key={c.key}
              >
                <span className="hp-cat-icon">{c.icon}</span>
                <span className="hp-cat-label">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED RESTAURANTS ── */}
      <section className="hp-section hp-rest-section">
        <div className="hp-inner">
          <div className="hp-flex-head">
            <h2 className="hp-section-title">Featured Restaurants</h2>
            <Link to="/Restaurants" className="hp-see-all">See all →</Link>
          </div>
          <div className="hp-rest-grid">
            {restaurants.map((r, i) => (
              <div
                className="hp-rest-card"
                key={i}
                onClick={() => navigate(`/restname/${r.name}`, { state: { from: "home" } })}
              >
                <div className="hp-rest-img-wrap">
                  <img src={r.image} alt={r.name} className="hp-rest-img" />
                  <span className="hp-rest-tag">{r.tag}</span>
                </div>
                <div className="hp-rest-info">
                  <h3 className="hp-rest-name">{r.name}</h3>
                  <div className="hp-rest-meta">
                    <span className="hp-rest-rating">⭐ {r.rating}</span>
                    <span className="hp-rest-dot">•</span>
                    <span className="hp-rest-time">🕐 {r.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFER BANNER ── */}
      <section className="hp-offer-banner">
        <div className="hp-offer-left">
          <span className="hp-offer-badge">🔥 Limited Time</span>
          <h2>Get <span>50% OFF</span> on your first order!</h2>
          <p>Use code <strong>FIRST50</strong> at checkout. Valid for new users only.</p>
          <Link to="/offers" className="hp-offer-btn">Grab the Deal →</Link>
        </div>
        <div className="hp-offer-right">
          <img src="/IMAGES/BiryaniCombo.avif" alt="Offer" />
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

      {/* ── WHY US ── */}
      <section className="hp-why-section">
        <div className="hp-inner">
          <h2 className="hp-section-title hp-center">Why Choose Food Express?</h2>
          <div className="hp-why-grid">
            {WHY.map((w, i) => (
              <div className="hp-why-card" key={i}>
                <div className="hp-why-icon">{w.icon}</div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
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
