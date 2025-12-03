import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-orange-900 to-red-600 text-white py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">पूजा पथ</h1>
          <p className="text-xl mb-2">आपकी आध्यात्मिक यात्रा का विश्वसनीय साथी</p>
          <p className="text-lg mb-8">शुद्ध पूजा सामग्री, मूर्तियां और धार्मिक पुस्तकें</p>
          <div className="flex space-x-4">
            <button className="bg-white text-orange-700 font-bold py-3 px-8 rounded-lg hover:bg-yellow-100 transition duration-300 shadow-lg flex items-center">
              <span className="mr-2">🪔</span>
              पूजा सामग्री देखें
            </button>
            <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-orange-700 transition duration-300 flex items-center">
              <span className="mr-2">📞</span>
              संपर्क करें
            </button>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-300 rounded-full opacity-50"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-200 rounded-full opacity-50"></div>
            <img 
              src="/img/poster3.png" 
              alt="पूजा सामग्री" 
              className="w-full h-[580px] rounded-lg shadow-2xl relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;