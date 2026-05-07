import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import { CartProvider } from '@/hooks/useCart.jsx';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <CartProvider>
      <App />
    </CartProvider>
  </>
);