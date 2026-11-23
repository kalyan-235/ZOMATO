import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NavBar = () => {
  const { user, logout }    = useAuth();
  const { getTotalItems }   = useCart();
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  /* Add shadow + blur when page scrolls */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeProfile = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", closeProfile);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeProfile);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const closeProfile = () => setProfileOpen(false);

  const navLinkClass = ({ isActive }) =>
    isActive ? "nb-link nb-link-active" : "nb-link";

  return (
    <nav className={`nb-nav ${scrolled ? "nb-scrolled" : ""}`}>

      {/* ── LOGO ── */}
      <Link to="/" className="nb-logo" onClick={closeProfile}>
        <span className="nb-logo-icon">🍴</span>
        <span className="nb-logo-text">Food<span className="nb-logo-accent">Express</span></span>
      </Link>

      {/* ── NAV LINKS (desktop) ── */}
      <ul className="nb-links">
        <li><NavLink to="/"            className={navLinkClass} onClick={closeProfile}>Home</NavLink></li>
        <li><NavLink to="/category"    className={navLinkClass} onClick={closeProfile}>Category</NavLink></li>
        <li><NavLink to="/Restaurants" className={navLinkClass} onClick={closeProfile}>Restaurants</NavLink></li>
        <li><NavLink to="/offers"      className={navLinkClass} onClick={closeProfile}>Offers</NavLink></li>
        <li><NavLink to="/about"       className={navLinkClass} onClick={closeProfile}>About</NavLink></li>
      </ul>

      {/* ── RIGHT ACTIONS ── */}
      <div className="nb-right">

        {/* Cart */}
        <Link to="/cart" className="nb-cart" onClick={closeProfile}>
          <span className="nb-cart-icon">🛒</span>
          {getTotalItems() > 0 && (
            <span className="nb-cart-badge">{getTotalItems()}</span>
          )}
        </Link>

        {/* Auth */}
        {user ? (
          <div className="nb-user" ref={profileRef}>
            <button
              type="button"
              className="nb-profile-button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              <span className="nb-avatar">{user.username?.[0]?.toUpperCase()}</span>
              <span className="nb-username">Hi, {user.username}</span>
            </button>
            {profileOpen && (
              <div className="nb-profile-menu">
                <div className="nb-profile-name">
                  <span>{user.username}</span>
                  <small>My account</small>
                </div>
                <Link to="/my-orders" className="nb-profile-link" onClick={closeProfile}>
                  <span className="nb-profile-link-icon">📦</span>
                  <span>My Orders</span>
                </Link>
                <button
                  type="button"
                  className="nb-profile-link nb-profile-logout"
                  onClick={() => {
                    closeProfile();
                    logout();
                  }}
                >
                  <span className="nb-profile-link-icon">↪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="nb-auth">
            <Link to="/login"  onClick={closeProfile}><button className="nb-btn nb-login">Login</button></Link>
            <Link to="/signup" onClick={closeProfile}><button className="nb-btn nb-signup">Sign Up</button></Link>
          </div>
        )}

      </div>

      <nav className="nb-mobile-footer" aria-label="Mobile navigation">
        <NavLink to="/" className={({ isActive }) => `nb-mobile-link ${isActive ? "nb-mobile-active" : ""}`}>
          <span className="nb-mobile-icon">⌂</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/category" className={({ isActive }) => `nb-mobile-link ${isActive ? "nb-mobile-active" : ""}`}>
          <span className="nb-mobile-icon">◉</span>
          <span>Category</span>
        </NavLink>
        <NavLink to="/Restaurants" className={({ isActive }) => `nb-mobile-link ${isActive ? "nb-mobile-active" : ""}`}>
          <span className="nb-mobile-icon">♨</span>
          <span>Restaurants</span>
        </NavLink>
        <NavLink to="/offers" className={({ isActive }) => `nb-mobile-link ${isActive ? "nb-mobile-active" : ""}`}>
          <span className="nb-mobile-icon">%</span>
          <span>Offers</span>
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `nb-mobile-link ${isActive ? "nb-mobile-active" : ""}`}>
          <span className="nb-mobile-icon">ⓘ</span>
          <span>About</span>
        </NavLink>
      </nav>
    </nav>
  );
};

export default NavBar;
