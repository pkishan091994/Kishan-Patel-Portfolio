'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import { getProfile, getEducation, Profile, Education } from '@/lib/api';
import styles from './page.module.css';
import { FiMapPin, FiMail, FiPhone, FiDownload, FiUser, FiBookOpen } from 'react-icons/fi';

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [education, setEducation] = useState<Education[]>([]);

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      setProfileLoading(false);
    });
    getEducation().then(setEducation);
  }, []);

  const name = profile?.name || 'Kishan Patel';
  const title = profile?.title || 'IT Mobile Application Developer';
  const bio = profile?.bio ||
    'I am a dedicated Mobile Application Developer with over 8 years of hands-on experience in designing and building high-quality mobile applications. Throughout my career, I have collaborated with startups, enterprises, and product companies to deliver robust, scalable, and user-friendly apps across major platforms.\n\nMy expertise spans the full mobile development lifecycle — from architecture design and API integration to performance optimization and App Store/Play Store deployment. I thrive in agile environments and have a strong focus on clean code, modern UI/UX, and delivering business value through technology.';

  const defaultEducation: Education[] = [
    { id: 1, degree: 'B.Tech in Computer Science', institution: 'Gujarat Technological University', year: '2012–2016', description: 'Graduated with distinction. Specialized in software engineering and mobile computing.' },
  ];

  const eduList = education.length > 0 ? education : defaultEducation;

  return (
    <div>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">About Me</span>
            <h1 style={{ marginTop: '0.5rem' }}>Meet {name}</h1>
          </motion.div>
        </div>
      </section>

      {/* ── Bio Section ── */}
      <section className="section">
        <div className="container">
          <div className={styles.bioGrid}>
            {/* Avatar */}
            <AnimatedSection>
              <div className={styles.avatarWrap}>
                {profileLoading ? (
                  // Neutral shimmer — no old image shown during fetch
                  <div className={styles.avatarSkeleton} aria-hidden="true" />
                ) : (
                  <img
                    src={profile?.avatar_url || '/kishan-avatar.jpg'}
                    alt={name}
                    className={styles.avatar}
                  />
                )}
                <div className={styles.expBadge}>
                  <strong>8+</strong>
                  <span>Years in IT</span>
                </div>
              </div>
            </AnimatedSection>

            {/* Content */}
            <AnimatedSection delay={0.1}>
              <div className={styles.bioContent}>
                <h2>{title}</h2>
                <div className={styles.bioText}>
                  {bio.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className={styles.contactDetails}>
                  {[
                    { icon: <FiMapPin />, label: profile?.location || 'Gujarat, India' },
                    { icon: <FiMail />, label: profile?.email || 'kishanpatel@email.com' },
                    { icon: <FiPhone />, label: profile?.phone || '+91 98765 43210' },
                  ].map((item, i) => (
                    <div key={i} className={styles.contactItem}>
                      <span className={styles.contactIcon}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                {profile?.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noopener" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    <FiDownload /> Download Resume
                  </a>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Key Highlights ── */}
      <AnimatedSection>
        <section className={`section ${styles.highlightsSection}`}>
          <div className="container">
            <div className="section-title">
              <span className="section-label">Highlights</span>
              <h2>What I Bring to the Table</h2>
            </div>
            <div className={styles.highlightsGrid}>
              {[
                { icon: <FiUser />, title: '8+ Years Experience', desc: 'Deep expertise in mobile app development across Flutter, iOS, Android, and React Native platforms.' },
                { icon: <FiBookOpen />, title: '30+ Apps Launched', desc: 'Successfully delivered mobile applications across healthcare, e-commerce, fintech, and social sectors.' },
                { icon: <FiMail />, title: 'Full Lifecycle', desc: 'End-to-end ownership from ideation and architecture through deployment, CI/CD, and ongoing maintenance.' },
                { icon: <FiPhone />, title: 'Cross-Platform Expert', desc: 'Specializing in building apps that feel native on both iOS and Android while sharing a single codebase.' },
              ].map((h, i) => (
                <motion.div
                  key={i}
                  className={styles.highlightCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={styles.highlightIcon}>{h.icon}</div>
                  <h3>{h.title}</h3>
                  <p>{h.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ── Education ── */}
      <AnimatedSection>
        <section className="section">
          <div className="container">
            <div className="section-title">
              <span className="section-label">Education</span>
              <h2>Academic Background</h2>
            </div>
            <div className={styles.eduList}>
              {eduList.map((edu, i) => (
                <motion.div
                  key={edu.id}
                  className={styles.eduCard}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={styles.eduYear}>{edu.year}</div>
                  <div className={styles.eduInfo}>
                    <h3>{edu.degree}</h3>
                    <span className={styles.institution}>{edu.institution}</span>
                    {edu.description && <p>{edu.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
