import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError, logout as logoutAction, updateUser, initializeAuth } from '../redux/authslice';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuthState = async () => {
      dispatch(setLoading(true));

      try {
        // Try to get current user data from backend
        const response = await authService.getCurrentUser();

        if (response.success) {
          // User is authenticated, update Redux state
          dispatch(initializeAuth({
            user: response.user,
            isAuthenticated: true,
          }));
        } else {
          // User is not authenticated
          dispatch(logoutAction());
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // If we can't determine auth status, assume not authenticated
        dispatch(logoutAction());
      }
      // Note: No need for finally block since initializeAuth and logout actions already set loading: false
    };

    initializeAuthState();
  }, [dispatch]);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.login(credentials);

      if (response.success) {
        // Update Redux state with user data
        dispatch(setUser(response.user));
        dispatch(setLoading(false)); // Clear loading state after successful login
        return { success: true, user: response.user };
      } else {
        dispatch(setError(response.message || 'Login failed'));
        dispatch(setLoading(false)); // Clear loading state after failed login
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch(setError(error.message || 'Login failed. Please try again.'));
      dispatch(setLoading(false)); // Clear loading state after error
      return {
        success: false,
        message: error.message || 'Login failed. Please try again.'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.register(userData);
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      dispatch(setError(error.message || 'Registration failed. Please try again.'));
      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.'
      };
    }
  };

  // Activate user function
  const activateUser = async (activationData) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.activateUser(activationData);

      if (response.success) {
        // Update Redux state after successful activation
        dispatch(setUser(response.user));
      }

      dispatch(setLoading(false));
      return response;
    } catch (error) {
      console.error('Activation error:', error);
      dispatch(setError(error.message || 'Activation failed. Please try again.'));
      return {
        success: false,
        message: error.message || 'Activation failed. Please try again.'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      dispatch(logoutAction());
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      dispatch(logoutAction());
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        // Update Redux state with new user data
        dispatch(updateUser(response.user));
        return { success: true, user: response.user };
      }
      dispatch(setError(response.message || 'Failed to update profile'));
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Update profile error:', error);
      dispatch(setError(error.message || 'Failed to update profile'));
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      };
    }
  };

  // Change user password
  const changePasswordContext = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      dispatch(setError(error.message || 'Failed to change password'));
      return {
        success: false,
        message: error.message || 'Failed to change password'
      };
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && ['admin', 'super_admin'].includes(user.role);
  };

  // Check if user is super admin
  const isSuperAdmin = () => {
    return user && user.role === 'super_admin';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    error,
    login,
    register,
    activateUser,
    logout,
    updateProfile,
    changePasswordContext,
    isAdmin,
    isSuperAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
