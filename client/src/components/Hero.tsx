import BlackHole from './BlackHole';
import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      window.scrollTo({
        top: servicesSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative h-screen">
      {/* Black Hole Container */}
      <div className="absolute inset-0 z-0">
        <BlackHole />
      </div>

      {/* Hero Content */}
      <div className="hero-content absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center z-10">
          <motion.h1 
            className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Navigating the <span className="text-gradient glow">Cosmic Frontier</span> of AI
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-white font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Pioneering AI solutions that transcend conventional boundaries, just like the mysteries of space.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button 
              onClick={scrollToServices}
              className="px-8 py-4 bg-primary hover:bg-opacity-80 rounded-full font-orbitron text-lg font-medium transition-all transform hover:-translate-y-1 hover:shadow-lg glow text-white"
            >
              Explore Solutions
            </button>
            
            <button 
              onClick={scrollToContact}
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 rounded-full font-orbitron text-lg font-medium transition-all transform hover:-translate-y-1 text-white"
            >
              Contact Us
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
