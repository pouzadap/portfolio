'use client';

import { useRef, useState, type FormEvent } from 'react';
import { links } from '@/lib/content';
import { useI18n } from '@/lib/i18n';

type Status = { kind: 'idle' | 'sending' | 'ok' | 'err'; msg: string };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle', msg: '' });
  const emailRef = useRef<HTMLAnchorElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      const sel = window.getSelection();
      const range = document.createRange();
      if (emailRef.current && sel) {
        range.selectNodeContents(emailRef.current);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (!data.name?.trim() || !EMAIL_RE.test(data.email ?? '') || !data.message?.trim()) {
      setStatus({ kind: 'err', msg: t.contact.invalid });
      return;
    }
    setStatus({ kind: 'sending', msg: t.contact.sending });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus({ kind: 'ok', msg: t.contact.sent });
    } catch {
      setStatus({ kind: 'err', msg: t.contact.failed });
    }
  };

  return (
    <section className="sec contact" id="contact" aria-labelledby="contact-title">
      <div className="inner">
        <h2 className="h2" id="contact-title">
          {t.contact.title}
        </h2>
        <div className="contact-grid">
          <ul className="links">
            <li>
              <span className="lbl">LinkedIn</span>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                /in/pedropefernandes
              </a>
            </li>
            <li>
              <span className="lbl">GitHub</span>
              <a href={links.github} target="_blank" rel="noopener noreferrer">
                /pouzadap
              </a>
            </li>
            <li>
              <span className="lbl">{t.contact.email}</span>
              <span className="email-row">
                <a className="val" href={`mailto:${links.email}`} ref={emailRef}>
                  {links.email}
                </a>
                <button type="button" className="copy" onClick={copy}>
                  {copied ? t.contact.copied : t.contact.copy}
                </button>
              </span>
            </li>
          </ul>
          <form className="form" onSubmit={submit} noValidate>
            <label htmlFor="f-name">
              {t.contact.fName}
              <input id="f-name" name="name" autoComplete="name" placeholder={t.contact.phName} maxLength={120} />
            </label>
            <label htmlFor="f-email">
              {t.contact.fEmail}
              <input id="f-email" name="email" type="email" autoComplete="email" placeholder={t.contact.phEmail} maxLength={200} />
            </label>
            <label htmlFor="f-msg">
              {t.contact.fMessage}
              <textarea id="f-msg" name="message" placeholder={t.contact.phMessage} maxLength={5000} />
            </label>
            {/* honeypot: hidden from people, filled by bots */}
            <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="send" type="submit" disabled={status.kind === 'sending'}>
              {status.kind === 'sending' ? t.contact.sending : t.contact.send}
            </button>
            <p className={`form-status ${status.kind}`} aria-live="polite">
              {status.kind === 'sending' ? '' : status.msg}
            </p>
          </form>
        </div>
      </div>
      <footer className="footer">
        <div className="inner">
          <span>© {new Date().getFullYear()} Pedro Fernandes</span>
          <span>AI · Software · UI/UX</span>
        </div>
      </footer>
    </section>
  );
}
