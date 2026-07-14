import type { APIRoute } from 'astro';
import { createSessionToken } from '../../../lib/admin/session';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string };

    const adminEmail = process.env.CMS_ADMIN_EMAIL || '';
    const adminPassword = process.env.CMS_ADMIN_PASSWORD || '';

    if (!adminEmail || !adminPassword) {
      return new Response(
        JSON.stringify({ error: 'CMS admin credentials are not configured on the server.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = createSessionToken(email);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to authenticate' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};