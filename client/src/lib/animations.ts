/**
 * Animation Utilities for BookDirectStays
 * 
 * Comprehensive animation system using Framer Motion
 * for premium UX/UI interactions
 */

import { Variants } from "framer-motion";

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.61, 1, 0.88, 1],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.32, 0, 0.67, 0]
    }
  }
};

// ============================================================================
// CONTENT ANIMATIONS
// ============================================================================

export const containerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    rotateX: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    rotateX: 5,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  hover: {
    scale: 1.03,
    y: -6,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// ============================================================================
// BUTTON ANIMATIONS
// ============================================================================

export const buttonVariants: Variants = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const rippleVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0.6
  },
  animate: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const skeletonVariants: Variants = {
  loading: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

export const spinnerVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity
    }
  }
};

export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const fadeInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const fadeInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// ============================================================================
// FORM ANIMATIONS
// ============================================================================

export const inputFocusVariants: Variants = {
  rest: {
    scale: 1,
    borderColor: "rgba(209, 213, 219, 1)", // gray-300
    boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  focus: {
    scale: 1.02,
    borderColor: "rgba(59, 130, 246, 1)", // blue-500
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const labelFloatVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    color: "rgba(107, 114, 128, 1)", // gray-500
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  focus: {
    y: -24,
    scale: 0.85,
    color: "rgba(59, 130, 246, 1)", // blue-500
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// ============================================================================
// MODAL ANIMATIONS
// ============================================================================

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const backdropVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// ============================================================================
// NOTIFICATION ANIMATIONS
// ============================================================================

export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

export const easings = {
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.55, 0.265, 1.55]
} as const;

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

export const animationPresets = {
  // Fast animations for immediate feedback
  fast: {
    duration: 0.15,
    ease: easings.easeOutCubic
  },
  
  // Normal animations for most interactions
  normal: {
    duration: 0.3,
    ease: easings.easeInOutCubic
  },
  
  // Slow animations for major transitions
  slow: {
    duration: 0.5,
    ease: easings.easeOutExpo
  },
  
  // Bouncy animations for playful interactions
  bouncy: {
    duration: 0.6,
    ease: easings.easeOutBack
  }
} as const;




