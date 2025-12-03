import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Privacy Policy</h1>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Last updated: October 18, 2025
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at privacy@sankalp.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
