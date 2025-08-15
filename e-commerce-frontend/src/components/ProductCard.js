// src/components/ProductCard.js

import React, { useState } from 'react';
import './ProductCard.css';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const imageUrl = product.images && product.images.length > 0
        ? product.images[0].image
        : 'https://via.placeholder.com/250';

    // Calculate discount percentage if original price is available
    const discountPercentage = product.original_price 
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : null;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        alert(`Adding ${product.name} to cart!`);
    };

    return (
        <a 
            href={`/${product.id}`} 
            className="product-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {product.is_design_of_week && (
                <div className="design-badge">DESIGN OF THE WEEK</div>
            )}
            
            <div className="product-image-container">
                <img src={imageUrl} alt={product.name} className="product-image" />
                {isHovered && (
                    <div className="add-to-cart-overlay" onClick={handleAddToCart}>
                        <button className="add-to-cart-btn">
                            ADD TO CART
                        </button>
                    </div>
                )}
            </div>
            
            <div className="product-info">
                <div className="product-rating">
                    <FaStar className="product-rating-star" />
                    <span>{product.rating || '4.4'}</span>
                </div>
                
                <div className="product-brand">{product.brand || 'Bewakoof®'}</div>
                <h3 className="product-name">{product.name}</h3>
                
                <div className="price-container">
                    <span className="product-price">₹{parseFloat(product.price).toFixed(2)}</span>
                    {product.original_price && (
                        <>
                            <span className="original-price">₹{parseFloat(product.original_price).toFixed(2)}</span>
                            {discountPercentage && (
                                <span className="discount-badge">{discountPercentage}% off</span>
                            )}
                        </>
                    )}
                </div>
                
                <div className="product-tags">
                    {product.is_cotton && <span className="product-tag cotton-tag">100% COTTON</span>}
                    {product.is_special_offer && <span className="product-tag special-offer-tag">SALE SPECIAL PRICE</span>}
                    {product.bundle_offer && <span className="product-tag">BUY 3 FOR 999</span>}
                    {product.glow_in_dark && <span className="product-tag">GLOW IN DARK</span>}
                </div>
            </div>
        </a>
    );
};

export default ProductCard;