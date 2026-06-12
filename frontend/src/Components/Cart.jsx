import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import '../css/Cart.css';

const fixImg = (src) =>
  src && !src.startsWith('/') && !src.startsWith('http') ? `/${src}` : src;

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon]       = useState('');
  const [discount, setDiscount]   = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [ordered, setOrdered]     = useState(false);

  const VALID_COUPONS = { FIRST50: 0.5, SAVE100: 100, FREEDEL: 0, WEEKEND30: 0.3 };

  const subtotal  = getTotalPrice();
  const delivery  = subtotal >= 499 ? 0 : 40;
  const gst       = Math.round(subtotal * 0.05);
  const discountAmt = discount >= 1 ? discount : Math.round(subtotal * discount);
  const total     = subtotal + delivery + gst - discountAmt;

  const handleCoupon = () => {
    const val = VALID_COUPONS[coupon.toUpperCase()];
    if (val !== undefined) {
      setDiscount(val);
      setCouponMsg(`✅ Coupon applied! You save ₹${val >= 1 ? val : Math.round(subtotal * val)}`);
    } else {
      setDiscount(0);
      setCouponMsg('❌ Invalid coupon code.');
    }
  };

  const { user } = useAuth();
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await API.post('/orders/place', {
        userId:         user?.id   || null,
        username:       user?.username || 'Guest',
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
        discount:    discountAmt,
        totalAmount: Math.max(0, total),
        couponCode:  discount > 0 ? coupon.toUpperCase() : '',
      });
      // Only clear cart and show success if order was saved successfully
      clearCart();
      setOrdered(true);
    } catch (err) {
      console.error('Order save failed:', err.message);
      alert('Failed to place order. Please try again.');
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
          <p>Your food is being prepared. Estimated delivery: <strong>30–45 min</strong></p>
          <div className="ct-success-actions">
            <button className="ct-btn-primary" onClick={() => navigate('/')}>Back to Home</button>
            <Link to="/Restaurants" className="ct-btn-outline">Order More</Link>
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
      {/* ── HEADER ── */}
      <div className="ct-header">
        <button className="ct-back" onClick={() => navigate(-1)}>← Back</button>
        <div className="ct-header-center">
          <h1 className="ct-title">Your Cart</h1>
          <span className="ct-item-count">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
        </div>
        <button className="ct-clear" onClick={clearCart}>Clear All</button>
      </div>

      <div className="ct-body">

        {/* ── LEFT: CART ITEMS ── */}
        <div className="ct-items-col">

          {/* Restaurant group label */}
          <div className="ct-rest-label">
            <span>🍴</span>
            <span>{cartItems[0]?.restaurant || 'Your Order'}</span>
          </div>

          {cartItems.map((item) => (
            <div className="ct-item" key={item.id}>
              <img
                src={fixImg(item.image)}
                alt={item.name}
                className="ct-item-img"
              />
              <div className="ct-item-info">
                <h3 className="ct-item-name">{item.name}</h3>
                <p className="ct-item-price">₹{item.price} <span>per item</span></p>
              </div>
              <div className="ct-qty">
                <button
                  className="ct-qty-btn"
                  onClick={() => item.quantity === 1
                    ? removeFromCart(item.id)
                    : updateQuantity(item.id, item.quantity - 1)
                  }
                >−</button>
                <span className="ct-qty-num">{item.quantity}</span>
                <button
                  className="ct-qty-btn ct-qty-plus"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >+</button>
              </div>
              <div className="ct-item-subtotal">
                ₹{item.price * item.quantity}
              </div>
              <button className="ct-remove" onClick={() => removeFromCart(item.id)} title="Remove">✕</button>
            </div>
          ))}

          {/* Coupon */}
          <div className="ct-coupon-box">
            <div className="ct-coupon-icon">🎟️</div>
            <input
              className="ct-coupon-input"
              type="text"
              placeholder="Enter coupon code (e.g. FIRST50)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCoupon()}
            />
            <button className="ct-coupon-btn" onClick={handleCoupon}>Apply</button>
          </div>
          {couponMsg && <p className={`ct-coupon-msg ${couponMsg.startsWith('✅') ? 'ct-coupon-ok' : 'ct-coupon-err'}`}>{couponMsg}</p>}

        </div>

        {/* ── RIGHT: BILL SUMMARY ── */}
        <div className="ct-summary">
          <h3 className="ct-summary-title">Order Summary</h3>

          {/* Item breakdown */}
          <div className="ct-summary-items">
            {cartItems.map((item, i) => (
              <div className="ct-summary-row" key={i}>
                <span className="ct-summary-item-name">{item.name} <span className="ct-qty-badge">×{item.quantity}</span></span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="ct-divider" />

          {/* Charges */}
          <div className="ct-summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="ct-summary-row">
            <span>Delivery {delivery === 0 && <span className="ct-free-tag">FREE</span>}</span>
            <span className={delivery === 0 ? 'ct-green' : ''}>
              {delivery === 0 ? '₹0' : `₹${delivery}`}
            </span>
          </div>
          <div className="ct-summary-row">
            <span>GST (5%)</span>
            <span>₹{gst}</span>
          </div>
          {discountAmt > 0 && (
            <div className="ct-summary-row ct-discount-row">
              <span>Coupon Discount</span>
              <span>− ₹{discountAmt}</span>
            </div>
          )}

          <div className="ct-divider" />

          <div className="ct-summary-row ct-total-row">
            <span>Total</span>
            <span>₹{Math.max(0, total)}</span>
          </div>

          {delivery > 0 && (
            <p className="ct-free-hint">🚚 Add ₹{499 - subtotal} more for free delivery</p>
          )}

          <button className="ct-place-btn" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing Order…' : `Place Order · ₹${Math.max(0, total)}`}
          </button>

          {/* Safety badges */}
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
