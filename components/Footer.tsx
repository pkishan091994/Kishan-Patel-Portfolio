import Link from 'next/link';
import styles from './Footer.module.css';
import { FiLinkedin, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { SITE, whatsappHref } from '@/lib/site';

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
          <p className={styles.tagline}>Mobile apps founders can ship and scale · {SITE.years} yrs · {SITE.apps} apps</p>
        </div>

        <nav className={styles.links}>
          <Link href="/about">About</Link>
          <Link href="/experience">Experience</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className={styles.social}>
          <a href={`mailto:${SITE.email}`} aria-label="Email"><FiMail /></a>
          <a href={SITE.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn"><FiLinkedin /></a>
          <a href={whatsappHref()} target="_blank" rel="noopener" aria-label="WhatsApp"><FaWhatsapp /></a>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {year} Kishan Patel. All rights reserved.</span>
      </div>
    </footer>
  );
}
