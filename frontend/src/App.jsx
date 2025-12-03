import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import About from './pages/about/About'
import Contact from './pages/contact/Contact'
import Products from './pages/Product/Products'
import ProductDetails from './pages/Product/ProductDetails'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/checkout/Checkout'
import Profile from './pages/Profile/Profile'
import OrderHistory from './pages/Order/OrderHistory'
import Wishlist from './pages/Wishlist/Wishlist'
import SearchResults from './pages/SearchResults'
import FAQ from './pages/FAQ'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import ForgotPassword from './pages/Auth/ForgotPassword'
import UserDashboard from './pages/Dashboard/UserDashboard'
import AdminDashboard from './pages/Dashboard/AdminDashboard'
import ProtectedRoute, { AdminRoute, UserRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import './App.css'
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import { CartProvider } from './context/CartContext'

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <AuthProvider>
      <CartProvider>
        {!isAuthPage && <Navbar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          {/* Add more routes as needed */}
        </Routes>
        {!isAuthPage && <Footer />}
      </CartProvider>
    </AuthProvider>
  )
}

export default App

// Component to route to appropriate dashboard based on user role
const DashboardRouter = () => {
  const { user, isAdmin } = useAuth();

  if (isAdmin()) {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};
