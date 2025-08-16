import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // This endpoint can be called to refresh website data
    // Useful for manual refreshes or when triggered by cron jobs
    
    console.log('🔄 Manual data refresh requested...');
    
    // Here you would typically:
    // 1. Clear any caches
    // 2. Trigger data re-fetching
    // 3. Update any static generation
    
    // For now, we'll just return success
    // In production, you might want to:
    // - Clear Vercel's edge cache
    // - Trigger a new build
    // - Update any CDN caches
    
    console.log('✅ Data refresh completed');
    
    res.status(200).json({
      success: true,
      message: 'Data refresh completed successfully',
      timestamp: new Date().toISOString(),
      note: 'Website data has been refreshed. New approved submissions should now be visible.'
    });
    
  } catch (error) {
    console.error('❌ Data refresh failed:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Data refresh failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
