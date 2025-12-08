import { useState, useRef, type MouseEvent } from "react";
import { X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageZoom = ({ src, alt, className = "" }: ImageZoomProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setZoomPosition({ x: 50, y: 50 });
  };

  return (
    <>
      {/* Main Image with Zoom Trigger */}
      <div
        ref={imageRef}
        className={`relative group cursor-zoom-in ${className}`}
        onClick={() => setIsZoomed(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-testid="image-zoom-trigger"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          data-testid="image-zoom-preview"
        />

        {/* Zoom Icon Overlay */}
        <div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center"
          data-testid="image-zoom-overlay"
        >
          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg"
            data-testid="image-zoom-icon"
          >
            <ZoomIn className="w-6 h-6 text-gray-900" />
          </div>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
            data-testid="image-zoom-modal"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
              data-testid="image-zoom-close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoomed Image Container */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
              data-testid="image-zoom-container"
            >
              <div
                className="relative w-full h-full overflow-hidden cursor-move"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                data-testid="image-zoom-wrapper"
              >
                <motion.img
                  src={src}
                  alt={alt}
                  className="w-full h-full object-contain"
                  style={{
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                  animate={{
                    scale: 2,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  data-testid="image-zoom-fullscreen"
                />
              </div>

              {/* Instructions */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm"
                data-testid="image-zoom-instructions"
              >
                Move mouse to pan • Click to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageZoom;
