import StarBackground from '@/components/StarBackground';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import CTA from '@/components/CTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <StarBackground />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <CTA />
      <Contact />
      <Footer />
    </div>
  );
}
