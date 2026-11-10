'use client';

import { useI18n } from '@/lib/i18n';

export function About() {
  const { t } = useI18n();
  return (
    <section className="sec about" aria-labelledby="about-title">
      <div className="inner">
        <p className="eyebrow">{t.about.eyebrow}</p>
        <h2 className="h2" id="about-title">
          {t.about.lead} <span className="dim">{t.about.rest}</span>
        </h2>
      </div>
    </section>
  );
}
