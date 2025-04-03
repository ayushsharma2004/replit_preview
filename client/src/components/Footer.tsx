export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="py-12 border-t border-primary border-opacity-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="relative mr-2">
                <div className="w-6 h-6 bg-primary rounded-full opacity-80"></div>
                <div className="absolute inset-0 bg-secondary rounded-full opacity-50 animate-pulse"></div>
              </div>
              <span className="font-orbitron text-lg font-bold tracking-wider text-gradient">SPACE MARVEL</span>
            </div>
            <p className="mb-6 max-w-md">
              Pioneering the cosmic frontier of artificial intelligence with innovative solutions that transform businesses and industries.
            </p>
            <p className="text-sm text-white text-opacity-60">
              &copy; {new Date().getFullYear()} Space Marvel. All rights reserved.
            </p>
          </div>
          
          <div>
            <h4 className="font-orbitron text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('home')} className="hover:text-secondary transition-colors">Home</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-secondary transition-colors">About</button></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-secondary transition-colors">Services</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-secondary transition-colors">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-orbitron text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
