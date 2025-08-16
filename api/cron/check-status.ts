import { NextApiRequest, NextApiResponse } from 'next';
import Airtable from 'airtable';

// Initialize Airtable
const airtableApiKey = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;

if (!airtableApiKey || !airtableBaseId) {
  throw new Error('Missing required Airtable environment variables');
}

const base = new Airtable({
  apiKey: airtableApiKey
}).base(airtableBaseId);

interface Submission {
  id: string;
  brandName: string;
  status: string;
  statusBis?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory cache to track last known statuses
const statusCache = new Map<string, string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // SECURITY: Verify this is a legitimate Vercel cron job
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log('❌ Unauthorized cron job access attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // This endpoint is called by Vercel Cron every 2 minutes
    console.log('🕐 Vercel Cron: Checking for status changes...');
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    // Get all submissions from Airtable
    const records = await base('Submissions').select({
      fields: ['id', 'Brand Name', 'Status', 'Status Bis (PMC directory)', 'Created', 'Last Modified']
    }).all();
    
    const allSubmissions: Submission[] = records.map(record => ({
      id: record.id,
      brandName: record.get('Brand Name') as string || 'Unknown',
      status: record.get('Status') as string || 'Unknown',
      statusBis: record.get('Status Bis (PMC directory)') as string,
      createdAt: record.get('Created') as string || '',
      updatedAt: record.get('Last Modified') as string || ''
    }));
    
    console.log(`📊 Cron: Found ${allSubmissions.length} total submissions`);
    
    let statusChanges = 0;
    let newlyApproved = 0;
    let newlyRejected = 0;
    
    // Check each submission for status changes
    for (const submission of allSubmissions) {
      const submissionId = submission.id;
      const currentStatus = submission.status;
      const previousStatus = statusCache.get(submissionId);
      
      // Track new submissions
      if (!previousStatus) {
        statusCache.set(submissionId, currentStatus);
        console.log(`🆕 New submission tracked: ${submission.brandName} (${currentStatus})`);
        continue;
      }
      
      // Check for status changes
      if (currentStatus !== previousStatus) {
        statusChanges++;
        console.log(`🔄 Status change detected: ${submission.brandName} ${previousStatus} → ${currentStatus}`);
        
        // Update cache
        statusCache.set(submissionId, currentStatus);
        
        // Check if newly approved
        if (currentStatus === 'Approved – Published' && previousStatus !== 'Approved – Published') {
          newlyApproved++;
          console.log(`✅ Newly approved: ${submission.brandName} - Will be published to website`);
        }
        
        // Check if newly rejected
        if (currentStatus === 'Rejected' && previousStatus !== 'Rejected') {
          newlyRejected++;
          console.log(`❌ Newly rejected: ${submission.brandName} - Will be removed from website`);
        }
      }
    }
    
    // Log summary
    if (statusChanges > 0) {
      console.log(`🔄 Cron Summary: ${statusChanges} status changes detected`);
      console.log(`✅ Newly approved: ${newlyApproved}`);
      console.log(`❌ Newly rejected: ${newlyRejected}`);
      
      // Here you could trigger additional actions like:
      // - Send notifications
      // - Update external systems
      // - Trigger website rebuilds
      
    } else {
      console.log('✅ Cron: No status changes detected');
    }
    
    // Return success response
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      statusChanges,
      newlyApproved,
      newlyRejected,
      totalSubmissions: allSubmissions.length,
      message: `Cron job completed successfully. ${statusChanges} changes detected.`
    });
    
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    // Return error response but don't fail the cron job
    res.status(500).json({ 
      success: false,
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
