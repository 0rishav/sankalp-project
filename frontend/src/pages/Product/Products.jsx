import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart } = useCart();

  // Sample product data with categories
  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: 99.99,
      image: '/img/img1.jpg',
      description: 'High-quality wireless headphones with noise cancellation.',
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      category: 'Clothing',
      price: 19.99,
      image: '/img/img2.jpg',
      description: 'Comfortable cotton t-shirt in various colors.',
    },
    {
      id: 3,
      name: 'Garden Tool Set',
      category: 'Home & Garden',
      price: 49.99,
      image: '/img/img3.jpg',
      description: 'Essential tools for gardening enthusiasts.',
    },
    {
      id: 4,
      name: 'Programming Book',
      category: 'Books',
      price: 29.99,
      image: '/img/img4.jpg',
      description: 'Learn programming with this comprehensive guide.',
    },
    {
      id: 5,
      name: 'Smartphone Case',
      category: 'Electronics',
      price: 15.99,
      image: '/img/img4.jpg',
      description: 'Protective case for your smartphone.',
    },
    {
      id: 6,
      name: 'Running Shoes',
      category: 'Clothing',
      price: 79.99,
      image: '/img/img3.jpg',
      description: 'Comfortable running shoes for all terrains.',
    },
    {
      id: 7,
      name: 'Coffee Maker',
      category: 'Home & Garden',
      price: 89.99,
      image: '/img/img2.jpg',
      description: 'Brew the perfect cup of coffee at home.',
    },
    {
      id: 8,
      name: 'Mystery Novel',
      category: 'Books',
      price: 14.99,
      image: '/img/img1.jpg',
      description: 'An exciting mystery novel to keep you hooked.',
    },
  ];

  const categories = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Books'];

  // Filter products based on category and search term
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover a wide range of quality products across various categories.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-orange-50 hover:border-orange-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/img/placeholder.jpg'; // Fallback for missing images
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-orange-600">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-700 transition-colors duration-200"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Additional Features Section */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Our Products?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality Assured</h3>
              <p className="text-gray-600">All products are carefully selected for their quality and durability.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping to get your products to you as soon as possible.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600">We're committed to providing excellent customer service and support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
