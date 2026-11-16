import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { FiGithub, FiCheck } from 'react-icons/fi';
import PhoneMockup from './PhoneMockup';
import { Project } from '@/lib/api';
import { findCaseStudy, shortTitle } from '@/lib/site';
import styles from './ProjectCard.module.css';

/** Turn long store copy into a single short sentence when no case study exists. */
function firstSentence(text: string) {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  const s = clean.split(/(?<=[.!?])\s/)[0] || '';
  return s.length > 140 ? s.slice(0, 137).trimEnd() + '…' : s;
}

export default function ProjectCard({ project, wide = false }: { project: Project; wide?: boolean }) {
  const cs = findCaseStudy(project.title);
  const name = shortTitle(project.title);
  const headline = cs?.headline || firstSentence(project.description);
  const tags = project.tech_stack?.length ? project.tech_stack : cs?.tags || [];

  return (
    <article className={`${styles.card} ${wide ? styles.wide : ''}`}>
      <div className={styles.visual}>
        <PhoneMockup icon={project.image_url} title={name} size={wide ? 'md' : 'sm'} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{name}</h3>
        {headline && <p className={styles.headline}>{headline}</p>}
        {cs?.bullets && (
          <ul className={styles.bullets}>
            {cs.bullets.map((b) => (
              <li key={b}><FiCheck aria-hidden /> {b}</li>
            ))}
          </ul>
        )}
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((t) => <span key={t} className="badge">{t}</span>)}
          </div>
        )}
        <div className={styles.links}>
          {project.app_store_url && (
            <a href={project.app_store_url} target="_blank" rel="noopener" className={styles.store}>
              <FaApple /> App Store
            </a>
          )}
          {project.play_store_url && (
            <a href={project.play_store_url} target="_blank" rel="noopener" className={styles.store}>
              <FaGooglePlay /> Google Play
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener" className={styles.store}>
              <FiGithub /> Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
