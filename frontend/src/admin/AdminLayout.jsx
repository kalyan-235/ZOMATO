import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './admin.css';

const NAV_ITEMS = [
  { path: '/admin/dashboard',      icon: '📊', label: 'Dashboard'       },
  { path: '/admin/manage-items',   icon: '🍽️', label: 'Manage Items'    },
  { path: '/admin/manage-users',   icon: '👥', label: 'Manage Users'    },
  { path: '/admin/restaurants',    icon: '🏪', label: 'Restaurants'     },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="adm-layout">

      {/* ── SIDEBAR ── */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <span>🍴</span>
          <div>
            <strong>Food Express</strong>
            <p>Admin Panel</p>
          </div>
        </div>

        <nav className="adm-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `adm-nav-link ${isActive ? 'adm-nav-active' : ''}`}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-user-info">
            <div className="adm-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <div>
              <p className="adm-username">{user?.username}</p>
              <p className="adm-role">Administrator</p>
            </div>
          </div>
          <button className="adm-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="adm-main">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;
