import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingSketch } from './SketchElements';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center max-w-md"
      >
        <LoadingSketch />

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="sketch-title text-2xl mt-8 mb-4"
        >
          Gathering the fragments...
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1 }}
          className="sketch-text text-muted-foreground mb-8 italic"
        >
          "Every answer leaves an impression,<br />
          like ink bleeding into parchment..."
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="sketch-card p-6 rounded-sm"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              className="text-charcoal/50"
            >
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M10 6 L10 11 L13 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="sketch-handwritten text-sm text-charcoal-light">
              Ephemeral Processing
            </span>
          </div>
          <p className="sketch-text text-xs text-muted-foreground">
            This space stores nothing. Your reflections exist only<br />
            in this moment, dissolving as you move forward.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 3 }}
          className="mt-8 text-xs text-muted-foreground sketch-handwritten"
        >
          ~ the void remembers what it chooses ~
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
