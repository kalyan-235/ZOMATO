import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import '../css/MyOrders.css';

const STATUS_STYLE = {
  placed:    { bg: '#fff2ee', color: '#e85d26', icon: '🕐' },
  accepted:  { bg: '#eff6ff', color: '#2563eb', icon: '✅' },
  rejected:  { bg: '#fff0f0', color: '#e23744', icon: '❌' },
  preparing: { bg: '#fffbeb', color: '#f59e0b', icon: '👨‍🍳' },
  ready:     { bg: '#f0fdf4', color: '#16a34a', icon: '🍽️' },
  completed: { bg: '#f0fdf4', color: '#16a34a', icon: '✅' },
  delivered: { bg: '#f0fdf4', color: '#16a34a', icon: '✅' },
  cancelled: { bg: '#fff0f0', color: '#e23744', icon: '❌' },
};

const MyOrders = () => {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [orders,    setOrders]  = useState([]);
  const [loading,   setLoading] = useState(true);
  const [error,     setError]   = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    API.get('/orders/my-orders')
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load orders.'); setLoading(false); });
  }, [user]);

  if (loading) return (
    <div className="mo-page">
      <div className="mo-state"><div className="mo-spinner" /><p>Loading your orders…</p></div>
    </div>
  );

  return (
    <div className="mo-page">
      <div className="mo-header">
        <button className="mo-back" onClick={() => navigate(-1)}>← Back</button>
        <h1>My Orders</h1>
        <span className="mo-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>

      {error && <div className="mo-state mo-error">⚠️ {error}</div>}

      {!error && orders.length === 0 && (
        <div className="mo-state">
          <div className="mo-empty-icon">📦</div>
          <p>You haven't placed any orders yet.</p>
          <Link to="/Restaurants" className="mo-btn">Browse Restaurants</Link>
        </div>
      )}

      <div className="mo-list">
        {orders.map((order) => {
          const st = STATUS_STYLE[order.status] || STATUS_STYLE.placed;
          return (
            <div className="mo-card" key={order._id}>

              {/* Card header */}
              <div className="mo-card-head">
                <div>
                  <p className="mo-order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="mo-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                  {order.restaurantName && <p className="mo-date">Restaurant: {order.restaurantName}</p>}
                </div>
                <span className="mo-status-badge" style={{ background: st.bg, color: st.color }}>
                  {st.icon} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Items */}
              <div className="mo-items">
                {order.items.map((item, i) => (
                  <div className="mo-item" key={i}>
                    <span className="mo-item-name">{item.name}</span>
                    <span className="mo-item-qty">×{item.quantity}</span>
                    <span className="mo-item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Bill summary */}
              <div className="mo-bill">
                {order.discount > 0 && (
                  <div className="mo-bill-row">
                    <span>Discount</span>
                    <span className="mo-discount">− ₹{order.discount}</span>
                  </div>
                )}
                {order.deliveryCharge > 0 && (
                  <div className="mo-bill-row">
                    <span>Delivery</span><span>₹{order.deliveryCharge}</span>
                  </div>
                )}
                <div className="mo-bill-row mo-total">
                  <span>Total Paid</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
