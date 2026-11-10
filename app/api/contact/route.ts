import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  // honeypot: pretend success so bots don't retry
  if (typeof body.company === 'string' && body.company.trim()) return Response.json({ ok: true });

  const name = String(body.name ?? '').trim().slice(0, 120);
  const email = String(body.email ?? '').trim().slice(0, 200);
  const message = String(body.message ?? '').trim().slice(0, 5000);
  const lang = body.lang === 'pt' ? 'pt' : 'en';
  if (!name || !EMAIL_RE.test(email) || !message) {
    return Response.json({ error: 'invalid_fields' }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    console.error('[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set');
    return Response.json({ error: 'not_configured' }, { status: 503 });
  }

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
    to,
    replyTo: email,
    subject: `Portfolio · ${name}`,
    text: `${message}\n\n— ${name} <${email}> (site in ${lang.toUpperCase()})`,
    html: `<p style="white-space:pre-wrap">${escape(message)}</p><hr><p>${escape(name)} &lt;${escape(email)}&gt; · site in ${lang.toUpperCase()}</p>`,
  });

  if (error) {
    console.error('[contact] resend error', error);
    return Response.json({ error: 'send_failed' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
