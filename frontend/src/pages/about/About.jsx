import React from 'react';
import { FaHeart, FaUsers, FaStar, FaLeaf, FaQuoteLeft, FaAward } from 'react-icons/fa';

const About = () => {
  const teamMembers = [
    { name: 'राजेश शर्मा', role: 'संस्थापक', image: '/img/team1.jpg' },
    { name: 'प्रिया वर्मा', role: 'ग्राहक सेवा प्रमुख', image: '/img/team2.jpg' },
    { name: 'अमित कुमार', role: 'उत्पाद विशेषज्ञ', image: '/img/team3.jpg' },
  ];

  const testimonials = [
    { name: 'सुनीता देवी', text: 'संकल्प की सामग्री से मेरी पूजा अनुभव बहुत बेहतर हुआ।' },
    { name: 'विकास सिंह', text: 'उच्च गुणवत्ता और समय पर डिलीवरी। धन्यवाद!' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">हमारे बारे में</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            2010 से, हम उच्च गुणवत्ता वाली पूजा सामग्री प्रदान कर रहे हैं, जो आपकी आध्यात्मिक यात्रा को समृद्ध बनाती है। हम प्रामाणिकता और उत्कृष्टता पर विश्वास करते हैं।
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img 
                src="/img/poster2.png" 
                alt="हमारी दुकान की तस्वीर" 
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="md:w-1/2 md:pl-10">
              <h2 className="text-3xl font-bold text-orange-800 mb-6">हमारी कहानी</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                हमारी दुकान की स्थापना 2010 में हुई थी, जब हमने देखा कि लोग उच्च गुणवत्ता वाली पूजा सामग्री आसानी से नहीं मिल पा रही है। 
                तब से, हमने हजारों ग्राहकों की सेवा की है और भारत भर में पूजा सामग्री की विश्वसनीय आपूर्ति बन गए हैं।
              </p>
              <p className="text-gray-700 leading-relaxed">
                हम प्रामाणिकता, गुणवत्ता और ग्राहक संतुष्टि पर जोर देते हैं, ताकि आपकी पूजा अनुभव बेहतर हो।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-orange-800 mb-12">हमारा मिशन और विजन</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <FaHeart className="text-orange-600 text-5xl mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">मिशन</h3>
              <p className="text-gray-700">
                उच्च गुणवत्ता वाली पूजा सामग्री को सस्ती कीमतों पर उपलब्ध कराना, ताकि हर कोई आसानी से आध्यात्मिकता का अनुभव कर सके।
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <FaLeaf className="text-orange-600 text-5xl mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">विजन</h3>
              <p className="text-gray-700">
                भारत की सबसे विश्वसनीय पूजा सामग्री ब्रांड बनना, जो पारंपरिक मूल्यों को आधुनिक तरीकों से जोड़ती है।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-orange-800 mb-12">क्यों चुनें हमें?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <FaUsers className="text-orange-600 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">विशेषज्ञ टीम</h3>
              <p className="text-gray-700">हमारी टीम पूजा सामग्री के विशेषज्ञों से बनी है, जो सही सलाह देते हैं।</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <FaStar className="text-orange-600 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">उच्च गुणवत्ता</h3>
              <p className="text-gray-700">सभी उत्पाद प्रामाणिक और उच्च मानकों पर खरे उतरते हैं।</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <FaHeart className="text-orange-600 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">ग्राहक केंद्रित</h3>
              <p className="text-gray-700">आपकी संतुष्टि हमारी प्राथमिकता है, हमेशा।</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-orange-800 mb-12">हमारी टीम</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-lg shadow-md">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-orange-800 mb-12">ग्राहक प्रशंसापत्र</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-orange-50 p-6 rounded-lg">
                <FaQuoteLeft className="text-orange-600 text-2xl mb-4" />
                <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                <p className="text-orange-800 font-semibold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">हमारी उपलब्धियां</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <FaAward className="text-4xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold">10+</h3>
              <p>वर्षों का अनुभव</p>
            </div>
            <div>
              <FaUsers className="text-4xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold">5000+</h3>
              <p>संतुष्ट ग्राहक</p>
            </div>
            <div>
              <FaStar className="text-2xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold">100+</h3>
              <p>उत्पाद श्रेणियां</p>
            </div>
            <div>
              <FaHeart className="text-4xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold">24/7</h3>
              <p>समर्थन</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">हमसे जुड़ें</h2>
          <p className="text-xl mb-8">अधिक जानकारी के लिए संपर्क करें या हमारी दुकान पर आएं।</p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/contact" 
              className="bg-orange-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-orange-700 transition duration-300"
            >
              संपर्क करें
            </a>
            <a 
              href="/products" 
              className="border-2 border-orange-600 text-orange-600 py-3 px-8 rounded-full font-semibold hover:bg-orange-600 hover:text-white transition duration-300"
            >
              उत्पाद देखें
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
