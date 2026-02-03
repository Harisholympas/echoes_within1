import { motion } from 'framer-motion';

export const SketchEye = () => (
  <svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="animate-breathe"
  >
    <motion.ellipse
      cx="60"
      cy="40"
      rx="50"
      ry="30"
      fill="none"
      stroke="hsl(var(--charcoal))"
      strokeWidth="1.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    <motion.circle
      cx="60"
      cy="40"
      r="15"
      fill="none"
      stroke="hsl(var(--charcoal))"
      strokeWidth="1.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
    />
    <motion.circle
      cx="60"
      cy="40"
      r="6"
      fill="hsl(var(--charcoal))"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    />
    <motion.circle
      cx="55"
      cy="36"
      r="2"
      fill="hsl(var(--parchment))"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    />
  </svg>
);

export const SketchDivider = () => (
  <svg width="200" height="20" viewBox="0 0 200 20" className="mx-auto my-8">
    <motion.path
      d="M10 10 Q50 5 100 10 T190 10"
      fill="none"
      stroke="hsl(var(--charcoal) / 0.3)"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
    <motion.circle
      cx="100"
      cy="10"
      r="3"
      fill="hsl(var(--charcoal) / 0.4)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5 }}
    />
  </svg>
);

export const SketchSpiral = () => (
  <motion.svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    className="animate-flicker"
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <motion.path
      d="M30 30 Q35 25 32 20 Q28 15 22 18 Q16 22 18 30 Q20 38 28 40 Q38 42 42 32 Q45 22 38 15 Q30 8 20 12 Q10 18 12 30 Q14 45 30 48"
      fill="none"
      stroke="hsl(var(--charcoal) / 0.4)"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 3, ease: "easeInOut" }}
    />
  </motion.svg>
);

export const SketchMoon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80">
    <motion.circle
      cx="40"
      cy="40"
      r="25"
      fill="none"
      stroke="hsl(var(--charcoal) / 0.5)"
      strokeWidth="1.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2 }}
    />
    <motion.path
      d="M50 20 Q35 30 35 40 Q35 50 50 60"
      fill="hsl(var(--charcoal) / 0.1)"
      stroke="hsl(var(--charcoal) / 0.3)"
      strokeWidth="1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
    />
  </svg>
);

export const LoadingSketch = () => (
  <div className="flex flex-col items-center">
    <svg width="100" height="100" viewBox="0 0 100 100">
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="hsl(var(--charcoal) / 0.2)"
        strokeWidth="1"
      />
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="hsl(var(--charcoal) / 0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, rotate: 0 }}
        animate={{ pathLength: [0, 0.5, 0], rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "center" }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="25"
        fill="none"
        stroke="hsl(var(--charcoal) / 0.4)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </svg>
  </div>
);
