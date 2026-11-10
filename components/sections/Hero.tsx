'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';

const VERBS = ['Synthesizing', 'Reasoning', 'Vectorizing', 'Distilling', 'Orchestrating', 'Compiling'];
const SPIN = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Hero() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState('');
  const [spin, setSpin] = useState('');
  const [verb, setVerb] = useState('');
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  const run = useRef(0);

  useEffect(() => {
    const id = ++run.current;
    const alive = () => id === run.current;
    const { q: Q, a1: A1, a2: A2 } = t.hero;
    setQ(''); setA1(''); setA2(''); setVerb(''); setSpin('');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setQ(Q); setA1(A1); setA2(A2);
      return;
    }

    const type = async (text: string, set: (s: string) => void, speed: number) => {
      for (let i = 1; i <= text.length; i++) {
        if (!alive()) return false;
        set(text.slice(0, i));
        await sleep(speed + Math.random() * speed * 0.6);
      }
      return true;
    };

    (async () => {
      await sleep(500);
      if (!(await type(Q, setQ, 42))) return;
      const picks = [...VERBS].sort(() => Math.random() - 0.5).slice(0, 3);
      const start = performance.now();
      let f = 0;
      while (performance.now() - start < 1700) {
        if (!alive()) return;
        setSpin(SPIN[f++ % SPIN.length]);
        setVerb(picks[Math.min(2, Math.floor((performance.now() - start) / 570))] + '…');
        await sleep(70);
      }
      setSpin(''); setVerb('');
      if (!(await type(A1, setA1, 34))) return;
      await sleep(180);
      await type(A2, setA2, 16);
    })();

    return () => {
      run.current++;
    };
  }, [t, lang]);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">
        Pedro Fernandes. {t.hero.a1} {t.hero.a2}
      </h1>
      <div className="inner" aria-hidden="true">
        <p className="prompt">
          <span className="sign">›</span>
          <span>{q}</span>
          <span className="cursor" />
        </p>
        <p className="thinking">
          <span>{spin}</span>
          <span className="verb">{verb}</span>
        </p>
        <p className="answer">
          <span>{a1}</span>
          <span className="answer-sub">{a2}</span>
        </p>
        <div className="hero-foot">
          <span>{t.hero.tagline}</span>
          <span className="scroll-line">
            {t.hero.scroll} <i />
          </span>
        </div>
      </div>
    </section>
  );
}
