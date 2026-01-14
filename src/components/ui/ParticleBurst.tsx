import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface ParticleBurstProps {
  isActive: boolean;
  children: ReactNode;
  particleCount?: number;
  particleColor?: string;
  burstRadius?: number;
}

export default function ParticleBurst({
  isActive,
  children,
  particleCount = 12,
  particleColor = "#ff1744",
  burstRadius = 100,
}: ParticleBurstProps) {
  const particles: Particle[] = Array.from(
    { length: particleCount },
    (_, i) => ({
      id: i,
      x: Math.cos((i / particleCount) * Math.PI * 2) * burstRadius,
      y: Math.sin((i / particleCount) * Math.PI * 2) * burstRadius,
      delay: i * 0.02,
    }),
  );

  return (
    <motion.div className="relative inline-block">
      {/* Main content */}
      {children}

      {/* Particle burst effect */}
      <AnimatePresence>
        {isActive &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="pointer-events-none fixed rounded-full"
              style={{
                width: 8,
                height: 8,
                backgroundColor: particleColor,
                left: 0,
                top: 0,
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 0.8,
                delay: particle.delay,
                ease: "easeOut",
              }}
              onAnimationComplete={() => {
                // Cleanup handled by AnimatePresence
              }}
            />
          ))}
      </AnimatePresence>

      {/* Glow flash effect */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: `0 0 20px ${particleColor}`,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
