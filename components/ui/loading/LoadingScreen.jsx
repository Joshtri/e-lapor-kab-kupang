'use client';

import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function LoadingScreen({
  size = 140,
  message = '',
  imageFront = '/icons/icon-512.png',
  imageBack = '/icons/icon-192.png',
  paused = false,
  isLoading = true,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isLoading || !mounted) return null;

  const px = typeof size === 'number' ? `${size}px` : size;

  const coinStyle = {
    width: px,
    height: px,
  };

  // flip animation definition
  const flipAnim = paused
    ? { rotateY: 0 }
    : {
        rotateY: [0, 180, 360],
      };

  const flipTransition = {
    duration: 1.6,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'loop',
  };

  // Background blur animation
  const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  const loadingContent = (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={backdropVariants}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-0"
      role="presentation"
      aria-hidden="true"
    >
      {/* Content Container */}
      <motion.div
        variants={contentVariants}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center gap-6"
      >
        {/* Coin Spinner */}
        <div
          className="relative flex items-center justify-center"
          style={{ perspective: 1200 }}
          aria-hidden={paused}
        >
          <motion.div
            className="relative will-change-transform"
            style={coinStyle}
            animate={flipAnim}
            transition={flipTransition}
          >
            {/* coin shell */}
            <div
              className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* front face */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <img
                  src={imageFront}
                  alt="logo front"
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* back face */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"
                style={{
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <img
                  src={imageBack}
                  alt="logo back"
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>

            {/* Outer glow ring */}
            <motion.div
              className="absolute -inset-2 rounded-full pointer-events-none border-2 border-blue-400/30 dark:border-blue-500/20"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
              }}
            />

            {/* Inner rim effect */}
            <div className="absolute -inset-1 rounded-full pointer-events-none border border-slate-300 dark:border-slate-600" />
          </motion.div>
        </div>

        {/* Loading Message */}
        {message && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <p className="text-white dark:text-gray-100 font-medium text-lg mb-2">
              {message}
            </p>
            <motion.div
              className="flex items-center justify-center gap-1"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
              }}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-white/60" />
              <span className="inline-block w-2 h-2 rounded-full bg-white/60" />
              <span className="inline-block w-2 h-2 rounded-full bg-white/60" />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );

  // Render using portal at document.body level
  return typeof document !== 'undefined'
    ? createPortal(loadingContent, document.body)
    : null;
}

LoadingScreen.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  message: PropTypes.string,
  imageFront: PropTypes.string,
  imageBack: PropTypes.string,
  paused: PropTypes.bool,
  isLoading: PropTypes.bool,
};
