'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProfile, getExperience, getSkills, getProjects, getEducation } from '@/lib/api';
import styles from './page.module.css';
import { FiUser, FiBriefcase, FiCode, FiGrid, FiBookOpen, FiLink, FiArrowRight, FiMail, FiSettings } from 'react-icons/fi';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ experience: 0, skills: 0, projects: 0, education: 0 });
  const [profileName, setProfileName] = useState('Kishan Patel');

  useEffect(() => {
    getProfile().then((p) => { if (p?.name) setProfileName(p.name); });
    Promise.all([getExperience(), getSkills(), getProjects(), getEducation()]).then(
      ([exp, skills, projects, edu]) =>
        setCounts({ experience: exp.length, skills: skills.length, projects: projects.length, education: edu.length })
    );
  }, []);

  const cards = [
    { href: '/admin/profile', icon: <FiUser />, label: 'Profile', desc: 'Update your bio, photo, and contact info', count: null },
    { href: '/admin/experience', icon: <FiBriefcase />, label: 'Experience', desc: 'Manage career history', count: counts.experience },
    { href: '/admin/skills', icon: <FiCode />, label: 'Skills', desc: 'Add or update technical skills', count: counts.skills },
    { href: '/admin/projects', icon: <FiGrid />, label: 'Projects', desc: 'Showcase your work', count: counts.projects },
    { href: '/admin/education', icon: <FiBookOpen />, label: 'Education', desc: 'Academic background', count: counts.education },
    { href: '/admin/contact-links', icon: <FiLink />, label: 'Contact Links', desc: 'Social media & links', count: null },
    { href: '/admin/messages', icon: <FiMail />, label: 'Messages', desc: 'View contact form submissions', count: null },
    { href: '/admin/settings', icon: <FiSettings />, label: 'Settings', desc: 'Change admin password', count: null },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <h1>Welcome back 👋</h1>
        <p>Manage all content for <strong>{profileName}</strong>'s portfolio from this panel.</p>
      </div>

      <div className={styles.grid}>
        {cards.map(({ href, icon, label, desc, count }) => (
          <Link key={href} href={href} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.icon}>{icon}</div>
              {count !== null && (
                <span className={styles.count}>{count}</span>
              )}
            </div>
            <h3>{label}</h3>
            <p>{desc}</p>
            <span className={styles.cardLink}>
              Manage <FiArrowRight size={13} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
