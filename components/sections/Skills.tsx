'use client';

import { hardSkills } from '@/lib/content';
import { useI18n } from '@/lib/i18n';

export function Skills() {
  const { t } = useI18n();
  return (
    <section className="sec" aria-label={t.skills.eyebrow}>
      <div className="inner">
        <p className="eyebrow">{t.skills.eyebrow}</p>
        <ul className="skills-list">
          {hardSkills.map((s) => (
            <li key={s.name}>
              {s.name} <span>{s.tier === 'core' ? t.skills.core : t.skills.build}</span>
            </li>
          ))}
        </ul>
        <div className="soft">
          {t.skills.soft.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
