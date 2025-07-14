export default function handler(req: any, res: any) {
  res.status(200).json({
    message: 'Simple test endpoint working',
    method: req.method,
    timestamp: new Date().toISOString(),
    hasAirtableKey: !!process.env.AIRTABLE_API_KEY,
    hasAirtableBase: !!process.env.AIRTABLE_BASE_ID
  });
} 