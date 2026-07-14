import type { APIRoute } from 'astro';
import { ensureAdmin, jsonError } from './helpers';
import { getPath, setPath } from '../../../lib/firebase/admin';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (!ensureAdmin(request)) return jsonError('Unauthorized', 401);
  const data = (await getPath<Record<string, unknown>>('careerPageSettings')) || {};
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const PUT: APIRoute = async ({ request }) => {
  if (!ensureAdmin(request)) return jsonError('Unauthorized', 401);
  const body = await request.json();
  await setPath('careerPageSettings', body);
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};