import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
const NavBar = () => {
    const { user, logout } = useAuth();
    const { getTotalItems } = useCart();

    const handleLogout = () => {
        logout();
    };

    return (
    <nav class="navbar">
        <div class="logo"><span>🍴</span> Food Express</div>

        <ul class="nav-links">
        <li><Link to ="/">Home</Link></li>
        <li><Link to ="/category">Category</Link></li>
        <li><Link to ="/Restaurants">Restaurants</Link></li>
        <li> <Link to ="/">Offers</Link></li>
        <li><Link to ="/">About</Link></li>

        </ul>

        <div class="nav-right">
            {user ? (
                <>
                    <span class="username">Welcome, {user.username}</span>
                    <button class="logout-btn" onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login"><button class="login-btn">Login</button></Link>
                    <Link to="/signup"><button class="signup-btn">Sign Up</button></Link>
                </>
            )}
            <Link to="/cart"><div class="cart-icon">🛒<span class="cart-count">{getTotalItems()}</span></div></Link>
            <div class="menu-toggle" id="menu-toggle">☰</div>
        </div>
  </nav>
    );
};

export default NavBar;