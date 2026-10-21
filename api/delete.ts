import { put, del } from '@vercel/blob';


const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  'vercel_blob_rw_IBQBG2FC8F0lS8rA_sLVdjgD0DhSRMJzsPpE0yVdFBs5WIj';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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
    const body = await request.json();
    const { assignmentId, student = 'shamita' } = body;

    if (!assignmentId) {
      return new Response(
        JSON.stringify({ error: 'Missing assignmentId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch existing index
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

    const targetRecord = records[assignmentId];
    if (targetRecord?.fileUrl) {
      try {
        await del(targetRecord.fileUrl, { token: BLOB_TOKEN });
      } catch (delErr) {
        console.warn('Could not delete file blob:', delErr);
      }
    }

    delete records[assignmentId];

    // Save updated index
    await put(`${student}/assignments.json`, JSON.stringify(records, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: BLOB_TOKEN,
      contentType: 'application/json',
    });

    return new Response(
      JSON.stringify({ success: true, assignmentId, allRecords: records }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Delete handler error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Delete failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
