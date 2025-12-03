import React from 'react';

const Features = () => {
  const features = [
    {
      title: "शुद्ध सामग्री",
      description: "हमारे सभी पूजा सामग्री शुद्ध और प्रामाणिक हैं",
      icon: "🪔"
    },
    {
      title: "पंडित जी की सलाह",
      description: "पूजा विधि के लिए विशेषज्ञ पंडित जी से मार्गदर्शन",
      icon: "🙏"
    },
    {
      title: "सुरक्षित भुगतान",
      description: "कई सुरक्षित भुगतान विकल्प उपलब्ध हैं",
      icon: "🔒"
    },
    {
      title: "घर पर डिलीवरी",
      description: "सभी पूजा सामग्री आपके घर तक पहुंचाई जाती है",
      icon: "🏠"
    }
  ];

  return (
    <section className="py-16 bg-orange-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-orange-800">हमें क्यों चुनें</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300 border-t-4 border-orange-500">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-orange-700">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;