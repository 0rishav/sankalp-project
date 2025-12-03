import React, { useState } from 'react';
import { FaBell, FaOm } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Subscribing email:', email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-16 bg-gradient-to-r from-orange-700 to-red-600 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10">
          <FaOm size={80} />
        </div>
        <div className="absolute bottom-10 right-10">
          <FaOm size={80} />
        </div>
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="flex justify-center mb-4">
          <FaBell className="text-yellow-300 text-3xl" />
        </div>
        <h2 className="text-3xl font-bold mb-4">पूजा अपडेट प्राप्त करें</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          हमारे न्यूज़लेटर की सदस्यता लें और नए पूजा सामग्री, विशेष पूजा ऑफर, और त्योहारों के लिए विशेष छूट के बारे में जानकारी प्राप्त करें।
        </p>
        
        {subscribed ? (
          <div className="bg-white text-orange-700 p-6 rounded-lg max-w-md mx-auto shadow-lg border-t-4 border-yellow-400">
            <p className="font-semibold text-lg">सदस्यता के लिए धन्यवाद!</p>
            <p>आप जल्द ही हमारे अपडेट प्राप्त करेंगे।</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row">
            <div className="relative flex-grow mb-3 sm:mb-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="आपका ईमेल पता"
                required
                className="w-full py-3 px-4 rounded-lg sm:rounded-r-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button 
              type="submit"
              className="bg-yellow-400 text-orange-800 font-bold py-3 px-6 rounded-lg sm:rounded-l-none hover:bg-yellow-300 transition duration-300 flex items-center justify-center"
            >
              <span>सदस्यता लें</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        )}
        <div className="mt-8 text-sm text-yellow-100 max-w-md mx-auto">
          हम आपकी गोपनीयता का सम्मान करते हैं और आपका ईमेल कभी भी किसी तीसरे पक्ष के साथ साझा नहीं करेंगे।
        </div>
      </div>
    </section>
  );
};

export default Newsletter;