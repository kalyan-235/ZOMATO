import { Link } from "react-router-dom";
import "../css/Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      {/* Left Side */}
      <div className="hero-left">
        <span className="hero-badge">🍽️ #1 Food Delivery Platform - 2026</span>

        <h1 className="hero-title">
          Delicious food <br />
          <span className="highlight">delivered</span> to <br />
          your doorstep.
        </h1>

        <p className="hero-subtitle">
          Order fresh, healthy, and tasty meals from your favorite restaurants
          in minutes. Over 1,000 kitchens, infinite cravings.
        </p>

        {/* Search Bar */}
        <div className="hero-search">
          <div className="search-location">
            <span className="search-icon">📍</span>
            <input type="text" placeholder="Brooklyn, NY" />
          </div>
          <div className="search-divider" />
          <div className="search-food">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search food, restaurants, cuisine..." />
          </div>
          <button className="search-btn">Search</button>
        </div>

        {/* CTA Buttons */}
        <div className="hero-cta">
          <Link to="/Restaurants">
            <button className="btn-order">Order Now →</button>
          </Link>
          <Link to="/category/ALL">
            <button className="btn-explore">Explore Menu</button>
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-stars">⭐ 4.9</span>
            <span className="stat-label">50k+ reviews</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span>🚚</span>
            <span className="stat-label">Free delivery $15+</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span>⏱️</span>
            <span className="stat-label">30-min guarantee</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="hero-right">
        {/* Floating top card */}
        <div className="float-card float-top">
          <img src="/IMAGES/chicken_Biryani.avif" alt="Margherita" className="float-img" />
          <div className="float-info">
            <strong>Chicken Biryani</strong>
            <span>⭐ 4.7 · 20 min</span>
          </div>
        </div>

        {/* Main food image circle */}
        <div className="hero-img-circle">
          <img src="/IMAGES/burger_2.webp" alt="Food" className="hero-food-img" />
        </div>

        {/* Floating bottom card */}
        <div className="float-card float-bottom">
          <img src="/IMAGES/BiryaniCombo.avif" alt="Biryani Combo" className="float-img" />
          <div className="float-info">
            <strong>Biryani Combo</strong>
            <span className="offer-tag">30% OFF</span>
          </div>
        </div>

        {/* Delivery time badge */}
        <div className="delivery-badge">
          <span className="delivery-label">Delivered in</span>
          <span className="delivery-time">28 min</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
