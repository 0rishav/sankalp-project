import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition duration-300 ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'wishlist' && <WishlistTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Wishlist Items</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Account Status</h3>
          <p className="text-lg font-bold text-purple-600 capitalize">{user?.role}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 p-3 bg-gray-50 rounded-lg">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 p-3 bg-gray-50 rounded-lg">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="mt-1 p-3 bg-gray-50 rounded-lg">{user?.phone || 'Not provided'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 p-3 bg-gray-50 rounded-lg capitalize">{user?.role}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="mt-1 p-3 bg-gray-50 rounded-lg">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Verified</label>
            <p className="mt-1 p-3 bg-gray-50 rounded-lg">
              {user?.isEmailVerified ? '✅ Verified' : '❌ Not Verified'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Orders Tab Component
const OrdersTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">No orders found.</p>
        <button className="mt-4 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition duration-300">
          Start Shopping
        </button>
      </div>
    </div>
  );
};

// Wishlist Tab Component
const WishlistTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h2>
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">Your wishlist is empty.</p>
        <button className="mt-4 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition duration-300">
          Browse Products
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
