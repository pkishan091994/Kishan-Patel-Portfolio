'use client';

import { motion } from 'framer-motion';
import TechGrid from '@/components/TechGrid';
import { SITE, bookCallHref } from '@/lib/site';
import styles from './page.module.css';
import { FiCalendar } from 'react-icons/fi';

const STRENGTHS = [
  { title: 'Clean Architecture', text: 'Feature-first modules, Bloc / Riverpod, testable domain layer — code your next dev can pick up.' },
  { title: 'Store-ready releases', text: 'Fastlane + CI pipelines, signing, review compliance and staged rollouts on both stores.' },
  { title: 'AI in production', text: 'Image/video generation, vision and chat features with queues, retries and cost controls.' },
  { title: 'Secure fintech flows', text: 'eKYC, document capture, encrypted storage and secure auth for regulated apps.' },
];

export default function SkillsPage() {
  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <span className="section-label">Stack</span>
            <h1 style={{ marginTop: '0.5rem' }}>The tools behind {SITE.apps} shipped apps.</h1>
            <p style={{ maxWidth: 560, marginTop: '0.9rem' }}>
              {SITE.years} years of production mobile work. Pick the right tool for the product — not the other way round.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          <TechGrid />
        </div>
      </section>

      <section className={`section ${styles.alt}`}>
        <div className="container">
          <div className="section-title">
            <span className="section-label">What that means for you</span>
            <h2>Engineering strengths</h2>
          </div>
          <div className={styles.strengths}>
            {STRENGTHS.map((s) => (
              <div key={s.title} className={styles.strength}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <a href={bookCallHref()} target="_blank" rel="noopener" className="btn btn-primary btn-lg">
              <FiCalendar /> Book a free call
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
