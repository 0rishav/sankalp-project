import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = '/login'
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but no specific roles are required, allow access
  if (isAuthenticated && allowedRoles.length === 0) {
    return children;
  }

  // If user is authenticated and specific roles are required, check if user has required role
  if (isAuthenticated && allowedRoles.length > 0) {
    const userRole = user?.role;

    // Check if user has any of the allowed roles
    if (allowedRoles.includes(userRole)) {
      return children;
    } else {
      // User doesn't have required role, redirect to unauthorized page or home
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If no authentication required, allow access
  if (!requireAuth) {
    return children;
  }

  // Fallback: redirect to login
  return <Navigate to={redirectTo} state={{ from: location }} replace />;
};

export default ProtectedRoute;

// Additional helper components for common use cases
export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'super_admin']} requireAuth={true}>
    {children}
  </ProtectedRoute>
);

export const SuperAdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['super_admin']} requireAuth={true}>
    {children}
  </ProtectedRoute>
);

export const UserRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['user']} requireAuth={true}>
    {children}
  </ProtectedRoute>
);

export const PublicRoute = ({ children }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
);
