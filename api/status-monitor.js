// Status monitor API - called by client-side polling every 2 minutes
// This checks Airtable for status changes and triggers website updates

export default async function handler(req, res) {
  try {
    // SECURITY: Verify this is a legitimate request
    const authHeader = req.headers.authorization;
    const monitorSecret = process.env.VITE_STATUS_MONITOR_SECRET || 'default-secret';
    
    if (authHeader !== `Bearer ${monitorSecret}`) {
      console.log('❌ Unauthorized status monitor access attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    console.log('🔍 Status monitor: Checking Airtable for changes...');
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
      fields: ['id', 'Brand Name', 'Status', 'Status Bis (PMC directory)', 'Last Modified']
    }).all();
    
    const allSubmissions = records.map(record => ({
      id: record.id,
      brandName: record.get('Brand Name') || 'Unknown',
      status: record.get('Status') || 'Unknown',
      statusBis: record.get('Status Bis (PMC directory)'),
      updatedAt: record.get('Last Modified') || ''
    }));
    
    console.log(`📊 Found ${allSubmissions.length} total submissions`);
    
    // Count submissions by status
    const approvedSubmissions = allSubmissions.filter(sub => 
      sub.status === 'Approved – Published'
    );
    
    const rejectedSubmissions = allSubmissions.filter(sub => 
      sub.status === 'Rejected'
    );
    
    const pendingSubmissions = allSubmissions.filter(sub => 
      sub.status === 'Pending Review'
    );
    
    console.log(`✅ Currently approved: ${approvedSubmissions.length}`);
    console.log(`❌ Currently rejected: ${rejectedSubmissions.length}`);
    console.log(`⏳ Currently pending: ${pendingSubmissions.length}`);
    
    // For now, we'll always indicate that changes might have occurred
    // In a more sophisticated version, you could compare with cached data
    const statusChanges = 1; // Always assume there might be changes
    const newlyApproved = approvedSubmissions.length;
    
    console.log('✅ Status monitor completed successfully');
    
    res.status(200).json({
      success: true,
      statusChanges: statusChanges,
      newlyApproved: newlyApproved,
      message: `Found ${approvedSubmissions.length} approved submissions ready for website`,
      timestamp: new Date().toISOString(),
      totalSubmissions: allSubmissions.length,
      approvedSubmissions: approvedSubmissions.length,
      rejectedSubmissions: rejectedSubmissions.length,
      pendingSubmissions: pendingSubmissions.length
    });
    
  } catch (error) {
    console.error('❌ Status monitor failed:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Status monitor failed',
      details: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
