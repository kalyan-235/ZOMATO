import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import MenuOverlay from "../MenuCards_List/MenuCard2";
import "../css/RestName.css";

/* Static descriptions per restaurant – fallback if name not found */
const REST_INFO = {
  default: {
    tagline: "Fresh ingredients, bold flavours, delivered fast.",
    cuisine: "Multi Cuisine",
    rating:  "4.5",
    time:    "30–45 min",
    cost:    "₹200 for two",
  },
};

const getInfo = (name) =>
  REST_INFO[name] || { ...REST_INFO.default, cuisine: "Speciality Kitchen" };

/* Pick a cover image from the first item of the restaurant */
const FALLBACK_COVER = "/IMAGES/burger_2.webp";

const fixImg = (src) =>
  src && !src.startsWith("/") && !src.startsWith("http") ? `/${src}` : src;

const RestName = () => {
  const { name }      = useParams();
  const navigate      = useNavigate();
  const location      = useLocation();
  const { addToCart } = useCart();

  // Where to go when back is clicked — depends on who sent us here
  const fromPage = location.state?.from === "category" ? "/category" : "/Restaurants";

  const [items, setItems]             = useState([]);
  const [activeCategory, setCategory] = useState("ALL");
  const [added, setAdded]             = useState({});
  const [loading, setLoading]         = useState(true);
  const [showMenu, setShowMenu]       = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/zomato")
      .then((res) => {
        const mine = res.data.filter((i) => i.restaurant === name);
        setItems(mine);
        setLoading(false);
      })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [name]);

  if (loading) return <div className="rn-loading">Loading...</div>;
  if (!items.length) return <div className="rn-loading">No items found for "{name}"</div>;

  const info       = getInfo(name);
  const coverImg   = fixImg(items[0]?.image) || FALLBACK_COVER;
  const categories = ["ALL", ...new Set(items.map((i) => i.category))];
  const displayed  = activeCategory === "ALL"
    ? items
    : items.filter((i) => i.category === activeCategory);

  const handleAdd = (item) => {
    addToCart({ id: item._id, name: item.name, price: item.price, image: item.image, quantity: 1 });
    setAdded((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [item._id]: false })), 1500);
  };

  return (
    <div className="rn-page">

      {/* ── HERO BANNER ── */}
      <div className="rn-hero" style={{ backgroundImage: `url(${coverImg})` }}>
        <div className="rn-hero-overlay" />
        <div className="rn-hero-inner">

          {/* Back */}
          <button className="rn-back" onClick={() => navigate(fromPage)}>
            ← {location.state?.from === "category" ? "Back to Category" : "All Restaurants"}
          </button>

          {/* Restaurant identity */}
          <div className="rn-identity">
            <div className="rn-logo">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="rn-meta">
              <h1 className="rn-title">{name}</h1>
              <p className="rn-tagline">{info.tagline}</p>
              <div className="rn-badges">
                <span className="rn-badge">🍽️ {info.cuisine}</span>
                <span className="rn-badge">⭐ {info.rating}</span>
                <span className="rn-badge">🕐 {info.time}</span>
                <span className="rn-badge">💰 {info.cost}</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="rn-hero-actions">
            <button className="rn-menu-link" onClick={() => setShowMenu(true)}>
              📋 Full Menu
            </button>
          </div>

        </div>
      </div>

      {/* ── BODY : sidebar + cards ── */}
      <div className="rn-body">

        {/* ── RIGHT SIDEBAR : categories ── */}
        <aside className="rn-sidebar">
          <h3 className="rn-sidebar-title">Categories</h3>
          <ul className="rn-cat-list">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  className={`rn-cat-btn ${activeCategory === cat ? "rn-cat-active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat === "ALL" ? "🍴 All Items" : cat}
                  <span className="rn-cat-count">
                    {cat === "ALL"
                      ? items.length
                      : items.filter((i) => i.category === cat).length}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Offer banner */}
          <div className="rn-offer-box">
            <p className="rn-offer-title">🎉 Today's Offer</p>
            <p className="rn-offer-desc">Use code <strong>FIRST50</strong> and get 50% off on your first order!</p>
          </div>
        </aside>

        {/* ── FOOD CARDS GRID ── */}
        <main className="rn-main">
          <div className="rn-section-header">
            <h2 className="rn-section-title">
              {activeCategory === "ALL" ? "All Items" : activeCategory}
              <span className="rn-count">({displayed.length})</span>
            </h2>
          </div>

          <div className="rn-grid">
            {displayed.map((item) => (
              <div className="rn-card" key={item._id}>

                {/* Image */}
                <div className="rn-card-img-wrap">
                  <img src={fixImg(item.image)} alt={item.name} className="rn-card-img" />
                  {item.category === "Veg" && <span className="rn-veg-dot" title="Veg">🟢</span>}
                  {item.category === "Non-veg" && <span className="rn-veg-dot" title="Non-Veg">🔴</span>}
                </div>

                {/* Info */}
                <div className="rn-card-info">
                  <h3 className="rn-card-name">{item.name}</h3>
                  <p className="rn-card-cat">{item.category}</p>
                  {item.description && (
                    <p className="rn-card-desc">{item.description}</p>
                  )}
                  <div className="rn-card-footer">
                    <div className="rn-card-prices">
                      {item.oldPrice && (
                        <span className="rn-old-price">₹{item.oldPrice}</span>
                      )}
                      <span className="rn-new-price">₹{item.price}</span>
                    </div>
                    <button
                      className={`rn-add-btn ${added[item._id] ? "rn-added" : ""}`}
                      onClick={() => handleAdd(item)}
                    >
                      {added[item._id] ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </main>

      </div>

      {/* ── FULL MENU OVERLAY ── */}
      {showMenu && (
        <MenuOverlay
          restaurant={name}
          onClose={() => setShowMenu(false)}
        />
      )}

    </div>
  );
};

export default RestName;
