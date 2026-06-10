import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(id);
        } else {
            updateQuantity(id, newQuantity);
        }
    };

    const handleRemove = (id) => {
        removeFromCart(id);
    };

    const handleClearCart = () => {
        clearCart();
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <button className="back-btn" onClick={handleBack}>&#8592;</button>
                    <h2>Your Cart</h2>
                </div>
                <p>Cart Items ({getTotalItems()})</p>
                <button className="clear-cart-btn" onClick={handleClearCart}>Clear Cart</button>

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-details">
                                    <img src={item.image} alt={item.name} className="cart-item-image" />
                                    <div className="item-info">
                                        <h3>{item.name}</h3>
                                        <p>₹{item.price}</p>
                                    </div>
                                </div>
                                <div className="quantity-controls">
                                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                </div>
                                <div className="item-total">
                                    <p>₹{item.price * item.quantity}</p>
                                </div>
                                <button className="delete-btn" onClick={() => handleRemove(item.id)}>Delete</button>
                            </div>
                        ))}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="bill-details">
                            <h3>Bill Details</h3>
                            <div className="bill-items">
                                {cartItems.map((item, index) => (
                                    <div key={`bill-${index}`} className="bill-item">
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bill-row">
                                <span>Subtotal</span>
                                <span>₹{getTotalPrice()}</span>
                            </div>
                            <div className="bill-row">
                                <span>Delivery Charges</span>
                                <span>₹40</span>
                            </div>
                            <div className="bill-row">
                                <span>GST (18%)</span>
                                <span>₹{Math.round(getTotalPrice() * 0.18)}</span>
                            </div>
                            <div className="bill-row total">
                                <span>Total</span>
                                <span>₹{getTotalPrice() + 40 + Math.round(getTotalPrice() * 0.18)}</span>
                            </div>
                            <button className="place-order-btn">Place Order</button>
                        </div>
                    )}
                </div>

            {cartItems.length === 0 && (
                <p>Your cart is empty.</p>
            )}
            </div>
        </div>
    );
};

export default Cart;