'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { LazyVideo } from '@/components/LazyVideo';
import { deckVideos, links } from '@/lib/content';
import { useI18n } from '@/lib/i18n';

export function Darkdome() {
  const { t } = useI18n();
  const deck = useRef<HTMLDivElement>(null);

  // Cards start stacked and fan out when the deck scrolls into view.
  useEffect(() => {
    const el = deck.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top <= window.innerHeight) return;
    el.classList.add('is-stacked');
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.remove('is-stacked');
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mid = (deckVideos.length - 1) / 2;

  return (
    <section className="sec" id="darkdome" aria-labelledby="dd-title">
      <div className="inner">
        <div className="dd-grid">
          <div className="dd-head">
            <p className="eyebrow">{t.darkdome.eyebrow}</p>
            <h2 className="h2" id="dd-title">
              Darkdome
            </h2>
            <p>{t.darkdome.desc}</p>
            <a className="dd-link mono" href={links.darkdome} target="_blank" rel="noopener noreferrer">
              darkdome.io <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="term" role="img" aria-label="darkdome status: ingest, triage, respond, automate, observe">
            <div className="term-bar">
              <span>darkdome — status</span>
              <span className="live">● live</span>
            </div>
            <pre>
              <span className="p">$</span> darkdome status{'\n'}
              <span className="k">ingest   </span> email · api · any vendor{'\n'}
              <span className="k">triage   </span> correlate → IoCs → threat intel → AI{'\n'}
              <span className="k">respond  </span> recommended actions, analyst-approved{'\n'}
              <span className="hl">
                <span className="p">automate </span> visual workflow editor  ↓
              </span>
              {'\n'}
              <span className="k">observe  </span> executive · tactical · analytical · SLA{'\n'}
              <span className="p">$</span> <span className="cursor" />
            </pre>
          </div>
        </div>
        <div className="deck" ref={deck} aria-label={t.darkdome.deckLabel}>
          {deckVideos.map((name, idx) => {
            const i = idx - mid;
            const style = { '--i': i, '--a': Math.abs(i), backgroundImage: `url(/videos/cards/${name}.jpg)` } as CSSProperties;
            return (
              <div className="card" style={style} key={name}>
                <LazyVideo src={`/videos/cards/${name}.mp4`} poster={`/videos/cards/${name}.jpg`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
