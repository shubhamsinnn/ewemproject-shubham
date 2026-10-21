import { put, del } from '@vercel/blob';

const RAW_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  'vercel_blob_rw_IBQBG2FC8F0lS8rA_sLVdjgD0DhSRMJzsPpE0yVdFBs5WIj';
const BLOB_TOKEN = RAW_TOKEN.trim();
const PUBLIC_BLOB_BASE = 'https://ibqbg2fc8f0ls8ra.public.blob.vercel-storage.com';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { assignmentId, student = 'shubham' } = req.body || {};

    if (!assignmentId) {
      return res.status(400).json({ error: 'Missing assignmentId' });
    }

    const indexUrl = `${PUBLIC_BLOB_BASE}/${student}/assignments.json?t=${Date.now()}`;
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

    await put(`${student}/assignments.json`, JSON.stringify(records, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: BLOB_TOKEN,
      contentType: 'application/json',
    });

    return res.status(200).json({ success: true, assignmentId, allRecords: records });
  } catch (error: any) {
    console.error('Delete handler error:', error);
    return res.status(500).json({ error: error.message || 'Delete failed' });
  }
}
