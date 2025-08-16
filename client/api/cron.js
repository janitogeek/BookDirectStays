// Cron job endpoint for Vercel - checks Airtable every 2 minutes
// This will be called automatically by Vercel Cron

export default async function handler(req, res) {
  try {
    // SECURITY: Verify this is a legitimate Vercel cron job
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log('❌ Unauthorized cron job access attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    console.log('🕐 Vercel Cron: Checking Airtable for status changes...');
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    // Get Airtable credentials from environment
    const airtableApiKey = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
    
    if (!airtableApiKey || !airtableBaseId) {
      console.error('❌ Missing Airtable environment variables');
      return res.status(500).json({ 
        error: 'Missing Airtable configuration',
        message: 'Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables'
      });
    }
    
    // Initialize Airtable
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);
    
    // Get all submissions from Airtable
    console.log('📡 Fetching submissions from Airtable...');
    const records = await base('Submissions').select({
      fields: ['id', 'Brand Name', 'Status', 'Status Bis (PMC directory)', 'Created', 'Last Modified']
    }).all();
    
    const allSubmissions = records.map(record => ({
      id: record.id,
      brandName: record.get('Brand Name') || 'Unknown',
      status: record.get('Status') || 'Unknown',
      statusBis: record.get('Status Bis (PMC directory)'),
      createdAt: record.get('Created') || '',
      updatedAt: record.get('Last Modified') || ''
    }));
    
    console.log(`📊 Found ${allSubmissions.length} total submissions`);
    
    // Check for newly approved submissions
    const newlyApproved = allSubmissions.filter(sub => 
      sub.status === 'Approved – Published'
    );
    
    const newlyRejected = allSubmissions.filter(sub => 
      sub.status === 'Rejected'
    );
    
    console.log(`✅ Approved submissions: ${newlyApproved.length}`);
    console.log(`❌ Rejected submissions: ${newlyRejected.length}`);
    
    // Log any newly approved submissions
    if (newlyApproved.length > 0) {
      console.log('🎉 Newly approved submissions that will appear on website:');
      newlyApproved.forEach(sub => {
        console.log(`  - ${sub.brandName} (${sub.status})`);
      });
    }
    
    // Return success with actual data
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      totalSubmissions: allSubmissions.length,
      approvedSubmissions: newlyApproved.length,
      rejectedSubmissions: newlyRejected.length,
      message: `Cron job completed! Found ${newlyApproved.length} approved submissions ready for website.`,
      note: 'These approved submissions should now be visible on your website!'
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
