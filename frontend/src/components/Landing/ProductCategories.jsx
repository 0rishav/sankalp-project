import React from 'react';

const ProductCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Agarbatti',
      image: '/img/img1.jpg', // Using existing image as fallback
      description: 'Traditional incense sticks'
    },
    {
      id: 2,
      name: 'Dhoop',
      image: '/img/img2.jpg',
      description: 'Cone-shaped incense'
    },
   {
  id: 6,
  name: 'Pooja Thali Set',
  image: '/img/img8.webp',
  description: 'Traditional brass thali with essentials'
},{
  id: 9,
  name: 'Kumkum & Haldi Pack',
  image: '/img/img7.webp',
  description: 'Essential powders for sacred ceremonies'
},
{
  id: 10,
  name: 'Ganga Jal Bottle',
  image: '/img/img4.jpg',
  description: 'Holy water from the Ganges for rituals'
},
 
    {
      id: 5,
      name: 'Hawan Samagri',
      image: '/img/img3.jpg',
      description: 'Sacred ritual ingredients'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">पवित्र अनुभवों हेतु दिव्य सुगंध</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
          पवित्र अनुभवों के लिए निर्मित प्रीमियम सुगंधों का संग्रह खोजें, जो आपके मन को शांति और दिव्यता से भर दे।
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col items-center max-w-[200px]">
              <div className="w-[180px] h-[180px] rounded-full overflow-hidden mb-4 shadow-md">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
              <p className="text-gray-600 text-center text-sm">{category.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a 
            href="/products" 
            className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Explore All Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;