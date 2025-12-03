import React from 'react';

const PopularProducts = () => {
  // Mock data for products
const products = [
  {
    id: 1,
    name: "हवन सामग्री",
    price: "₹299",
    image: "/img/img3.jpg",
    category: "पूजा सामग्री"
  },
  {
    id: 2,
    name: "अगरबत्ती सेट",
    price: "₹149",
    image: "/img/img2.jpg",
    category: "सुगंध"
  },
  {
    id: 3,
    name: "पीतल की पूजा थाली",
    price: "₹499",
    image: "/img/img8.webp",
    category: "पूजा बर्तन"
  },
  {
    id: 4,
    name: "गंगाजल की बोतल",
    price: "₹99",
    image: "/img/img4.jpg",
    category: "पवित्र जल"
  }
];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Popular Products</h2>
          <a href="/products" className="text-indigo-600 font-semibold hover:text-indigo-800">
            See All →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              {/* Sale badge */}
              <div className="relative">
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 m-2 rounded-lg z-10">
                  SALE
                </div>
                <div className="h-56 bg-gray-100 overflow-hidden relative group">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-md">{product.category}</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 hover:text-indigo-600 transition-colors">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xl text-indigo-600">{product.price}</span>
                    <span className="text-sm text-gray-400 line-through ml-2">$159.99</span>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;