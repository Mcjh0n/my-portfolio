const OWNER_EMAIL = 'johnmarkfuentes8@gmail.com';
const CODE_TTL_SECONDS = 600;
const RATE_WINDOW_SECONDS = 900;
const MAX_CODES_PER_IP = 5;
const MAX_VERIFY_ATTEMPTS = 5;

function response(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'access-control-max-age': '86400',
      'vary': 'Origin',
      'cache-control': 'no-store',
    },
  });
}

function clean(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function cleanHeader(value, limit) {
  return clean(value, limit).replace(/[\r\n\t]/g, ' ');
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function newCode() {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(bytes[0] % 1_000_000).padStart(6, '0');
}

async function sendEmail(env, { to, subject, text }) {
  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.FROM_EMAIL, to, subject, text }),
  });
  if (!result.ok) throw new Error('Email delivery failed. Check the email service configuration.');
}

function originFor(request, env) {
  const origin = request.headers.get('Origin');
  return origin && origin === env.SITE_ORIGIN ? origin : null;
}

export default {
  async fetch(request, env) {
    const origin = originFor(request, env);
    if (!origin) return new Response('Origin not allowed', { status: 403 });
    if (request.method === 'OPTIONS') return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': origin,
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
        'access-control-max-age': '86400',
        'vary': 'Origin',
      },
    });

    const url = new URL(request.url);
    try {
      if (url.pathname === '/visits' && request.method === 'GET') {
        const visits = Number(await env.PORTFOLIO_KV.get('visits')) || 0;
        return response({ visits }, 200, origin);
      }

      if (url.pathname === '/visits' && request.method === 'POST') {
        if (!request.headers.get('content-type')?.startsWith('application/json')) {
          return response({ error: 'JSON content type required.' }, 415, origin);
        }
        // The portfolio records at most one count per browser tab session.
        // KV counters can be approximate if many visitors arrive at the exact same moment.
        const visits = (Number(await env.PORTFOLIO_KV.get('visits')) || 0) + 1;
        await env.PORTFOLIO_KV.put('visits', String(visits));
        return response({ visits }, 200, origin);
      }

      if (url.pathname === '/contact/start' && request.method === 'POST') {
        if (!env.RESEND_API_KEY || !env.FROM_EMAIL) return response({ error: 'Email verification is not configured yet. Please email John directly.' }, 503, origin);
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const rateKey = `rate:${await digest(ip)}`;
        const rate = Number(await env.PORTFOLIO_KV.get(rateKey)) || 0;
        if (rate >= MAX_CODES_PER_IP) return response({ error: 'Too many code requests. Please try again later.' }, 429, origin);

        const body = await request.json();
        const name = clean(body.name, 90);
        const email = clean(body.email, 254).toLowerCase();
        const subject = cleanHeader(body.subject, 120);
        const message = clean(body.message, 3000);
        if (name.length < 2 || !validEmail(email) || subject.length < 2 || message.length < 10) {
          return response({ error: 'Please check your name, email, subject, and message.' }, 400, origin);
        }

        const code = newCode();
        const key = `otp:${await digest(email)}`;
        const expiresAt = Date.now() + CODE_TTL_SECONDS * 1000;
        await env.PORTFOLIO_KV.put(key, JSON.stringify({ name, email, subject, message, codeHash: await digest(`${email}:${code}`), attempts: 0, expiresAt }), { expirationTtl: CODE_TTL_SECONDS });
        await env.PORTFOLIO_KV.put(rateKey, String(rate + 1), { expirationTtl: RATE_WINDOW_SECONDS });
        await sendEmail(env, {
          to: email,
          subject: 'Verify your email for John Mark’s portfolio',
          text: `Hi ${name},\n\nYour verification code is ${code}. It expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`,
        });
        return response({ message: 'A one-time code was sent to your email. It expires in 10 minutes.' }, 200, origin);
      }

      if (url.pathname === '/contact/verify' && request.method === 'POST') {
        const body = await request.json();
        const email = clean(body.email, 254).toLowerCase();
        const code = clean(body.code, 6);
        if (!validEmail(email) || !/^\d{6}$/.test(code)) return response({ error: 'Enter the email and 6-digit code.' }, 400, origin);
        const key = `otp:${await digest(email)}`;
        const record = await env.PORTFOLIO_KV.get(key, 'json');
        if (!record || Date.now() > record.expiresAt) {
          await env.PORTFOLIO_KV.delete(key);
          return response({ error: 'That code expired or was not found. Request a new one.' }, 400, origin);
        }
        if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
          await env.PORTFOLIO_KV.delete(key);
          return response({ error: 'Too many incorrect attempts. Request a new code.' }, 429, origin);
        }
        if ((await digest(`${email}:${code}`)) !== record.codeHash) {
          record.attempts += 1;
          const remainingTtl = Math.max(1, Math.ceil((record.expiresAt - Date.now()) / 1000));
          await env.PORTFOLIO_KV.put(key, JSON.stringify(record), { expirationTtl: remainingTtl });
          return response({ error: 'That code is incorrect. Check the email and try again.' }, 400, origin);
        }

        await env.PORTFOLIO_KV.delete(key);
        await sendEmail(env, {
          to: OWNER_EMAIL,
          subject: `Portfolio inquiry: ${clean(record.subject, 120)}`,
          text: `From: ${clean(record.name, 90)} <${email}>\nSubject: ${clean(record.subject, 120)}\n\n${clean(record.message, 3000)}`,
        });
        return response({ message: 'Email verified and your message was sent. Thank you!' }, 200, origin);
      }

      return response({ error: 'Not found.' }, 404, origin);
    } catch (error) {
      return response({ error: error instanceof Error ? error.message : 'Something went wrong. Please try again.' }, 500, origin);
    }
  },
};
