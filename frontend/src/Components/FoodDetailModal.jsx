import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../css/FoodDetailModal.css";

const fixImg = (src) =>
  src && !src.startsWith("/") && !src.startsWith("http") ? `/${src}` : src;

/**
 * Props:
 *  item    — food item object (from DB)
 *  onClose — close callback
 */
const FoodDetailModal = ({ item, onClose }) => {
  const { addToCart }  = useCart();
  const navigate       = useNavigate();
  const [qty, setQty]  = useState(1);
  const [added, setAdded] = useState(false);

  /* Close on Escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Prevent background scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const totalPrice = item.price * qty;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ id: item._id, name: item.name, price: item.price, image: item.image, quantity: 1 });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleOrderNow = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ id: item._id, name: item.name, price: item.price, image: item.image, quantity: 1 });
    }
    onClose();
    navigate("/cart");
  };

  return (
    <div className="fdm-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="fdm-modal">

        {/* Close button */}
        <button className="fdm-close" onClick={onClose} aria-label="Close">✕</button>

        {/* ── IMAGE ── */}
        <div className="fdm-img-wrap">
          <img
            src={fixImg(item.image)}
            alt={item.name}
            className="fdm-img"
            onError={e => { e.target.src = "/IMAGES/burger_2.webp"; }}
          />
          {/* Veg / Non-veg badge */}
          <span className={`fdm-type-badge ${item.category === "Veg" ? "fdm-veg" : "fdm-nonveg"}`}>
            {item.category === "Veg" ? "🟢 Veg" : "🔴 Non-Veg"}
          </span>
          {/* Discount badge */}
          {item.oldPrice && item.oldPrice > item.price && (
            <span className="fdm-discount-badge">
              {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* ── DETAILS ── */}
        <div className="fdm-details">

          {/* Category tag */}
          <span className="fdm-category">{item.category}</span>

          <h2 className="fdm-name">{item.name}</h2>

          {/* Rating row */}
          {item.rating && (
            <div className="fdm-rating-row">
              <span className="fdm-rating">⭐ {item.rating}</span>
              {item.reviews && <span className="fdm-reviews">({item.reviews} reviews)</span>}
              {item.time    && <span className="fdm-time">🕐 {item.time}</span>}
            </div>
          )}

          {/* Description */}
          {item.description && (
            <p className="fdm-desc">{item.description}</p>
          )}

          {/* Price row */}
          <div className="fdm-price-row">
            <div className="fdm-prices">
              {item.oldPrice && <span className="fdm-old-price">₹{item.oldPrice}</span>}
              <span className="fdm-new-price">₹{item.price}</span>
            </div>
            <span className="fdm-restaurant">🏪 {item.restaurant}</span>
          </div>

          <div className="fdm-divider" />

          {/* Quantity selector */}
          <div className="fdm-qty-row">
            <span className="fdm-qty-label">Quantity</span>
            <div className="fdm-qty-ctrl">
              <button
                className="fdm-qty-btn"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty === 1}
              >−</button>
              <span className="fdm-qty-num">{qty}</span>
              <button
                className="fdm-qty-btn fdm-qty-plus"
                onClick={() => setQty(q => Math.min(20, q + 1))}
              >+</button>
            </div>
            <span className="fdm-total">Total: <strong>₹{totalPrice}</strong></span>
          </div>

          {/* Action buttons */}
          <div className="fdm-actions">
            <button
              className={`fdm-btn-cart ${added ? "fdm-btn-added" : ""}`}
              onClick={handleAddToCart}
            >
              {added ? "✓ Added to Cart!" : `🛒 Add to Cart · ₹${totalPrice}`}
            </button>
            <button className="fdm-btn-order" onClick={handleOrderNow}>
              ⚡ Order Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FoodDetailModal;
