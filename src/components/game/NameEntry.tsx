import { useState } from 'react';
import { motion } from 'framer-motion';
import { SketchDivider } from './SketchElements';

interface NameEntryProps {
  onSubmit: (name: string) => void;
}

export const NameEntry = ({ onSubmit }: NameEntryProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

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
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center max-w-md w-full"
      >
        <p className="sketch-text text-sm text-muted-foreground mb-2 uppercase tracking-widest">
          The Visitor's Log
        </p>
        
        <h2 className="sketch-title text-3xl md:text-4xl mb-4">
          Before we begin...
        </h2>

        <SketchDivider />

        <p className="sketch-text text-lg text-charcoal-light mb-8 italic">
          "A name is but a breath given form—<br />
          yet it shapes all that follows."
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="inscribe your name here"
              className="sketch-input text-center text-2xl"
              autoFocus
            />
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-charcoal/40"
              initial={{ width: 0 }}
              animate={{ width: name ? '80%' : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={!name.trim()}
            whileHover={{ scale: name.trim() ? 1.02 : 1 }}
            whileTap={{ scale: name.trim() ? 0.98 : 1 }}
            className={`sketch-button text-lg ${
              !name.trim() ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            I am ready
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          className="mt-12 text-xs text-muted-foreground sketch-handwritten"
        >
          ~ your journey awaits ~
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
