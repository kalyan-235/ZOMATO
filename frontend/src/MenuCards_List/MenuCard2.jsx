import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/MenuCard2.css";

/**
 * MenuCard2 works in two modes:
 *  1. Overlay mode  — rendered by RestName with `restaurant` + `onClose` props
 *  2. Standalone mode — rendered by the /menuCard2/:restaurant route (no props)
 */
function MenuCard2({ restaurant: propRestaurant, onClose }) {
  const { restaurant: paramRestaurant } = useParams();
  const restaurant = propRestaurant || paramRestaurant;

  const isOverlay = !!onClose;           // true when opened from RestName

  const [menuMap, setMenuMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/zomato").then((res) => {
      const mine = res.data.filter((i) => i.restaurant === restaurant);
      const map  = {};
      mine.forEach((item) => {
        if (!map[item.category]) map[item.category] = [];
        map[item.category].push(item);
      });
      setMenuMap(map);
      setLoading(false);
    });
  }, [restaurant]);

  const content = (
    <div className="mc2-sheet">
      {/* Header */}
      <div className="mc2-header">
        <div className="mc2-header-left">
          <span className="mc2-icon">📋</span>
          <div>
            <h2 className="mc2-title">{restaurant}</h2>
            <p className="mc2-subtitle">Our Special Menu</p>
          </div>
        </div>
        <button className="mc2-close" onClick={onClose}>✕ Close</button>
      </div>

      {/* Body */}
      <div className="mc2-body">
        {loading ? (
          <p className="mc2-loading">Loading menu…</p>
        ) : (
          <>
            {/* Menu categories */}
            <div className="mc2-categories">
              {Object.keys(menuMap).map((cat) => (
                <div className="mc2-cat-block" key={cat}>
                  <h3 className="mc2-cat-title">{cat.toUpperCase()}</h3>
                  <div className="mc2-items-list">
                    {menuMap[cat].map((item) => (
                      <div className="mc2-item-row" key={item._id}>
                        <div className="mc2-item-left">
                          {item.category === "Veg"
                            ? <span className="mc2-dot mc2-veg">🟢</span>
                            : <span className="mc2-dot mc2-nonveg">🔴</span>
                          }
                          <span className="mc2-item-name">{item.name}</span>
                        </div>
                        <span className="mc2-item-price">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="mc2-hours">
              <h3 className="mc2-hours-title">🕐 Hours of Operation</h3>
              <div className="mc2-hours-grid">
                {[
                  ["Monday",    "9AM – 10PM"],
                  ["Tuesday",   "9AM – 10PM"],
                  ["Wednesday", "9AM – 10PM"],
                  ["Thursday",  "9AM – 10PM"],
                  ["Friday",    "9AM – 11PM"],
                  ["Saturday",  "9AM – 11PM"],
                  ["Sunday",    "10AM – 9PM"],
                ].map(([day, time]) => (
                  <div className="mc2-hours-row" key={day}>
                    <span className="mc2-day">{day}</span>
                    <span className="mc2-time">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  /* ── OVERLAY MODE ── */
  if (isOverlay) {
    return (
      <div className="mc2-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {content}
      </div>
    );
  }

  /* ── STANDALONE PAGE MODE ── */
  return <div className="mc2-page">{content}</div>;
}

export default MenuCard2;
