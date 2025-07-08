// Airtable API configuration for BookDirectStays

// Airtable configuration
const AIRTABLE_API_KEY = (import.meta as any).env?.VITE_AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = (import.meta as any).env?.VITE_AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE_NAME = 'Submissions'; // Your table name

// Airtable API endpoint
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

// Debug: Log configuration (remove in production)
console.log('Airtable Config:', {
  hasApiKey: !!AIRTABLE_API_KEY,
  hasBaseId: !!AIRTABLE_BASE_ID,
  tableName: AIRTABLE_TABLE_NAME
});

// Airtable service
export const airtableService = {
  async createSubmission(data: any) {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing. Please set VITE_AIRTABLE_API_KEY and VITE_AIRTABLE_BASE_ID');
    }

    const response = await fetch(AIRTABLE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              'Brand Name': data.Brand_name,
              'Direct Booking Website': data.Direct_Booking_Website,
              'Number of Listings': data.Number_of_Listings,
              'Email': data.E_mail,
              'One-line Description': data.field9,
              'Why Book With You': data.field10,
              'Plan': data.field11,
              'Countries': data.Countries,
              'Cities / Regions': data.Cities_Regions,
              'Types of Stays': data.field12,
              'Ideal For': data.field13,
              'Is Pet Friendly': data.field14 === 'true',
              'Perks / Amenities': data.field15,
              'Is Eco Conscious': data.field16 === 'true',
              'Is Remote Work Friendly': data.field17 === 'true',
              'Vibe / Aesthetic': data.field18,
              'Instagram': data.field19,
              'Facebook': data.field20,
              'LinkedIn': data.field21,
              'TikTok': data.field22,
              'YouTube / Video Tour': data.field23,
              'Logo': data.Logo ? [{ url: data.Logo }] : [],
              'Highlight Image': data.Highlight_Image ? [{ url: data.Highlight_Image }] : [],
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
    }

    return response.json();
  },

  async getAllSubmissions() {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    const response = await fetch(AIRTABLE_API_URL, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    return response.json();
  }
};

// Export for use in components
export default airtableService; 