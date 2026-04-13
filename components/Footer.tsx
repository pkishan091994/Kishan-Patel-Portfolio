import Link from 'next/link';
import styles from './Footer.module.css';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark}>KP</span>
            <span>Kishan Patel</span>
          </Link>
          <p className={styles.tagline}>Mobile Application Developer · 8+ Years</p>
        </div>

        <nav className={styles.links}>
          <Link href="/about">About</Link>
          <Link href="/experience">Experience</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className={styles.social}>
          <a href="mailto:kishanpatel@email.com" aria-label="Email"><FiMail /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn"><FiLinkedin /></a>
          <a href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub"><FiGithub /></a>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {year} Kishan Patel. All rights reserved.</span>
      </div>
    </footer>
  );
}
