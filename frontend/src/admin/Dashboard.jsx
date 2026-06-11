import { useEffect, useState } from 'react';
import API from '../api';
import AdminLayout from './AdminLayout';

const StatCard = ({ icon, label, value, color }) => (
  <div className="adm-stat-card" style={{ borderTopColor: color }}>
    <div className="adm-stat-icon" style={{ background: color + '22', color }}>{icon}</div>
    <div>
      <p className="adm-stat-label">{label}</p>
      <h3 className="adm-stat-value">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div className="adm-loading">Loading dashboard…</div></AdminLayout>;
  if (!stats)  return <AdminLayout><div className="adm-loading">Failed to load stats.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="adm-page">
        <div className="adm-page-header">
          <h1>Dashboard</h1>
          <p>Welcome back, Admin! Here's what's happening today.</p>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="adm-stats-grid">
          <StatCard icon="👥" label="Total Users"       value={stats.totalUsers}       color="#1e88e5" />
          <StatCard icon="🍽️" label="Total Food Items"  value={stats.totalItems}       color="#e85d26" />
          <StatCard icon="🏪" label="Restaurants"       value={stats.totalRestaurants} color="#43a047" />
          <StatCard icon="📦" label="Total Orders"      value={stats.totalOrders}      color="#8e24aa" />
          <StatCard icon="💰" label="Est. Revenue"      value={`₹${stats.revenue?.toLocaleString()}`} color="#f9a825" />
        </div>

        <div className="adm-two-col">

          {/* ── RECENT USERS ── */}
          <div className="adm-table-card">
            <h3>👥 Recent Users</h3>
            <table className="adm-table">
              <thead>
                <tr><th>Username</th><th>Email</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {stats.recentUsers?.map(u => (
                  <tr key={u._id}>
                    <td><span className="adm-user-badge">{u.username[0].toUpperCase()}</span> {u.username}</td>
                    <td>{u.email}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── CATEGORY BREAKDOWN ── */}
          <div className="adm-table-card">
            <h3>📊 Items by Category</h3>
            <div className="adm-cat-bars">
              {stats.categoryStats?.map(c => {
                const pct = Math.round((c.count / stats.totalItems) * 100);
                return (
                  <div key={c._id} className="adm-cat-bar-row">
                    <span className="adm-cat-name">{c._id}</span>
                    <div className="adm-bar-track">
                      <div className="adm-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="adm-cat-count">{c.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
