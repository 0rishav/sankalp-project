import axiosInstance from '../utils/axiosInstance';

class AuthService {
  // Helper method to handle API responses
  handleResponse(response) {
    return response.data;
  }

  // Helper method to handle API errors (errors are already handled by interceptors)
  handleError(error) {
    // Errors are already processed by the axios interceptors
    // Just re-throw the processed error
    throw error;
  }

  // Login user
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/user/login', credentials);
      const data = this.handleResponse(response);

      if (data.success) {
        // Backend sets authentication cookies (accessToken, refreshToken)
        // User data should be fetched fresh when needed via getCurrentUser()
        // Don't store user data in localStorage since it's not in cookies
      }

      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await axiosInstance.post('/user/register', userData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Activate user account
  async activateUser(activationData) {
    try {
      const response = await axiosInstance.post('/user/activate-user', activationData);
      const data = this.handleResponse(response);

      if (data.success) {
        // Backend sets authentication cookies after activation
        // User data should be fetched fresh when needed via getCurrentUser()
        // Don't store user data in localStorage since it's not in cookies
      }

      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await axiosInstance.post('/user/logout');

      // Clear user data from localStorage
      localStorage.removeItem('user');

      return this.handleResponse(response);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('user');
      this.handleError(error);
    }
  }

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await axiosInstance.get('/user/me');
      const data = this.handleResponse(response);

      if (data.success) {
        // User data is returned in response, but not stored in cookies
        // The AuthContext will manage user state
        return data;
      }

      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Refresh access token (if needed)
  async refreshToken() {
    try {
      const response = await axiosInstance.post('/user/refresh-token');
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Generate password reset token
  async generateResetToken(email) {
    try {
      const response = await axiosInstance.post('/user/generate-reset-token', { email });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Reset password
  async resetPassword(resetData) {
    try {
      const response = await axiosInstance.post('/user/new-password', resetData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Admin: Get all users
  async getAllUsers(params = {}) {
    try {
      const response = await axiosInstance.get('/user/all-users', { params });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update user profile
  async updateProfile(updateData) {
    try {
      const response = await axiosInstance.patch('/user/edit-profile', updateData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Change user password
  async changePassword(passwordData) {
    try {
      const response = await axiosInstance.patch('/user/change-password', passwordData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Admin: Block/Unblock user
  async blockUnblockUser(userId, action) {
    try {
      const response = await axiosInstance.patch(`/user/block-unblock/${userId}`, { action });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Check if user is authenticated
  // Since cookies are handled by backend, we can't directly check them
  // The AuthContext will handle authentication state by trying to fetch current user
  isAuthenticated() {
    // For now, return false and let AuthContext handle authentication state
    // by attempting to fetch current user data
    return false;
  }

  // Get current user data from localStorage
  getCurrentUserData() {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Check if current user is admin
  isAdmin() {
    const user = this.getCurrentUserData();
    return user && ['admin', 'super_admin'].includes(user.role);
  }

  // Check if current user is super admin
  isSuperAdmin() {
    const user = this.getCurrentUserData();
    return user && user.role === 'super_admin';
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
