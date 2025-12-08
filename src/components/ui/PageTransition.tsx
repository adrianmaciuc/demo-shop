import { motion } from "framer-motion";
import { useEffect } from "react";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{
        duration: 0.35,
        ease: "easeInOut",
      }}
      data-testid="page-transition"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
