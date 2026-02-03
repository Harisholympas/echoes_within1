import { motion } from 'framer-motion';
import { SketchEye } from './SketchElements';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen = ({ onStart }: IntroScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-center max-w-md"
      >
        <div className="mb-8 flex justify-center">
          <SketchEye />
        </div>

        <h1 className="sketch-title text-4xl md:text-5xl mb-6 animate-breathe">
          Echoes
        </h1>

        <div className="sketch-line w-32 mx-auto mb-8" />

        <p className="sketch-text text-lg md:text-xl text-charcoal-light mb-4 italic">
          "Some things are felt
        </p>
        <p className="sketch-text text-lg md:text-xl text-charcoal-light mb-8 italic">
          before they are understood."
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="sketch-text text-base text-muted-foreground mb-12"
        >
          Someone sent you here for a reason.<br />
          Let's see what surfaces.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="sketch-button text-xl"
        >
          Enter
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-12 text-sm text-muted-foreground sketch-handwritten"
        >
          ~ take a breath before you enter ~
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
