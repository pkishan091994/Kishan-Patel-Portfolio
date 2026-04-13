'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import { getExperience, Experience } from '@/lib/api';
import styles from './page.module.css';
import { FiBriefcase } from 'react-icons/fi';

const DEFAULT_EXPERIENCE: Experience[] = [
  { id: 1, company: 'TechSolution Pvt. Ltd.', role: 'Senior Mobile Developer', duration: 'Jan 2021 – Present', description: 'Lead a team of 6 developers to architect and build cross-platform apps in Flutter. Delivered 10+ production apps. Established CI/CD pipelines using GitHub Actions and Fastlane. Reduced app crash rate by 40% through performance profiling.', order_index: 1 },
  { id: 2, company: 'AppCraft Technologies', role: 'Mobile Application Developer', duration: 'Jun 2018 – Dec 2020', description: 'Developed and maintained 15+ iOS and Android apps using Swift and Kotlin. Integrated RESTful APIs, Firebase, payment gateways (Razorpay, Stripe). Worked closely with UI/UX teams to implement pixel-perfect designs.', order_index: 2 },
  { id: 3, company: 'Infoways Digital', role: 'Junior Android Developer', duration: 'Aug 2016 – May 2018', description: 'Built Android applications from scratch using Java and later migrated codebases to Kotlin. Implemented features including real-time chat, push notifications, offline sync, and Google Maps integration.', order_index: 3 },
];

export default function ExperiencePage() {
  const [experience, setExperience] = useState<Experience[]>([]);

  useEffect(() => {
    getExperience().then(setExperience);
  }, []);

  const expList = experience.length > 0 ? experience : DEFAULT_EXPERIENCE;

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label">Career Journey</span>
            <h1 style={{ marginTop: '0.5rem' }}>8+ Years of Experience</h1>
            <p style={{ maxWidth: 560, marginTop: '0.75rem' }}>
              A timeline of professional growth, impactful projects, and technology expertise across the mobile development landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className={styles.timeline}>
            {expList.map((exp, i) => (
              <AnimatedSection key={exp.id} delay={i * 0.1}>
                <div className={styles.timelineItem}>
                  {/* Dot & Line */}
                  <div className={styles.timelineDotWrap}>
                    <div className={styles.dot}>
                      <FiBriefcase size={14} />
                    </div>
                    {i < expList.length - 1 && <div className={styles.line} />}
                  </div>

                  {/* Content */}
                  <motion.div
                    className={styles.card}
                    whileHover={{ borderColor: 'var(--accent)', boxShadow: 'var(--shadow-md)' }}
                  >
                    <div className={styles.cardHeader}>
                      <div>
                        <h2 className={styles.role}>{exp.role}</h2>
                        <span className={styles.company}>{exp.company}</span>
                      </div>
                      <span className={styles.duration}>{exp.duration}</span>
                    </div>
                    <p className={styles.description}>{exp.description}</p>
                  </motion.div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
