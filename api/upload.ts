import { put } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  'vercel_blob_rw_IBQBG2FC8F0lS8rA_sLVdjgD0DhSRMJzsPpE0yVdFBs5WIj';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function getFallbackMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return 'application/pdf';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'doc': return 'application/msword';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls': return 'application/vnd.ms-excel';
    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'ppt': return 'application/vnd.ms-powerpoint';
    case 'pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'zip': return 'application/zip';
    default: return 'application/octet-stream';
  }
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const assignmentId = formData.get('assignmentId') as string | null;
    const student = (formData.get('student') as string | null) || 'shubham';

    if (!file || !assignmentId) {
      return new Response(
        JSON.stringify({ error: 'Missing required file or assignmentId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean file name
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `${student}/files/${assignmentId}_${Date.now()}_${cleanFileName}`;

    // Upload file to Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      token: BLOB_TOKEN,
      contentType: file.type || getFallbackMimeType(file.name),
    });

    // Fetch existing assignments index
    const indexUrl = `https://ibqbg2fc8f0ls8ra.public.blob.vercel-storage.com/${student}/assignments.json?t=${Date.now()}`;
    let records: Record<string, any> = {};
    try {
      const existingRes = await fetch(indexUrl, { cache: 'no-store' });
      if (existingRes.ok) {
        records = await existingRes.json();
      }
    } catch {
      records = {};
    }

    const newRecord = {
      assignmentId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || getFallbackMimeType(file.name),
      uploadedAt: new Date().toISOString(),
      fileUrl: blob.url,
      downloadUrl: blob.downloadUrl,
    };

    records[assignmentId] = newRecord;

    // Save updated index back to Vercel Blob
    await put(`${student}/assignments.json`, JSON.stringify(records, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: BLOB_TOKEN,
      contentType: 'application/json',
    });

    return new Response(
      JSON.stringify({ success: true, record: newRecord, allRecords: records }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Upload failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
