const PUBLIC_BLOB_BASE = 'https://ibqbg2fc8f0ls8ra.public.blob.vercel-storage.com';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const student = (req.query && req.query.student) || 'shamita';

  try {
    const indexUrl = `${PUBLIC_BLOB_BASE}/${student}/assignments.json?t=${Date.now()}`;
    const r = await fetch(indexUrl, { cache: 'no-store' });

    if (!r.ok) {
      return res.status(200).json({ success: true, student, records: {} });
    }

    const records = await r.json();
    return res.status(200).json({ success: true, student, records: records || {} });
  } catch (error: any) {
    console.error('Assignments API error:', error);
    return res.status(500).json({ success: false, error: error.message, records: {} });
  }
}
