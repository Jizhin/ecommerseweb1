// src/pages/ProductList.js

import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchProductFilters } from '../api/products';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dynamic state for filter options
    const [filterOptions, setFilterOptions] = useState({});

    // Filter and sort state
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });

    // State for collapsible filter sections
    const [openFilters, setOpenFilters] = useState({
        price: true, brand: true, category: true, size: true, color: true,
        fit: true, sleeve: true, neck: true, type: true,
    });

    // State for mobile sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts({ ...filters, sort, min_price: priceRange.min, max_price: priceRange.max });
                setProducts(data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch products. Please try again later.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        const getFilterOptions = async () => {
            try {
                const options = await fetchProductFilters();
                setFilterOptions(options);
            } catch (err) {
                console.error("Could not fetch filter options.");
            }
        };

        getProducts();
        getFilterOptions();
    }, [filters, sort, priceRange]);

    const handleFilterChange = (key, value) => {
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            if (newFilters[key] === value) {
                delete newFilters[key];
            } else {
                newFilters[key] = value;
            }
            return newFilters;
        });
    };

    const handlePriceRangeChange = (e) => {
        setPriceRange({
            ...priceRange,
            [e.target.name]: e.target.value,
        });
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const toggleFilter = (key) => {
        setOpenFilters(prevOpen => ({
            ...prevOpen,
            [key]: !prevOpen[key],
        }));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }
    
    return (
        <div className="product-list-page">
            <div className="main-content-header">
                <button className="filter-toggle-button" onClick={toggleSidebar}>
                    {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
                <div className="sort-container">
                    <label htmlFor="sort-select">Sort by:</label>
                    <select
                        id="sort-select"
                        className="sort-select"
                        value={sort}
                        onChange={handleSortChange}
                    >
                        <option value="">Default</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="name_asc">Name: A-Z</option>
                        <option value="name_desc">Name: Z-A</option>
                    </select>
                </div>
            </div>

            <div className={`sidebar ${isSidebarOpen ? 'show-sidebar' : ''}`}>
                <h2>Filters</h2>
                
                {/* Price Filter */}
                <div className="filter-group">
                    <div className="filter-group-header" onClick={() => toggleFilter('price')}>
                        <h3>Price</h3>
                        <span className="toggle-icon">{openFilters.price ? '−' : '+'}</span>
                    </div>
                    {openFilters.price && (
                        <div className="filter-group-body">
                            <div className="price-range">
                                <input
                                    type="number"
                                    name="min"
                                    value={priceRange.min}
                                    onChange={handlePriceRangeChange}
                                    className="price-input"
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    name="max"
                                    value={priceRange.max}
                                    onChange={handlePriceRangeChange}
                                    className="price-input"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Other Dynamic Filters */}
                {Object.keys(filterOptions).map(key => (
                    <div className="filter-group" key={key}>
                        <div className="filter-group-header" onClick={() => toggleFilter(key)}>
                            <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                            <span className="toggle-icon">{openFilters[key] ? '−' : '+'}</span>
                        </div>
                        {openFilters[key] && (
                            <div className="filter-group-body">
                                {key === 'colors' ? (
                                    <div className="filter-options-grid color-grid">
                                        {filterOptions[key].map(color => (
                                            <div
                                                key={color}
                                                className={`color-option ${filters[key] === color ? 'active' : ''}`}
                                                style={{ backgroundColor: color.toLowerCase() }}
                                                onClick={() => handleFilterChange(key, color)}
                                            >
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <ul className="filter-options-list">
                                        {filterOptions[key].map(option => (
                                            <li
                                                key={option}
                                                className={`filter-option ${filters[key] === option ? 'active' : ''}`}
                                                onClick={() => handleFilterChange(key, option)}
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="product-grid-container">
                {products.length > 0 ? (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="no-products">No products found.</div>
                )}
            </div>
        </div>
    );
};

export default ProductList;