import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPath, isFirebaseAdminConfigured } from '../../lib/firebase/admin';

function normalizeCategories(input: Record<string, any> | any[] | null) {
  if (!input) return [];

  const list = Array.isArray(input)
    ? input
    : Object.entries(input).map(([slug, category]) => ({ ...category, slug: category.slug || slug }));

  return list
    .filter(category => category?.published !== false)
    .map((category, index) => ({
      id: category.id || category.slug || String(index),
      slug: category.slug || category.id || String(index),
      name: category.name || 'Untitled',
      order: category.order ?? index + 1,
      published: category.published !== false,
      description: category.description || '',
      jobs: Array.isArray(category.jobs) ? category.jobs : [],
    }))
    .sort((a, b) => a.order - b.order);
}

export const GET: APIRoute = async () => {
  try {
    if (isFirebaseAdminConfigured()) {
      const firebaseCategories = normalizeCategories(await getPath<Record<string, any> | any[]>('jobCategories'));
      return new Response(JSON.stringify(firebaseCategories), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const categories = await getCollection('job-categories');
    
    const jobCategories = categories
      .filter(category => category.data.published)
      .map(category => ({
        id: category.id,
        slug: category.slug,
        name: category.data.name,
        order: category.data.order,
        published: category.data.published,
        description: category.data.description,
        jobs: category.data.jobs || [],
      }))
      .sort((a, b) => a.order - b.order);

    return new Response(JSON.stringify(jobCategories), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching job categories:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch job categories' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
