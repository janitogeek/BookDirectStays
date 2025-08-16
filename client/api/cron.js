// Simple cron job endpoint for Vercel
// This will be called every 2 minutes by Vercel Cron

export default async function handler(req, res) {
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
    
    // For now, just return success
    // The actual Airtable integration will be added once we confirm the cron job is working
    
    console.log('✅ Cron job executed successfully');
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Cron job executed successfully - Airtable integration coming next!',
      note: 'This is a test endpoint. Once confirmed working, we will add Airtable status monitoring.'
    });
    
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Cron job failed',
      details: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
