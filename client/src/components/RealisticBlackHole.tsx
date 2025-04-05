import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
  angle: number;
  radius: number;
  orbitSpeed: number;
  orbitOffset: number;
  depth: number;
  color: string;
  trail: {x: number, y: number, age: number}[];
}

export default function RealisticBlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [viewAngle, setViewAngle] = useState(35); // Perspective angle in degrees
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Black hole physics constants
  const EVENT_HORIZON_RADIUS = 30;
  const ACCRETION_DISK_INNER = 45;
  const ACCRETION_DISK_OUTER = 180;
  const DISK_THICKNESS = 0.12; // Thinner disk ratio
  const ROTATION_SPEED = 0.0001;
  const PARTICLE_COUNT = 3000;
  
  // Planet reference (like in the Interstellar image)
  const planetRef = useRef({
    x: 0,
    y: 0,
    z: 20,
    radius: 8,
    distance: 270,
    orbitSpeed: 0.00002,
    angle: Math.random() * Math.PI * 2
  });

  // Initialize canvas and resize handler
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        
        setDimensions({
          width: clientWidth,
          height: clientHeight
        });
        
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
      }
    };
    
    updateDimensions();
    
    // Initialize particles
    initializeParticles();
    
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Initialize accretion disk particles
  const initializeParticles = () => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random orbit radius within accretion disk bounds
      const radius = ACCRETION_DISK_INNER + Math.random() * (ACCRETION_DISK_OUTER - ACCRETION_DISK_INNER);
      
      // Distribution of particles, with most concentrated in the middle
      const diskPosition = (radius - ACCRETION_DISK_INNER) / (ACCRETION_DISK_OUTER - ACCRETION_DISK_INNER);
      
      // Angle around the disk
      const angle = Math.random() * Math.PI * 2;
      
      // Z-position (height above/below disk plane) with most near the central plane
      let z;
      const heightDistribution = Math.random();
      
      if (heightDistribution < 0.7) {
        // 70% of particles very close to disk plane
        z = (Math.random() - 0.5) * DISK_THICKNESS * radius * 0.2;
      } else if (heightDistribution < 0.9) {
        // 20% slightly further from plane
        z = (Math.random() - 0.5) * DISK_THICKNESS * radius * 0.5;
      } else {
        // 10% can extend farther from plane
        z = (Math.random() - 0.5) * DISK_THICKNESS * radius;
      }
      
      // Orbit speed (Keplerian velocity - faster when closer to center)
      const orbitSpeed = 0.0004 * Math.pow(radius, -0.5);
      
      // Particle brightness and size based on position in disk
      let brightness, size;
      let particleColor;
      
      if (diskPosition < 0.2) {
        // Inner accretion disk - very hot, bright white/yellow
        brightness = 0.7 + Math.random() * 0.3;
        size = 0.8 + Math.random() * 1.2;
        
        const whiteLevel = 180 + Math.random() * 75;
        particleColor = `rgb(${whiteLevel}, ${whiteLevel * 0.95}, ${whiteLevel * 0.8})`;
      } else if (diskPosition < 0.5) {
        // Middle disk - orange/yellow
        brightness = 0.6 + Math.random() * 0.3;
        size = 0.6 + Math.random() * 1.0;
        
        const r = 150 + Math.random() * 70;
        const g = 90 + Math.random() * 60;
        const b = 30 + Math.random() * 40;
        particleColor = `rgb(${r}, ${g}, ${b})`;
      } else {
        // Outer disk - reddish
        brightness = 0.4 + Math.random() * 0.3;
        size = 0.4 + Math.random() * 0.8;
        
        const r = 100 + Math.random() * 60;
        const g = 30 + Math.random() * 30;
        const b = 10 + Math.random() * 20;
        particleColor = `rgb(${r}, ${g}, ${b})`;
      }
      
      // Add slight orbital variation to create more natural pattern
      const orbitOffset = (Math.random() - 0.5) * 0.05;
      
      newParticles.push({
        x: 0, // Will be calculated in the render loop
        y: 0, // Will be calculated in the render loop
        z,
        size,
        brightness,
        angle,
        radius,
        orbitSpeed,
        orbitOffset,
        depth: 0, // Will be calculated in the render loop
        color: particleColor,
        trail: []
      });
    }
    
    setParticles(newParticles);
  };
  
  // Mouse event handlers
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      // Change view angle based on mouse position
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      
      // Calculate angle offset based on distance from center
      const xOffset = (e.clientX - rect.left - centerX) / centerX;
      const yOffset = (e.clientY - rect.top - centerY) / centerY;
      
      // Adjust the view angle with the mouse (limited range)
      const baseAngle = 35; // Base tilt angle
      const angleRangeX = 15; // How much the angle can change
      const angleRangeY = 10;
      
      setViewAngle(baseAngle + xOffset * angleRangeX - yOffset * angleRangeY);
    };
    
    const handleMouseEnter = () => {
      setIsMouseInCanvas(true);
    };
    
    const handleMouseLeave = () => {
      setIsMouseInCanvas(false);
      // Reset to default view angle gradually
      setViewAngle(35);
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dimensions]);
  
  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let lastTimestamp = 0;
    
    const render = (timestamp: number) => {
      // Calculate delta time for smooth animation
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate the center of the canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Increase global rotation over time
      setRotationAngle(prev => (prev + ROTATION_SPEED * deltaTime) % (Math.PI * 2));
      
      // Draw the glowing accretion disk (base layer)
      drawAccretionDiskGlow(ctx, centerX, centerY);
      
      // Calculate 3D positions and depths for all particles
      const updatedParticles = particles.map(particle => {
        // Update particle position based on orbit
        particle.angle += particle.orbitSpeed * deltaTime + particle.orbitOffset;
        
        // Calculate 3D coordinates (before perspective projection)
        const x3d = Math.cos(particle.angle + rotationAngle) * particle.radius;
        const y3d = Math.sin(particle.angle + rotationAngle) * particle.radius;
        const z3d = particle.z;
        
        // Apply perspective projection with dynamic view angle
        const angleRad = (viewAngle * Math.PI) / 180;
        const xProjected = x3d;
        const yProjected = y3d * Math.cos(angleRad) - z3d * Math.sin(angleRad);
        const zProjected = y3d * Math.sin(angleRad) + z3d * Math.cos(angleRad);
        
        // Apply perspective (objects further away appear smaller)
        const perspective = 800;
        const scale = perspective / (perspective + zProjected);
        
        // Final 2D screen coordinates
        const x2d = centerX + xProjected * scale;
        const y2d = centerY + yProjected * scale;
        
        // Update trail
        if (Math.random() < 0.2 && particle.brightness > 0.5) {
          particle.trail.push({
            x: x2d,
            y: y2d,
            age: 0
          });
          
          // Limit trail length
          if (particle.trail.length > 10) {
            particle.trail.shift();
          }
        }
        
        // Age trail points
        particle.trail.forEach(point => {
          point.age += 0.05;
        });
        
        // Remove old trail points
        particle.trail = particle.trail.filter(point => point.age < 1);
        
        return {
          ...particle,
          x: x2d,
          y: y2d,
          depth: zProjected // Depth for z-sorting
        };
      });
      
      // Sort particles by depth for correct rendering order
      updatedParticles.sort((a, b) => a.depth - b.depth);
      
      // Draw all particle trails first
      updatedParticles.forEach(particle => {
        drawParticleTrail(ctx, particle);
      });
      
      // Then draw all particles
      updatedParticles.forEach(particle => {
        drawParticle(ctx, particle);
      });
      
      // Update planet position (like in Interstellar)
      updateAndDrawPlanet(ctx, centerX, centerY, timestamp);
      
      // Draw the event horizon
      drawEventHorizon(ctx, centerX, centerY);
      
      // Draw gravitational lensing effect
      drawGravitationalLensing(ctx, centerX, centerY);
      
      // Continue animation loop
      requestRef.current = requestAnimationFrame(render);
    };
    
    requestRef.current = requestAnimationFrame(render);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [particles, rotationAngle, viewAngle]);
  
  // Draw functions
  const drawAccretionDiskGlow = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    // Create a gradient for the disk glow
    const diskGradient = ctx.createRadialGradient(
      centerX, centerY, ACCRETION_DISK_INNER,
      centerX, centerY, ACCRETION_DISK_OUTER
    );
    
    // Use warm colors like in the Interstellar black hole
    diskGradient.addColorStop(0, 'rgba(255, 200, 100, 0.03)');
    diskGradient.addColorStop(0.3, 'rgba(220, 130, 60, 0.02)');
    diskGradient.addColorStop(0.7, 'rgba(150, 60, 30, 0.01)');
    diskGradient.addColorStop(1, 'rgba(50, 20, 10, 0)');
    
    // Apply perspective to create elliptical appearance
    const angleRad = (viewAngle * Math.PI) / 180;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Apply perspective transform
    ctx.transform(1, 0, 0, Math.cos(angleRad), 0, 0);
    
    // Draw glow
    ctx.beginPath();
    ctx.arc(0, 0, ACCRETION_DISK_OUTER, 0, Math.PI * 2);
    ctx.fillStyle = diskGradient;
    ctx.fill();
    
    ctx.restore();
  };
  
  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    // Don't draw particles behind the black hole (simple occlusion)
    if (particle.depth < -EVENT_HORIZON_RADIUS) {
      return;
    }
    
    // Calculate size based on depth
    const scaledSize = particle.size * (1 + particle.brightness * 0.5);
    
    // Calculate brightness based on depth (fade with distance)
    const depthFade = Math.max(0, 1 - Math.abs(particle.depth) / 400);
    const finalBrightness = particle.brightness * depthFade;
    
    // Parse the RGB values from the color
    const rgbMatch = particle.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      
      // Apply brightness multiplier
      const actualColor = `rgba(${r}, ${g}, ${b}, ${finalBrightness})`;
      
      // Draw the particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, scaledSize, 0, Math.PI * 2);
      ctx.fillStyle = actualColor;
      ctx.fill();
      
      // Add glow for brighter particles
      if (finalBrightness > 0.6) {
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, scaledSize * 3
        );
        
        glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${finalBrightness * 0.4})`);
        glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, scaledSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }
    }
  };
  
  const drawParticleTrail = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    if (particle.trail.length < 2) return;
    
    // Parse the RGB values from the color
    const rgbMatch = particle.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      
      ctx.beginPath();
      ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
      
      // Draw trail with decreasing opacity based on age
      for (let i = 1; i < particle.trail.length; i++) {
        const point = particle.trail[i];
        ctx.lineTo(point.x, point.y);
      }
      
      // Connect to current position
      ctx.lineTo(particle.x, particle.y);
      
      // Create gradient along trail
      const gradient = ctx.createLinearGradient(
        particle.trail[0].x, particle.trail[0].y,
        particle.x, particle.y
      );
      
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${particle.brightness * 0.3})`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = particle.size * 0.5;
      ctx.stroke();
    }
  };
  
  const drawEventHorizon = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    // Draw the pure black event horizon
    ctx.beginPath();
    ctx.arc(centerX, centerY, EVENT_HORIZON_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fill();
  };
  
  const drawGravitationalLensing = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    // Create lensing effect with a gradient
    const lensGradient = ctx.createRadialGradient(
      centerX, centerY, EVENT_HORIZON_RADIUS,
      centerX, centerY, EVENT_HORIZON_RADIUS * 5
    );
    
    lensGradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    lensGradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.5)');
    lensGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    lensGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');
    lensGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, EVENT_HORIZON_RADIUS * 5, 0, Math.PI * 2);
    ctx.fillStyle = lensGradient;
    ctx.fill();
    
    // Add subtle light ring at event horizon edge (Einstein ring effect)
    const ringWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, EVENT_HORIZON_RADIUS + ringWidth/2, 0, Math.PI * 2);
    ctx.lineWidth = ringWidth;
    ctx.strokeStyle = 'rgba(255, 200, 120, 0.1)';
    ctx.stroke();
  };
  
  const updateAndDrawPlanet = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    timestamp: number
  ) => {
    const planet = planetRef.current;
    
    // Update planet position
    planet.angle += planet.orbitSpeed * timestamp;
    
    // Calculate 3D position with elliptical orbit
    const x3d = Math.cos(planet.angle) * planet.distance;
    const y3d = Math.sin(planet.angle) * planet.distance * 0.3; // Flattened for elliptical orbit
    
    // Apply the same perspective transformation as particles
    const angleRad = (viewAngle * Math.PI) / 180;
    const xProjected = x3d;
    const yProjected = y3d * Math.cos(angleRad) - planet.z * Math.sin(angleRad);
    const zProjected = y3d * Math.sin(angleRad) + planet.z * Math.cos(angleRad);
    
    // Apply perspective
    const perspective = 800;
    const scale = perspective / (perspective + zProjected);
    
    // Final 2D screen coordinates
    const x2d = centerX + xProjected * scale;
    const y2d = centerY + yProjected * scale;
    
    // Only draw if not behind black hole
    if (zProjected > -EVENT_HORIZON_RADIUS) {
      // Draw planet
      ctx.beginPath();
      ctx.arc(x2d, y2d, planet.radius * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#333';
      ctx.fill();
      
      // Add highlight to give it dimension
      ctx.beginPath();
      ctx.arc(
        x2d - planet.radius * 0.3 * scale,
        y2d - planet.radius * 0.3 * scale,
        planet.radius * 0.6 * scale,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
      ctx.fill();
    }
  };

  return (
    <section id="realistic-blackhole" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="font-orbitron text-4xl font-bold mb-3 inline-block text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The <span className="silver-shine">Interstellar</span> Black Hole
          </motion.h2>
          <motion.div 
            className="h-1 w-20 bg-white mx-auto rounded"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          ></motion.div>
          <motion.p 
            className="mt-4 max-w-2xl mx-auto text-lg text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Explore our scientifically accurate model of Gargantua, the famous black hole from Interstellar.
            Move your cursor to change the viewing angle.
          </motion.p>
        </div>
        
        <motion.div 
          className="max-w-5xl mx-auto rounded-lg shadow-2xl h-[600px] relative overflow-hidden orange-glow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          ref={containerRef}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-black"
          />
          
          {!isMouseInCanvas && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="bg-black bg-opacity-40 p-6 rounded-lg text-center">
                <p className="text-white font-orbitron text-xl mb-2">Move Your Cursor</p>
                <p className="text-gray-300">to change the viewing angle</p>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-white max-w-2xl mx-auto">
            This visualization replicates the iconic black hole from Christopher Nolan's Interstellar,
            using accurate physics models to simulate gravitational lensing and relativistic effects.
          </p>
        </motion.div>
      </div>
    </section>
  );
}