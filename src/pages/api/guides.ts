import type { APIRoute } from 'astro';
import { getGuides } from '../../utils/guides';
import { getPath, isFirebaseAdminConfigured } from '../../lib/firebase/admin';

export const prerender = false;

type Guide = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  pdfFile: string;
  published: boolean;
  order: number;
  date: string;
};

function normalizeGuides(input: Record<string, Guide> | Guide[] | null): Guide[] {
  if (!input) return [];

  const list = Array.isArray(input)
    ? input
    : Object.entries(input).map(([slug, guide]) => ({ ...guide, slug: guide.slug || slug }));

  return list
    .filter(guide => guide?.published)
    .sort((a, b) => (a.order || 999) - (b.order || 999));
}

export const GET: APIRoute = async () => {
  try {
    if (!isFirebaseAdminConfigured()) {
      const localGuides = await getGuides();
      return new Response(JSON.stringify(localGuides), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const guides = normalizeGuides(await getPath<Record<string, Guide> | Guide[]>('downloadableGuides'));
    return new Response(JSON.stringify(guides), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch guides:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch guides' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};