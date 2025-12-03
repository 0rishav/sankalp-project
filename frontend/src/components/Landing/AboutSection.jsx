import React from 'react';
import { FaOm, FaDiaspora } from 'react-icons/fa';

const AboutSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white pt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10 relative">
            <div className="absolute -top-4 -left-4 w-20 h-20 text-orange-500 opacity-20">
              <FaOm size={80} />
            </div>
            <img 
              src="/img/poster6.png" 
              alt="हमारे पूजा पाठ की दुकान" 
              className="rounded-lg shadow-xl w-full h-[550px] border-2 border-orange-200"
            />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 text-orange-500 opacity-20">
              <FaDiaspora size={80} />
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-1 bg-orange-500 mr-4"></div>
              <h2 className="text-3xl font-bold text-orange-800">हमारे बारे में</h2>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              २०१० में स्थापित, हमारी पूजा पाठ की दुकान का एक ही मिशन है: उच्च गुणवत्ता वाली पूजा सामग्री को उचित मूल्य पर प्रदान करना। 
              वर्षों से, हम भारत के सबसे विश्वसनीय पूजा सामग्री विक्रेताओं में से एक बन गए हैं, हजारों संतुष्ट ग्राहकों की सेवा कर रहे हैं।
            </p>
            <p className="text-gray-700 mb-8 leading-relaxed">
              हमारी टीम सर्वोत्तम पूजा सामग्री, प्रामाणिक मूर्तियां, और पारंपरिक पूजा उपकरण प्रदान करने के लिए समर्पित है। 
              हम आपके आध्यात्मिक यात्रा में आपका साथ देने के लिए प्रतिबद्ध हैं।
            </p>
            <div className="flex space-x-4">
              <a 
                href="/about" 
                className="bg-orange-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-orange-700 transition duration-300 flex items-center"
              >
                <span>और जानें</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="/contact" 
                className="border-2 border-orange-600 text-orange-600 py-3 px-8 rounded-full font-semibold hover:bg-orange-50 transition duration-300"
              >
                संपर्क करें
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;