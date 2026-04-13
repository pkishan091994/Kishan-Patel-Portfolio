'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import { getProjects, Project } from '@/lib/api';
import styles from './page.module.css';
import { FiSmartphone, FiExternalLink, FiGithub } from 'react-icons/fi';

const DEFAULT_PROJECTS: Project[] = [
  { id: 1, title: 'HealthTrack Pro', description: 'Comprehensive health monitoring app with real-time analytics, Apple HealthKit/Google Fit integration, AI-driven insights, and custom workout tracking. Used by 50,000+ users.', image_url: '', tech_stack: ['Flutter', 'Firebase', 'HealthKit', 'ML Kit'], app_store_url: '#', play_store_url: '#', github_url: '', order_index: 1 },
  { id: 2, title: 'ShopEase', description: 'Feature-rich e-commerce app with AR product preview, Stripe & Razorpay payment integration, real-time inventory, and vendor management dashboard.', image_url: '', tech_stack: ['React Native', 'Node.js', 'Stripe', 'AWS S3'], app_store_url: '#', play_store_url: '#', github_url: '', order_index: 2 },
  { id: 3, title: 'CityComm', description: 'Real-time community platform with encrypted messaging, live video streams, location-based discovery, and event management. 100,000+ downloads.', image_url: '', tech_stack: ['Swift', 'Kotlin', 'WebRTC', 'Socket.io'], app_store_url: '#', play_store_url: '#', github_url: '', order_index: 3 },
  { id: 4, title: 'FinBook', description: 'Personal finance tracker with bank account syncing, expense categorization, budget goals, and AI-powered financial insights.', image_url: '', tech_stack: ['Flutter', 'Plaid API', 'Supabase', 'ML'], app_store_url: '#', play_store_url: '#', github_url: '', order_index: 4 },
  { id: 5, title: 'DeliverNow', description: 'On-demand delivery platform with real-time driver tracking, route optimization, multi-restaurant ordering, and live notifications.', image_url: '', tech_stack: ['React Native', 'Google Maps', 'Firebase', 'Stripe'], app_store_url: '#', play_store_url: '#', github_url: '', order_index: 5 },
  { id: 6, title: 'EduPath', description: 'Interactive e-learning app with video courses, live classes, quiz engine, certificate generation, and offline content download.', image_url: '', tech_stack: ['Flutter', 'Django', 'AWS', 'FFmpeg'], app_store_url: '#', play_store_url: '#', github_url: '', order_index: 6 },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const projectList = projects.length > 0 ? projects : DEFAULT_PROJECTS;

  // Collect all tech tags
  const allTech = Array.from(
    new Set(projectList.flatMap((p) => (p.tech_stack || []).slice(0, 2)))
  );
  const filters = ['All', ...allTech.slice(0, 6)];

  const filtered =
    filter === 'All'
      ? projectList
      : projectList.filter((p) => p.tech_stack?.includes(filter));

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label">Portfolio</span>
            <h1 style={{ marginTop: '0.5rem' }}>Projects & Apps</h1>
            <p style={{ maxWidth: 520, marginTop: '0.75rem' }}>
              A selection of mobile applications delivered across diverse domains and platforms over 8+ years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <AnimatedSection>
        <div className="container" style={{ paddingTop: '2.5rem' }}>
          <div className={styles.filters}>
            {filters.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Projects Grid */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className={styles.grid}>
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                className={`card ${styles.card}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                layout
              >
                {/* Image */}
                <div className={styles.imgWrap}>
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className={styles.img} />
                  ) : (
                    <div className={styles.imgPlaceholder}>
                      <FiSmartphone size={36} />
                      <span>{project.title.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className={styles.body}>
                  <h3 className={styles.title}>{project.title}</h3>
                  <p className={styles.desc}>{project.description}</p>

                  <div className={styles.techStack}>
                    {(project.tech_stack || []).map((t) => (
                      <span key={t} className="badge">{t}</span>
                    ))}
                  </div>

                  <div className={styles.actions}>
                    {project.app_store_url && (
                      <a href={project.app_store_url} className="btn btn-ghost btn-sm" target="_blank" rel="noopener">
                        <FiExternalLink size={13} /> App Store
                      </a>
                    )}
                    {project.play_store_url && (
                      <a href={project.play_store_url} className="btn btn-ghost btn-sm" target="_blank" rel="noopener">
                        <FiExternalLink size={13} /> Play Store
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} className="btn btn-ghost btn-sm" target="_blank" rel="noopener">
                        <FiGithub size={13} /> GitHub
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
