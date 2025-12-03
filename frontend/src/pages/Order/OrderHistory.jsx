import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders] = useState([
    {
      id: 'ORD-001',
      date: '2023-10-01',
      status: 'Delivered',
      total: 149.99,
      items: [
        { id: 1, name: 'Wireless Bluetooth Headphones', quantity: 1, price: 99.99 },
        { id: 2, name: 'Cotton T-Shirt', quantity: 2, price: 25.00 },
      ],
    },
    {
      id: 'ORD-002',
      date: '2023-09-15',
      status: 'Shipped',
      total: 79.99,
      items: [
        { id: 3, name: 'Garden Tool Set', quantity: 1, price: 49.99 },
        { id: 4, name: 'Programming Book', quantity: 1, price: 29.99 },
      ],
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Shipped': return 'text-blue-600 bg-blue-100';
      case 'Processing': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Order History</h1>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Order #{order.id}</h2>
                    <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-bold text-orange-600 mt-1">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Items</h3>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-800">{item.name}</span>
                          <span className="text-gray-600 ml-2">Qty: {item.quantity}</span>
                        </div>
                        <span className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                  <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200">
                    View Details
                  </button>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200">
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your order history here.</p>
            <Link
              to="/products"
              className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
