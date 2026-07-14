import type { APIRoute } from 'astro';
import { getPath, isFirebaseAdminConfigured, setPath } from '../../lib/firebase/admin';

export const prerender = false;

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

function sanitizeFilename(name: string) {
  return String(name || 'resume')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!isFirebaseAdminConfigured()) {
      return new Response(JSON.stringify({ error: 'Job applications are not configured on this server.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const name = String(formData.get('name') || '').trim();
    const jobRole = String(formData.get('jobRole') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const resume = formData.get('resume');

    if (!name || !jobRole || !email || !phone) {
      return new Response(JSON.stringify({ error: 'Please complete all required fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!(resume instanceof File) || !resume.size) {
      return new Response(JSON.stringify({ error: 'Resume is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (resume.size > MAX_RESUME_SIZE_BYTES) {
      return new Response(JSON.stringify({ error: 'Resume exceeds the 5MB limit.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fileBuffer = Buffer.from(await resume.arrayBuffer());
    const ext = resume.name.includes('.') ? resume.name.split('.').pop() : 'file';
    const applicationId = `app-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const payload = {
      id: applicationId,
      name,
      jobRole,
      email,
      phone,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resume: {
        filename: sanitizeFilename(resume.name || `resume.${ext}`),
        contentType: resume.type || 'application/octet-stream',
        size: resume.size,
        base64: fileBuffer.toString('base64'),
      },
    };

    const existing = (await getPath<Record<string, unknown>>('jobApplications')) || {};
    await setPath('jobApplications', {
      ...existing,
      [applicationId]: payload,
    });

    return new Response(JSON.stringify({ success: true, id: applicationId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to save job application:', error);
    return new Response(JSON.stringify({ error: 'Failed to submit application' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
