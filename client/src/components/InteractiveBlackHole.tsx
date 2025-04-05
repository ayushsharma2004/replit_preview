import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Extended particle type with physics properties
interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  distance: number;
  originalDistance: number;
  // New physics properties
  velocityX: number;
  velocityY: number;
  mass: number;
  trailPoints: Array<{x: number, y: number, age: number}>; // For better particle trails
  energy: number; // Energy level affects particle behavior
  zPosition: number; // Z-axis position for 3D-like effect
}

// Vector utility for physics calculations
class Vector2D {
  x: number;
  y: number;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  normalize(): Vector2D {
    const len = this.length();
    if (len === 0) return new Vector2D(0, 0);
    return new Vector2D(this.x / len, this.y / len);
  }
  
  multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }
  
  add(vector: Vector2D): Vector2D {
    return new Vector2D(this.x + vector.x, this.y + vector.y);
  }
  
  subtract(vector: Vector2D): Vector2D {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
  }
}

export default function InteractiveBlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prevMousePosition, setPrevMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false);
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  // Physics constants - updated for the Interstellar-style black hole look
  const GRAVITATIONAL_CONSTANT = 0.0007; // Increased for stronger gravity
  const BLACK_HOLE_MASS = 15000; // Increased mass
  const EVENT_HORIZON_RADIUS = 40; // Larger event horizon
  const ACCRETION_DISK_INNER_RADIUS = 50; // Larger inner radius
  const ACCRETION_DISK_OUTER_RADIUS = 220; // Larger outer radius
  const DISK_THICKNESS_RATIO = 0.12; // Thinner disk like in the image
  
  // Animation parameters that can be controlled
  const [accretionDiskRotationSpeed, setAccretionDiskRotationSpeed] = useState(0.00008);
  const [gravitationalStrength, setGravitationalStrength] = useState(150);
  const [particleCount, setParticleCount] = useState(2500); // More particles for better effect
  const [timeScale, setTimeScale] = useState(1.0);
  
  // Physics simulation parameters
  const [spacetimeDistortion, setSpacetimeDistortion] = useState(0);
  const lastFrameTimeRef = useRef<number>(0);
  const deltaTimeRef = useRef<number>(0);
  const mouseForceMultiplierRef = useRef<number>(1.0);
  
  // Small planet (like in the Interstellar image)
  const hasPlanet = true;
  const planetRef = useRef({
    x: 0,
    y: 0,
    radius: 8,
    orbitRadius: 280,
    orbitSpeed: 0.00005,
    orbitAngle: Math.random() * Math.PI * 2
  });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const updateDimensions = () => {
      if (canvasRef.current && containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth,
          height: clientHeight
        });
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
        
        // Initialize mouse position to center when dimensions change
        setMousePosition({
          x: clientWidth / 2,
          y: clientHeight / 2
        });
        setPrevMousePosition({
          x: clientWidth / 2,
          y: clientHeight / 2
        });
      }
    };

    // Initial update
    updateDimensions();

    // Update on resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // Mouse event handlers with enhanced physics
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate mouse velocity for momentum effects
      const newVelocity = {
        x: x - mousePosition.x,
        y: y - mousePosition.y
      };
      
      setPrevMousePosition({ ...mousePosition });
      setMousePosition({ x, y });
      setMouseVelocity(newVelocity);
      
      // Scale mouse force based on velocity magnitude
      const velocityMagnitude = Math.sqrt(newVelocity.x * newVelocity.x + newVelocity.y * newVelocity.y);
      mouseForceMultiplierRef.current = Math.min(3.0, 1.0 + velocityMagnitude * 0.05);
      
      // Simulate spacetime distortion when mouse moves fast
      if (velocityMagnitude > 10) {
        setSpacetimeDistortion(Math.min(1.0, spacetimeDistortion + 0.05));
      } else {
        setSpacetimeDistortion(Math.max(0, spacetimeDistortion - 0.02));
      }
    };
    
    const handleMouseEnter = () => {
      setIsMouseInCanvas(true);
    };
    
    const handleMouseLeave = () => {
      setIsMouseInCanvas(false);
      // Return to center when mouse leaves, with gradual transition
      setPrevMousePosition({ ...mousePosition });
      setMousePosition({
        x: canvas.width / 2,
        y: canvas.height / 2
      });
      setMouseVelocity({ x: 0, y: 0 });
      mouseForceMultiplierRef.current = 1.0;
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        setIsMouseDown(true);
        // Increase gravitational pull when mouse is down
        mouseForceMultiplierRef.current = 2.5;
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        setIsMouseDown(false);
        // Release gravitational pull
        mouseForceMultiplierRef.current = 1.0;
      }
    };
    
    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      // Clean up listeners
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mousePosition, spacetimeDistortion]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Track performance time for delta time calculation
    let lastTime = performance.now();
    
    // Create particles with enhanced physics properties
    const createParticles = () => {
      particles = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = ACCRETION_DISK_INNER_RADIUS + Math.random() * (ACCRETION_DISK_OUTER_RADIUS - ACCRETION_DISK_INNER_RADIUS);
        
        // Z-position for 3D effect (distribution along accretion disk thickness)
        // Most particles should be near z=0 (the disk plane)
        const zDistribution = Math.random();
        let zPosition;
        if (zDistribution < 0.8) {
          // 80% of particles close to disk plane
          zPosition = (Math.random() - 0.5) * DISK_THICKNESS_RATIO * distance * 0.5;
        } else {
          // 20% particles spread further from disk plane
          zPosition = (Math.random() - 0.5) * DISK_THICKNESS_RATIO * distance;
        }
        
        // Initial orbital velocity (perpendicular to radius)
        const orbitalSpeed = 0.5 + Math.random() * 1.5;
        const initialVelocityX = Math.sin(angle) * orbitalSpeed;
        const initialVelocityY = -Math.cos(angle) * orbitalSpeed;
        
        // Random mass affects gravitational attraction
        const mass = 0.1 + Math.random() * 0.9;
        
        // Calculate heat based on distance (closer = hotter)
        const heatFactor = 1 - (distance - ACCRETION_DISK_INNER_RADIUS) / 
          (ACCRETION_DISK_OUTER_RADIUS - ACCRETION_DISK_INNER_RADIUS);
        
        particles.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          size: Math.random() * 2 + 0.5,
          color: getParticleColor(distance, heatFactor, mass),
          speed: 0.2 + Math.random() * 0.8,
          angle,
          distance,
          originalDistance: distance,
          // New physics properties
          velocityX: initialVelocityX,
          velocityY: initialVelocityY,
          mass,
          trailPoints: [], // Will store points for drawing trails
          energy: heatFactor, // Initial energy level based on heat/distance
          zPosition
        });
      }
    };

    // Enhanced particle color with realistic interstellar black hole colors
    const getParticleColor = (distance: number, heatFactor: number, mass: number = 1) => {
      // Replicate the orange-reddish glow seen in Interstellar black hole
      if (distance < EVENT_HORIZON_RADIUS * 1.5) {
        // Near the event horizon - hot particles
        return `rgb(30, 30, 30)`;
      } else if (distance < ACCRETION_DISK_INNER_RADIUS * 1.2) {
        // Inner accretion disk - white-hot
        const whiteness = 180 + mass * 75;
        return `rgb(${whiteness}, ${whiteness * 0.95}, ${whiteness * 0.8})`;
      } else if (distance < ACCRETION_DISK_INNER_RADIUS * 1.8) {
        // Middle accretion disk - yellow-white
        const intensity = 150 + mass * 70 * heatFactor;
        return `rgb(${intensity}, ${intensity * 0.9}, ${intensity * 0.6})`;
      } else if (distance < ACCRETION_DISK_OUTER_RADIUS * 0.7) {
        // Outer middle accretion disk - orange
        const red = 140 + mass * 80 * heatFactor;
        const green = 70 + mass * 50 * heatFactor;
        const blue = 20 + mass * 30 * heatFactor;
        return `rgb(${red}, ${green}, ${blue})`;
      } else {
        // Outer accretion disk - reddish
        const red = 100 + mass * 60 * heatFactor;
        const green = 30 + mass * 30 * heatFactor;
        const blue = 10 + mass * 20 * heatFactor;
        return `rgb(${red}, ${green}, ${blue})`;
      }
    };
    
    // Draw the event horizon with realistic lensing effects
    const drawEventHorizon = (coreX: number, coreY: number, mouseInfluence: number) => {
      // Event horizon - pure black
      ctx.beginPath();
      ctx.arc(coreX, coreY, EVENT_HORIZON_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fill();
      
      // Draw gravitational lensing effect
      const lensGradient = ctx.createRadialGradient(
        coreX, coreY, EVENT_HORIZON_RADIUS,
        coreX, coreY, EVENT_HORIZON_RADIUS * 4
      );
      
      lensGradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      lensGradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.5)');
      lensGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
      lensGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(coreX, coreY, EVENT_HORIZON_RADIUS * 4, 0, Math.PI * 2);
      ctx.fillStyle = lensGradient;
      ctx.fill();
    };
    
    // Draw accretion disk with enhanced physics-based appearance
    const drawAccretionDisk = (coreX: number, coreY: number, tiltX: number, tiltY: number, time: number) => {
      // Main disk glow - subtle background effect
      const diskGlow = ctx.createRadialGradient(
        coreX, coreY, ACCRETION_DISK_INNER_RADIUS,
        coreX, coreY, ACCRETION_DISK_OUTER_RADIUS
      );
      
      // Use colors matching the Interstellar black hole
      diskGlow.addColorStop(0, 'rgba(255, 200, 100, 0.1)');
      diskGlow.addColorStop(0.3, 'rgba(220, 130, 60, 0.07)');
      diskGlow.addColorStop(0.7, 'rgba(150, 60, 30, 0.05)');
      diskGlow.addColorStop(1, 'rgba(50, 20, 10, 0)');

      ctx.save();
      ctx.translate(coreX, coreY);
      
      // Base rotation
      ctx.rotate(time * accretionDiskRotationSpeed);
      
      // Apply perspective tilt effect
      const dynamicTiltX = tiltX * (1 + spacetimeDistortion * 0.3);
      const dynamicTiltY = tiltY * (1 + spacetimeDistortion * 0.2) - 0.3; // Default tilt to match image
      ctx.transform(1, dynamicTiltY, dynamicTiltX, 1, 0, 0);
      
      // Draw main glow
      ctx.beginPath();
      ctx.ellipse(0, 0, ACCRETION_DISK_OUTER_RADIUS, ACCRETION_DISK_OUTER_RADIUS * DISK_THICKNESS_RATIO, 0, 0, Math.PI * 2);
      ctx.fillStyle = diskGlow;
      ctx.fill();
      
      // Draw disk structure with thin rings
      const numRings = 8;
      for (let i = 0; i < numRings; i++) {
        const radius = ACCRETION_DISK_INNER_RADIUS + 
          (ACCRETION_DISK_OUTER_RADIUS - ACCRETION_DISK_INNER_RADIUS) * (i / numRings);
        
        // Vary the ring color based on distance
        const ringPosition = i / numRings;
        let ringColor;
        
        if (ringPosition < 0.2) {
          // Inner rings - bright white/yellow
          ringColor = `rgba(255, 250, 200, ${0.1 - i * 0.01})`;
        } else if (ringPosition < 0.5) {
          // Middle rings - orange
          ringColor = `rgba(255, 150, 50, ${0.08 - i * 0.008})`;
        } else {
          // Outer rings - reddish
          ringColor = `rgba(200, 70, 30, ${0.05 - i * 0.005})`;
        }
        
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * DISK_THICKNESS_RATIO, 0, 0, Math.PI * 2);
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 1.5 - i * 0.1;
        ctx.stroke();
      }
      
      ctx.restore();
    };
    
    // Draw the small planet like in the Interstellar image
    const drawPlanet = (coreX: number, coreY: number, time: number) => {
      if (!hasPlanet) return;
      
      const planet = planetRef.current;
      
      // Update planet position
      planet.orbitAngle += time * 0.00001; // Very slow orbit
      planet.x = coreX + Math.cos(planet.orbitAngle) * planet.orbitRadius;
      planet.y = coreY + Math.sin(planet.orbitAngle) * planet.orbitRadius * 0.3; // Elliptical orbit
      
      // Draw the planet
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#333';
      ctx.fill();
      
      // Add a subtle highlight
      ctx.beginPath();
      ctx.arc(planet.x - planet.radius * 0.3, planet.y - planet.radius * 0.3, 
              planet.radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
      ctx.fill();
    };

    // Animate the black hole with enhanced physics
    const animate = (time: number) => {
      // Calculate delta time for frame-rate independent physics
      const now = performance.now();
      const deltaTime = Math.min((now - lastTime) / 16.67, 2.0); // Cap at 2x normal if frame drop
      deltaTimeRef.current = deltaTime;
      lastTime = now;
      lastFrameTimeRef.current = time;
      
      // Clear canvas with trail effect - darker background for better contrast
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Default center is canvas center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Calculate mouse influence
      let mouseInfluenceX = 0;
      let mouseInfluenceY = 0;
      
      if (isMouseInCanvas) {
        mouseInfluenceX = (mousePosition.x - centerX) / centerX;
        mouseInfluenceY = (mousePosition.y - centerY) / centerY;
      }
      
      // Draw black hole core with slight displacement based on mouse gravity well
      const coreDisplacementFactor = isMouseDown ? 0.15 : 0.08;
      const coreX = centerX + (isMouseInCanvas ? mouseInfluenceX * centerX * coreDisplacementFactor : 0);
      const coreY = centerY + (isMouseInCanvas ? mouseInfluenceY * centerY * coreDisplacementFactor : 0);
      
      // Calculate overall mouse influence for effects
      const mouseInfluence = Math.sqrt(mouseInfluenceX * mouseInfluenceX + mouseInfluenceY * mouseInfluenceY);
      
      // Calculate tilt based on mouse position with momentum
      let tiltX = 0;
      let tiltY = 0;
      
      if (isMouseInCanvas) {
        // Base tilt on mouse position with momentum from velocity
        tiltX = mouseInfluenceX * 0.2 + mouseVelocity.x * 0.002;
        tiltY = mouseInfluenceY * 0.1 + mouseVelocity.y * 0.001;
      }
      
      // Draw accretion disk first (behind event horizon)
      drawAccretionDisk(coreX, coreY, tiltX, tiltY, time);
      
      // Sort particles by z-position to handle proper drawing order
      const sortedParticles = [...particles].sort((a, b) => a.zPosition - b.zPosition);
      
      // Update and draw particles with enhanced physics
      sortedParticles.forEach((particle) => {
        // Calculate vector from particle to black hole
        const toBlackHole = new Vector2D(coreX - particle.x, coreY - particle.y);
        const distToCore = toBlackHole.length();
        
        // Calculate vector from particle to mouse gravity well
        const toMouse = new Vector2D(
          isMouseInCanvas ? mousePosition.x - particle.x : 0,
          isMouseInCanvas ? mousePosition.y - particle.y : 0
        );
        const distToMouse = toMouse.length();
        
        // Universal gravitation formula: F = G * (m1 * m2) / r²
        const coreGravityForce = GRAVITATIONAL_CONSTANT * (BLACK_HOLE_MASS * particle.mass) / 
          Math.max(distToCore * distToCore, 100);
          
        // Apply force direction
        const coreGravityVector = toBlackHole.normalize().multiply(coreGravityForce * deltaTime);
        
        // Mouse gravity well (if mouse is in canvas)
        if (isMouseInCanvas) {
          const mouseGravityForce = GRAVITATIONAL_CONSTANT * 
            (gravitationalStrength * 50 * particle.mass * mouseForceMultiplierRef.current) / 
            Math.max(distToMouse * distToMouse, 100);
          
          const mouseGravityVector = toMouse.normalize().multiply(mouseGravityForce * deltaTime);
          
          // Add mouse gravity to velocity
          particle.velocityX += mouseGravityVector.x;
          particle.velocityY += mouseGravityVector.y;
        }
        
        // Add core gravity to velocity
        particle.velocityX += coreGravityVector.x;
        particle.velocityY += coreGravityVector.y;
        
        // Apply orbital correction to maintain stable accretion disk
        if (distToCore > EVENT_HORIZON_RADIUS * 2 && distToCore < ACCRETION_DISK_OUTER_RADIUS) {
          // Calculate current velocity perpendicular to radius vector (tangential)
          const velVector = new Vector2D(particle.velocityX, particle.velocityY);
          const radialDir = toBlackHole.normalize();
          
          // Dot product gives the radial component of velocity
          const radialVelocity = velVector.x * radialDir.x + velVector.y * radialDir.y;
          
          // Calculate correction to make orbit more circular (subtract radial component)
          const correctionFactor = 0.01 * deltaTime;
          particle.velocityX -= radialDir.x * radialVelocity * correctionFactor;
          particle.velocityY -= radialDir.y * radialVelocity * correctionFactor;
          
          // Add tangential velocity to maintain orbital speed
          const tangentialDir = new Vector2D(-radialDir.y, radialDir.x);
          const orbitalSpeed = Math.sqrt(coreGravityForce * distToCore) * 0.3;
          
          // Calculate current tangential velocity
          const currentTangentialVelocity = velVector.x * tangentialDir.x + velVector.y * tangentialDir.y;
          const tangentialCorrection = (orbitalSpeed - currentTangentialVelocity) * correctionFactor;
          
          particle.velocityX += tangentialDir.x * tangentialCorrection;
          particle.velocityY += tangentialDir.y * tangentialCorrection;
        }
        
        // Apply slight drag/friction in accretion disk
        if (distToCore < ACCRETION_DISK_OUTER_RADIUS) {
          const drag = 0.005 * deltaTime;
          particle.velocityX *= (1 - drag);
          particle.velocityY *= (1 - drag);
        }
        
        // Special effects near event horizon - particles accelerate and stretch
        if (distToCore < EVENT_HORIZON_RADIUS * 2) {
          // Speed up particles near the event horizon
          const accelerationFactor = 1 + (1 - distToCore / (EVENT_HORIZON_RADIUS * 2)) * 2;
          particle.velocityX *= accelerationFactor;
          particle.velocityY *= accelerationFactor;
          
          // Increase energy/heat as particles approach horizon
          particle.energy = Math.min(1.0, particle.energy + 0.05 * deltaTime);
        } else {
          // Cool down particles away from the horizon
          particle.energy = Math.max(0.1, particle.energy - 0.01 * deltaTime);
        }
        
        // Apply velocity to position with time dilation
        // Time runs slower near the event horizon
        const timeDilation = distToCore < EVENT_HORIZON_RADIUS * 3 
          ? 1 - (1 - distToCore / (EVENT_HORIZON_RADIUS * 3)) * 0.7 
          : 1;
          
        particle.x += particle.velocityX * deltaTime * timeDilation;
        particle.y += particle.velocityY * deltaTime * timeDilation;
        
        // Add point to trail
        if (Math.random() < 0.2) { // Only add some points to save performance
          particle.trailPoints.push({
            x: particle.x,
            y: particle.y,
            age: 0
          });
        }
        
        // Limit trail length
        if (particle.trailPoints.length > 10) {
          particle.trailPoints.shift();
        }
        
        // Age trail points
        particle.trailPoints.forEach(point => {
          point.age += deltaTime;
        });
        
        // Remove old trail points
        particle.trailPoints = particle.trailPoints.filter(point => point.age < 10);
        
        // Reset particle if consumed by black hole or flew too far away
        if (distToCore < EVENT_HORIZON_RADIUS * 0.8 || distToCore > ACCRETION_DISK_OUTER_RADIUS * 3) {
          // Create new particle at random location in the accretion disk
          const newAngle = Math.random() * Math.PI * 2;
          const newDistance = ACCRETION_DISK_INNER_RADIUS + 
            Math.random() * (ACCRETION_DISK_OUTER_RADIUS - ACCRETION_DISK_INNER_RADIUS);
            
          // Z-position for 3D effect
          const zDistribution = Math.random();
          let zPosition;
          if (zDistribution < 0.8) {
            // 80% of particles close to disk plane
            zPosition = (Math.random() - 0.5) * DISK_THICKNESS_RATIO * newDistance * 0.5;
          } else {
            // 20% particles spread further from disk plane
            zPosition = (Math.random() - 0.5) * DISK_THICKNESS_RATIO * newDistance;
          }
          
          particle.x = coreX + Math.cos(newAngle) * newDistance;
          particle.y = coreY + Math.sin(newAngle) * newDistance;
          particle.zPosition = zPosition;
          
          // Give it proper orbital velocity
          const orbitalSpeed = Math.sqrt(GRAVITATIONAL_CONSTANT * BLACK_HOLE_MASS / newDistance) * 0.5;
          particle.velocityX = Math.sin(newAngle) * orbitalSpeed;
          particle.velocityY = -Math.cos(newAngle) * orbitalSpeed;
          
          // Reset other properties
          particle.mass = 0.1 + Math.random() * 0.9;
          const heatFactor = 1 - (newDistance - ACCRETION_DISK_INNER_RADIUS) / 
            (ACCRETION_DISK_OUTER_RADIUS - ACCRETION_DISK_INNER_RADIUS);
          particle.color = getParticleColor(newDistance, heatFactor, particle.mass);
          particle.energy = heatFactor;
          particle.trailPoints = [];
        }
        
        // Draw particle trails first (under the particles)
        if (particle.trailPoints.length > 1) {
          ctx.beginPath();
          ctx.moveTo(particle.trailPoints[0].x, particle.trailPoints[0].y);
          
          for (let i = 1; i < particle.trailPoints.length; i++) {
            ctx.lineTo(particle.trailPoints[i].x, particle.trailPoints[i].y);
          }
          
          // Connect to current position
          ctx.lineTo(particle.x, particle.y);
          
          // Set trail style based on particle speed and energy
          const speed = Math.sqrt(particle.velocityX * particle.velocityX + particle.velocityY * particle.velocityY);
          const trailOpacity = Math.min(0.3, speed * 0.05);
          
          // Parse the RGB values from the color string to make glowing trails
          const rgbMatch = particle.color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
          if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${trailOpacity})`;
            ctx.lineWidth = particle.size * 0.5 * (1 - Math.abs(particle.zPosition) * 0.5);
            ctx.stroke();
          }
        }
        
        // Draw particle with size influenced by speed and energy
        const particleSpeed = Math.sqrt(particle.velocityX * particle.velocityX + particle.velocityY * particle.velocityY);
        
        // Compute size adjustment based on z-position (3D effect)
        const zFactor = 1 - Math.abs(particle.zPosition) * 0.5;
        
        // Stretch particles based on velocity (directional stretching)
        if (particleSpeed > 1) {
          const stretchFactor = Math.min(5, 1 + particleSpeed * 0.5);
          const angle = Math.atan2(particle.velocityY, particle.velocityX);
          
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(angle);
          
          // Draw stretched particle
          ctx.beginPath();
          ctx.ellipse(0, 0, particle.size * stretchFactor * zFactor, 
                     particle.size * zFactor, 0, 0, Math.PI * 2);
          
          // Parse the RGB values to create energy-affected color
          const rgbMatch = particle.color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
          if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            
            // Boost color based on energy
            const energyFactor = 1 + particle.energy;
            const energyR = Math.min(255, r * energyFactor);
            const energyG = Math.min(255, g * energyFactor);
            const energyB = Math.min(255, b * energyFactor);
            
            ctx.fillStyle = `rgb(${energyR}, ${energyG}, ${energyB})`;
            ctx.fill();
          } else {
            // Fallback
            ctx.fillStyle = particle.color;
            ctx.fill();
          }
          
          ctx.restore();
        } else {
          // Draw normal particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * (1 + particle.energy * 0.5) * zFactor, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
        }
      });
      
      // Draw planet
      drawPlanet(coreX, coreY, time);
      
      // Draw the event horizon last (foreground)
      drawEventHorizon(coreX, coreY, mouseInfluence);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    createParticles();
    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, mousePosition, prevMousePosition, mouseVelocity, isMouseInCanvas, isMouseDown, gravitationalStrength, accretionDiskRotationSpeed, particleCount, spacetimeDistortion, timeScale, 
      GRAVITATIONAL_CONSTANT, BLACK_HOLE_MASS, EVENT_HORIZON_RADIUS, ACCRETION_DISK_INNER_RADIUS, ACCRETION_DISK_OUTER_RADIUS, DISK_THICKNESS_RATIO]);

  return (
    <section id="interactive-blackhole" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="font-orbitron text-4xl font-bold mb-3 inline-block text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Explore Our <span className="silver-shine">Interactive</span> Black Hole
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
            Experience gravitational physics: move your cursor to create a gravity well, and click to intensify the force
          </motion.p>
        </div>
        
        <motion.div 
          className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-2xl h-[600px] relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          ref={containerRef}
        >
          {/* Black hole canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
          
          {/* Overlay instructions */}
          {!isMouseInCanvas && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                className="bg-black bg-opacity-40 p-6 rounded-lg text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <p className="text-white font-orbitron text-xl mb-2">Move Your Cursor</p>
                <p className="text-gray-300">to interact with the black hole</p>
                <p className="text-gray-400 mt-2 text-sm">Click and hold to increase gravitational pull</p>
              </motion.div>
            </div>
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
            This visualization replicates the iconic black hole from Interstellar.
            Just as our AI solutions harness and control complex technological forces, 
            you can influence the behavior of this simulated cosmic phenomenon.
          </p>
        </motion.div>
      </div>
    </section>
  );
}