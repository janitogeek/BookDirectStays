import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleWebhook } from '../../server/stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Call the original webhook handler
  return handleWebhook(req as any, res as any);
}