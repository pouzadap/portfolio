'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { I18nProvider } from '@/lib/i18n';

function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <SmoothScroll />
      {children}
    </I18nProvider>
  );
}
