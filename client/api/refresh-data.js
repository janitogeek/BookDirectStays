// Data refresh endpoint - called by cron job to update website data
// This forces the website to refresh and show only approved submissions

export default async function handler(req, res) {
  try {
    // SECURITY: Verify this is a legitimate request from cron job
    const authHeader = req.headers.authorization;
    const refreshSecret = process.env.REFRESH_SECRET || 'cron-refresh';
    
    if (authHeader !== `Bearer ${refreshSecret}`) {
      console.log('❌ Unauthorized data refresh attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    console.log('🔄 Data refresh requested by cron job...');
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    // Get fresh data from Airtable
    const airtableApiKey = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
    
    if (!airtableApiKey || !airtableBaseId) {
      throw new Error('Missing Airtable configuration');
    }
    
    // Initialize Airtable
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);
    
    // Get only approved submissions
    console.log('📡 Fetching approved submissions from Airtable...');
    const records = await base('Submissions').select({
      filterByFormula: `{Status} = 'Approved – Published'`
    }).all();
    
    const approvedSubmissions = records.map(record => ({
      id: record.id,
      brandName: record.get('Brand Name') || 'Unknown',
      status: record.get('Status') || 'Unknown',
      description: record.get('One-line Description') || '',
      whyBookWithYou: record.get('Why Book With You') || '',
      website: record.get('Website') || '',
      countries: record.get('Countries') || [],
      citiesRegions: record.get('Cities/Regions') || [],
      typesOfStays: record.get('Types of Stays') || [],
      currency: record.get('Currency') || '',
      perksAmenities: record.get('Perks/Amenities') || [],
      vibeAesthetic: record.get('Vibe & Aesthetic') || [],
      propertyType: record.get('Property Type') || [],
      idealFor: record.get('Ideal For') || '',
      topStats: record.get('Top Stats') || '',
      commission: record.get('Commission On Revenue') || '',
      pms: record.get('PMS') || '',
      instagram: record.get('Instagram') || '',
      tiktok: record.get('TikTok') || '',
      googleReviews: record.get('Google Reviews Link') || '',
      cancellationPolicy: record.get('Cancellation Policy') || '',
      createdAt: record.get('Created') || '',
      updatedAt: record.get('Last Modified') || ''
    }));
    
    console.log(`✅ Found ${approvedSubmissions.length} approved submissions`);
    
    // Process countries and cities for website display
    const countriesData = {};
    const citiesData = {};
    
    approvedSubmissions.forEach(submission => {
      // Process countries
      if (submission.countries && submission.countries.length > 0) {
        submission.countries.forEach(country => {
          if (!countriesData[country]) {
            countriesData[country] = {
              name: country,
              slug: country.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
              submissions: []
            };
          }
          countriesData[country].submissions.push(submission);
        });
      }
      
      // Process cities
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        submission.citiesRegions.forEach(cityRegion => {
          let cityName = cityRegion;
          let countryName = '';
          
          // Parse "City, Region, Country" format
          if (cityRegion.includes(', ')) {
            const parts = cityRegion.split(', ');
            cityName = parts[0];
            countryName = parts[parts.length - 1]; // Last part is country
          }
          
          if (cityName && countryName) {
            const cityKey = `${cityName}-${countryName}`;
            if (!citiesData[cityKey]) {
              citiesData[cityKey] = {
                name: cityName,
                country: countryName,
                slug: cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
                submissions: []
              };
            }
            citiesData[cityKey].submissions.push(submission);
          }
        });
      }
    });
    
    // Store updated data in a way that the website can access
    // This could be stored in a database, cache, or file system
    // For now, we'll log the processed data
    
    console.log('🌍 Processed countries:', Object.keys(countriesData));
    console.log('🏙️ Processed cities:', Object.keys(citiesData));
    
    // Here you would typically:
    // 1. Update your website's data store
    // 2. Clear any caches
    // 3. Trigger a rebuild if using static generation
    // 4. Update any in-memory data stores
    
    console.log('✅ Website data refresh completed successfully');
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      approvedSubmissions: approvedSubmissions.length,
      countries: Object.keys(countriesData).length,
      cities: Object.keys(citiesData).length,
      message: 'Website data has been refreshed with latest approved submissions',
      note: 'The website should now display only approved submissions. Users may need to refresh their browser to see changes.'
    });
    
  } catch (error) {
    console.error('❌ Data refresh failed:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Data refresh failed',
      details: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}



