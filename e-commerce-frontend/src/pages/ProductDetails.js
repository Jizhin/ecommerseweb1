// src/pages/ProductDetails.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegHeart } from 'react-icons/fa';
import { HiOutlineBadgeCheck } from 'react-icons/hi';
import { FiMapPin } from 'react-icons/fi';
import './ProductDetails.css';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [deliveryPincode, setDeliveryPincode] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState(null);
    const [addToCartStatus, setAddToCartStatus] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/products/${productId}`);
                
                if (!response.ok) {
                    throw new Error('Product not found.');
                }
                const productData = await response.json();
                setProduct(productData);
                setSelectedImage(`${IMAGE_BASE_URL}${productData.images[0]?.image}` || 'https://via.placeholder.com/600');
                setError(null);
            } catch (err) {
                setError(err.message);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return <div className="loading">Loading product details...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!product) {
        return <div className="no-product">Product not found.</div>;
    }

    const rating = '4.5';
    const reviews = '578 Reviews';
    const is_hot_selling = true;

    const discountPercentage = product.price && product.original_price
        ? Math.round(((parseFloat(product.original_price) - parseFloat(product.price)) / parseFloat(product.original_price)) * 100)
        : null;

    const handleCheckDelivery = (e) => {
        e.preventDefault();
        if (deliveryPincode.length === 6) {
            setDeliveryStatus({
                available: true,
                message: "This product is eligible for FREE SHIPPING."
            });
        } else {
            setDeliveryStatus({
                available: false,
                message: "Please enter a valid 6-digit pincode."
            });
        }
    };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            setAddToCartStatus({ success: false, message: 'Please select a size first.' });
            return;
        }
        
        setAddToCartStatus({ success: null, message: 'Adding to bag...' });
        
        try {
            // Assuming your backend cart API is at /cart/
            const response = await fetch(`${API_BASE_URL}/cart/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // You'll need to add an Authorization token here once you implement user authentication
                },
                body: JSON.stringify({
                    product_id: product.id,
                    size: selectedSize, // Assuming your backend expects 'size' not 'size_name'
                    quantity: 1,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setAddToCartStatus({ success: true, message: 'Item added to bag successfully!' });
            } else {
                setAddToCartStatus({ success: false, message: data.detail || 'Failed to add item to bag.' });
            }
        } catch (err) {
            setAddToCartStatus({ success: false, message: 'An error occurred. Please try again.' });
        }
    };

    const handleWishlist = () => {
        // Placeholder for wishlist functionality
        alert(`Adding ${product.name} to wishlist!`);
    };

    return (
        <div className="product-details-page">
            <div className="image-section">
                <div className="thumbnail-container">
                    {product.images.map((img, index) => (
                        <div
                            key={index}
                            className={`thumbnail ${selectedImage === `${IMAGE_BASE_URL}${img.image}` ? 'active' : ''}`}
                            onMouseEnter={() => setSelectedImage(`${IMAGE_BASE_URL}${img.image}`)}
                            onClick={() => setSelectedImage(`${IMAGE_BASE_URL}${img.image}`)}
                        >
                            <img src={`${IMAGE_BASE_URL}${img.image}`} alt={`${product.name} thumbnail ${index + 1}`} />
                        </div>
                    ))}
                </div>
                <div className="main-image-container">
                    <img src={selectedImage} alt={product.name} className="main-product-image" />
                </div>
            </div>
            <div className="details-section">
                <div className="product-header">
                    <p className="product-brand">{product.brand || ''}</p>
                    <h1 className="product-name">{product.name}</h1>
                </div>

                <div className="rating-price-group">
                    <div className="price-info">
                        <span className="current-price">₹{parseFloat(product.price).toFixed(2)}</span>
                        {product.original_price && (
                            <>
                                <span className="original-price">₹{parseFloat(product.original_price).toFixed(2)}</span>
                                <span className="discount-info">{discountPercentage}% OFF</span>
                            </>
                        )}
                        <p className="inclusive-text">Inclusive of all taxes</p>
                    </div>
                    <div className="product-rating-container">
                        <div className="product-rating-box">
                            <FaStar className="product-rating-star" />
                            <span>{rating}</span>
                        </div>
                        <a href="#reviews" className="reviews-link">{reviews}</a>
                    </div>
                </div>

                {is_hot_selling && (
                    <div className="hot-selling-badge">
                        🔥 1025 people bought this in the last 7 days
                    </div>
                )}
                <div className="product-attributes">
                    <span className="attribute-badge">BUY 3 FOR 999</span>
                    <span className="attribute-badge">100% COTTON</span>
                </div>

                <div className="size-selection-container">
                    <div className="size-header">
                        <span className="select-size-text">Select Size</span>
                        <a href="#size-guide" className="size-guide-link">SIZE GUIDE</a>
                    </div>
                    <div className="size-options">
                        {product.sizes.map((size) => (
                            <button
                                key={size.id}
                                className={`size-option ${selectedSize === size.name ? 'active' : ''}`}
                                onClick={() => setSelectedSize(size.name)}
                            >
                                {size.name}
                            </button>
                        ))}
                    </div>
                    <p className="size-left-text">2 left</p>
                </div>

                <div className="action-buttons">
                    <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!selectedSize}>
                        <HiOutlineBadgeCheck /> ADD TO BAG
                    </button>
                    <button className="add-to-wishlist-btn" onClick={handleWishlist}>
                        <FaRegHeart /> WISHLIST
                    </button>
                </div>

                {addToCartStatus && (
                    <div className={`add-to-cart-status ${addToCartStatus.success ? 'success' : 'error'}`}>
                        {addToCartStatus.message}
                    </div>
                )}

                <div className="delivery-check-section">
                    <p className="delivery-check-text">
                        <FiMapPin /> Check for Delivery Details
                    </p>
                    <div className="pincode-input-container">
                        <input
                            type="text"
                            placeholder="Enter Pincode"
                            value={deliveryPincode}
                            onChange={(e) => setDeliveryPincode(e.target.value)}
                            className="pincode-input"
                        />
                        <button className="pincode-check-btn" onClick={handleCheckDelivery}>CHECK</button>
                    </div>
                    {deliveryStatus && (
                        <div className={`delivery-status ${deliveryStatus.available ? 'available' : 'unavailable'}`}>
                            {deliveryStatus.message}
                        </div>
                    )}
                    <div className="delivery-info">
                        <div className="delivery-info-icon"><HiOutlineBadgeCheck /></div>
                        <p className="delivery-info-text">This product is eligible for FREE SHIPPING</p>
                    </div>
                </div>

                <div className="extra-offers-section">
                    <p className="extra-offers-title">Save extra with these offers</p>
                    <div className="offer-card">
                        <HiOutlineBadgeCheck />
                        <p>Get 15% Cashback only on orders above Rs.299. Coupon code - **MAD15**</p>
                    </div>
                </div>

                <div className="key-highlights-section">
                    <h2 className="key-highlights-title">Key Highlights</h2>
                    <div className="key-highlights-grid">
                        {product.fit && (
                            <div className="highlight-item">
                                <p className="highlight-label">Fit</p>
                                <p className="highlight-value">{product.fit}</p>
                            </div>
                        )}
                        {product.sleeve && (
                            <div className="highlight-item">
                                <p className="highlight-label">Sleeve</p>
                                <p className="highlight-value">{product.sleeve}</p>
                            </div>
                        )}
                        {product.neck && (
                            <div className="highlight-item">
                                <p className="highlight-label">Neck</p>
                                <p className="highlight-value">{product.neck}</p>
                            </div>
                        )}
                        {product.type && (
                            <div className="highlight-item">
                                <p className="highlight-label">Type</p>
                                <p className="highlight-value">{product.type}</p>
                            </div>
                        )}
                        <div className="highlight-item">
                            <p className="highlight-label">Fabric</p>
                            <p className="highlight-value">Cotton</p>
                        </div>
                        <div className="highlight-item">
                            <p className="highlight-label">Design</p>
                            <p className="highlight-value">Graphic Print</p>
                        </div>
                    </div>
                </div>

                <div className="product-description">
                    <h2>Product Description</h2>
                    <p>Manufacture, Care and Fit</p>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
