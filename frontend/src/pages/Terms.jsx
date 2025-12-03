import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Terms and Conditions</h1>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Last updated: October 18, 2025
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using Sankalp's services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Disclaimer</h2>
            <p className="text-gray-600 mb-4">
              The materials on Sankalp's website are provided on an 'as is' basis. Sankalp makes no warranties, expressed or implied.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Limitations</h2>
            <p className="text-gray-600 mb-4">
              In no event shall Sankalp or its suppliers be liable for any damages arising out of the use or inability to use the materials on Sankalp's website.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">User Account</h2>
            <p className="text-gray-600 mb-4">
              You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms and Conditions, please contact us at legal@sankalp.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
