'use client';

import { useEffect, useRef, useState } from 'react';

/** Fixed full-screen WebGL layer. three.js is loaded lazily so it never blocks first paint. */
export function CoreCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let cancelled = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    import('@/lib/liquid-core').then(({ createLiquidCore }) => {
      if (cancelled || !ref.current) return;
      cleanup = createLiquidCore(ref.current, { reduced, reformAt: 'contact' });
      if (!cleanup) setFailed(true);
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  if (failed) return <div className="gl-fallback" aria-hidden="true" />;
  return <canvas ref={ref} className="gl" aria-hidden="true" />;
}
