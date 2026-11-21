import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../admin/admin.css';
import './restaurant.css';

const NAV_ITEMS = [
  { path: '/restaurant/dashboard', icon: '📊', label: 'Dashboard', end: true },
  { path: '/restaurant/orders', icon: '📦', label: 'All Orders' },
  { path: '/restaurant/menu', icon: '🍽️', label: 'Manage Items' },
];

const RestaurantLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="adm-layout">
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <span>🍴</span>
          <div>
            <strong>Food Express</strong>
            <p>Restaurant Panel</p>
          </div>
        </div>

        <nav className="adm-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `adm-nav-link ${isActive ? 'adm-nav-active' : ''}`}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-user-info">
            <div className="adm-avatar">{user?.username?.[0]?.toUpperCase() || 'R'}</div>
            <div>
              <p className="adm-username">{user?.username}</p>
              <p className="adm-role">Restaurant Owner</p>
            </div>
          </div>
          <button className="adm-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="adm-main">{children}</main>
    </div>
  );
};

export default RestaurantLayout;
