'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import PhoneMockup from '@/components/PhoneMockup';
import ProjectCard from '@/components/ProjectCard';
import TechGrid from '@/components/TechGrid';
import { getProfile, getProjects, Profile, Project } from '@/lib/api';
import {
  SITE, SERVICES, PROCESS, TESTIMONIALS, bookCallHref, whatsappHref, findCaseStudy, shortTitle, caseStudyRank,
} from '@/lib/site';
import styles from './page.module.css';
import {
  FiArrowRight, FiCalendar, FiMail, FiCpu, FiGlobe, FiTool, FiZap,
} from 'react-icons/fi';
import { FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  rocket: <FiZap />, tool: <FiTool />, cpu: <FiCpu />, globe: <FiGlobe />,
};

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  // Render immediately; data fills in when Supabase answers (no full-page loader).
  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
    getProjects().then(setProjects).catch(() => {});
  }, []);

  const avatar = profile?.avatar_url || '/kishan-avatar.jpg';
  const featured = projects.filter((p) => findCaseStudy(p.title)?.featured).sort((a, b) => caseStudyRank(a.title) - caseStudyRank(b.title));
  const featuredList = (featured.length ? featured : projects).slice(0, 3);
  const heroApps = projects.slice(0, 3);
  const call = bookCallHref();

  return (
    <div className={styles.page}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden />
        <div className={`container ${styles.heroInner}`}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className={styles.availability}>
              <img src={avatar} alt={SITE.name} className={styles.miniAvatar} />
              <span>
                <strong>{SITE.name}</strong> · {SITE.role}
              </span>
              <span className={styles.dot} aria-hidden />
              <span className={styles.open}>Available now</span>
            </div>

            <h1 className={styles.headline}>
              I build mobile apps <span className={styles.accentText}>founders can ship and scale.</span>
            </h1>

            <p className={styles.stackLine}>
              {SITE.stackLine.join(' • ')} <span className={styles.sep}>|</span> {SITE.years} yrs{' '}
              <span className={styles.sep}>|</span> {SITE.apps} apps
            </p>

            <div className={styles.ctas}>
              <a href={call} target="_blank" rel="noopener" className="btn btn-primary btn-lg">
                <FiCalendar /> Book a free call
              </a>
              <Link href="/projects" className="btn btn-outline btn-lg">
                View work <FiArrowRight />
              </Link>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
          >
            {heroApps.length >= 3 ? (
              <>
                <div className={styles.phoneBack1}>
                  <PhoneMockup icon={heroApps[1].image_url} title={shortTitle(heroApps[1].title)} size="sm" />
                </div>
                <div className={styles.phoneFront}>
                  <PhoneMockup
                    icon={heroApps[0].image_url}
                    title={shortTitle(heroApps[0].title)}
                    subtitle={findCaseStudy(heroApps[0].title)?.headline}
                    size="lg"
                  />
                </div>
                <div className={styles.phoneBack2}>
                  <PhoneMockup icon={heroApps[2].image_url} title={shortTitle(heroApps[2].title)} size="sm" />
                </div>
              </>
            ) : (
              <div className={styles.phoneFront}>
                <PhoneMockup title="Your app" subtitle="Shipped to both stores" size="lg" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Trusted by strip */}
        <div className={`container ${styles.trusted}`}>
          <span className={styles.trustedLabel}>Apps I&apos;ve shipped for</span>
          <div className={styles.trustedRow}>
            {(projects.length ? projects : []).slice(0, 8).map((p) => (
              <div key={p.id} className={styles.trustedItem} title={p.title}>
                {p.image_url && <img src={p.image_url} alt="" loading="lazy" />}
                <span>{shortTitle(p.title)}</span>
              </div>
            ))}
            {!projects.length &&
              ['iDplus', 'myUpchar', 'DeepVid AI', 'ProNose AI', 'Teethsi', 'WineWise'].map((n) => (
                <div key={n} className={styles.trustedItem}><span>{n}</span></div>
              ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className={styles.statsBand}>
        <div className={`container ${styles.statsGrid}`}>
          {[
            { v: SITE.years, l: 'years building mobile apps' },
            { v: SITE.apps, l: 'apps shipped to the stores' },
            { v: 'iOS + Android', l: 'from a single codebase' },
            { v: 'Fintech · Health · AI', l: 'industries shipped in' },
          ].map((s) => (
            <div key={s.l} className={styles.stat}>
              <strong>{s.v}</strong>
              <span>{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Selected work ─────────────────────────────────── */}
      <AnimatedSection>
        <section className="section">
          <div className="container">
            <div className={styles.sectionHead}>
              <div className="section-title" style={{ marginBottom: 0 }}>
                <span className="section-label">Selected work</span>
                <h2>Real apps, real users, live in the stores.</h2>
              </div>
              <Link href="/projects" className="btn btn-ghost">
                All projects <FiArrowRight />
              </Link>
            </div>
            <div className={styles.workList}>
              {featuredList.map((p) => (
                <ProjectCard key={p.id} project={p} wide />
              ))}
              {!featuredList.length && <div className={styles.skeleton} />}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ── Services ─────────────────────────────────────── */}
      <AnimatedSection>
        <section className={`section ${styles.alt}`}>
          <div className="container">
            <div className="section-title">
              <span className="section-label">Services</span>
              <h2>How I can help</h2>
            </div>
            <div className={styles.services}>
              {SERVICES.map((s) => (
                <div key={s.title} className={styles.service}>
                  <div className={styles.serviceIcon}>{SERVICE_ICONS[s.icon]}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ── Process ───────────────────────────────────────── */}
      <AnimatedSection>
        <section className="section">
          <div className="container">
            <div className="section-title">
              <span className="section-label">How I work</span>
              <h2>Simple, transparent, fast.</h2>
            </div>
            <ol className={styles.process}>
              {PROCESS.map((step, i) => (
                <li key={step.title} className={styles.step}>
                  <span className={styles.stepNum}>0{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </AnimatedSection>

      {/* ── Tech stack ───────────────────────────────────── */}
      <AnimatedSection>
        <section className={`section ${styles.alt}`}>
          <div className="container">
            <div className={styles.sectionHead}>
              <div className="section-title" style={{ marginBottom: 0 }}>
                <span className="section-label">Stack</span>
                <h2>Tools I ship with</h2>
              </div>
              <Link href="/skills" className="btn btn-ghost">
                Full stack <FiArrowRight />
              </Link>
            </div>
            <TechGrid compact />
          </div>
        </section>
      </AnimatedSection>

      {/* ── Testimonials (only renders when real ones are added in lib/site.ts) ── */}
      {TESTIMONIALS.length > 0 && (
        <AnimatedSection>
          <section className="section">
            <div className="container">
              <div className="section-title">
                <span className="section-label">Testimonials</span>
                <h2>What clients say</h2>
              </div>
              <div className={styles.testimonials}>
                {TESTIMONIALS.map((t) => (
                  <figure key={t.name} className={styles.testimonial}>
                    <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* ── Contact CTA ───────────────────────────────────── */}
      <AnimatedSection>
        <section className="section" id="contact">
          <div className="container">
            <div className={styles.ctaBox}>
              <div>
                <span className="section-label">Let&apos;s talk</span>
                <h2>Have an app idea or a project that&apos;s stuck?</h2>
                <p>Tell me what you&apos;re building. You&apos;ll get a clear plan and a quote within 24 hours.</p>
              </div>
              <div className={styles.ctaActions}>
                <a href={call} target="_blank" rel="noopener" className="btn btn-primary btn-lg">
                  <FiCalendar /> Book a free call
                </a>
                <a href={whatsappHref()} target="_blank" rel="noopener" className="btn btn-whatsapp btn-lg">
                  <FaWhatsapp /> WhatsApp
                </a>
                <a href={`mailto:${SITE.email}`} className="btn btn-ghost btn-lg">
                  <FiMail /> {SITE.email}
                </a>
                <a href={SITE.linkedin} target="_blank" rel="noopener" className="btn btn-ghost btn-lg">
                  <FaLinkedinIn /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
