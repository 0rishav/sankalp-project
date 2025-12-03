import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBackground from '../../components/shared/AuthBackground';
import Logo from '../../../public/img/sankalps.png';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.generateResetToken(formData.email);

      if (response.success) {
        setSuccess(`Password reset link sent to ${formData.email}`);
        setFormData({ email: '' });
      } else {
        setError(response.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-4xl p-6">
        <div className="auth-card grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl">
          {/* Marketing / Poster side */}
          <div
            className="hidden md:flex flex-col justify-center px-8 py-12 relative overflow-hidden opacity-75"
            aria-hidden={false}
            role="region"
            style={{
              backgroundImage: `url('/img/poster5.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
            <div className="relative z-10 text-white">
              <h3 className="text-3xl font-extrabold mb-4">Forgot Password?</h3>
              <p className="mb-6 opacity-90">Don't worry! Enter your email address and we'll send you a link to reset your password.</p>
              <ul className="space-y-2 opacity-95">
                <li>• Secure password reset</li>
                <li>• Email verification</li>
                <li>• Quick and easy process</li>
              </ul>
            </div>
          </div>

          {/* Form side */}
          <div className="px-6 py-8 bg-white/95 backdrop-blur-md">
            <div className="mb-6 text-center">
              <img src={Logo} alt="Logo" className="mx-auto mb-3 h-24 w-auto" />
              <h2 className="text-xl font-bold text-gray-900">पासवर्ड रीसेट करें</h2>
              <p className="text-sm text-gray-600 mt-1">अपना ईमेल पता दर्ज करें</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Forgot password form">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">ईमेल पता</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="अपना ईमेल पता दर्ज करें"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.email}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'भेज रहा है...' : 'रीसेट लिंक भेजें'}
              </button>

              <div className="pt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white/95 px-3 text-gray-500">Remember your password?</span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Link to="/login" className="text-orange-600 hover:underline">
                    वापस लॉगिन पेज पर जाएं
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
