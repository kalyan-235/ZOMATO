import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Hero.css";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/Restaurants?q=${encodeURIComponent(query)}` : "/Restaurants");
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-badge">🍴 Fresh food, delivered fast</span>
        <h1 className="hero-title">
          Delicious Food,<br />
          Delivered <span className="highlight">Fast!</span>
        </h1>
        <p className="hero-subtitle">
          Order from your favourite restaurants and get it delivered to your doorstep.
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <div className="search-food">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              aria-label="Search food, restaurants, or cuisines"
              placeholder="Search for restaurants, cuisines..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="hero-benefits">
          <span><b aria-hidden="true">🚚</b> Fast Delivery</span>
          <span><b aria-hidden="true">🛡️</b> Safe &amp; Secure</span>
          <span><b aria-hidden="true">⭐</b> Great Offers</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
