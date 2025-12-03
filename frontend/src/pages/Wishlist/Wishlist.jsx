import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Wishlist = () => {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 99.99,
      image: '/img/img1.jpg',
      description: 'High-quality wireless headphones with noise cancellation.',
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      price: 19.99,
      image: '/img/img2.jpg',
      description: 'Comfortable cotton t-shirt in various colors.',
    },
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Wishlist</h1>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/img/placeholder.jpg';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-orange-600">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors duration-200 text-sm"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-8">Save items you're interested in for later by adding them to your wishlist.</p>
            <Link
              to="/products"
              className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
