import React, { useState, useEffect } from 'react';

const PosterCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Sample poster data - replace with your actual posters
const posters = [
  {
    id: 1,
    image: '/img/poster2.png', // मौजूदा छवि का उपयोग करें, वास्तविक पोस्टर छवियों से बदलें
    title: 'विशेष ग्रीष्मकालीन संग्रह',
    description: 'सभी समर आइटम पर 50% तक की छूट प्राप्त करें',
    buttonText: 'अभी खरीदें',
    buttonLink: '/products'
  },
  {
    id: 2,
    image: '/img/poster3.png', // वास्तविक पोस्टर छवि से बदलें
    title: 'नवीनतम आगमन',
    description: 'हमारे नवीनतम उत्पाद देखें',
    buttonText: 'देखें',
    buttonLink: '/products/new'
  },

   {
    id: 3,
    image: '/img/poster4.png', // वास्तविक पोस्टर छवि से बदलें
    title: 'सीमित समय की पेशकश',
    description: '₹1000 से अधिक के ऑर्डर पर मुफ्त शिपिंग',
    buttonText: 'और जानें',
    buttonLink: '/promotions'
  }
];


  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === posters.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [posters.length]);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? posters.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === posters.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative mt-24 w-full overflow-hidden">
      {/* Carousel container */}
      <div className="relative h-[400px] md:h-[700px]">
        {/* Slides */}
        {posters.map((poster, index) => (
          <div
            key={poster.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="relative w-full h-full bg-gradient-to-r from-gray-800 to-indigo-300">
              {/* Background image */}
              <img
                src={poster.image}
                alt={poster.title}
                className="absolute w-full h-full object-cover opacity-40"
              />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-3xl">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">{poster.title}</h2>
                  <p className="text-lg md:text-xl mb-8">{poster.description}</p>
                  <a
                    href={poster.buttonLink}
                    className="inline-block bg-white text-indigo-700 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300"
                  >
                    {poster.buttonText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 focus:outline-none"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 focus:outline-none"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-0 right-0 z-20">
        <div className="flex justify-center space-x-2">
          {posters.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full focus:outline-none ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PosterCarousel;