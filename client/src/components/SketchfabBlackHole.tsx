import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SketchfabEmbedProps {
  modelId: string;
  autoplay?: boolean;
  ui_infos?: 0 | 1;
  ui_controls?: 0 | 1;
  ui_stop?: 0 | 1;
  transparent?: 0 | 1;
  autoRotate?: 0 | 1;
  annotations_visible?: 0 | 1;
}

export default function SketchfabBlackHole() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  
  // Sketchfab model ID for the black hole
  // This is from the URL you provided: https://sketchfab.com/3d-models/blackhole-74cbeaeae2174a218fe9455d77902b5c
  const modelId = "74cbeaeae2174a218fe9455d77902b5c";
  
  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const json = JSON.parse(event.data);
        if (json.type === 'LOAD_PROGRESS') {
          // Update loading progress
          const progress = json.progress * 100;
          console.log(`Loading: ${progress.toFixed(2)}%`);
        } else if (json.type === 'VIEWER_READY') {
          setIsLoaded(true);
          console.log('Model loaded');
        }
      } catch (e) {
        // Not a JSON message or not from Sketchfab
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  // Embed parameters
  const embedParams: SketchfabEmbedProps = {
    modelId,
    autoplay: true,
    ui_infos: 0,      // Hide model info
    ui_controls: 0,   // Hide controls
    ui_stop: 0,       // Hide stop button
    transparent: 1,   // Transparent background
    autoRotate: isRotating ? 1 : 0,  // Auto-rotate based on state
    annotations_visible: 0  // Hide annotations
  };
  
  // Generate URL with parameters
  const generateUrl = () => {
    let url = `https://sketchfab.com/models/${embedParams.modelId}/embed`;
    
    // Convert params to URL query string
    const params = Object.entries(embedParams)
      .filter(([key]) => key !== 'modelId')
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    return `${url}?${params}`;
  };
  
  // Handle mouse interactions for zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!isLoaded) return;
    
    // Adjust zoom level based on wheel direction
    const newZoom = e.deltaY < 0 
      ? Math.min(zoom + 0.1, 2) // Zoom in, max 2x
      : Math.max(zoom - 0.1, 0.5); // Zoom out, min 0.5x
    
    setZoom(newZoom);
    
    // If we have access to the iframe's API, we can control the camera
    if (iframeRef.current) {
      // Send message to iframe to adjust camera - this depends on Sketchfab API
      try {
        const message = {
          type: 'CAMERA_ZOOM',
          value: newZoom
        };
        iframeRef.current.contentWindow?.postMessage(JSON.stringify(message), '*');
      } catch (e) {
        console.error('Error sending zoom message to iframe', e);
      }
    }
  };
  
  // Handle rotation with mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isLoaded) return;
    
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    
    // Pause auto-rotation when manually rotating
    setIsRotating(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isLoaded) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    const newRotationY = rotationY + deltaX * 0.01;
    const newRotationX = rotationX + deltaY * 0.01;
    
    setRotationY(newRotationY);
    setRotationX(newRotationX);
    
    // Send rotation to iframe
    if (iframeRef.current) {
      try {
        const message = {
          type: 'CAMERA_ROTATION',
          value: { x: newRotationX, y: newRotationY }
        };
        iframeRef.current.contentWindow?.postMessage(JSON.stringify(message), '*');
      } catch (e) {
        console.error('Error sending rotation message to iframe', e);
      }
    }
    
    setStartX(e.clientX);
    setStartY(e.clientY);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Mouse leave handler
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  // Toggle auto-rotation
  const toggleRotation = () => {
    setIsRotating(!isRotating);
    
    // Send command to iframe
    if (iframeRef.current) {
      try {
        const message = {
          type: 'TOGGLE_AUTOROTATE',
          value: !isRotating
        };
        iframeRef.current.contentWindow?.postMessage(JSON.stringify(message), '*');
      } catch (e) {
        console.error('Error sending rotation toggle message to iframe', e);
      }
    }
  };
  
  // Reset camera position
  const resetCamera = () => {
    setZoom(1);
    setRotationX(0);
    setRotationY(0);
    
    // Send reset command to iframe
    if (iframeRef.current) {
      try {
        const message = {
          type: 'RESET_CAMERA'
        };
        iframeRef.current.contentWindow?.postMessage(JSON.stringify(message), '*');
      } catch (e) {
        console.error('Error sending camera reset message to iframe', e);
      }
    }
  };

  return (
    <section id="sketchfab-blackhole" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="font-orbitron text-4xl font-bold mb-3 inline-block text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Experience Our <span className="silver-shine">3D Black Hole</span> Model
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
            Interact with our scientifically accurate 3D black hole - scroll to zoom, drag to rotate
          </motion.p>
        </div>
        
        <motion.div 
          className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-2xl h-[600px] relative orange-glow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <iframe
            ref={iframeRef}
            title="Sketchfab Black Hole Model"
            src={generateUrl()}
            width="100%"
            height="100%"
            allowFullScreen
            allow="autoplay; xr-spatial-tracking"
            className="border-0"
          ></iframe>
          
          {/* Loading overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white font-orbitron">Loading 3D Model...</p>
              </div>
            </div>
          )}
          
          {/* Controls overlay */}
          <div className="absolute bottom-4 right-4 flex space-x-3">
            <button 
              onClick={toggleRotation}
              className="bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70 transition"
              title={isRotating ? "Pause Rotation" : "Resume Rotation"}
            >
              {isRotating ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={resetCamera}
              className="bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70 transition"
              title="Reset View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center mt-8 space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-white max-w-2xl mx-auto">
            This 3D visualization shows the gravitational lensing effect and accretion disk of a 
            black hole, accurately representing the physics discovered by the scientific community.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6 max-w-2xl mx-auto">
            <div className="bg-black bg-opacity-30 p-3 rounded-lg">
              <h3 className="text-white font-medium mb-1">Interact:</h3>
              <p className="text-gray-300 text-sm">Scroll to zoom, drag to rotate</p>
            </div>
            
            <div className="bg-black bg-opacity-30 p-3 rounded-lg">
              <h3 className="text-white font-medium mb-1">Auto-Rotate:</h3>
              <p className="text-gray-300 text-sm">Toggle with the play/pause button</p>
            </div>
            
            <div className="bg-black bg-opacity-30 p-3 rounded-lg">
              <h3 className="text-white font-medium mb-1">Reset View:</h3>
              <p className="text-gray-300 text-sm">Click the reset button to restore default view</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}