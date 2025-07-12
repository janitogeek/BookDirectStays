import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get Airtable credentials
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Submissions';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return res.status(500).json({ 
        error: 'Missing Airtable configuration',
        debug: {
          hasApiKey: !!AIRTABLE_API_KEY,
          hasBaseId: !!AIRTABLE_BASE_ID
        }
      });
    }

    // Prepare data for Airtable
    const fields = { ...req.body };
    
    // Convert arrays to JSON strings for Airtable
    Object.keys(fields).forEach(key => {
      if (Array.isArray(fields[key])) {
        fields[key] = JSON.stringify(fields[key]);
      }
    });

    // Submit to Airtable using fetch (no external dependencies)
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    
    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: fields
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({ 
        error: 'Airtable API error',
        details: errorData,
        status: response.status
      });
    }

    const result = await response.json();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Submission successful!',
      id: result.records[0].id
    });

  } catch (error: any) {
    console.error('Submission error:', error);
    
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      stack: error.stack
    });
  }
} 