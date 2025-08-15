// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage'; // Import the new CartPage component
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} /> {/* Add a new route for the cart */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
