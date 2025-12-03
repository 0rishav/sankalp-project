import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "श्रीमती सरिता शर्मा",
      role: "नियमित ग्राहक",
      image: "/img/img1.jpg",
      quote: "मैं पिछले दो सालों से यहां से पूजा सामग्री खरीद रही हूं। उत्पादों की शुद्धता और सेवा अद्वितीय है!"
    },
    {
      id: 2,
      name: "पंडित रमेश त्रिवेदी",
      role: "पुरोहित",
      image: "/img/img2.jpg",
      quote: "इस दुकान की सामग्री पूरी तरह से शुद्ध और प्रामाणिक है। मैं अपने सभी यजमानों को यहां से खरीदने की सलाह देता हूं।"
    },
    {
      id: 3,
      name: "श्री अनिल गुप्ता",
      role: "मंदिर प्रबंधक",
      image: "/img/img3.jpg",
      quote: "हमारे मंदिर के लिए सभी पूजा सामग्री हम यहीं से लेते हैं। उत्कृष्ट गुणवत्ता और समय पर डिलीवरी के लिए धन्यवाद।"
    }
  ];

  return (
    <section className="py-16 bg-orange-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-orange-800">हमारे ग्राहकों के अनुभव</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-orange-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-orange-300">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-orange-800">{testimonial.name}</h3>
                  <p className="text-orange-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="mb-4 text-yellow-500">
                ★★★★★
              </div>
              <p className="text-gray-700 italic text-lg">"<span className="font-medium">{testimonial.quote}</span>"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;