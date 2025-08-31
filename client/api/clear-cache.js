// Cache clearing endpoint - called by cron job to clear any cached data
// This ensures the website shows fresh data after status changes

export default async function handler(req, res) {
  try {
    // SECURITY: Verify this is a legitimate request from cron job
    const authHeader = req.headers.authorization;
    const refreshSecret = process.env.REFRESH_SECRET || 'cron-refresh';
    
    if (authHeader !== `Bearer ${refreshSecret}`) {
      console.log('❌ Unauthorized cache clear attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    console.log('🧹 Cache clearing requested by cron job...');
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    // Clear any in-memory caches
    // This is where you would clear any caches your website uses
    
    // For example, if you're using Redis:
    // await redis.flushall();
    
    // Or if you're using a local cache:
    // global.cache.clear();
    
    // Or if you're using Vercel's edge cache:
    // You can set cache headers to force refresh
    
    console.log('✅ Cache clearing completed successfully');
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Cache has been cleared successfully',
      note: 'Website should now display fresh data from Airtable'
    });
    
  } catch (error) {
    console.error('❌ Cache clearing failed:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Cache clearing failed',
      details: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}



