import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Offers.css";

/* ── Static coupons ── */
const COUPONS = [
  {
    code: "FIRST50",
    title: "50% OFF your first order",
    desc: "Valid on orders above ₹199. New users only.",
    discount: "50%",
    color: "#e85d26",
    bg: "#fff2ee",
    border: "#fcd3c0",
    icon: "🎉",
    expiry: "31 Dec 2026",
  },
  {
    code: "SAVE100",
    title: "Flat ₹100 OFF",
    desc: "On orders above ₹499. Use once per account.",
    discount: "₹100",
    color: "#e23744",
    bg: "#fff0f1",
    border: "#ffc8cc",
    icon: "💸",
    expiry: "30 Nov 2026",
  },
  {
    code: "FREEDEL",
    title: "Free Delivery",
    desc: "Get free delivery on any order today. No minimum.",
    discount: "FREE",
    color: "#1e88e5",
    bg: "#f0f7ff",
    border: "#b3d4f8",
    icon: "🚴",
    expiry: "15 Jul 2026",
  },
  {
    code: "BOGO20",
    title: "Buy 1 Get 1 – 20% OFF",
    desc: "Add 2 items and get 20% off on the second item.",
    discount: "BOGO",
    color: "#43a047",
    bg: "#f0faf0",
    border: "#b2dfb3",
    icon: "🍽️",
    expiry: "20 Aug 2026",
  },
  {
    code: "WEEKEND30",
    title: "Weekend Special 30% OFF",
    desc: "Valid only on Saturday & Sunday orders above ₹299.",
    discount: "30%",
    color: "#8e24aa",
    bg: "#faf0ff",
    border: "#e1b3f8",
    icon: "🎊",
    expiry: "Every Weekend",
  },
  {
    code: "NIGHT15",
    title: "Late Night 15% OFF",
    desc: "Order between 10PM – 2AM and save 15%.",
    discount: "15%",
    color: "#f9a825",
    bg: "#fffbf0",
    border: "#fde68a",
    icon: "🌙",
    expiry: "Ongoing",
  },
];

/* ── Flash deals (static) ── */
const FLASH_DEALS = [
  { name: "Chicken Biryani",  img: "/IMAGES/chicken_Biryani.avif",   original: 249, offer: 149, tag: "40% OFF" },
  { name: "Butter Chicken",   img: "/IMAGES/ButterChicjen_Rm.jpg",   original: 320, offer: 199, tag: "38% OFF" },
  { name: "Margherita Pizza", img: "/IMAGES/Margherita_Pizza.webp",  original: 299, offer: 199, tag: "33% OFF" },
  { name: "Veg Fried Rice",   img: "/IMAGES/Veg_friedrice.avif",     original: 180, offer: 99,  tag: "45% OFF" },
  { name: "Chocolate Brownie",img: "/IMAGES/Chocolate_Brownie.webp", original: 120, offer: 79,  tag: "34% OFF" },
  { name: "Momos",            img: "/IMAGES/Momos.avif",             original: 149, offer: 89,  tag: "40% OFF" },
];

const fixImg = (src) =>
  src && !src.startsWith("/") && !src.startsWith("http") ? `/${src}` : src;

const Offers = () => {
  const navigate           = useNavigate();
  const [copied, setCopied] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/zomato").then((res) => {
      const map = {};
      res.data.forEach((item) => {
        if (!map[item.restaurant]) {
          map[item.restaurant] = {
            name:   item.restaurant,
            image:  fixImg(item.image),
            rating: (4 + Math.random()).toFixed(1),
            offer:  `${[10, 15, 20, 25, 30][Math.floor(Math.random() * 5)]}% OFF`,
          };
        }
      });
      setRestaurants(Object.values(map));
    });
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="of-page">

      {/* ── HERO ── */}
      <div className="of-hero">
        <div className="of-hero-overlay" />
        <div className="of-hero-content">
          <span className="of-hero-badge">🔥 Limited Time Deals</span>
          <h1>Exclusive Offers & Coupons</h1>
          <p>Save big on your favourite meals. New deals added every day.</p>
        </div>
      </div>

      <div className="of-body">

        {/* ── COUPON CARDS ── */}
        <section className="of-section">
          <h2 className="of-section-title">🎟️ Available Coupons</h2>
          <div className="of-coupon-grid">
            {COUPONS.map((c, i) => (
              <div
                className="of-coupon"
                key={i}
                style={{ background: c.bg, borderColor: c.border }}
              >
                {/* Left badge */}
                <div className="of-coupon-left" style={{ background: c.color }}>
                  <span className="of-coupon-icon">{c.icon}</span>
                  <span className="of-coupon-discount">{c.discount}</span>
                </div>

                {/* Notch divider */}
                <div className="of-notch-top"    style={{ background: c.border }} />
                <div className="of-notch-bottom" style={{ background: c.border }} />

                {/* Right info */}
                <div className="of-coupon-right">
                  <h3 style={{ color: c.color }}>{c.title}</h3>
                  <p>{c.desc}</p>
                  <div className="of-coupon-footer">
                    <div className="of-code-box" style={{ borderColor: c.color, color: c.color }}>
                      {c.code}
                    </div>
                    <button
                      className="of-copy-btn"
                      style={{ background: c.color }}
                      onClick={() => handleCopy(c.code)}
                    >
                      {copied === c.code ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>
                  <span className="of-expiry">Expires: {c.expiry}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FLASH DEALS ── */}
        <section className="of-section">
          <h2 className="of-section-title">⚡ Flash Deals</h2>
          <div className="of-flash-grid">
            {FLASH_DEALS.map((d, i) => (
              <div className="of-flash-card" key={i}>
                <div className="of-flash-img-wrap">
                  <img src={d.img} alt={d.name} className="of-flash-img" />
                  <span className="of-flash-tag">{d.tag}</span>
                </div>
                <div className="of-flash-info">
                  <h4>{d.name}</h4>
                  <div className="of-flash-prices">
                    <span className="of-old-price">₹{d.original}</span>
                    <span className="of-new-price">₹{d.offer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RESTAURANT OFFERS ── */}
        <section className="of-section">
          <h2 className="of-section-title">🍴 Restaurant Offers</h2>
          <div className="of-rest-grid">
            {restaurants.map((r, i) => (
              <div
                className="of-rest-card"
                key={i}
                onClick={() => navigate(`/restname/${r.name}`, { state: { from: "offers" } })}
              >
                <div className="of-rest-img-wrap">
                  <img src={r.image} alt={r.name} className="of-rest-img" />
                  <span className="of-rest-offer-tag">{r.offer}</span>
                </div>
                <div className="of-rest-info">
                  <h4>{r.name}</h4>
                  <span className="of-rest-rating">⭐ {r.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TERMS ── */}
        <section className="of-terms">
          <h3>Terms & Conditions</h3>
          <ul>
            <li>Coupons are valid for a limited period and subject to availability.</li>
            <li>Only one coupon can be applied per order.</li>
            <li>Discounts are applicable on the food subtotal, excluding delivery charges and taxes.</li>
            <li>Food Express reserves the right to modify or withdraw offers without prior notice.</li>
            <li>Offers are non-transferable and cannot be redeemed for cash.</li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default Offers;
