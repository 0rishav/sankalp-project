import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBackground from '../../components/shared/AuthBackground';
import Logo from '../../../public/img/sankalps.png';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
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

    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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
              <h3 className="text-3xl font-extrabold mb-4">Welcome back</h3>
              <p className="mb-6 opacity-90">Sign in to access your dashboard, manage orders and track shipments. Secure and fast — built for merchants.</p>
              <ul className="space-y-2 opacity-95">
                <li>• Quick product management</li>
                <li>• Real-time order tracking</li>
                <li>• Secure payments</li>
              </ul>
            </div>
          </div>

          {/* Form side */}
          <div className="px-6 py-8 bg-white/95 backdrop-blur-md">
            <div className="mb-6 text-center">
              <img src={Logo} alt="Logo" className="mx-auto mb-3 h-24 w-auto" />
              <h2 className="text-xl font-bold text-gray-900">लॉगिन</h2>
              <p className="text-sm text-gray-600 mt-1">आपका खाता में प्रवेश करें</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="identifier">ईमेल या फोन</label>
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ईमेल या फोन नंबर दर्ज करें"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">पासवर्ड</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-orange-600" />
                  <span className="ml-2 text-gray-700">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-orange-600 hover:underline">Forgot?</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
              </button>

              <div className="pt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white/95 px-3 text-gray-500">or continue with</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button type="button" className="py-2 px-3 border rounded-lg flex items-center justify-center text-sm hover:bg-gray-50">Google</button>
                  <button type="button" className="py-2 px-3 border rounded-lg flex items-center justify-center text-sm hover:bg-gray-50">Facebook</button>
                </div>
              </div>
            </form>

            <p className="mt-6 text-center text-gray-600 text-sm">खाता नहीं है? <Link to="/signup" className="text-orange-600 hover:underline">साइन अप करें</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
