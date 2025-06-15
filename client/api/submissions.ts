import type { VercelRequest, VercelResponse } from '@vercel/node';
import Airtable from 'airtable';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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

// Helper to handle file uploads
async function handleFileUpload(file: { url: string, name: string }) {
  try {
    const response = await fetch(file.url);
    const buffer = await response.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(filePath, Buffer.from(buffer));
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
}

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

    // Handle file uploads
    if (fields["Logo Upload"]) {
      fields["Logo Upload"] = await handleFileUpload(fields["Logo Upload"]);
    }
    if (fields["Highlight Image"]) {
      fields["Highlight Image"] = await handleFileUpload(fields["Highlight Image"]);
    }

    // Map 'Cities / Regions' to array of region/city names (first part before comma)
    if (Array.isArray(fields["Cities / Regions"])) {
      const cityNames = fields["Cities / Regions"].map((c: any) => {
        const name = typeof c === "object" && c.name ? c.name : c;
        return name.split(",")[0].trim();
      });
      fields["Cities / Regions"] = await getCityRecordIds(cityNames, base);
    }

    // Add status and approval fields
    fields.Status = 'pending';
    fields.Approved = false;

    // Create the record
    const result = await base(tableName).create([{ fields }]);
    return res.status(200).json({ success: true, id: result[0].id });
  } catch (error: any) {
    console.error('Airtable submission error:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit to Airtable' });
  }
} 