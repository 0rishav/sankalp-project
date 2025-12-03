import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews] = useState([
    { id: 1, user: 'John D.', rating: 5, comment: 'Great quality product!' },
    { id: 2, user: 'Jane S.', rating: 4, comment: 'Fast delivery and good value.' },
  ]);

  // Sample product data (in a real app, fetch from API)
  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: 99.99,
      images: ['/img/img1.jpg', '/img/img1.jpg'], // Add more images if available
      description: 'High-quality wireless headphones with noise cancellation and long battery life.',
      features: ['Noise Cancelling', 'Bluetooth 5.0', '30-hour Battery', 'Comfortable Fit'],
      specifications: { 'Battery Life': '30 hours', 'Connectivity': 'Bluetooth', 'Weight': '250g' },
    },
    // Add more products as needed
  ];

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors duration-200"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 bg-white rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = '/img/placeholder.jpg';
                }}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${
                      selectedImage === index ? 'border-orange-600' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(index)}
                    onError={(e) => {
                      e.target.src = '/img/placeholder.jpg';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-orange-600 text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
              <ul className="list-disc list-inside text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Specifications</h3>
              <div className="space-y-1">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition-colors duration-200 mb-4"
            >
              Add to Cart
            </button>

            <div className="flex space-x-4">
              <Link
                to="/products"
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition-colors duration-200 text-center"
              >
                Back to Products
              </Link>
              <Link
                to="/cart"
                className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 text-center"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-2">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="font-semibold text-gray-800">{review.user}</span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
