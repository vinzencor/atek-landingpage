import type { APIRoute } from 'astro';
import { getCareerJobs } from '../../utils/careers';
import { getPath, isFirebaseAdminConfigured } from '../../lib/firebase/admin';

type CareerRecord = Record<string, any>;

function normalizeCareers(input: CareerRecord | any[] | null) {
  if (!input) return [];

  const list = Array.isArray(input)
    ? input
    : Object.entries(input).map(([slug, job]) => ({ ...job, slug: (job as any).slug || slug }));

  return list
    .filter(job => job?.published !== false)
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

export const GET: APIRoute = async () => {
  try {
    if (isFirebaseAdminConfigured()) {
      const firebaseJobs = normalizeCareers(await getPath<CareerRecord | any[]>('careers'));
      return new Response(JSON.stringify(firebaseJobs), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }

    const jobs = getCareerJobs();
    return new Response(JSON.stringify(jobs), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching career jobs:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch jobs' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
};
