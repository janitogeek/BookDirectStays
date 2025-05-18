import type { VercelRequest, VercelResponse } from '@vercel/node';
import Airtable from 'airtable';

const baseId = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_API_KEY;
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Submissions';

if (!baseId || !apiKey) {
  throw new Error('Airtable credentials are not set in environment variables');
}

const base = new Airtable({ apiKey }).base(baseId);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const fields = req.body;
    // Map 'Cities / Regions' to array of names if needed
    if (Array.isArray(fields["Cities / Regions"])) {
      fields["Cities / Regions"] = fields["Cities / Regions"].map((c: any) => c.name || c);
    }
    // Optionally, validate fields here
    const result = await base(tableName).create([{ fields }]);
    return res.status(200).json({ success: true, id: result[0].id });
  } catch (error: any) {
    console.error('Airtable submission error:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit to Airtable' });
  }
} 