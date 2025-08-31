/**
 * Scroll Animation Hook
 * 
 * Provides smooth scroll-triggered animations for elements
 * entering and leaving the viewport
 */

import { useEffect, useRef } from 'react';
import { useAnimation, useInView } from 'framer-motion';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    delay = 0
  } = options;

  const ref = useRef(null);
  const isInView = useInView(ref, { 
    threshold,
    once: triggerOnce 
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        controls.start('visible');
      }, delay * 1000);
      
      return () => clearTimeout(timer);
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [isInView, controls, delay, triggerOnce]);

  return {
    ref,
    controls,
    isInView
  };
};

export const useStaggeredScrollAnimation = (itemCount: number, options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    delay = 0
  } = options;

  const ref = useRef(null);
  const isInView = useInView(ref, { 
    threshold,
    once: triggerOnce 
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        controls.start('visible');
      }, delay * 1000);
      
      return () => clearTimeout(timer);
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [isInView, controls, delay, triggerOnce]);

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return {
    ref,
    controls,
    isInView,
    containerVariants,
    itemVariants
  };
};




