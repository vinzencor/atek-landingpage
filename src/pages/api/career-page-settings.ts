import type { APIRoute } from 'astro';
import { getCareerPageContent } from '../../utils/careers';
import { getPath, isFirebaseAdminConfigured } from '../../lib/firebase/admin';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    if (!isFirebaseAdminConfigured()) {
      const fallback = getCareerPageContent();
      return new Response(JSON.stringify(fallback || {}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const settings = (await getPath<Record<string, unknown>>('careerPageSettings')) || {};
    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch career page settings:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch career page settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};