import type { VercelRequest, VercelResponse } from '@vercel/node';
import PocketBase from 'pocketbase';

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(POCKETBASE_URL);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Fetch all submissions for admin dashboard
    try {
      const records = await pb.collection('submissions').getFullList();
      return res.status(200).json(records);
    } catch (error: any) {
      console.error('PocketBase fetch error:', error);
      return res.status(500).json({ error: error.message || 'Failed to fetch submissions from PocketBase' });
    }
  }

  if (req.method === 'PATCH') {
    // Handle approval/rejection
    try {
      const { id, status } = req.body;
      if (!id || !status) {
        return res.status(400).json({ error: 'Missing id or status' });
      }
      
      const record = await pb.collection('submissions').update(id, {
        status: status
      });
      
      return res.status(200).json(record);
    } catch (error: any) {
      console.error('PocketBase update error:', error);
      return res.status(500).json({ error: error.message || 'Failed to update submission' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received submission data:', req.body); // Debug log

    const data = {
      ...req.body,
      status: 'pending',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };

    console.log('Creating PocketBase record with data:', data); // Debug log

    // Create the record
    const result = await pb.collection('submissions').create(data);
    console.log('PocketBase create result:', result); // Debug log

    return res.status(200).json({ success: true, id: result.id });
  } catch (error: any) {
    console.error('PocketBase submission error:', error);
    // Return more detailed error information
    return res.status(500).json({ 
      error: error.message || 'Failed to submit to PocketBase',
      details: error.toString(),
      stack: error.stack
    });
  }
} 