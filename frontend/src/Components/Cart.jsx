import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import '../css/Cart.css';

const fixImg = (src) =>
  src && !src.startsWith('/') && !src.startsWith('http') ? `/${src}` : src;

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [coupon,      setCoupon]      = useState('');
  const [discount,    setDiscount]    = useState(0);
  const [couponMsg,   setCouponMsg]   = useState('');
  const [couponOk,    setCouponOk]    = useState(false);
  const [validating,  setValidating]  = useState(false);
  const [ordered,     setOrdered]     = useState(false);
  const [orderCount,  setOrderCount]  = useState(0);
  const [placing,     setPlacing]     = useState(false);
  const [toast,       setToast]       = useState('');

  const subtotal    = getTotalPrice();
  const delivery    = subtotal >= 499 ? 0 : 40;
  const gst         = Math.round(subtotal * 0.05);
  const total       = Math.max(0, subtotal + delivery + gst - discount);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 4500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  /* ── VALIDATE COUPON via backend ── */
  const handleCoupon = async () => {
    if (!coupon.trim()) return;
    setValidating(true);
    setCouponMsg('');
    try {
      const res = await API.post('/orders/validate-coupon', {
        code: coupon.trim(),
        subtotal,
      });
      setDiscount(res.data.discountAmt);
      setCouponMsg(res.data.message);
      setCouponOk(true);
    } catch (err) {
      setDiscount(0);
      setCouponOk(false);
      setCouponMsg(err.response?.data?.message || '❌ Invalid coupon code.');
    } finally {
      setValidating(false);
    }
  };

  /* ── PLACE ORDER ── */
  const handlePlaceOrder = async () => {
    if (user?.role !== 'user') {
      setToast(user
        ? 'Please use a customer account to place your order.'
        : 'Please log in to place your order.');
      return;
    }

    setPlacing(true);
    try {
      const response = await API.post('/orders/place', {
        items: cartItems.map(i => ({
          itemId:   i.id,
          name:     i.name,
          image:    i.image,
          price:    i.price,
          quantity: i.quantity,
        })),
        subtotal,
        deliveryCharge: delivery,
        gst,
        discount,
        totalAmount:    total,
        couponCode:     couponOk ? coupon.toUpperCase() : '',
      });
      setOrderCount(response.data.orderIds?.length || 1);
      clearCart();
      setOrdered(true);
    } catch (err) {
      console.error('Order failed:', err.message);
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  /* ── ORDER SUCCESS ── */
  if (ordered) {
    return (
      <div className="ct-page">
        <div className="ct-success">
          <div className="ct-success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>
            {orderCount > 1
              ? `Your order was split into ${orderCount} restaurant orders.`
              : 'Your food is being prepared.'}
            {' '}Estimated delivery: <strong>30–45 min</strong>
          </p>
          <div className="ct-success-actions">
            <button className="ct-btn-primary" onClick={() => navigate('/')}>Back to Home</button>
            <Link to="/my-orders" className="ct-btn-outline">View Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── EMPTY CART ── */
  if (cartItems.length === 0) {
    return (
      <div className="ct-page">
        <div className="ct-empty">
          <div className="ct-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/Restaurants" className="ct-btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ct-page">
      {toast && (
        <div className="ct-toast" role="alert">
          <span>{toast}</span>
          {!user && (
            <Link to="/login" state={{ from: '/cart' }} className="ct-toast-login">
              Login
            </Link>
          )}
          <button
            type="button"
            className="ct-toast-close"
            onClick={() => setToast('')}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
      <div className="ct-header">
        <button className="ct-back" onClick={() => navigate(-1)}>← Back</button>
        <div className="ct-header-center">
          <h1 className="ct-title">Your Cart</h1>
          <span className="ct-item-count">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
        </div>
        <button className="ct-clear" onClick={clearCart}>Clear All</button>
      </div>

      <div className="ct-body">
        <div className="ct-items-col">
          <div className="ct-rest-label">
            <span>🍴</span>
            <span>{cartItems[0]?.restaurant || 'Your Order'}</span>
          </div>

          {cartItems.map((item) => (
            <div className="ct-item" key={item.id}>
              <img src={fixImg(item.image)} alt={item.name} className="ct-item-img" />
              <div className="ct-item-info">
                <h3 className="ct-item-name">{item.name}</h3>
                <p className="ct-item-price">₹{item.price} <span>per item</span></p>
              </div>
              <div className="ct-qty">
                <button className="ct-qty-btn"
                  onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span className="ct-qty-num">{item.quantity}</span>
                <button className="ct-qty-btn ct-qty-plus"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="ct-item-subtotal">₹{item.price * item.quantity}</div>
              <button className="ct-remove" onClick={() => removeFromCart(item.id)} title="Remove">✕</button>
            </div>
          ))}

          {/* Coupon — validated via backend */}
          <div className="ct-coupon-box">
            <div className="ct-coupon-icon">🎟️</div>
            <input
              className="ct-coupon-input"
              type="text"
              placeholder="Enter coupon code (e.g. FIRST50)"
              value={coupon}
              onChange={(e) => { setCoupon(e.target.value); setCouponOk(false); setDiscount(0); setCouponMsg(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleCoupon()}
              disabled={couponOk}
            />
            {couponOk
              ? <button className="ct-coupon-btn ct-coupon-remove" onClick={() => { setDiscount(0); setCouponOk(false); setCoupon(''); setCouponMsg(''); }}>Remove</button>
              : <button className="ct-coupon-btn" onClick={handleCoupon} disabled={validating}>{validating ? '…' : 'Apply'}</button>
            }
          </div>
          {couponMsg && <p className={`ct-coupon-msg ${couponOk ? 'ct-coupon-ok' : 'ct-coupon-err'}`}>{couponMsg}</p>}
        </div>

        {/* Bill summary */}
        <div className="ct-summary">
          <h3 className="ct-summary-title">Order Summary</h3>
          <div className="ct-summary-items">
            {cartItems.map((item, i) => (
              <div className="ct-summary-row" key={i}>
                <span className="ct-summary-item-name">{item.name} <span className="ct-qty-badge">×{item.quantity}</span></span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="ct-divider" />
          <div className="ct-summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="ct-summary-row">
            <span>Delivery {delivery === 0 && <span className="ct-free-tag">FREE</span>}</span>
            <span className={delivery === 0 ? 'ct-green' : ''}>{delivery === 0 ? '₹0' : `₹${delivery}`}</span>
          </div>
          <div className="ct-summary-row"><span>GST (5%)</span><span>₹{gst}</span></div>
          {discount > 0 && (
            <div className="ct-summary-row ct-discount-row"><span>Coupon Discount</span><span>− ₹{discount}</span></div>
          )}
          <div className="ct-divider" />
          <div className="ct-summary-row ct-total-row"><span>Total</span><span>₹{total}</span></div>
          {delivery > 0 && <p className="ct-free-hint">🚚 Add ₹{499 - subtotal} more for free delivery</p>}
          <button className="ct-place-btn" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing Order…' : `Place Order · ₹${total}`}
          </button>
          <div className="ct-badges">
            <span>🔒 Secure Payment</span>
            <span>✅ Verified Restaurants</span>
            <span>⚡ Fast Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
