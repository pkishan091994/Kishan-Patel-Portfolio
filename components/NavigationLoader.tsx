'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Loader from './Loader';

/**
 * Shows a themed full-page loader whenever the user navigates
 * to a different public route (navbar / in-page links).
 */
export default function NavigationLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hide once the new route has mounted
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      // brief hold so the transition feels intentional
      hideTimer.current = setTimeout(() => setVisible(false), 280);
    }
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [pathname]);

  // Catch same-origin <a> / Next Link clicks that change the path
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // External or new-tab links — skip
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;

        const nextPath = url.pathname;
        if (nextPath === pathname) return;

        // Admin routes have their own loader
        if (nextPath.startsWith('/kishan-dashboard')) return;

        setVisible(true);
      } catch {
        // ignore invalid URLs
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pathname]);

  return <Loader variant="overlay" visible={visible} label="Loading" showProgress />;
}
