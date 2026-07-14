import type { APIRoute } from 'astro';
import { getPath } from '../../../../../lib/firebase/admin';
import { ensureAdmin, jsonError } from '../../helpers';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  if (!ensureAdmin(request)) return jsonError('Unauthorized', 401);

  const id = String(params.id || '').trim();
  if (!id) return jsonError('Missing application id', 400);

  const item = await getPath<any>(`jobApplications/${id}`);
  if (!item?.resume?.base64) return jsonError('Resume not found', 404);

  const contentType = item.resume.contentType || 'application/octet-stream';
  const filename = item.resume.filename || `resume-${id}.bin`;
  const buffer = Buffer.from(String(item.resume.base64), 'base64');

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(buffer.length),
    },
  });
};
