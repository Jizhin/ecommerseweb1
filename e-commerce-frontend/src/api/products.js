// src/api/products.js

import axios from 'axios';
import { API_BASE_URL } from '../config';
// The base URL of your Django backend API
const API_URL = API_BASE_URL;

/**
 * Fetches products from the backend with optional filtering and sorting.
 * @param {Object} filters - An object containing filter and sort parameters.
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 */
export const fetchProducts = async (filters = {}) => {
  try {
    // Construct the query string from the filters object
    const queryString = new URLSearchParams(filters).toString();
    
    // Make the GET request to the backend API
    const response = await axios.get(`${API_URL}/products/?${queryString}`);
    
    // The products are in the response.data
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    // You might want to throw an error or return an empty array depending on your error handling strategy
    throw error;
  }
};

/**
 * Fetches dynamic filter options from the backend.
 * @returns {Promise<Object>} A promise that resolves to an object of filter options.
 */
export const fetchProductFilters = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/filters/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching filter options:", error);
        throw error;
    }
};