import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    message: 'Environment test endpoint',
    hasAirtableApiKey: !!process.env.AIRTABLE_API_KEY,
    hasAirtableBaseId: !!process.env.AIRTABLE_BASE_ID,
    airtableApiKeyPrefix: process.env.AIRTABLE_API_KEY?.substring(0, 4) || 'not found',
    airtableBaseIdPrefix: process.env.AIRTABLE_BASE_ID?.substring(0, 4) || 'not found',
    allAirtableEnvKeys: Object.keys(process.env).filter(key => key.includes('AIRTABLE')),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
  });
} 