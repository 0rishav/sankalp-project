// import Navbar from '../components/Shared/Navbar';
import HeroSection from '../components/Landing/HeroSection';
import Features from '../components/Landing/Features';
import PopularProducts from '../components/Landing/PopularProducts';
import Testimonials from '../components/Landing/Testimonials';
import AboutSection from '../components/Landing/AboutSection';
import Newsletter from '../components/Landing/Newsletter';
// import Footer from '../components/Shared/Footer';
import PosterCarousel from '../components/Landing/PosterCarousel';
import ProductCategories from '../components/Landing/ProductCategories';
// import CollageBackground from '../components/Landing/CollageBackground';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* <CollageBackground /> */}
      <PosterCarousel/>
      <Features />
      <HeroSection />
      <ProductCategories />
      <PopularProducts />
      <Testimonials />
      <AboutSection />
      <Newsletter />
     
    </div>
  );
};

export default LandingPage;