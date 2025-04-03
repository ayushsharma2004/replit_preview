import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-space-black bg-opacity-80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <div className="relative mr-2">
              <div className="w-8 h-8 bg-primary rounded-full opacity-80"></div>
              <div className="absolute inset-0 bg-secondary rounded-full opacity-50 animate-pulse"></div>
            </div>
            <span className="font-orbitron text-xl font-bold tracking-wider text-gradient">SPACE MARVEL</span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="font-orbitron text-white hover:text-secondary transition-colors">Home</button>
            <button onClick={() => scrollToSection('about')} className="font-orbitron text-white hover:text-secondary transition-colors">About</button>
            <button onClick={() => scrollToSection('services')} className="font-orbitron text-white hover:text-secondary transition-colors">Services</button>
            <button onClick={() => scrollToSection('contact')} className="font-orbitron text-white hover:text-secondary transition-colors">Contact</button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden py-4 bg-space-black bg-opacity-95 mt-2 rounded-md`}>
          <div className="flex flex-col space-y-4 px-4">
            <button onClick={() => scrollToSection('home')} className="font-orbitron text-white hover:text-secondary py-2 transition-colors text-left">Home</button>
            <button onClick={() => scrollToSection('about')} className="font-orbitron text-white hover:text-secondary py-2 transition-colors text-left">About</button>
            <button onClick={() => scrollToSection('services')} className="font-orbitron text-white hover:text-secondary py-2 transition-colors text-left">Services</button>
            <button onClick={() => scrollToSection('contact')} className="font-orbitron text-white hover:text-secondary py-2 transition-colors text-left">Contact</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
