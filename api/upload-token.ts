import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';

const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  'vercel_blob_rw_IBQBG2FC8F0lS8rA_sLVdjgD0DhSRMJzsPpE0yVdFBs5WIj';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const pathname = (req.query && req.query.pathname) || 'uploads/file';

  try {
    const clientToken = await generateClientTokenFromReadWriteToken({
      token: BLOB_TOKEN,
      pathname,
      maximumSizeInBytes: 50 * 1024 * 1024,
    });

    return res.status(200).json({ clientToken, pathname });
  } catch (err: any) {
    console.error('Token generation error:', err);
    return res.status(500).json({ error: err.message || 'Token generation failed' });
  }
}
