import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './features/cart/context/CartContext';
import { ProductListingPage } from './features/products/pages/ProductListingPage';
import { ProductDetailPage } from './features/products/pages/ProductDetailPage';
import { CartPage } from './features/cart/pages/CartPage';

export const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* Redirect unknown routes back to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
