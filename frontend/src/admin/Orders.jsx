import { useEffect, useState } from 'react';
import API from '../api';
import AdminLayout from './AdminLayout';

const STATUS_OPTIONS = ['placed', 'accepted', 'rejected', 'preparing', 'ready', 'completed', 'delivered', 'cancelled'];

const STATUS_STYLE = {
  placed:    { bg: '#fff2ee', color: '#e85d26' },
  accepted:  { bg: '#eff6ff', color: '#2563eb' },
  rejected:  { bg: '#fff0f0', color: '#e23744' },
  preparing: { bg: '#fffbeb', color: '#f59e0b' },
  ready:     { bg: '#f0fdf4', color: '#16a34a' },
  completed: { bg: '#f0fdf4', color: '#16a34a' },
  delivered: { bg: '#f0fdf4', color: '#16a34a' },
  cancelled: { bg: '#fff0f0', color: '#e23744' },
};

const AdminOrders = () => {
  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expanded,     setExpanded]     = useState(null); // _id of expanded row
  const [updating,     setUpdating]     = useState('');   // _id being updated

  const fetchOrders = () => {
    setLoading(true);
    API.get('/admin/orders')
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load orders.'); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, []);

  /* Update order status */
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdating('');
    }
  };

  /* Filter */
  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchSearch = search
      ? o.username?.toLowerCase().includes(search.toLowerCase()) ||
        o._id.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  /* Summary counts */
  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="adm-page">

        {/* ── HEADER ── */}
        <div className="adm-page-header">
          <div>
            <h1>📦 All Orders</h1>
            <p style={{ margin:'4px 0 0', color:'#888', fontSize:'0.82rem' }}>
              {orders.length} total orders
            </p>
          </div>
          <button className="adm-btn-outline" onClick={fetchOrders}>🔄 Refresh</button>
        </div>

        {/* ── STATUS SUMMARY PILLS ── */}
        <div className="ado-status-pills">
          <button
            className={`ado-pill ${filterStatus === 'all' ? 'ado-pill-active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All <span>{orders.length}</span>
          </button>
          {STATUS_OPTIONS.map(s => {
            const st = STATUS_STYLE[s];
            return (
              <button
                key={s}
                className={`ado-pill ${filterStatus === s ? 'ado-pill-active' : ''}`}
                style={filterStatus === s ? { background: st.color, borderColor: st.color, color: '#fff' } : {}}
                onClick={() => setFilterStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)} <span>{counts[s]}</span>
              </button>
            );
          })}
        </div>

        {/* ── SEARCH ── */}
        <div className="adm-search-bar">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search by customer name or order ID…"
          />
          <span>{filtered.length} results</span>
        </div>

        {/* ── STATES ── */}
        {loading && <div className="adm-loading">Loading orders…</div>}
        {error   && <div className="adm-loading" style={{ color:'#e23744' }}>⚠️ {error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="adm-loading">No orders found.</div>
        )}

        {/* ── ORDERS TABLE ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="adm-table-card">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const st   = STATUS_STYLE[order.status] || STATUS_STYLE.placed;
                  const isEx = expanded === order._id;
                  return (
                    <>
                      {/* ── Main row ── */}
                      <tr key={order._id} className={isEx ? 'ado-expanded-row' : ''}>
                        <td>
                          <span className="ado-order-id">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className="adm-user-badge">
                            {(order.username?.[0] || 'G').toUpperCase()}
                          </span>
                          {order.username || 'Guest'}
                        </td>
                        <td style={{ color:'#888' }}>
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                        </td>
                        <td style={{ fontWeight: 700 }}>₹{order.totalAmount}</td>
                        <td style={{ color:'#aaa', fontSize:'0.78rem' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day:'2-digit', month:'short', year:'numeric',
                          })}
                        </td>
                        <td>
                          {/* Inline status dropdown */}
                          <select
                            className="ado-status-select"
                            value={order.status}
                            onChange={e => handleStatusChange(order._id, e.target.value)}
                            disabled={updating === order._id}
                            style={{ background: st.bg, color: st.color, borderColor: st.color }}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          {updating === order._id && <span className="ado-updating">…</span>}
                        </td>
                        <td>
                          <button
                            className="adm-btn-edit"
                            onClick={() => setExpanded(isEx ? null : order._id)}
                          >
                            {isEx ? '▲ Hide' : '▼ View'}
                          </button>
                        </td>
                      </tr>

                      {/* ── Expanded detail row ── */}
                      {isEx && (
                        <tr key={`${order._id}-detail`} className="ado-detail-row">
                          <td colSpan={7}>
                            <div className="ado-detail-box">

                              {/* Items list */}
                              <div className="ado-detail-section">
                                <h4>🛒 Items Ordered</h4>
                                <table className="ado-items-table">
                                  <thead>
                                    <tr><th>Image</th><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, i) => (
                                      <tr key={i}>
                                        <td>
                                          {item.image ? (
                                            <img
                                              src={item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `/${item.image}`}
                                              alt={item.name}
                                              className="ado-item-img"
                                              onError={e => { e.target.style.display='none'; }}
                                            />
                                          ) : <span>—</span>}
                                        </td>
                                        <td style={{ fontWeight:600 }}>{item.name}</td>
                                        <td>×{item.quantity}</td>
                                        <td>₹{item.price}</td>
                                        <td style={{ fontWeight:700 }}>₹{item.price * item.quantity}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Bill summary */}
                              <div className="ado-detail-section ado-bill">
                                <h4>💰 Bill Summary</h4>
                                <div className="ado-bill-row"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                                <div className="ado-bill-row"><span>Delivery</span><span>₹{order.deliveryCharge || 0}</span></div>
                                <div className="ado-bill-row"><span>GST</span><span>₹{order.gst || 0}</span></div>
                                {order.discount > 0 && (
                                  <div className="ado-bill-row" style={{ color:'#16a34a' }}>
                                    <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                                    <span>− ₹{order.discount}</span>
                                  </div>
                                )}
                                <div className="ado-bill-row ado-bill-total">
                                  <span>Total Paid</span><span>₹{order.totalAmount}</span>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
