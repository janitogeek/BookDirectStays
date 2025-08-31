/**
 * Animated Page Component
 * 
 * Provides smooth page transitions and content animations
 * for all pages in BookDirectStays
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, containerVariants } from '@/lib/animations';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
  key?: string;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ 
  children, 
  className = "",
  key 
}) => {
  return (
    <motion.div
      key={key}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`min-h-screen ${className}`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export const AnimatedContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerChildren?: boolean;
}> = ({ children, className = "", staggerChildren = true }) => {
  const variants = staggerChildren ? containerVariants : {};
  
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;




