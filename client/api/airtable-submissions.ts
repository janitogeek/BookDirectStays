import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET requests - fetch all approved submissions
  if (req.method === 'GET') {
    try {
      const AIRTABLE_API_KEY = process.env.VITE_AIRTABLE_API_KEY;
      const AIRTABLE_BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
      const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Directory Submissions';

      if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        return res.status(500).json({ 
          error: 'Missing Airtable configuration',
          debug: {
            hasApiKey: !!AIRTABLE_API_KEY,
            hasBaseId: !!AIRTABLE_BASE_ID
          }
        });
      }

      // Fetch ALL approved submissions from Airtable with pagination
      const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
      const filterFormula = `OR({Status}='Approved – Published',{Status}='Approved - Published',{Status}='Published')`;
      
      let allRecords: any[] = [];
      let offset: string | null = null;
      let requestCount = 0;
      
      console.log('🔄 Starting paginated fetch from Airtable...');
      
      do {
        const params = new URLSearchParams({
          filterByFormula: filterFormula,
          maxRecords: '100'  // Process 100 at a time (Airtable's max per request)
        });
        
        if (offset) {
          params.set('offset', offset);
        }
        
        const airtableUrl = `${baseUrl}?${params}`;
        requestCount++;
        
        console.log(`📋 Fetching batch ${requestCount} from Airtable...`);
        
        const response = await fetch(airtableUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`❌ Airtable API error on batch ${requestCount}:`, errorData);
          return res.status(500).json({ 
            error: 'Airtable API error',
            details: errorData,
            status: response.status,
            batch: requestCount
          });
        }

        const batchResult = await response.json();
        allRecords = allRecords.concat(batchResult.records);
        offset = batchResult.offset;
        
        console.log(`✅ Fetched ${batchResult.records.length} records in batch ${requestCount}`);
        console.log(`📊 Total records so far: ${allRecords.length}`);
        
        // Add a small delay to respect Airtable's rate limits (5 requests/second)
        if (offset) {
          await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
        }
        
      } while (offset);
      
      console.log(`🎉 Pagination complete! Total records fetched: ${allRecords.length}`);
      
      // Create result object that matches the original single-request format
      const result = { records: allRecords };
      
      // Transform records to match expected format
      const submissions = result.records.map((record: any) => ({
        id: record.id,
        ...record.fields,
        createdTime: record.createdTime
      }));
      
      return res.status(200).json(submissions);

    } catch (error: any) {
      console.error('Fetch submissions error:', error);
      return res.status(500).json({ 
        error: 'Server error',
        message: error.message
      });
    }
  }

  // Handle POST requests - create new submission
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get Airtable credentials
    const AIRTABLE_API_KEY = process.env.VITE_AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Directory Submissions';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return res.status(500).json({ 
        error: 'Missing Airtable configuration',
        debug: {
          hasApiKey: !!AIRTABLE_API_KEY,
          hasBaseId: !!AIRTABLE_BASE_ID
        }
      });
    }

    // Prepare data for Airtable
    const fields = { ...req.body };
    
    // Convert arrays to JSON strings for Airtable
    Object.keys(fields).forEach(key => {
      if (Array.isArray(fields[key])) {
        fields[key] = JSON.stringify(fields[key]);
      }
    });

    // Submit to Airtable using fetch (no external dependencies)
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    
    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: fields
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({ 
        error: 'Airtable API error',
        details: errorData,
        status: response.status
      });
    }

    const result = await response.json();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Submission successful!',
      id: result.records[0].id
    });

  } catch (error: any) {
    console.error('Submission error:', error);
    
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      stack: error.stack
    });
  }
} 