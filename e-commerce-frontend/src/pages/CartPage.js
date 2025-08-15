import React, { useState, useEffect } from 'react';
import './CartPage.css';
import { FiMapPin, FiChevronDown, FiX, FiInfo } from 'react-icons/fi';
import { HiOutlineBadgeCheck } from 'react-icons/hi';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config';

const CartPage = () => {
    // State to hold the cart items
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveryPincode, setDeliveryPincode] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState('');

    // Fetch cart data from the backend on component mount
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                // Assuming your backend cart API is at /cart/
                const response = await fetch(`${API_BASE_URL}/cart/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch cart data.');
                }
                const data = await response.json();
                setCartItems(data.items); // Assuming the response has an 'items' key
                setError(null);
            } catch (err) {
                console.error("Error fetching cart data:", err);
                setError('Failed to load cart items. Please try again.');
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    // Placeholder functions for cart actions
    const handlePincodeCheck = () => {
        if (deliveryPincode.length === 6) {
            setDeliveryStatus('Delivery is available for this pincode.');
        } else {
            setDeliveryStatus('Please enter a valid 6-digit pincode.');
        }
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        // We'll implement this function to update the cart in a future step.
        console.log(`Updating item ${itemId} to quantity ${newQuantity}`);
    };

    const handleRemoveItem = (itemId) => {
        // We'll implement this function to remove an item from the cart.
        console.log(`Removing item ${itemId}`);
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0);
    const hasFreeDelivery = totalPrice >= 1000; // Example condition for free delivery

    if (loading) {
        return <div className="cart-page-container">Loading cart...</div>;
    }

    if (error) {
        return <div className="cart-page-container error-message">{error}</div>;
    }

    return (
        <div className="cart-page-container">
            <h1 className="cart-page-header">Shopping Bag</h1>
            <div className="cart-content">
                <div className="cart-items-section">
                    <div className="cart-offers">
                        <div className="offer-badge-success">
                            <HiOutlineBadgeCheck />
                            <p>Yay! You get FREE delivery on this order.</p>
                        </div>
                    </div>
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-message">
                            Your cart is empty. Start shopping to add items!
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-item-card" key={item.id}>
                                <div className="item-image">
                                    <img src={`${IMAGE_BASE_URL}${item.product.images[0]?.image}`} alt={item.product.name} />
                                </div>
                                <div className="item-details">
                                    <h3 className="item-name">{item.product.name}</h3>
                                    <p className="item-brand">{item.product.brand}</p>
                                    <p className="item-size">Size: <span className="item-size-value">{item.size}</span></p>
                                    <div className="item-pricing">
                                        <p className="current-price">₹{parseFloat(item.product.price).toFixed(2)}</p>
                                        <p className="original-price">₹{parseFloat(item.product.original_price).toFixed(2)}</p>
                                        <p className="discount-info">
                                            {Math.round(((parseFloat(item.product.original_price) - parseFloat(item.product.price)) / parseFloat(item.product.original_price)) * 100)}% OFF
                                        </p>
                                    </div>
                                    <div className="item-actions">
                                        <div className="quantity-selector">
                                            <label>Qty:
                                                <select
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                                >
                                                    {[...Array(10).keys()].map(i => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                                <FiChevronDown />
                                            </label>
                                        </div>
                                        <button className="remove-item-btn" onClick={() => handleRemoveItem(item.id)}>
                                            <FiX /> REMOVE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-summary-section">
                    <div className="coupon-card">
                        <FiInfo />
                        <p>Apply Coupon</p>
                    </div>

                    <div className="summary-card">
                        <h3 className="summary-header">Price Summary</h3>
                        <div className="summary-details">
                            <div className="summary-row">
                                <p>Subtotal</p>
                                <p>₹{totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                        {hasFreeDelivery && (
                            <div className="delivery-info-summary">
                                <HiOutlineBadgeCheck />
                                <p>Yay! You get FREE delivery on this order</p>
                            </div>
                        )}
                        <button className="proceed-btn">PROCEED</button>
                    </div>

                    <div className="guarantees-section">
                        <div className="guarantee-item">
                            <HiOutlineBadgeCheck />
                            <p>100% SECURE PAYMENT</p>
                        </div>
                        <div className="guarantee-item">
                            <HiOutlineBadgeCheck />
                            <p>EASY RETURNS & INSTANT REFUNDS</p>
                        </div>
                        <div className="guarantee-item">
                            <HiOutlineBadgeCheck />
                            <p>QUALITY ASSURANCE</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
