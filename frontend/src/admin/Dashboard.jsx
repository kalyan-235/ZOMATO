import { useEffect, useState } from 'react';
import API from '../api';
import AdminLayout from './AdminLayout';

const StatCard = ({ icon, label, value, color }) => (
  <div className="adm-stat-card" style={{ borderTopColor: color }}>
    <div className="adm-stat-icon" style={{ background: color + '22', color }}>{icon}</div>
    <div>
      <p className="adm-stat-label">{label}</p>
      <h3 className="adm-stat-value">{value ?? '—'}</h3>
    </div>
  </div>
);

const STATUS_COLORS = {
  placed:     { bg: '#fff2ee', color: '#e85d26' },
  preparing:  { bg: '#fffbeb', color: '#f59e0b' },
  delivered:  { bg: '#f0fdf4', color: '#16a34a' },
  cancelled:  { bg: '#fff0f0', color: '#e23744' },
};

const Dashboard = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetchStats = () => {
    setLoading(true);
    API.get('/admin/dashboard')
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
        setLoading(false);
      });
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <AdminLayout><div className="adm-loading">Loading dashboard…</div></AdminLayout>;
  if (error)   return <AdminLayout><div className="adm-loading" style={{ color:'#e23744' }}>⚠️ {error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="adm-page">

        {/* ── HEADER ── */}
        <div className="adm-page-header">
          <div>
            <h1>📊 Dashboard</h1>
            <p>Welcome back, Admin! Here's the latest overview.</p>
          </div>
          <button className="adm-btn-outline" onClick={fetchStats}>🔄 Refresh</button>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="adm-stats-grid">
          <StatCard icon="👥" label="Total Users"      value={stats.totalUsers}                          color="#1e88e5" />
          <StatCard icon="🍽️" label="Food Items"       value={stats.totalItems}                          color="#e85d26" />
          <StatCard icon="🏪" label="Restaurants"      value={stats.totalRestaurants}                    color="#43a047" />
          <StatCard icon="📦" label="Total Orders"     value={stats.totalOrders}                         color="#8e24aa" />
          <StatCard icon="💰" label="Total Revenue"    value={`₹${(stats.revenue || 0).toLocaleString('en-IN')}`} color="#f9a825" />
        </div>

        {/* ── ROW 1: Recent Orders + Recent Users ── */}
        <div className="adm-two-col">

          {/* Recent Orders */}
          <div className="adm-table-card">
            <h3>📦 Recent Orders</h3>
            {stats.recentOrders?.length === 0 ? (
              <p style={{ color:'#aaa', fontSize:'0.85rem', textAlign:'center', padding:'20px 0' }}>No orders yet.</p>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {stats.recentOrders?.map(order => {
                    const sc = STATUS_COLORS[order.status] || STATUS_COLORS.placed;
                    return (
                      <tr key={order._id}>
                        <td>
                          <span className="adm-user-badge">
                            {(order.username?.[0] || 'G').toUpperCase()}
                          </span>
                          {order.username || 'Guest'}
                        </td>
                        <td style={{ color:'#888', fontSize:'0.78rem' }}>
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                        </td>
                        <td style={{ fontWeight:700 }}>₹{order.totalAmount}</td>
                        <td>
                          <span style={{
                            background: sc.bg, color: sc.color,
                            fontSize:'0.72rem', fontWeight:700,
                            padding:'3px 8px', borderRadius:6
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ color:'#aaa', fontSize:'0.78rem' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent Users */}
          <div className="adm-table-card">
            <h3>👥 Recent Users</h3>
            <table className="adm-table">
              <thead>
                <tr><th>Username</th><th>Email</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {stats.recentUsers?.map(u => (
                  <tr key={u._id}>
                    <td>
                      <span className="adm-user-badge">{u.username[0].toUpperCase()}</span>
                      {u.username}
                    </td>
                    <td style={{ color:'#888', fontSize:'0.82rem' }}>{u.email}</td>
                    <td style={{ color:'#aaa', fontSize:'0.78rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                    </td>
                  </tr>
                ))}
                {stats.recentUsers?.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign:'center', color:'#aaa', padding:'20px 0' }}>No users yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* ── ROW 2: Category breakdown ── */}
        <div className="adm-table-card" style={{ marginTop: 20 }}>
          <h3>📊 Items by Category</h3>
          <div className="adm-cat-bars">
            {stats.categoryStats?.map(c => {
              const pct = stats.totalItems > 0
                ? Math.round((c.count / stats.totalItems) * 100)
                : 0;
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
    </AdminLayout>
  );
};

export default Dashboard;
