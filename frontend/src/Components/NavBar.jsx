import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NavBar = () => {
    const { user, logout } = useAuth();
    const { getTotalItems } = useCart();

    return (
        <nav className="navbar">
            <div className="logo"><span>🍴</span> Food Express</div>

            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/category">Category</Link></li>
                <li><Link to="/Restaurants">Restaurants</Link></li>
                <li><Link to="/">Offers</Link></li>
                <li><Link to="/">About</Link></li>
            </ul>

            <div className="nav-right">
                {user ? (
                    <>
                        <span className="username">Welcome, {user.username}</span>
                        <button className="logout-btn" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login"><button className="login-btn">Login</button></Link>
                        <Link to="/signup"><button className="signup-btn">Sign Up</button></Link>
                    </>
                )}
                <Link to="/cart">
                    <div className="cart-icon">🛒<span className="cart-count">{getTotalItems()}</span></div>
                </Link>
                <div className="menu-toggle">☰</div>
            </div>
        </nav>
    );
};

export default NavBar;
