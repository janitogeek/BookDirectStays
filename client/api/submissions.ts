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
  if (req.method === 'GET') {
    // Fetch all submissions for admin dashboard
    try {
      const records = await base(tableName).select({}).all();
      const submissions = records.map((record: any) => ({
        id: record.id,
        ...record.fields,
        createdTime: record.createdTime,
      }));
      return res.status(200).json(submissions);
    } catch (error: any) {
      console.error('Airtable fetch error:', error);
      return res.status(500).json({ error: error.message || 'Failed to fetch submissions from Airtable' });
    }
  }

  if (req.method === 'PATCH') {
    // Handle approval/rejection
    try {
      const { id, status } = req.body;
      if (!id || !status) {
        return res.status(400).json({ error: 'Missing id or status' });
      }
      
      const record = await base(tableName).update(id, {
        Status: status,
        Approved: status === 'approved'
      });
      
      return res.status(200).json(record);
    } catch (error: any) {
      console.error('Airtable update error:', error);
      return res.status(500).json({ error: error.message || 'Failed to update submission' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received submission data:', req.body); // Debug log

    const fields = req.body;
    
    // Add status and approval fields
    fields.Status = 'pending';
    fields.Approved = false;
    fields.createdTime = new Date().toISOString();

    console.log('Creating Airtable record with fields:', fields); // Debug log

    // Create the record
    const result = await base(tableName).create([{ fields }]);
    console.log('Airtable create result:', result); // Debug log

    return res.status(200).json({ success: true, id: result[0].id });
  } catch (error: any) {
    console.error('Airtable submission error:', error);
    // Return more detailed error information
    return res.status(500).json({ 
      error: error.message || 'Failed to submit to Airtable',
      details: error.toString(),
      stack: error.stack
    });
  }
} 