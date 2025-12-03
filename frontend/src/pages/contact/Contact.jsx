import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., send to API)
    alert('संदेश भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-300 text-white py-48">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">संपर्क करें</h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto opacity-95">
            हमसे संपर्क करने के लिए नीचे दिए गए फॉर्म का उपयोग करें या हमारे संपर्क विवरण देखें।
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4">
            <a href="#contact-form" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md">फ़ॉर्म पर जाएं</a>
            <a href="#map" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md">नक्शा देखें</a>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section id="contact-form" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">हमें संदेश भेजें</h2>
              <p className="text-sm text-gray-500 mb-4">कोई सामान्य प्रश्न? पहले हमारे FAQ देखें या नीचे फ़ॉर्म भरें।</p>
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="name">नाम</label>
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
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="email">ईमेल</label>
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
                </div>

                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="subject">विषय</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="message">संदेश</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  ></textarea>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition duration-300"
                  >
                    संदेश भेजें
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <aside className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">संपर्क जानकारी</h2>
              <p className="text-gray-600">हमसे संपर्क करने के लिए निम्न विवरण का उपयोग करें या नीचे दिया गया फॉर्म भरें।</p>

              <div className="space-y-4 mt-4">
                <div className="flex items-start">
                  <div className="bg-orange-50 text-orange-600 p-3 rounded-xl mr-4">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">पता</h3>
                    <p className="text-gray-700">123 पूजा मार्ग, दिल्ली, भारत 110001</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-50 text-orange-600 p-3 rounded-xl mr-4">
                    <FaPhone className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">फोन</h3>
                    <p className="text-gray-700"><a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a></p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-50 text-orange-600 p-3 rounded-xl mr-4">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">ईमेल</h3>
                    <p className="text-gray-700"><a href="mailto:info@sankalp.com" className="hover:underline">info@sankalp.com</a></p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-50 text-orange-600 p-3 rounded-xl mr-4">
                    <FaClock className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">कार्य समय</h3>
                    <p className="text-gray-700">सोमवार - शनिवार: 9:00 AM - 8:00 PM<br />रविवार: बंद</p>
                  </div>
                </div>

              </div>

              {/* Decorative Poster + Map */}
              <div id="map" className="mt-4 grid grid-cols-1 gap-4">
                {/* Poster (decorative) - visible on large screens */}
             
                {/* Embedded map - responsive and accessible */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">हमारा स्थान</h3>
                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <iframe
                      title="Sankalp location"
                      src="https://www.google.com/maps?q=New+Delhi+India&output=embed"
                      width="100%"
                      height="320"
                      className="block"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3">
                    <a href="https://www.google.com/maps/search/?api=1&query=New+Delhi+India" target="_blank" rel="noreferrer" className="inline-block text-orange-600 hover:underline">Google Maps पर खोलें</a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
