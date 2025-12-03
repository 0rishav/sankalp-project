import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addToCart } = useCart();
  const [results, setResults] = useState([]);

  // Sample product data (in a real app, fetch from API based on query)
  const allProducts = [
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
    // Add more products as needed
  ];

  useEffect(() => {
    if (query) {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600 mb-8">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </p>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/img/placeholder.jpg';
                    }}
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-orange-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                  </Link>
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Results Found</h2>
            <p className="text-gray-600 mb-8">
              Try adjusting your search terms or browse our products.
            </p>
            <Link
              to="/products"
              className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors duration-200"
            >
              Browse All Products
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="text-orange-600 hover:text-orange-800 font-medium"
          >
            ← Back to All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
