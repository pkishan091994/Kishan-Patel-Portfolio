'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './layout.module.css';
import {
  FiUser, FiBriefcase, FiCode, FiGrid, FiBookOpen,
  FiLink, FiLogOut, FiMenu, FiX, FiHome, FiMail, FiSettings
} from 'react-icons/fi';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: <FiGrid /> },
  { href: '/admin/profile', label: 'Profile', icon: <FiUser /> },
  { href: '/admin/experience', label: 'Experience', icon: <FiBriefcase /> },
  { href: '/admin/skills', label: 'Skills', icon: <FiCode /> },
  { href: '/admin/projects', label: 'Projects', icon: <FiHome /> },
  { href: '/admin/education', label: 'Education', icon: <FiBookOpen /> },
  { href: '/admin/contact-links', label: 'Contact Links', icon: <FiLink /> },
  { href: '/admin/messages', label: 'Messages', icon: <FiMail /> },
  { href: '/admin/settings', label: 'Settings / Password', icon: <FiSettings /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
      setChecking(false);
    });
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  if (pathname === '/admin/login') return <>{children}</>;
  if (checking) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      {/* Overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark}>KP</span>
            <span>Admin Panel</span>
          </Link>
          <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${pathname === href ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.viewSite} target="_blank">
            View Site ↗
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <span className={styles.pageTitle}>
            {navItems.find((n) => n.href === pathname)?.label || 'Admin'}
          </span>
          <button onClick={handleLogout} className={styles.logoutSmall}>
            <FiLogOut /> Logout
          </button>
        </header>

        {/* Page Content */}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
