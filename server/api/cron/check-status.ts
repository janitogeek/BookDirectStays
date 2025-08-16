import { NextApiRequest, NextApiResponse } from 'next';
import { airtableService } from '../../lib/airtable-service';

// In-memory cache to track last known statuses
const statusCache = new Map<string, string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // This endpoint is called by Vercel Cron every 2 minutes
    // No authentication needed as it's called internally by Vercel
    
    console.log('🕐 Vercel Cron: Checking for status changes...');
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    // Get all submissions from Airtable
    const allSubmissions = await airtableService.getAllSubmissions();
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
