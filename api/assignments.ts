
const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  'vercel_blob_rw_IBQBG2FC8F0lS8rA_sLVdjgD0DhSRMJzsPpE0yVdFBs5WIj';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const student = url.searchParams.get('student') || 'shamita';

    // Direct fetch from public blob store index
    const indexUrl = `https://ibqbg2fc8f0ls8ra.public.blob.vercel-storage.com/${student}/assignments.json?t=${Date.now()}`;
    const res = await fetch(indexUrl, { cache: 'no-store' });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: true, student, records: {} }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const records = await res.json();
    return new Response(
      JSON.stringify({ success: true, student, records: records || {} }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error fetching assignments:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message, records: {} }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
