'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Muted, looping, control-less video that only loads when it gets near the viewport
 * and pauses off-screen to save battery. Cannot be paused by the visitor.
 */
export function LazyVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (load) ref.current?.play().catch(() => {});
  }, [load]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      src={load ? src : undefined}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
