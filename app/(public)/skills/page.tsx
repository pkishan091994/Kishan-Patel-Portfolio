'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import { getSkills, Skill } from '@/lib/api';
import styles from './page.module.css';

const DEFAULT_SKILLS: Skill[] = [
  { id: 1, name: 'Flutter / Dart', category: 'Cross-Platform', proficiency: 98, order_index: 1 },
  { id: 2, name: 'iOS (Swift)', category: 'Native', proficiency: 90, order_index: 2 },
  { id: 3, name: 'Android (Kotlin)', category: 'Native', proficiency: 90, order_index: 3 },
  { id: 4, name: 'Java (Android)', category: 'Native', proficiency: 85, order_index: 4 },
  { id: 5, name: 'React Native', category: 'Cross-Platform', proficiency: 85, order_index: 5 },
  { id: 6, name: 'Firebase', category: 'Backend / Cloud', proficiency: 88, order_index: 6 },
  { id: 7, name: 'REST APIs', category: 'Backend / Cloud', proficiency: 92, order_index: 7 },
  { id: 8, name: 'Supabase', category: 'Backend / Cloud', proficiency: 80, order_index: 8 },
  { id: 9, name: 'Git & GitHub', category: 'DevOps & Tools', proficiency: 90, order_index: 9 },
  { id: 10, name: 'CI/CD (Fastlane)', category: 'DevOps & Tools', proficiency: 82, order_index: 10 },
  { id: 11, name: 'App Store / Play Store', category: 'DevOps & Tools', proficiency: 95, order_index: 11 },
  { id: 12, name: 'Figma / UI/UX', category: 'Design & Tools', proficiency: 75, order_index: 12 },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    getSkills().then(setSkills);
  }, []);

  const skillList = skills.length > 0 ? skills : DEFAULT_SKILLS;

  const categories = Array.from(new Set(skillList.map((s) => s.category)));

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label">Technical Skills</span>
            <h1 style={{ marginTop: '0.5rem' }}>Technologies & Tools</h1>
            <p style={{ maxWidth: 520, marginTop: '0.75rem' }}>
              8+ years of hands-on experience with mobile platforms, cloud services, and modern development tools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Skills by Category */}
      {categories.map((cat, catIdx) => (
        <AnimatedSection key={cat} delay={catIdx * 0.1}>
          <section className={`section ${catIdx % 2 === 1 ? styles.altBg : ''}`}>
            <div className="container">
              <div className="section-title">
                <span className="section-label">{cat}</span>
              </div>
              <div className={styles.skillsGrid}>
                {skillList
                  .filter((s) => s.category === cat)
                  .map((skill, i) => (
                    <motion.div
                      key={skill.id}
                      className={styles.skillCard}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ borderColor: 'var(--accent)', boxShadow: 'var(--shadow-sm)' }}
                    >
                      <div className={styles.skillHeader}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <span className={styles.proficiency}>{skill.proficiency}%</span>
                      </div>
                      <div className={styles.barTrack}>
                        <motion.div
                          className={styles.barFill}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.07 + 0.25, duration: 0.7, ease: 'easeOut' }}
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      ))}
    </div>
  );
}
