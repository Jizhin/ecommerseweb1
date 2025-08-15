import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './Header.css';

const Header = () => {
    return (
        <header className="main-header">
            {/* Top Promotional Bar */}
            <div className="top-bar">
                <div className="top-bar-content">
                    <p className="promo-text">FREE SHIPPING FOR ALL ORDERS OF ₹500 & ABOVE</p>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" aria-label="Facebook"><FontAwesomeIcon icon={faFacebook} /></a>
                        <a href="https://www.twitter.com" aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} /></a>
                        <a href="https://www.instagram.com" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                    </div>
                </div>
            </div>

            {/* Main Header Section */}
            <div className="header-main">
                <div className="logo-container">
                    {/* Replace with your actual logo image */}
                    <a href="/" className="logo">BRAND NAME</a>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Search for products..." />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
                <div className="header-icons">
                    <a href="/account" aria-label="Account"><FontAwesomeIcon icon={faUser} /></a>
                    <a href="/wishlist" aria-label="Wishlist"><FontAwesomeIcon icon={faHeart} /></a>
                    <a href="/cart" aria-label="Cart"><FontAwesomeIcon icon={faShoppingCart} /></a>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="header-nav">
                <ul className="nav-menu">
                    {/* Only these items remain as per your request */}
                    <li className="nav-item"><a href="/men">Men</a></li>
                    <li className="nav-item"><a href="/women">Women</a></li>
                    <li className="nav-item"><a href="/about">About Us</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;