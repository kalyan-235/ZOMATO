import { useCallback, useEffect, useState } from 'react';
import API from '../api';
import RestaurantLayout from './RestaurantLayout';

const StatCard = ({ icon, label, value, color }) => (
  <div className="adm-stat-card" style={{ borderTopColor: color }}>
    <div className="adm-stat-icon" style={{ background: `${color}22`, color }}>{icon}</div>
    <div>
      <p className="adm-stat-label">{label}</p>
      <h3 className="adm-stat-value">{value}</h3>
    </div>
  </div>
);

const RestaurantDashboard = () => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [menuResponse, ordersResponse] = await Promise.all([
        API.get('/restaurant/menu'),
        API.get('/orders/restaurant'),
      ]);
      setItems(menuResponse.data);
      setOrders(ordersResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load restaurant dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const revenue = orders.reduce((total, order) => total + (Number(order.totalAmount) || 0), 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <RestaurantLayout>
      <div className="adm-page">
        <div className="adm-page-header">
          <div>
            <h1>📊 Dashboard</h1>
            <p>Welcome back! Here's your restaurant's latest overview.</p>
          </div>
          <button className="adm-btn-outline" onClick={fetchDashboard} disabled={loading}>
            🔄 Refresh
          </button>
        </div>

        {error && <div className="adm-toast adm-toast-error" role="alert">{error}</div>}
        {loading ? (
          <div className="adm-loading">Loading dashboard…</div>
        ) : (
          <>
            <div className="adm-stats-grid restaurant-stats-grid">
              <StatCard icon="🍽️" label="Food Items" value={items.length} color="#e85d26" />
              <StatCard icon="📦" label="Total Orders" value={orders.length} color="#8e24aa" />
              <StatCard
                icon="💰"
                label="Total Revenue"
                value={`₹${revenue.toLocaleString('en-IN')}`}
                color="#f9a825"
              />
            </div>

            <div className="adm-table-card restaurant-recent-orders">
              <h3>📦 Recent Orders</h3>
              {recentOrders.length === 0 ? (
                <p className="restaurant-dashboard-empty">No orders yet.</p>
              ) : (
                <table className="adm-table">
                  <thead>
                    <tr><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="adm-user-badge">
                            {(order.username?.[0] || 'G').toUpperCase()}
                          </span>
                          {order.username || 'Guest'}
                        </td>
                        <td className="restaurant-muted-cell">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </td>
                        <td className="restaurant-amount-cell">
                          ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                        </td>
                        <td><span className={`restaurant-status-badge status-${order.status}`}>{order.status}</span></td>
                        <td className="restaurant-muted-cell">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantDashboard;
