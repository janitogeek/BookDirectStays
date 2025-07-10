import type { VercelRequest, VercelResponse } from '@vercel/node';
import Airtable from 'airtable';

// Initialize Airtable
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Submissions';

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  throw new Error('Airtable configuration missing. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID');
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// Helper to get record IDs for city/region names
async function getCityRecordIds(cityNames: string[]) {
  const recordIds: string[] = [];
  for (const name of cityNames) {
    try {
      const records = await base('Cities / Regions').select({
        filterByFormula: `{Name} = "${name}"`
      }).firstPage();
      if (records.length > 0) {
        recordIds.push(records[0].id);
      }
    } catch (error) {
      console.error(`Error looking up city "${name}":`, error);
    }
  }
  return recordIds;
}

// List of valid Airtable fields (from your form schema)
const validFields = [
  'Submitted By (Email)',
  'Brand Name',
  'Direct Booking Website',
  'Number of Listings',
  'One-line Description',
  'Why Book With You?',
  'Choose Your Listing Type',
  'Countries',
  'Cities / Regions',
  'Types of Stays',
  'Ideal For',
  'Is your brand pet-friendly?',
  'Perks / Amenities',
  'Eco-Conscious Stay?',
  'Remote-Work Friendly?',
  'Vibe / Aesthetic',
  'Instagram',
  'Facebook',
  'LinkedIn',
  'TikTok',
  'YouTube / Video Tour',
  'Logo Upload',
  'Highlight Image'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received Airtable submission data:', req.body);

    const fields = { ...req.body };

    // Filter out unknown fields
    Object.keys(fields).forEach(key => {
      if (!validFields.includes(key)) {
        console.log(`Removing unknown field: ${key}`);
        delete fields[key];
      }
    });

    // Map 'Cities / Regions' to array of names if needed
    if (Array.isArray(fields['Cities / Regions'])) {
      fields['Cities / Regions'] = fields['Cities / Regions'].map((c: any) => c.name || c);
    }

    // Get record IDs for cities/regions if it's a linked record field
    if (Array.isArray(fields['Cities / Regions']) && fields['Cities / Regions'].length > 0) {
      try {
        const cityRecordIds = await getCityRecordIds(fields['Cities / Regions']);
        if (cityRecordIds.length > 0) {
          fields['Cities / Regions'] = cityRecordIds;
        }
      } catch (error) {
        console.error('Error getting city record IDs:', error);
        // Fallback: keep as array of names
      }
    }

    // Format attachment fields for Airtable
    const attachmentFields = ['Logo Upload', 'Highlight Image'];
    attachmentFields.forEach(field => {
      if (fields[field]) {
        if (typeof fields[field] === 'string') {
          fields[field] = [{ url: fields[field] }];
        } else if (Array.isArray(fields[field])) {
          fields[field] = fields[field].map((item: any) =>
            typeof item === 'string' ? { url: item } : item
          );
        }
      }
    });

    // Convert boolean fields to proper format
    const booleanFields = ['Is your brand pet-friendly?', 'Eco-Conscious Stay?', 'Remote-Work Friendly?'];
    booleanFields.forEach(field => {
      if (fields[field] !== undefined) {
        fields[field] = fields[field] === 'true' || fields[field] === true;
      }
    });

    // Convert array fields to JSON strings if they're arrays
    const arrayFields = ['Countries', 'Types of Stays', 'Ideal For', 'Perks / Amenities', 'Vibe / Aesthetic'];
    arrayFields.forEach(field => {
      if (Array.isArray(fields[field])) {
        fields[field] = JSON.stringify(fields[field]);
      }
    });

    console.log('Processed fields for Airtable:', fields);

    // Submit to Airtable
    const result = await base(AIRTABLE_TABLE_NAME).create([
      {
        fields: fields
      }
    ]);

    console.log('Airtable submission successful:', result);

    return res.status(200).json({ 
      success: true, 
      id: result[0].id,
      message: 'Submission successful!'
    });

  } catch (error: any) {
    console.error('Airtable submission error:', error);
    
    // Return detailed error information
    return res.status(500).json({ 
      error: 'Airtable API error: ' + (error.message || 'Unknown error'),
      details: error.toString(),
      stack: error.stack
    });
  }
} 