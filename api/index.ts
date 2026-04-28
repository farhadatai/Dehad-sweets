/**
 * Vercel deploy entry handler, for serverless deployment, please don't modify this file
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.url?.startsWith('/api/health')) {
    return res.status(200).json({ status: 'ok' });
  }

  try {
    const { default: app } = await import('../server/app.js');
    return app(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown API startup error';
    console.error('API startup failed:', error);
    return res.status(500).json({ error: 'API startup failed', message });
  }
}
