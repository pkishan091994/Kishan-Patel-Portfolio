'use client';

import { AnimatePresence, motion } from 'framer-motion';
import styles from './Loader.module.css';

type LoaderProps = {
  /** full-page overlay vs inline content placeholder */
  variant?: 'overlay' | 'inline';
  label?: string;
  visible?: boolean;
  /** show slim top progress bar (used during route clicks) */
  showProgress?: boolean;
};

export default function Loader({
  variant = 'inline',
  label = 'Loading',
  visible = true,
  showProgress = false,
}: LoaderProps) {
  const content = (
    <div className={styles.stage} role="status" aria-live="polite" aria-label={label}>
      <div className={styles.orb}>
        <span className={styles.ring} />
        <span className={styles.ringInner} />
        <span className={styles.core}>KP</span>
      </div>
      <p className={styles.label}>
        {label}
        <span className={styles.dots} aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </p>
    </div>
  );

  if (variant === 'overlay') {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            key="page-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {showProgress && (
              <div className={styles.progressTrack}>
                <div className={styles.progressBar} />
              </div>
            )}
            <div className={styles.overlay}>
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              >
                {content}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (!visible) return null;

  return (
    <motion.div
      className={styles.inline}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {content}
    </motion.div>
  );
}
