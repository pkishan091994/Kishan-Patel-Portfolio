'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Subtle reveal that never leaves blank gaps:
 * - starts animating ~200px BEFORE the section enters the viewport
 * - content is never fully transparent (starts at 0.4 opacity, small offset)
 * - short duration, and disabled entirely for reduced-motion users
 */
export default function AnimatedSection({ children, delay = 0, className }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0.4, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px 200px 0px' }}
      transition={{ duration: 0.3, delay: Math.min(delay, 0.1), ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
