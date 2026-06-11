import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../css/Restaurants.css";

const fixImg = (src) =>
  src && !src.startsWith("/") && !src.startsWith("http") ? `/${src}` : src;

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch]           = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/zomato")
      .then(res => {
        // Build unique restaurant list with first item image + rating
        const map = {};
        res.data.forEach(item => {
          if (!map[item.restaurant]) {
            map[item.restaurant] = {
              name:    item.restaurant,
              image:   item.image,
              rating:  (4 + Math.random()).toFixed(1),   // static-ish rating
              time:    `${20 + Math.floor(Math.random() * 20)}-${30 + Math.floor(Math.random() * 20)} min`,
            };
          }
        });
        setRestaurants(Object.values(map));
      })
      .catch(err => console.log(err));
  }, []);

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rp-page">

      {/* ── HERO BANNER ── */}
      <div className="rp-hero">
        <div className="rp-hero-overlay" />
        <div className="rp-hero-content">
          <h1>Delicious Food, Delivered Fast.</h1>
          <p>Explore the best local restaurants and order your favourite meals in minutes.</p>
          <div className="rp-hero-search">
            <span className="rp-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Enter your address or restaurant name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="rp-find-btn">Find Food</button>
          </div>
        </div>
      </div>

      <div className="rp-body">

        {/* ── FEATURED RESTAURANTS ── */}
        <section className="rp-section">
          <h2 className="rp-section-title">Featured Restaurants</h2>
          <div className="rp-grid">
            {filtered.map((r, i) => (
              <div className="rp-card" key={i}>
                <div className="rp-card-img-wrap">
                  <img src={fixImg(r.image)} alt={r.name} className="rp-card-img" />
                  <button className="rp-heart">♡</button>
                  <span className="rp-rating">⭐ {r.rating}</span>
                </div>
                <div className="rp-card-body">
                  <h3 className="rp-card-name">{r.name}</h3>
                  <p className="rp-card-time">🕐 {r.time}</p>
                  <button
                    className="rp-order-btn"
                    onClick={() => navigate(`/restname/${r.name}`, { state: { from: "restaurants" } })}
                  >
                    VISIT NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TRENDING CATEGORIES ── */}
        {/* <section className="rp-section rp-cat-section">
          <h2 className="rp-section-title">Trending Categories</h2>
          <div className="rp-cat-grid">
            {TRENDING_CATEGORIES.map((cat, i) => (
              <div className="rp-cat-card" key={i}>
                <img src={cat.img} alt={cat.name} className="rp-cat-img" />
                <span className="rp-cat-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </section> */}

      </div>
    </div>
  );
};

export default Restaurants;
