import crypto from 'node:crypto';

type SessionPayload = {
  email: string;
  exp: number;
};

function getSecret() {
  return process.env.CMS_SESSION_SECRET || '';
}

function b64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function fromB64url(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '==='.slice((normalized.length + 3) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

export function createSessionToken(email: string, ttlSeconds = 60 * 60 * 8) {
  const secret = getSecret();
  if (!secret) {
    throw new Error('Missing CMS_SESSION_SECRET');
  }

  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const payloadPart = b64url(JSON.stringify(payload));
  const signature = b64url(crypto.createHmac('sha256', secret).update(payloadPart).digest());
  return `${payloadPart}.${signature}`;
}

export function verifySessionToken(token: string) {
  const secret = getSecret();
  if (!secret) {
    return null;
  }

  const [payloadPart, signaturePart] = token.split('.');
  if (!payloadPart || !signaturePart) {
    return null;
  }

  const expected = b64url(crypto.createHmac('sha256', secret).update(payloadPart).digest());
  if (expected !== signaturePart) {
    return null;
  }

  try {
    const payload = JSON.parse(fromB64url(payloadPart)) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function readBearerToken(authHeader: string | null) {
  if (!authHeader) return '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return '';
  return token;
}