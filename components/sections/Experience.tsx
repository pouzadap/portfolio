'use client';

import { useCallback, useRef, useState } from 'react';
import { roles } from '@/lib/content';
import { usePinnedProgress } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n';

/** Pinned: the screen holds still and each third of the scroll brings in the next role. */
export function Experience() {
  const { t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  const onProgress = useCallback((p: number) => {
    rail.current?.style.setProperty('--fill', String(p));
    setActive(Math.min(roles.length - 1, Math.floor(p * roles.length)));
  }, []);
  usePinnedProgress(section, onProgress);

  const fmt = ([y, m]: readonly [number, number]) => `${t.experience.months[m - 1]} ${y}`;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="exp" id="experience" ref={section} aria-labelledby="exp-title">
      <div className="exp-sticky">
        <div className="inner exp-inner">
          <p className="eyebrow" id="exp-title">
            {t.experience.eyebrow}
          </p>
          <div className="company">
            <strong>NGXit</strong>
            <span>
              {roles[0].from[0]} — {roles[roles.length - 1].to[0]}
            </span>
          </div>
          <div className="exp-body">
            <ol className="exp-rail" ref={rail} aria-hidden="true">
              {roles.map((r, i) => (
                <li key={r.title} className={i <= active ? 'on' : undefined}>
                  {r.from[0]}
                </li>
              ))}
            </ol>
            <div className="exp-stage">
              {roles.map((r, i) => (
                <article
                  key={r.title}
                  className={`exp-item${i === active ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}
                  aria-hidden={i !== active}
                >
                  <span className="exp-count">
                    {pad(i + 1)} / {pad(roles.length)}
                  </span>
                  <time>
                    {fmt(r.from)} — {fmt(r.to)}
                  </time>
                  <h3>{r.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
