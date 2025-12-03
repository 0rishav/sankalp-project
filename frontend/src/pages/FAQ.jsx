import React, { useState } from 'react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const faqs = [
    {
      id: 1,
      question: 'How do I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via email. You can also check your order status in your account under Order History.',
    },
    {
      id: 2,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Contact our support team to initiate a return.',
    },
    {
      id: 3,
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. Check our shipping page for more details.',
    },
    {
      id: 4,
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support team via email at support@sankalp.com or through the contact form on our Contact page.',
    },
    {
      id: 5,
      question: 'Are my payment details secure?',
      answer: 'Yes, we use industry-standard encryption to protect your payment information. We never store your credit card details on our servers.',
    },
    {
      id: 6,
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be cancelled or modified within 24 hours of placement if they haven\'t shipped yet. Contact support immediately for assistance.',
    },
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Frequently Asked Questions</h1>
          <p className="text-gray-600 mb-8 text-center">
            Find answers to common questions about our products and services.
          </p>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg shadow-md">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                    <span className={`text-2xl transition-transform duration-200 ${openFAQ === faq.id ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </div>
                </button>
                {openFAQ === faq.id && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a
              href="/contact"
              className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors duration-200 inline-block"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
