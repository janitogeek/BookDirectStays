// Vercel API endpoint that mimics PocketBase submissions API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Extract form data (your existing form sends FormData)
      const body = req.body;
      
      // Create a submission record that matches PocketBase structure
      const submission = {
        id: Date.now().toString(),
        Brand_name: body.Brand_name || '',
        Direct_Booking_Website: body.Direct_Booking_Website || '',
        Number_of_Listings: parseInt(body.Number_of_Listings) || 0,
        E_mail: body.E_mail || '',
        One_line_Description: body.One_line_Description || '',
        Why_Book_With_You: body.Why_Book_With_You || '',
        Plan: body.Plan || '',
        Countries: body.Countries || '',
        Cities_Regions: body.Cities_Regions || '',
        Types_of_Stays: body.Types_of_Stays || '',
        Ideal_For: body.Ideal_For || '',
        Perks_Amenities: body.Perks_Amenities || '',
        Vibe_Aesthetic: body.Vibe_Aesthetic || '',
        Instagram: body.Instagram || '',
        Facebook: body.Facebook || '',
        LinkedIn: body.LinkedIn || '',
        TikTok: body.TikTok || '',
        Youtube: body.Youtube || '',
        Logo: body.Logo || '',
        Highlight_Image: body.Highlight_Image || '',
        Status: 'Pending',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        collectionId: 'submissions',
        collectionName: 'Submissions'
      };

      // Log submission (you can later save to a database)
      console.log('Form submission received:', submission);

      // TODO: Save to Vercel Postgres/KV or other database
      // For now, just return success response that matches PocketBase format
      
      res.status(200).json(submission);

    } catch (error) {
      console.error('Submission error:', error);
      res.status(400).json({ 
        code: 400,
        message: 'Failed to create record.',
        data: { error: error.message }
      });
    }
  } else {
    res.status(405).json({ 
      code: 405,
      message: 'Method not allowed',
      data: {} 
    });
  }
} 