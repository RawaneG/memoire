import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const dotVariants = {
    animate: (i) => ({
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1,
        repeat: Infinity,
        delay: i * 0.1,
        ease: "easeInOut"
      }
    })
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Main spinner */}
      <motion.div
        className={`relative ${sizeClasses[size]}`}
        variants={spinnerVariants}
        animate="animate"
      >
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full" />
        <div className="absolute inset-2 border-4 border-transparent border-b-purple-500 border-l-blue-500 rounded-full" />
      </motion.div>

      {/* Text with animated dots */}
      <div className="flex items-center space-x-1 text-white/80 font-medium">
        <span>{text}</span>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-white rounded-full"
              variants={dotVariants}
              animate="animate"
              custom={i}
            />
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;