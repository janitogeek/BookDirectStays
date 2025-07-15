// Airtable API configuration for BookDirectStays

// Airtable configuration
const AIRTABLE_API_KEY = (import.meta as any).env?.VITE_AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = (import.meta as any).env?.VITE_AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE_NAME = 'Directory Submissions'; // Your actual table name

// Airtable API endpoint
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

// Debug: Log configuration (remove in production)
console.log('Airtable Config:', {
  hasApiKey: !!AIRTABLE_API_KEY,
  hasBaseId: !!AIRTABLE_BASE_ID,
  tableName: AIRTABLE_TABLE_NAME
});

// Types for submissions
export interface AirtableSubmission {
  id: string;
  fields: {
    'Brand Name': string;
    'Direct Booking Website': string;
    'Number of Listings': number;
    'Email': string;
    'One-line Description': string;
    'Why Book With You': string;
    'Plan': string;
    'Countries': string | string[];
    'Cities / Regions': string | string[];
    'Types of Stays': string | string[];
    'Ideal For': string | string[];
    'Perks / Amenities': string | string[];
    'Vibe / Aesthetic': string | string[];
    'Instagram'?: string;
    'Facebook'?: string;
    'LinkedIn'?: string;
    'TikTok'?: string;
    'YouTube / Video Tour'?: string;
    'Logo'?: Array<{ url: string; filename: string }>;
    'Highlight Image'?: Array<{ url: string; filename: string }>;
    'Status': string;
    'Submission Date': string;
  };
  createdTime: string;
}

// Normalized submission interface for frontend use
export interface Submission {
  id: string;
  brandName: string;
  website: string;
  numberOfListings: number;
  email: string;
  oneLineDescription: string;
  whyBookWithYou: string;
  plan: string;
  countries: string[];
  citiesRegions: string[];
  typesOfStays: string[];
  idealFor: string[];
  perksAmenities: string[];
  vibeAesthetic: string[];
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  youtubeVideoTour?: string;
  logo?: string;
  highlightImage?: string;
  status: string;
  submissionDate: string;
  createdTime: string;
}

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

  async getAllSubmissions(): Promise<AirtableSubmission[]> {
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

    const data = await response.json();
    return data.records || [];
  },

  async getApprovedSubmissions(): Promise<Submission[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('🔍 Fetching all approved submissions...');

    // Use Airtable filter to get approved/published submissions
    const filterFormula = `OR({Status} = "Approved", {Status} = "Published", {Status} = "Approved – Not Yet Published")`;
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    console.log('🔗 All approved URL:', url);
    console.log('📝 All approved filter:', filterFormula);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Airtable API error for approved submissions:', response.status, response.statusText);
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data = await response.json();
    const records: AirtableSubmission[] = data.records || [];

    console.log('📦 All approved raw response:', data);
    console.log('📊 Total approved records:', records.length);

    // Transform Airtable records to normalized format
    const transformed = records.map(this.transformSubmission);
    console.log('✨ All approved transformed:', transformed);
    
    return transformed;
  },

  async getSubmissionsByCountry(countryName: string): Promise<Submission[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('🔍 Fetching submissions for country:', countryName);

    // Filter for approved/published submissions in specific country (case-insensitive)
    const filterFormula = `AND(OR({Status} = "Approved", {Status} = "Published", {Status} = "Approved – Not Yet Published"), OR(FIND(UPPER("${countryName.toUpperCase()}"), UPPER({Countries})) > 0, FIND(LOWER("${countryName.toLowerCase()}"), LOWER({Countries})) > 0, FIND("${countryName}", {Countries}) > 0))`;
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;
    
    console.log('🔗 API URL:', url);
    console.log('📝 Filter formula:', filterFormula);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Airtable API error:', response.status, response.statusText);
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data = await response.json();
    const records: AirtableSubmission[] = data.records || [];
    
    console.log('📦 Raw Airtable response:', data);
    console.log('📊 Number of records found:', records.length);
    
    if (records.length > 0) {
      console.log('🏠 First record fields:', records[0].fields);
      console.log('🔍 Status field:', records[0].fields['Status']);
      console.log('🌍 Countries field:', records[0].fields['Countries']);
      console.log('🏢 Brand Name field:', records[0].fields['Brand Name']);
      console.log('🌐 Website field:', records[0].fields['Direct Booking Website']);
    } else {
      console.log('🔍 No records found, let me check all approved submissions...');
      // Fallback: get all approved submissions to debug
      try {
        const allApproved = await this.getApprovedSubmissions();
        console.log('📋 All approved submissions:', allApproved);
        console.log('🌍 Countries in approved submissions:', allApproved.map(s => s.countries));
      } catch (error) {
        console.error('❌ Error fetching all approved submissions:', error);
      }
    }

    const transformedSubmissions = records.map((record, index) => {
      try {
        console.log(`🔄 Transforming record ${index + 1}/${records.length}:`, record.id);
        const transformed = this.transformSubmission(record);
        console.log(`✅ Successfully transformed record ${index + 1}:`, transformed);
        return transformed;
      } catch (error) {
        console.error(`❌ Error transforming record ${index + 1}:`, error);
        console.error('📋 Problematic record:', record);
        throw error;
      }
    });
    
    console.log('✨ All transformed submissions:', transformedSubmissions);
    console.log('📝 Number of transformed submissions:', transformedSubmissions.length);
    
    if (transformedSubmissions.length > 0) {
      console.log('🎯 First transformed submission:', transformedSubmissions[0]);
      console.log('🏷️ Brand name after transformation:', transformedSubmissions[0].brandName);
      console.log('🌍 Countries after transformation:', transformedSubmissions[0].countries);
    }
    
    return transformedSubmissions;
  },

  async getSubmissionById(id: string): Promise<Submission | null> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    const response = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const record: AirtableSubmission = await response.json();
    return this.transformSubmission(record);
  },

  // Helper method to transform Airtable records to normalized format
  transformSubmission(record: AirtableSubmission): Submission {
    try {
      console.log('🔄 Transforming record:', record.id);
      const fields = record.fields;
      console.log('📋 Record fields:', fields);
      
      // Helper function to parse comma-separated strings into arrays
      const parseArray = (value: string | string[] | undefined): string[] => {
        if (!value) return [];
        
        // If it's already an array (Airtable multi-select fields), return it
        if (Array.isArray(value)) {
          return value.filter(Boolean);
        }
        
        // If it's a string, split by comma
        if (typeof value === 'string') {
          return value.split(',').map(item => item.trim()).filter(Boolean);
        }
        
        // Fallback for unexpected types
        console.warn('⚠️ Unexpected value type for parseArray:', typeof value, value);
        return [];
      };

      console.log('🔧 Starting field extraction...');
      
      const transformed = {
        id: record.id,
        brandName: fields['Brand Name'] || '',
        website: fields['Direct Booking Website'] || '',
        numberOfListings: fields['Number of Listings'] || 0,
        email: fields['Email'] || '',
        oneLineDescription: fields['One-line Description'] || '',
        whyBookWithYou: fields['Why Book With You'] || '',
        plan: fields['Plan'] || '',
        countries: parseArray(fields['Countries']),
        citiesRegions: parseArray(fields['Cities / Regions']),
        typesOfStays: parseArray(fields['Types of Stays']),
        idealFor: parseArray(fields['Ideal For']),
        perksAmenities: parseArray(fields['Perks / Amenities']),
        vibeAesthetic: parseArray(fields['Vibe / Aesthetic']),
        instagram: fields['Instagram'] || undefined,
        facebook: fields['Facebook'] || undefined,
        linkedin: fields['LinkedIn'] || undefined,
        tiktok: fields['TikTok'] || undefined,
        youtubeVideoTour: fields['YouTube / Video Tour'] || undefined,
        logo: fields['Logo']?.[0]?.url || undefined,
        highlightImage: fields['Highlight Image']?.[0]?.url || undefined,
        status: fields['Status'] || '',
        submissionDate: fields['Submission Date'] || '',
        createdTime: record.createdTime
      };

      console.log('✅ Transformation complete for record:', record.id);
      console.log('📊 Transformed data:', transformed);
      console.log('🏷️ Brand name:', transformed.brandName);
      console.log('🌍 Parsed countries:', transformed.countries);
      console.log('🏢 Types of stays:', transformed.typesOfStays);
      console.log('🎯 Ideal for:', transformed.idealFor);
      console.log('🖼️ Logo URL:', transformed.logo);
      console.log('🎨 Highlight image URL:', transformed.highlightImage);
      
      return transformed;
    } catch (error) {
      console.error('❌ Error in transformSubmission for record:', record.id);
      console.error('❌ Error details:', error);
      console.error('📋 Record that failed:', record);
      throw error;
    }
  }
};

// Export for use in components
export default airtableService; 