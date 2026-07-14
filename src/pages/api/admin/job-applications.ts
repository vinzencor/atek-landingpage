import type { APIRoute } from 'astro';
import { getPath, setPath } from '../../../lib/firebase/admin';
import { ensureAdmin, jsonError } from './helpers';

export const prerender = false;

type JobApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobRole: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  resume?: {
    filename?: string;
    contentType?: string;
    size?: number;
    base64?: string;
  };
};

export const GET: APIRoute = async ({ request }) => {
  if (!ensureAdmin(request)) return jsonError('Unauthorized', 401);

  const data = (await getPath<Record<string, JobApplication>>('jobApplications')) || {};
  const list = Object.values(data)
    .map((item) => ({
      ...item,
      resume: item.resume
        ? {
            filename: item.resume.filename,
            contentType: item.resume.contentType,
            size: item.resume.size,
          }
        : undefined,
    }))
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  return new Response(JSON.stringify(list), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PATCH: APIRoute = async ({ request }) => {
  if (!ensureAdmin(request)) return jsonError('Unauthorized', 401);

  const body = (await request.json()) as { id?: string; status?: JobApplication['status'] };
  const id = String(body?.id || '').trim();
  const status = body?.status;

  if (!id || !status || !['pending', 'approved', 'rejected'].includes(status)) {
    return jsonError('Invalid id or status', 400);
  }

  const applications = (await getPath<Record<string, JobApplication>>('jobApplications')) || {};
  const existing = applications[id];

  if (!existing) {
    return jsonError('Application not found', 404);
  }

  applications[id] = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  };

  await setPath('jobApplications', applications);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
