import React from "react";
import { useCart } from '../context/CartContext';

function Menu_item({ itemsData }) {
    const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
    return (
        <div className="menuItems">
            {itemsData.map((item, index) => {
                const itemWithId = { ...item, id: item._id || item.id || index };
                const cartItem = cartItems.find(i => i.id === itemWithId.id);
                const quantity = cartItem ? cartItem.quantity : 0;
                const handleAdd = () => {
                    addToCart(itemWithId);
                };

                const handleIncrement = () => {
                    updateQuantity(itemWithId.id, quantity + 1);
                };

                const handleDecrement = () => {
                    if (quantity === 1) {
                        removeFromCart(itemWithId.id);
                    } else {
                        updateQuantity(itemWithId.id, quantity - 1);
                    }
                };
                return (
                <section class="productSection" key={index}>
                    <div class="productBox">
                    <div>
                        <div><strong>{item.name}</strong></div>
                        <div>₹{item.price}</div>
                        <div>{item.description}</div>
                    </div>
                    <div class="productGroup">
                        <img src={`/${item.image}`} alt="food" />
                        <div>
                            {quantity > 0 ?(
                                <div className="addbutton">
                                    <button onClick={handleDecrement} class="addButton" size={16}>-</button>
                                    <span class="addButton">{quantity}</span>
                                    <button onClick={handleIncrement} class="addButton" size={16}>+</button>
                                </div>    
                            ):(
                                <div>
                                    <button className="addButton" onClick={handleAdd}>ADD</button>
                                </div>
                            )
                        }
                        </div>
                    </div>
                    </div>
                </section>
                );
            })}
        </div>
    );
}
export default Menu_item;
