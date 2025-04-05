import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="font-orbitron text-4xl font-bold mb-3 inline-block text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            About <span className="silver-shine">Space Marvel</span>
          </motion.h2>
          <motion.div 
            className="h-1 w-20 bg-white mx-auto rounded"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          ></motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-orbitron text-2xl font-semibold mb-4 silver-shine">Venturing Beyond Conventional AI</h3>
            <p className="mb-6 text-lg leading-relaxed text-white">
              At Space Marvel, we explore the uncharted territories of artificial intelligence, much like astronomers probe the mysteries of black holes and distant galaxies.
            </p>
            <p className="mb-6 text-lg leading-relaxed text-white">
              Founded by a team of AI researchers and space enthusiasts, we combine cutting-edge technology with cosmic inspiration to deliver solutions that transform businesses across industries.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-white">
              Our mission is to harness the infinite possibilities of AI, creating technologies that seem like marvels from a distant future.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-orbitron text-white">Innovation-Driven</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="font-orbitron text-white">AI Excellence</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="font-orbitron text-white">Collaborative</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 md:order-2 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 z-10"></div>
              <img src="https://images.unsplash.com/photo-1511500118080-275313ec90a1" alt="Team working on AI solutions" className="w-full h-full object-cover rounded-lg" />
              <div className="absolute top-0 left-0 w-full h-full bg-space-black opacity-30"></div>
            </div>
            <motion.div 
              className="absolute -top-8 -right-8 w-24 h-24 bg-primary rounded-full opacity-20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary rounded-full opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
