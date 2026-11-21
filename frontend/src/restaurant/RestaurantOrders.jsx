import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import API from '../api';
import RestaurantLayout from './RestaurantLayout';

const FILTERS = [
  'all', 'placed', 'accepted', 'rejected', 'preparing', 'ready', 'completed', 'delivered', 'cancelled',
];

const NEXT_ACTIONS = {
  placed: [
    { status: 'accepted', label: 'Accept order', className: 'restaurant-order-accept' },
    { status: 'rejected', label: 'Reject', className: 'restaurant-order-reject' },
  ],
  accepted: [{ status: 'preparing', label: 'Start preparing', className: 'restaurant-order-advance' }],
  preparing: [{ status: 'ready', label: 'Mark ready', className: 'restaurant-order-advance' }],
  ready: [{ status: 'completed', label: 'Complete order', className: 'restaurant-order-advance' }],
};

const formatDate = (date) => new Date(date).toLocaleString('en-IN', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [desktopAlertsEnabled, setDesktopAlertsEnabled] = useState(
    typeof window !== 'undefined' &&
    'Notification' in window &&
    window.Notification.permission === 'granted'
  );
  const knownOrderIds = useRef(new Set());

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/orders/restaurant');
      setOrders((current) => {
        const merged = new Map(response.data.map((order) => [order._id, order]));
        current.forEach((order) => {
          if (!merged.has(order._id)) merged.set(order._id, order);
        });
        knownOrderIds.current = new Set([...knownOrderIds.current, ...merged.keys()]);
        return [...merged.values()].sort((first, second) => (
          new Date(second.createdAt) - new Date(first.createdAt)
        ));
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load restaurant orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return undefined;

    const socket = io(API.defaults.baseURL, { auth: { token } });
    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));
    socket.on('connect_error', () => setSocketConnected(false));
    socket.on('restaurant:new-order', (order) => {
      if (!order?._id || knownOrderIds.current.has(order._id)) return;

      knownOrderIds.current.add(order._id);
      setOrders((current) => [order, ...current.filter((existing) => existing._id !== order._id)]);
      setFilter('all');
      setNotice(`New order from ${order.username || 'a customer'} · #${order._id.slice(-8).toUpperCase()}`);

      if (typeof window !== 'undefined' && 'Notification' in window &&
          window.Notification.permission === 'granted') {
        try {
          new window.Notification('New restaurant order', {
            body: `${order.username || 'A customer'} · ${order.items?.length || 0} items · ₹${order.totalAmount}`,
            tag: order._id,
          });
        } catch (notificationError) {
          console.error('Desktop order notification could not be displayed:', notificationError);
        }
      }
    });

    return () => {
      socket.disconnect();
      setSocketConnected(false);
    };
  }, []);

  const counts = useMemo(() => orders.reduce((result, order) => {
    result[order.status] = (result[order.status] || 0) + 1;
    return result;
  }, {}), [orders]);

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((order) => order.status === filter);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    setActionError('');
    setNotice('');
    try {
      const response = await API.patch(`/orders/restaurant/${orderId}/status`, { status });
      setOrders((current) => current.map((order) => (
        order._id === orderId ? response.data : order
      )));
      setNotice(`Order #${orderId.slice(-8).toUpperCase()} ${status}.`);
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to update order status.');
    } finally {
      setUpdatingId('');
    }
  };

  const enableDesktopAlerts = async () => {
    if (!('Notification' in window)) {
      setActionError('Desktop notifications are not supported by this browser.');
      return;
    }

    try {
      const permission = await window.Notification.requestPermission();
      const enabled = permission === 'granted';
      setDesktopAlertsEnabled(enabled);
      setNotice(enabled ? 'Desktop order alerts enabled.' : '');
      if (!enabled) setActionError('Desktop alerts were not enabled. You can change this in browser settings.');
    } catch (notificationError) {
      console.error('Unable to request desktop notification permission:', notificationError);
      setActionError('Unable to enable desktop alerts.');
    }
  };

  const canUseNotifications = typeof window !== 'undefined' && 'Notification' in window;

  return (
    <RestaurantLayout>
      <div className="adm-page">
        <div className="adm-page-header restaurant-orders-page-header">
          <div>
            <h1>📦 All Orders</h1>
            <p>{orders.length} total orders for your restaurant</p>
          </div>
          <div className="restaurant-orders-tools">
            <span
              className={`restaurant-live-status ${socketConnected ? 'is-live' : ''}`}
              aria-live="polite"
            >
              <span aria-hidden="true" />
              {socketConnected ? 'Live updates on' : 'Live updates reconnecting'}
            </span>
            {canUseNotifications && (
              <button
                className="adm-btn-outline"
                type="button"
                onClick={enableDesktopAlerts}
                disabled={desktopAlertsEnabled}
              >
                {desktopAlertsEnabled ? 'Desktop alerts on' : 'Enable desktop alerts'}
              </button>
            )}
            <button
              className="adm-btn-outline"
              type="button"
              onClick={fetchOrders}
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="ado-status-pills" aria-label="Filter orders by status">
          {FILTERS.map((status) => (
            <button
              type="button"
              key={status}
              className={`ado-pill ${filter === status ? 'ado-pill-active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              <span>{status === 'all' ? orders.length : counts[status] || 0}</span>
            </button>
          ))}
        </div>

        {notice && <p className="restaurant-orders-notice" role="status">{notice}</p>}
        {actionError && <p className="restaurant-orders-error" role="alert">{actionError}</p>}
        {error && (
          <div className="adm-table-card restaurant-orders-error" role="alert">
            <p>{error}</p>
            <button type="button" className="adm-btn-outline" onClick={fetchOrders}>Try again</button>
          </div>
        )}
        {loading && <p className="adm-loading">Loading orders…</p>}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="adm-table-card restaurant-dashboard-empty">
            {filter === 'all' ? 'No orders yet.' : `No ${filter} orders.`}
          </div>
        )}

        {!loading && !error && filteredOrders.length > 0 && (
          <div className="adm-table-card">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th>
                  <th>Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const actions = NEXT_ACTIONS[order.status] || [];
                  const isUpdating = updatingId === order._id;
                  return (
                    <tr key={order._id}>
                      <td><span className="ado-order-id">#{order._id.slice(-8).toUpperCase()}</span></td>
                      <td>
                        <span className="adm-user-badge">{(order.username?.[0] || 'G').toUpperCase()}</span>
                        {order.username || 'Guest'}
                      </td>
                      <td className="restaurant-order-items-cell">
                        {order.items.map((item) => `${item.name} ×${item.quantity}`).join(', ')}
                      </td>
                      <td className="restaurant-amount-cell">
                        ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="restaurant-muted-cell">{formatDate(order.createdAt)}</td>
                      <td><span className={`restaurant-status-badge status-${order.status}`}>{order.status}</span></td>
                      <td>
                        <div className="restaurant-order-actions">
                          {actions.map((action) => (
                            <button
                              type="button"
                              key={action.status}
                              className={action.className}
                              onClick={() => handleStatusChange(order._id, action.status)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? 'Saving…' : action.label}
                            </button>
                          ))}
                          {actions.length === 0 && <span className="restaurant-muted-cell">—</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantOrders;
