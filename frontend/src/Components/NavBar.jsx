import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NavBar = () => {
  const { user, logout }    = useAuth();
  const { getTotalItems }   = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Add shadow + blur when page scrolls */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile menu on route change */
  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    isActive ? "nb-link nb-link-active" : "nb-link";

  return (
    <nav className={`nb-nav ${scrolled ? "nb-scrolled" : ""}`}>

      {/* ── LOGO ── */}
      <Link to="/" className="nb-logo" onClick={closeMenu}>
        <span className="nb-logo-icon">🍴</span>
        <span className="nb-logo-text">Food<span className="nb-logo-accent">Express</span></span>
      </Link>

      {/* ── NAV LINKS (desktop) ── */}
      <ul className={`nb-links ${menuOpen ? "nb-links-open" : ""}`}>
        <li><NavLink to="/"            className={navLinkClass} onClick={closeMenu}>Home</NavLink></li>
        <li><NavLink to="/category"    className={navLinkClass} onClick={closeMenu}>Category</NavLink></li>
        <li><NavLink to="/Restaurants" className={navLinkClass} onClick={closeMenu}>Restaurants</NavLink></li>
        <li><NavLink to="/offers"      className={navLinkClass} onClick={closeMenu}>Offers</NavLink></li>
        <li><NavLink to="/about"       className={navLinkClass} onClick={closeMenu}>About</NavLink></li>
      </ul>

      {/* ── RIGHT ACTIONS ── */}
      <div className="nb-right">

        {/* Cart */}
        <Link to="/cart" className="nb-cart" onClick={closeMenu}>
          <span className="nb-cart-icon">🛒</span>
          {getTotalItems() > 0 && (
            <span className="nb-cart-badge">{getTotalItems()}</span>
          )}
        </Link>

        {/* Auth */}
        {user ? (
          <div className="nb-user">
            <span className="nb-avatar">{user.username?.[0]?.toUpperCase()}</span>
            <span className="nb-username">Hi, {user.username}</span>
            <button className="nb-btn nb-logout" onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className="nb-auth">
            <Link to="/login"  onClick={closeMenu}><button className="nb-btn nb-login">Login</button></Link>
            <Link to="/signup" onClick={closeMenu}><button className="nb-btn nb-signup">Sign Up</button></Link>
          </div>
        )}

        {/* Hamburger */}
        <button
          className={`nb-hamburger ${menuOpen ? "nb-ham-open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

      </div>
    </nav>
  );
};

export default NavBar;
