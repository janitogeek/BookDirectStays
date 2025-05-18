import type { VercelRequest, VercelResponse } from '@vercel/node';
import Airtable from 'airtable';

const baseId = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_API_KEY;
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Submissions';

if (!baseId || !apiKey) {
  throw new Error('Airtable credentials are not set in environment variables');
}

const base = new Airtable({ apiKey }).base(baseId);

// Helper to get record IDs for city/region names
async function getCityRecordIds(cityNames: string[], base: any) {
  const recordIds: string[] = [];
  for (const name of cityNames) {
    const records = await base('Cities / Regions').select({
      filterByFormula: `{Name} = "${name}"`
    }).firstPage();
    if (records.length > 0) {
      recordIds.push(records[0].id);
    }
  }
  return recordIds;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const fields = req.body;
    // Filter to only allow valid fields (from frontend schema)
    const validFields = [
      "Brand Name",
      "Direct Booking Website",
      "Number of Listings",
      "Countries",
      "Cities / Regions",
      "Logo Upload",
      "Highlight Image",
      "One-line Description",
      "Why Book With You?",
      "Types of Stays",
      "Ideal For",
      "Perks / Amenities",
      "Vibe / Aesthetic",
      "Instagram",
      "Facebook",
      "LinkedIn",
      "TikTok",
      "YouTube / Video Tour",
      "Choose Your Listing Type",
      "Submitted By (Email)"
    ];
    Object.keys(fields).forEach(key => {
      if (!validFields.includes(key)) {
        delete fields[key];
      }
    });
    // Map 'Cities / Regions' to array of region/city names (first part before comma)
    if (Array.isArray(fields["Cities / Regions"])) {
      const cityNames = fields["Cities / Regions"].map((c: any) => {
        const name = typeof c === "object" && c.name ? c.name : c;
        return name.split(",")[0].trim();
      });
      fields["Cities / Regions"] = await getCityRecordIds(cityNames, base);
    }
    // Format attachment fields for Airtable
    const attachmentFields = ["Logo Upload", "Highlight Image"];
    attachmentFields.forEach(field => {
      if (fields[field]) {
        if (typeof fields[field] === "string") {
          fields[field] = [{ url: fields[field] }];
        } else if (Array.isArray(fields[field])) {
          fields[field] = fields[field].map((item: any) =>
            typeof item === "string" ? { url: item } : item
          );
        }
      }
    });
    // Optionally, validate fields here
    const result = await base(tableName).create([{ fields }]);
    return res.status(200).json({ success: true, id: result[0].id });
  } catch (error: any) {
    console.error('Airtable submission error:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit to Airtable' });
  }
} 