'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import { getProjects, Project } from '@/lib/api';
import { SITE, findCaseStudy, bookCallHref, caseStudyRank } from '@/lib/site';
import styles from './page.module.css';
import { FiCalendar } from 'react-icons/fi';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    getProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  const list = projects || [];
  const featured = list.filter((p) => findCaseStudy(p.title)?.featured).sort((a, b) => caseStudyRank(a.title) - caseStudyRank(b.title));
  const rest = list.filter((p) => !findCaseStudy(p.title)?.featured);

  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <span className="section-label">Work</span>
            <h1 style={{ marginTop: '0.5rem' }}>Apps I&apos;ve designed, built and shipped.</h1>
            <p style={{ maxWidth: 560, marginTop: '0.9rem' }}>
              {SITE.apps} production apps over {SITE.years} years — fintech, healthcare and AI products live on the
              App Store and Google Play.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          {projects === null && <div className={styles.skeletonGrid}><div /><div /><div /></div>}

          {featured.length > 0 && (
            <div className={styles.featured}>
              {featured.map((p) => <ProjectCard key={p.id} project={p} wide />)}
            </div>
          )}

          {rest.length > 0 && (
            <>
              <h2 className={styles.subhead}>More apps</h2>
              <div className={styles.grid}>
                {rest.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            </>
          )}

          <div className={styles.cta}>
            <div>
              <h3>Want something like this for your product?</h3>
              <p>Free 20-minute call — you&apos;ll leave with a plan, timeline and quote.</p>
            </div>
            <a href={bookCallHref()} target="_blank" rel="noopener" className="btn btn-primary btn-lg">
              <FiCalendar /> Book a free call
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
