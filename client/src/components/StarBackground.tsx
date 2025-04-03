import { useEffect, useRef } from 'react';

interface StarProps {
  size: number;
  posX: number;
  posY: number;
  duration: number;
  delay: number;
  color: string;
}

const Star: React.FC<StarProps> = ({ size, posX, posY, duration, delay, color }) => {
  return (
    <div 
      className="absolute rounded-full pointer-events-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${posX}%`,
        top: `${posY}%`,
        backgroundColor: color,
        opacity: 0.2,
        animation: `twinkle ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    />
  );
};

export default function StarBackground() {
  const starsContainerRef = useRef<HTMLDivElement>(null);
  const starsCount = 300; // More stars for a denser space feel

  useEffect(() => {
    // Add CSS for the twinkle animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.3); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getStarColor = () => {
    // Generate realistic grayscale star colors - pure white to light gray
    const colors = [
      '#FFFFFF', // White
      '#F0F0F0', // Light gray
      '#E0E0E0', // Light gray
      '#D0D0D0', // Light gray
      '#C0C0C0', // Medium gray
      '#B0B0B0'  // Medium gray
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < starsCount; i++) {
      // Vary star sizes - most stars small, few larger
      const sizeFactor = Math.random();
      const size = sizeFactor < 0.85 ? 
                   Math.random() * 1.5 + 0.5 : // 85% smaller stars
                   Math.random() * 3 + 1.5;    // 15% larger stars
                   
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = Math.random() * 4 + 2;
      const delay = Math.random() * 5;
      const color = getStarColor();
      
      stars.push(
        <Star 
          key={i}
          size={size}
          posX={posX}
          posY={posY}
          duration={duration}
          delay={delay}
          color={color}
        />
      );
    }
    return stars;
  };

  return (
    <div 
      ref={starsContainerRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-black"
    >
      {generateStars()}
      {/* Add subtle nebula effect - in grayscale */}
      <div className="absolute w-full h-full opacity-20"
           style={{
             background: `
               radial-gradient(ellipse at 20% 20%, rgba(40, 40, 40, 0.1) 0%, transparent 70%),
               radial-gradient(ellipse at 80% 80%, rgba(50, 50, 50, 0.1) 0%, transparent 70%),
               radial-gradient(ellipse at 60% 30%, rgba(30, 30, 30, 0.08) 0%, transparent 70%),
               radial-gradient(ellipse at 40% 70%, rgba(35, 35, 35, 0.08) 0%, transparent 70%)
             `
           }}
      ></div>
    </div>
  );
}
