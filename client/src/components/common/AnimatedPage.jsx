import { motion } from 'framer-motion';

const animations = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function AnimatedPage({ children, className = '' }) {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={`flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden scrollbar-hidden block ${className}`}
    >
      {children}
    </motion.div>
  );
}
