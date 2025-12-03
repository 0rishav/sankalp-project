import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBackground from '../../components/shared/AuthBackground';
import Logo from '../../../public/img/sankalps.png';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, activateUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleNext = async () => {
    if (step === 1 && formData.name && formData.email && formData.password && formData.password === formData.confirmPassword) {
      setLoading(true);
      setError('');

      try {
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: formData.phone
        });

        if (result.success) {
          setStep(2);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('साइन अप में त्रुटि। कृपया पुनः प्रयास करें।');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 2 && formData.otp) {
      setLoading(true);
      setError('');

      try {
        const result = await activateUser({
          activation_code: formData.otp
        });

        if (result.success) {
          setSuccess('साइन अप सफल! आपका खाता सक्रिय हो गया है।');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('साइन अप में त्रुटि। कृपया पुनः प्रयास करें।');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-4xl p-6">
        <div className="auth-card grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl">
          {/* Marketing / Poster side */}
          <div
            className="hidden md:flex flex-col justify-center px-8 py-12 relative overflow-hidden opacity-80"
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
              <h3 className="text-3xl font-extrabold mb-4">Join us</h3>
              <p className="mb-6 opacity-90">Create your account to start selling and grow your business.</p>
              <ul className="space-y-2 opacity-95">
                <li>• Easy product onboarding</li>
                <li>• Secure checkout</li>
                <li>• Insights & analytics</li>
              </ul>
            </div>
          </div>

          {/* Form side */}
          <div className="px-6 py-8 bg-white/95 backdrop-blur-md">
            <div className="mb-6 text-center">
              <img src={Logo} alt="Logo" className="mx-auto mb-3 h-24 w-auto" />
              <h2 className="text-xl font-bold text-gray-900">साइन अप</h2>
              <p className="text-sm text-gray-600 mt-1">अपना खाता बनाएँ</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">नाम</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">ईमेल</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">फोन (वैकल्पिक)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirmPassword">पासवर्ड पुष्टि करें</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'साइन अप हो रहा है...' : 'अगला'}
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <p className="text-gray-600 mb-4 text-center">आपके ईमेल पर OTP भेजा गया है।</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="otp">OTP</label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'सत्यापन हो रहा है...' : 'साइन अप करें'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full mt-2 text-orange-600 hover:underline"
                  >
                    पीछे जाएं
                  </button>
                </>
              )}
            </form>

            <p className="mt-4 text-center text-gray-600">
              पहले से खाता है? <Link to="/login" className="text-orange-600 hover:underline">लॉगिन करें</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
