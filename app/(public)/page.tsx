'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import { getProfile, getSkills, getProjects, Profile, Skill, Project } from '@/lib/api';
import styles from './page.module.css';
import { FiArrowRight, FiDownload, FiSmartphone, FiCode, FiAward } from 'react-icons/fi';

const TITLES = [
  'Mobile Application Developer',
  'Flutter Expert',
  'iOS & Android Developer',
  'React Native Developer',
];

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      setProfileLoading(false);
    });
    getSkills().then(setSkills);
    getProjects().then((p) => setProjects(p.slice(0, 3)));
  }, []);

  // Typewriter effect
  useEffect(() => {
    const full = TITLES[titleIdx];
    let i = displayed.length;

    if (typing) {
      if (i < full.length) {
        const t = setTimeout(() => setDisplayed(full.slice(0, i + 1)), 65);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (i > 0) {
        const t = setTimeout(() => setDisplayed(full.slice(0, i - 1)), 38);
        return () => clearTimeout(t);
      } else {
        setTitleIdx((prev) => (prev + 1) % TITLES.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, titleIdx]);

  const stats = [
    { icon: <FiAward />, value: `${profile?.years_experience || '8'}+`, label: 'Years Experience' },
    { icon: <FiSmartphone />, value: `${profile?.apps_delivered || projects.length || '30'}+`, label: 'Apps Delivered' },
    { icon: <FiCode />, value: `${skills.length || '20'}+`, label: 'Technologies' },
  ];

  const name = profile?.name || 'Kishan Patel';
  const bio =
    profile?.bio ||
    'Passionate IT Mobile Application Developer with 8+ years of experience crafting high-performance, user-centric mobile applications across Flutter, iOS (Swift), Android (Kotlin/Java), and React Native.';

  return (
    <div className={styles.page}>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className={`badge ${styles.heroBadge}`}>
              🚀 Available for Freelance & Full-time
            </span>

            <h1 className={styles.heroName}>
              Hi, I'm <span className={styles.nameAccent}>{name}</span>
            </h1>

            <div className={styles.typewriterWrap}>
              <span className={styles.typewriter}>{displayed}</span>
              <span className={styles.cursor} aria-hidden>|</span>
            </div>

            <p className={styles.heroBio}>{bio}</p>

            <div className={styles.heroCtas}>
              <Link href="/projects" className="btn btn-primary">
                View My Work <FiArrowRight />
              </Link>
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-outline"
                >
                  <FiDownload /> Resume
                </a>
              )}
              {!profile?.resume_url && (
                <Link href="/contact" className="btn btn-outline">
                  Get In Touch
                </Link>
              )}
            </div>
          </motion.div>

          {/* Avatar */}
          <motion.div
            className={styles.heroAvatar}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
          >
            {profileLoading ? (
              // Shimmer skeleton — shown WHILE fetch is in-flight
              // prevents old image flashing before new one loads
              <div className={styles.avatarSkeleton} aria-hidden="true" />
            ) : (
              <img
                src={profile?.avatar_url || '/kishan-avatar.jpg'}
                alt={name}
                className={styles.avatarImg}
              />
            )}
            <div className={styles.avatarDeco} />
            <div className={styles.expBadge}>
              <strong>8+</strong>
              <span>Years</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className={styles.scrollDot} />
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      <AnimatedSection>
        <section className={styles.stats}>
          <div className="container">
            <div className={styles.statsGrid}>
              {stats.map((s, i) => (
                <div key={i} className={styles.statCard}>
                  <div className={styles.statIcon}>{s.icon}</div>
                  <strong className={styles.statValue}>{s.value}</strong>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ── Featured Skills ─────────────────────────────── */}
      <AnimatedSection>
        <section className={`section ${styles.featuredSection}`}>
          <div className="container">
            <div className="section-title">
              <span className="section-label">Expertise</span>
              <h2>Technologies I Work With</h2>
            </div>
            <div className={styles.skillsGrid}>
              {(skills.length > 0
                ? skills.slice(0, 8)
                : [
                    { id: 1, name: 'Flutter / Dart', category: 'Cross-Platform', proficiency: 98, order_index: 1 },
                    { id: 2, name: 'iOS (Swift)', category: 'Native', proficiency: 90, order_index: 2 },
                    { id: 3, name: 'Android (Kotlin)', category: 'Native', proficiency: 90, order_index: 3 },
                    { id: 4, name: 'React Native', category: 'Cross-Platform', proficiency: 85, order_index: 4 },
                    { id: 5, name: 'Firebase', category: 'Backend', proficiency: 88, order_index: 5 },
                    { id: 6, name: 'REST APIs', category: 'Backend', proficiency: 92, order_index: 6 },
                    { id: 7, name: 'Git / CI/CD', category: 'DevOps', proficiency: 85, order_index: 7 },
                    { id: 8, name: 'Supabase', category: 'Backend', proficiency: 80, order_index: 8 },
                  ]
              ).map((skill, i) => (
                <motion.div
                  key={skill.id}
                  className={styles.skillChip}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                >
                  <span className={styles.skillName}>{skill.name}</span>
                  <span className={styles.skillCat}>{skill.category}</span>
                  <div className={styles.skillBar}>
                    <motion.div
                      className={styles.skillFill}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 + 0.3, duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/skills" className="btn btn-outline">
                View All Skills <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ── Featured Projects ────────────────────────────── */}
      <AnimatedSection>
        <section className={`section ${styles.featuredSection}`} style={{ background: 'var(--surface)' }}>
          <div className="container">
            <div className="section-title">
              <span className="section-label">Portfolio</span>
              <h2>Featured Projects</h2>
            </div>
            <div className={styles.projectsGrid}>
              {(projects.length > 0
                ? projects
                : [
                    {
                      id: 1, title: 'HealthTrack Pro', description: 'A comprehensive health monitoring app with real-time analytics, wearable integration, and AI-driven insights. Built with Flutter for iOS & Android.', image_url: '', tech_stack: ['Flutter', 'Firebase', 'HealthKit', 'ML Kit'], app_store_url: '#', play_store_url: '#', github_url: '', order_index: 1,
                    },
                    {
                      id: 2, title: 'ShopEase', description: 'Feature-rich e-commerce application with seamless payment gateway integration, AR product preview, and real-time inventory management.', image_url: '', tech_stack: ['React Native', 'Node.js', 'Stripe', 'AWS'], app_store_url: '#', play_store_url: '#', github_url: '', order_index: 2,
                    },
                    {
                      id: 3, title: 'CityComm', description: 'Real-time community communication platform with live video, encrypted messaging, and location-based features.', image_url: '', tech_stack: ['Swift', 'Kotlin', 'WebRTC', 'Socket.io'], app_store_url: '#', play_store_url: '#', github_url: '', order_index: 3,
                    },
                  ]
              ).map((project, i) => (
                <motion.div
                  key={project.id}
                  className={`card ${styles.projectCard}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={styles.projectImg}>
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} />
                    ) : (
                      <div className={styles.projectImgPlaceholder}>
                        <FiSmartphone size={32} />
                      </div>
                    )}
                  </div>
                  <div className={styles.projectBody}>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className={styles.techStack}>
                      {project.tech_stack?.slice(0, 4).map((t) => (
                        <span key={t} className="badge">{t}</span>
                      ))}
                    </div>
                    <div className={styles.projectLinks}>
                      {project.app_store_url && (
                        <a href={project.app_store_url} className="btn btn-ghost btn-sm" target="_blank" rel="noopener">App Store</a>
                      )}
                      {project.play_store_url && (
                        <a href={project.play_store_url} className="btn btn-ghost btn-sm" target="_blank" rel="noopener">Play Store</a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/projects" className="btn btn-primary">
                See All Projects <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ── Call To Action ───────────────────────────────── */}
      <AnimatedSection>
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaBox}>
              <h2>Let's Build Something Great</h2>
              <p>Have a project in mind? I'd love to hear about it and help bring your vision to life.</p>
              <div className={styles.ctaActions}>
                <Link href="/contact" className="btn btn-primary">Start a Conversation <FiArrowRight /></Link>
                <Link href="/experience" className="btn btn-outline">View My Journey</Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
