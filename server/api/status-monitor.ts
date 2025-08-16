import { NextApiRequest, NextApiResponse } from 'next';
import { airtableService } from '../../lib/airtable-service';

// Cache to track last known statuses
const statusCache = new Map<string, string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow this to be called by automated systems or with proper auth
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.STATUS_MONITOR_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🔍 Status monitor: Checking for status changes...');
    
    // Get all submissions from Airtable
    const allSubmissions = await airtableService.getAllSubmissions();
    console.log(`📊 Status monitor: Found ${allSubmissions.length} total submissions`);
    
    let statusChanges = 0;
    let newlyApproved = 0;
    
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
      }
    }
    
    // If we have status changes, trigger a data refresh
    if (statusChanges > 0) {
      console.log(`🔄 ${statusChanges} status changes detected, ${newlyApproved} newly approved`);
      
      // Return success with refresh flag
      res.status(200).json({
        success: true,
        statusChanges,
        newlyApproved,
        message: `Detected ${statusChanges} status changes, ${newlyApproved} newly approved`,
        timestamp: new Date().toISOString(),
        totalSubmissions: allSubmissions.length
      });
    } else {
      console.log('✅ No status changes detected');
      res.status(200).json({
        success: true,
        statusChanges: 0,
        newlyApproved: 0,
        message: 'No status changes detected',
        timestamp: new Date().toISOString(),
        totalSubmissions: allSubmissions
      });
    }
    
  } catch (error) {
    console.error('❌ Status monitor error:', error);
    res.status(500).json({ 
      error: 'Status monitor failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
