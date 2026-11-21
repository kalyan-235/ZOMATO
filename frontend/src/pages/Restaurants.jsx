import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";
import "../css/Restaurants.css";

const fixImg = (src) =>
  src && !src.startsWith("/") && !src.startsWith("http") ? `/${src}` : src;

/* Fix 5 — stable hash-based values, same restaurant always gets same rating */
const stableHash = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
};
const stableRating = (name) => (4 + (stableHash(name) % 10) / 10).toFixed(1);
const stableTime   = (name) => { const b = 20 + (stableHash(name) % 20); return `${b}–${b + 10} min`; };

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [search,      setSearch]      = useState("");
  const navigate    = useNavigate();
  const [searchParams] = useSearchParams();

  /* Pre-fill search from Hero query param (?q=...) */
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    API.get("/zomato")
      .then(res => {
        const map = {};
        res.data.forEach(item => {
          if (!map[item.restaurant]) {
            map[item.restaurant] = {
              name:   item.restaurant,
              image:  item.image,
              rating: stableRating(item.restaurant),
              time:   stableTime(item.restaurant),
            };
          }
        });
        setRestaurants(Object.values(map));
        setLoading(false);
      })
      .catch(() => { setError("Failed to load restaurants. Please try again."); setLoading(false); });
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
              placeholder="Search restaurants by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus={!!searchParams.get("q")}
            />
            {search && (
              <button className="rp-clear-search" onClick={() => setSearch("")}>✕</button>
            )}
            <button className="rp-find-btn">Search</button>
          </div>
        </div>
      </div>

      <div className="rp-body">
        <section className="rp-section">

          {/* Section header with result count */}
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:20 }}>
            <h2 className="rp-section-title" style={{ margin:0 }}>
              {search ? `Results for "${search}"` : 'Featured Restaurants'}
            </h2>
            {!loading && !error && (
              <span style={{ fontSize:'0.82rem', color:'#aaa' }}>{filtered.length} restaurants</span>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="rp-state-box">
              <div className="rp-spinner" />
              <p>Loading restaurants…</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="rp-state-box rp-error">
              <span>⚠️</span>
              <p>{error}</p>
              <button className="rp-find-btn" onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {/* Empty search result */}
          {!loading && !error && filtered.length === 0 && (
            <div className="rp-state-box">
              <span style={{ fontSize:'3rem' }}>🔍</span>
              <p>No restaurants found for "<strong>{search}</strong>"</p>
              <button className="rp-find-btn" onClick={() => setSearch("")}>Clear Search</button>
            </div>
          )}

          {/* Cards grid */}
          {!loading && !error && (
            <div className="rp-grid">
              {filtered.map((r, i) => (
                <div className="rp-card" key={i}>
                  <div className="rp-card-img-wrap">
                    <img
                      src={fixImg(r.image)}
                      alt={r.name}
                      className="rp-card-img"
                      onError={e => { e.target.src = '/IMAGES/burger_2.webp'; }}
                    />
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
          )}
        </section>
      </div>
    </div>
  );
};

export default Restaurants;
