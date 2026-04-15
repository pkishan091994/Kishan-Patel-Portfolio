'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  SiAndroid,
  SiDart,
  SiFastlane,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiGithub,
  SiKotlin,
  SiNodedotjs,
  SiReact,
  SiSwift,
  SiSupabase,
} from 'react-icons/si';
import { TbApi } from 'react-icons/tb';
import { IconType } from 'react-icons';
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

const ICON_MAP: Record<string, IconType> = {
  flutter: SiFlutter,
  dart: SiDart,
  react: SiReact,
  'react native': SiReact,
  node: SiNodedotjs,
  firebase: SiFirebase,
  supabase: SiSupabase,
  kotlin: SiKotlin,
  swift: SiSwift,
  android: SiAndroid,
  java: SiAndroid,
  git: SiGit,
  github: SiGithub,
  figma: SiFigma,
  fastlane: SiFastlane,
  api: TbApi,
};

function resolveSkillIcon(name: string): IconType {
  const normalized = name.toLowerCase();
  const matchedKey = Object.keys(ICON_MAP).find((key) => normalized.includes(key));
  return matchedKey ? ICON_MAP[matchedKey] : SiGithub;
}

function getSkillTone(proficiency: number): 'advanced' | 'proficient' | 'learning' {
  if (proficiency >= 88) return 'advanced';
  if (proficiency >= 72) return 'proficient';
  return 'learning';
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);

  useEffect(() => {
    getSkills().then(setSkills);
  }, []);

  const skillList = useMemo(() => {
    const rawSkills = skills.length > 0 ? skills : DEFAULT_SKILLS;
    return [...rawSkills].sort((a, b) => b.proficiency - a.proficiency);
  }, [skills]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(skillList.map((s) => s.category)))], [skillList]);

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return skillList;
    return skillList.filter((skill) => skill.category === activeCategory);
  }, [activeCategory, skillList]);

  const selectedSkill = useMemo(() => {
    if (!filteredSkills.length) return null;
    const fallbackSkill = filteredSkills[0];
    if (selectedSkillId === null) return fallbackSkill;
    return filteredSkills.find((skill) => skill.id === selectedSkillId) || fallbackSkill;
  }, [filteredSkills, selectedSkillId]);

  useEffect(() => {
    if (!filteredSkills.length) return;
    if (selectedSkillId === null || !filteredSkills.some((skill) => skill.id === selectedSkillId)) {
      setSelectedSkillId(filteredSkills[0].id);
    }
  }, [filteredSkills, selectedSkillId]);

  const averageProficiency = Math.round(
    filteredSkills.reduce((sum, skill) => sum + skill.proficiency, 0) / Math.max(filteredSkills.length, 1)
  );

  const selectedSkillProgress = selectedSkill?.proficiency ?? 0;
  const selectedSkillProgressOffset = 2 * Math.PI * 54 * (1 - selectedSkillProgress / 100);
  const selectedSkillIcon = selectedSkill ? resolveSkillIcon(selectedSkill.name) : SiGithub;

  const proficiencyBuckets = {
    advanced: filteredSkills.filter((skill) => getSkillTone(skill.proficiency) === 'advanced').length,
    proficient: filteredSkills.filter((skill) => getSkillTone(skill.proficiency) === 'proficient').length,
    learning: filteredSkills.filter((skill) => getSkillTone(skill.proficiency) === 'learning').length,
  };

  return (
    <div className={styles.skillsPage}>
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <span className="section-label">Technical Skills</span>
            <h1 style={{ marginTop: '0.5rem' }}>Technologies & Tools</h1>
            <p style={{ maxWidth: 520, marginTop: '0.75rem' }}>
              A dynamic skill map with category filters, animated indicators, and interactive cards.
            </p>
          </motion.div>

          <motion.div
            className={styles.filterRow}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`${styles.filterChip} ${activeCategory === category ? styles.filterChipActive : ''}`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatedSection delay={0.1}>
        <section className={`section ${styles.altBg}`}>
          <div className="container">
            <div className={styles.composition}>
              <motion.div
                key={selectedSkill?.id}
                className={styles.spotlightCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className={styles.spotlightHeader}>
                  <div>
                    <span className="section-label">Spotlight</span>
                    <h3>{selectedSkill?.name ?? 'Top Skill'}</h3>
                  </div>
                  <div className={styles.categoryPill}>{selectedSkill?.category ?? activeCategory}</div>
                </div>

                <div className={styles.ringWrap}>
                  <svg className={styles.ring} viewBox="0 0 120 120" aria-label={`${selectedSkillProgress}% proficiency`}>
                    <circle cx="60" cy="60" r="54" className={styles.ringTrack} />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="54"
                      className={styles.ringProgress}
                      initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                      animate={{ strokeDashoffset: selectedSkillProgressOffset }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className={styles.ringCenter}>
                    <selectedSkillIcon />
                    <strong>{selectedSkillProgress}%</strong>
                    <span>{getSkillTone(selectedSkillProgress)}</span>
                  </div>
                </div>

                <div className={styles.stats}>
                  <div>
                    <span>Avg proficiency</span>
                    <strong>{averageProficiency}%</strong>
                  </div>
                  <div>
                    <span>Advanced</span>
                    <strong>{proficiencyBuckets.advanced}</strong>
                  </div>
                  <div>
                    <span>Proficient</span>
                    <strong>{proficiencyBuckets.proficient}</strong>
                  </div>
                  <div>
                    <span>Learning</span>
                    <strong>{proficiencyBuckets.learning}</strong>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className={styles.tagCloud}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                {filteredSkills.map((skill, index) => {
                  const Icon = resolveSkillIcon(skill.name);
                  return (
                    <motion.button
                      key={skill.id}
                      type="button"
                      onClick={() => setSelectedSkillId(skill.id)}
                      className={`${styles.floatingBadge} ${selectedSkill?.id === skill.id ? styles.badgeActive : ''}`}
                      animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
                      transition={{ duration: 4 + (index % 4), repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                    >
                      <Icon />
                      <span>{skill.name}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection delay={0.12}>
        <section className="section">
          <div className="container">
            <div className="section-title">
              <span className="section-label">{activeCategory === 'All' ? 'All Skills' : activeCategory}</span>
              <h2>Capability Timeline</h2>
            </div>

            <div className={styles.skillTimeline}>
              {filteredSkills.map((skill, i) => {
                const Icon = resolveSkillIcon(skill.name);
                return (
                  <motion.button
                    key={skill.id}
                    type="button"
                    onClick={() => setSelectedSkillId(skill.id)}
                    className={`${styles.timelineItem} ${selectedSkill?.id === skill.id ? styles.timelineItemActive : ''}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className={styles.timelineHead}>
                      <div className={styles.skillIdentity}>
                        <span className={styles.skillIcon}>
                          <Icon />
                        </span>
                        <div>
                          <strong className={styles.skillName}>{skill.name}</strong>
                          <span className={styles.skillCategory}>{skill.category}</span>
                        </div>
                      </div>
                      <span className={styles.proficiency}>{skill.proficiency}%</span>
                    </div>
                    <div className={styles.barTrack}>
                      <motion.div
                        className={styles.barFill}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 + 0.1, duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
