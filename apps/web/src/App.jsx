import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import DemosPage from './pages/DemosPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/hooks/useCart.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';

// Initialize Stripe with the publishable key from the environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TLMSq848C4rUNZMIlNu935xBND5ifRszf2KbEOZqOZtylsqr699ZMxMJFUsOP9Yly8mRiL5tg3TsaGoYKFkxd4n0047kzFzWa');

function App() {
  const basename = import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <CartProvider>
          <Router basename={basename}>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
              <Route path="/demos" element={<DemosPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<HomePage />} />
            </Routes>
            <Toaster />
          </Router>
        </CartProvider>
      </AuthProvider>
    </Elements>
  );
}

export default App;
