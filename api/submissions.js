// Vercel API endpoint for form submissions
import { createClient } from '@vercel/postgres';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // For now, let's store submissions in a simple way
    // You can later connect this to Vercel Postgres or any other database
    
    const submission = {
      id: Date.now().toString(),
      ...req.body,
      created: new Date().toISOString(),
      status: 'pending'
    };

    // Log the submission (for now)
    console.log('New submission:', submission);

    // TODO: Save to database
    // const client = createClient();
    // await client.sql`INSERT INTO submissions ...`;

    res.status(200).json({
      message: 'Submission received successfully',
      data: submission
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ 
      error: 'Failed to process submission',
      message: error.message 
    });
  }
} 