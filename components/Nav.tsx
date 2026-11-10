'use client';

import { useI18n } from '@/lib/i18n';

function FlagUS() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden="true">
      <rect width="30" height="20" fill="#fff" />
      <g fill="#b22234">
        {[0, 3.08, 6.15, 9.23, 12.31, 15.38, 18.46].map((y) => (
          <rect key={y} y={y} width="30" height="1.54" />
        ))}
      </g>
      <rect width="12" height="10.77" fill="#3c3b6e" />
      <g fill="#fff">
        {[
          [2.4, 2.2], [6, 2.2], [9.6, 2.2], [4.2, 4.4], [7.8, 4.4],
          [2.4, 6.6], [6, 6.6], [9.6, 6.6], [4.2, 8.8], [7.8, 8.8],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.55" />
        ))}
      </g>
    </svg>
  );
}

function FlagBR() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden="true">
      <rect width="30" height="20" fill="#009c3b" />
      <polygon points="15,2.4 27.6,10 15,17.6 2.4,10" fill="#ffdf00" />
      <circle cx="15" cy="10" r="4.3" fill="#002776" />
      <path d="M10.9 9.2c2.7-.7 5.6-.4 8.1.9" stroke="#fff" strokeWidth="0.7" fill="none" />
    </svg>
  );
}

export function Nav() {
  const { lang, setLang, t } = useI18n();
  return (
    <header className="nav">
      <div className="brand">
        <a className="mark" href="#top" aria-label="Pedro Fernandes">
          PF<span>.</span>
        </a>
        <div className="lang" role="group" aria-label={t.langLabel}>
          <button type="button" aria-pressed={lang === 'en'} aria-label="English" title="English" onClick={() => setLang('en')}>
            <FlagUS />
          </button>
          <button type="button" aria-pressed={lang === 'pt'} aria-label="Português" title="Português" onClick={() => setLang('pt')}>
            <FlagBR />
          </button>
        </div>
      </div>
    </header>
  );
}
