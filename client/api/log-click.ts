import type { VercelRequest, VercelResponse } from '@vercel/node';

const AIRTABLE_API_KEY = process.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = 'app0tFfsjLbI1qXq0';
const AIRTABLE_TABLE_NAME = 'Directory Submissions';
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

interface ClickRequest {
  hostId: string;
  type: 'website' | 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok' | 'company';
}

// Map click types to Airtable field names
const FIELD_MAPPING = {
  website: 'Clicks to Website',
  instagram: 'Clicks to Instagram', 
  facebook: 'Clicks to Facebook',
  linkedin: 'Clicks to LinkedIn',
  youtube: 'Clicks to YouTube',
  tiktok: 'Clicks to TikTok',
  company: 'Clicks to Company Page'
} as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!AIRTABLE_API_KEY) {
    console.error('Missing Airtable API key');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { hostId, type }: ClickRequest = req.body;

    // Validate input
    if (!hostId || !type) {
      return res.status(400).json({ error: 'Missing hostId or type' });
    }

    if (!FIELD_MAPPING[type]) {
      return res.status(400).json({ error: 'Invalid click type' });
    }

    const fieldName = FIELD_MAPPING[type];

    // Step 1: Get current record to read current click count
    const getResponse = await fetch(`${AIRTABLE_API_URL}/${hostId}`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!getResponse.ok) {
      if (getResponse.status === 404) {
        return res.status(404).json({ error: 'Host not found' });
      }
      throw new Error(`Failed to fetch record: ${getResponse.statusText}`);
    }

    const record = await getResponse.json();
    const currentCount = record.fields[fieldName] || 0;

    // Step 2: Update the record with incremented count
    const updateResponse = await fetch(`${AIRTABLE_API_URL}/${hostId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          [fieldName]: currentCount + 1
        }
      }),
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to update record: ${updateResponse.statusText}`);
    }

    await updateResponse.json();
    
    console.log(`✅ Click tracked: ${type} for host ${hostId} (${currentCount} → ${currentCount + 1})`);

    return res.status(200).json({ 
      success: true, 
      type,
      newCount: currentCount + 1,
      recordId: hostId
    });

  } catch (error: any) {
    console.error('❌ Click tracking error:', error);
    return res.status(500).json({ 
      error: 'Failed to track click',
      details: error.message 
    });
  }
} 