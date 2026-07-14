import type { APIRoute } from 'astro';
import { createSessionToken } from '../../../lib/admin/session';

export const prerender = false;

function readAdminEmail() {
  return (typeof process !== 'undefined' && process.env?.CMS_ADMIN_EMAIL) || import.meta.env.CMS_ADMIN_EMAIL || '';
}

function readAdminPassword() {
  return (typeof process !== 'undefined' && process.env?.CMS_ADMIN_PASSWORD) || import.meta.env.CMS_ADMIN_PASSWORD || '';
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string };
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    const normalizedPassword = typeof password === 'string' ? password : '';

    const adminEmail = readAdminEmail();
    const adminPassword = readAdminPassword();

    if (!adminEmail || !adminPassword) {
      return new Response(
        JSON.stringify({ error: 'CMS admin credentials are not configured on the server.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (normalizedEmail !== adminEmail || normalizedPassword !== adminPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = createSessionToken(normalizedEmail);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Admin auth failed:', error);
    const message = error instanceof Error ? error.message : 'Failed to authenticate';

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};