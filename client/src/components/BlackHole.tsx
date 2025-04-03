import { useRef, useEffect, useState } from 'react';

// Simplified BlackHole component without Three.js
export default function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const updateDimensions = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: container.clientHeight
          });
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = container.clientHeight;
        }
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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      distance: number;
    }> = [];

    // Create particles
    const createParticles = () => {
      particles = [];
      const particleCount = 1000;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 70 + Math.random() * 200;
        particles.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          size: Math.random() * 2 + 0.5,
          color: getParticleColor(distance),
          speed: 0.2 + Math.random() * 0.8,
          angle,
          distance
        });
      }
    };

    // Get particle color based on distance
    const getParticleColor = (distance: number) => {
      const hue = 270 - (distance / 300) * 80; // Range from purple to blue
      const saturation = 70 + (distance / 300) * 30; // More saturated closer to center
      const lightness = 50 + (distance / 300) * 20; // Brighter farther from center
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    // Animate the black hole
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw black hole core
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 5,
        centerX, centerY, 60
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.4, 'rgba(97, 55, 177, 0.8)');
      gradient.addColorStop(0.8, 'rgba(97, 55, 177, 0.2)');
      gradient.addColorStop(1, 'rgba(97, 55, 177, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw accretion disk
      const diskGradient = ctx.createRadialGradient(
        centerX, centerY, 70,
        centerX, centerY, 150
      );
      diskGradient.addColorStop(0, 'rgba(97, 55, 177, 0.5)');
      diskGradient.addColorStop(0.5, 'rgba(78, 175, 225, 0.3)');
      diskGradient.addColorStop(1, 'rgba(78, 175, 225, 0)');

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(performance.now() * 0.0001);
      ctx.beginPath();
      ctx.ellipse(0, 0, 150, 30, 0, 0, Math.PI * 2);
      ctx.fillStyle = diskGradient;
      ctx.fill();
      ctx.restore();

      // Draw and update particles
      particles.forEach((particle, index) => {
        // Calculate vector to center
        const dx = centerX - particle.x;
        const dy = centerY - particle.y;
        const distToCenter = Math.sqrt(dx * dx + dy * dy);
        
        // Update particle position (spiral toward center)
        const gravitationalPull = 100 / Math.max(distToCenter, 10);
        particle.x += (dx / distToCenter) * gravitationalPull * 0.05;
        particle.y += (dy / distToCenter) * gravitationalPull * 0.05;
        
        // Rotate around center
        const rotationSpeed = 0.005 * (200 / Math.max(distToCenter, 10));
        const newAngle = Math.atan2(particle.y - centerY, particle.x - centerX) + rotationSpeed;
        const newDist = distToCenter * 0.999; // Slowly move inward
        
        particle.x = centerX + Math.cos(newAngle) * newDist;
        particle.y = centerY + Math.sin(newAngle) * newDist;
        
        // Reset particle if too close to center
        if (distToCenter < 20) {
          const newAngle = Math.random() * Math.PI * 2;
          const newDistance = 200 + Math.random() * 100;
          particle.x = centerX + Math.cos(newAngle) * newDistance;
          particle.y = centerY + Math.sin(newAngle) * newDistance;
          particle.color = getParticleColor(newDistance);
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions]);

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}
