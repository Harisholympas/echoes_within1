import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SketchMoon, SketchSpiral } from './SketchElements';

interface CutsceneScreenProps {
  phase: number;
  onComplete: () => void;
}

const cutscenes = [
  {
    visual: 'moon',
    text: ['Memories surface slowly...', 'like dreams at dawn.'],
  },
  {
    visual: 'spiral',
    text: ['The heart speaks', 'in fragments and whispers...'],
  },
  {
    visual: 'moon',
    text: ['Almost there...', 'one last breath.'],
  },
];

export const CutsceneScreen = ({ phase, onComplete }: CutsceneScreenProps) => {
  const [textIndex, setTextIndex] = useState(0);
  const cutscene = cutscenes[phase % cutscenes.length];

  useEffect(() => {
    const textTimer = setTimeout(() => {
      if (textIndex < cutscene.text.length - 1) {
        setTextIndex(textIndex + 1);
      }
    }, 1500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [textIndex, cutscene.text.length, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background/95"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="mb-12"
      >
        {cutscene.visual === 'moon' ? <SketchMoon /> : <SketchSpiral />}
      </motion.div>

      <div className="text-center">
        {cutscene.text.map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: index <= textIndex ? 1 : 0,
              y: index <= textIndex ? 0 : 20,
            }}
            transition={{ duration: 0.8, delay: index * 0.5 }}
            className="sketch-title text-2xl md:text-3xl text-charcoal-light mb-2"
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
};
