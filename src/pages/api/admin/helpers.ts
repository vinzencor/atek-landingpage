import { readBearerToken, verifySessionToken } from '../../../lib/admin/session';

export function ensureAdmin(request: Request) {
  const token = readBearerToken(request.headers.get('authorization'));
  const session = verifySessionToken(token);
  return Boolean(session);
}

export function jsonError(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}