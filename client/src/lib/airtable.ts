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
    'Top Stats': string;
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
    'Rating (X/5) & Reviews (#) Screenshot'?: Array<{ url: string; filename: string }>;
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
  topStats: string;
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
  ratingScreenshot?: string;
  status: string;
  submissionDate: string;
  createdTime: string;
}

// Airtable service
export const airtableService = {
  async createSubmission(submissionData: any): Promise<any> {
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
              'Brand Name': submissionData.Brand_name,
              'Direct Booking Website': submissionData.Direct_Booking_Website,
              'Number of Listings': submissionData.Number_of_Listings,
              'Email': submissionData.E_mail,
              'One-line Description': submissionData.field9,
              'Why Book With You': submissionData.field10,
              'Plan': submissionData.field11,
              'Countries': submissionData.Countries,
              'Cities / Regions': submissionData.Cities_Regions,
              'Types of Stays': submissionData.field12,
              'Ideal For': submissionData.field13,
              'Is Pet Friendly': submissionData.field14 === 'true',
              'Perks / Amenities': submissionData.field15,
              'Is Eco Conscious': submissionData.field16 === 'true',
              'Is Remote Work Friendly': submissionData.field17 === 'true',
              'Vibe / Aesthetic': submissionData.field18,
              'Instagram': submissionData.field19,
              'Facebook': submissionData.field20,
              'LinkedIn': submissionData.field21,
              'TikTok': submissionData.field22,
              'YouTube / Video Tour': submissionData.field23,
              'Logo': submissionData.Logo ? [{ url: submissionData.Logo }] : [],
              'Highlight Image': submissionData.Highlight_Image ? [{ url: submissionData.Highlight_Image }] : [],
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

    console.log('📋 Fetching approved-published submissions...');

    // Only show "Approved - Published" records on the frontend
    // Admin workflow: 
    // - Standard plans: "Pending Review" → "Approved - Published" (when approved)
    // - Premium plans: "Approved - Published" (auto-approved)
    // - Any other status ("Pending Review", "Rejected", etc.) = withdrawn from frontend
    const filterFormula = `{Status} = "Approved - Published"`;
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;
    
    console.log('🔗 API URL:', url);
    console.log('📝 Filter formula:', filterFormula);
    console.log('🎯 Looking for status: "Approved - Published"');

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
    
    console.log('📦 Raw Airtable response for approved-published submissions:', data);
    console.log('📊 Number of approved-published records found:', records.length);

    if (records.length > 0) {
      console.log('🏠 First approved-published record:', records[0]);
      console.log('📝 First record status:', records[0].fields['Status']);
    } else {
      console.log('❌ No records found with status "Approved - Published"');
    }

    const transformedSubmissions = records.map((record, index) => {
      try {
        console.log(`🔄 Transforming approved-published record ${index + 1}/${records.length}:`, record.id);
        console.log(`📝 Record status: ${record.fields['Status']}`);
        
        const transformedSubmission = this.transformSubmission(record);
        console.log('✅ Successfully transformed submission:', transformedSubmission.brandName);
        return transformedSubmission;
      } catch (error) {
        console.error(`❌ Error transforming approved-published record ${index + 1}:`, error);
        console.error('📋 Problematic record:', record);
        throw error;
      }
    });
    
    console.log('✨ All transformed approved-published submissions:', transformedSubmissions.length);
    return transformedSubmissions;
  },

  async getSubmissionsByCountry(countryName: string): Promise<Submission[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('🌍 Fetching approved-published submissions for country:', countryName);

    // Only show "Approved - Published" records for this country
    const filterFormula = `AND({Status} = "Approved - Published", {Country} = "${countryName}")`;
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    console.log('🔗 Country API URL:', url);
    console.log('📝 Country filter formula:', filterFormula);

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
    
    console.log(`📦 Approved-published submissions for ${countryName}:`, records.length);

    return records.map(record => this.transformSubmission(record));
  },

  async getSubmissionById(id: string): Promise<Submission | null> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    try {
      const url = `${AIRTABLE_API_URL}/${id}`;
      
      const response = await fetch(url, {
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
      
      const status = record.fields['Status'];
      console.log('📝 Single record status:', status);
      console.log('📊 Single record data:', record.fields);
      
      // Only return records that are approved-published
      if (status !== 'Approved - Published') {
        console.log('❌ Record not approved-published, status:', status);
        return null;
      }

      return this.transformSubmission(record);
    } catch (error) {
      console.error('Error fetching submission by ID:', error);
      return null;
    }
  },

  async getSubmissionBySlug(slug: string): Promise<Submission | null> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    try {
      // Get all approved submissions and find the one with matching slug
      const submissions = await this.getApprovedSubmissions();
      
      // Generate slug for each submission and find match
      const submission = submissions.find(sub => {
        const generatedSlug = sub.brandName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/&/g, 'and')
          .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
        
        return generatedSlug === slug;
      });

      return submission || null;
    } catch (error) {
      console.error('Error fetching submission by slug:', error);
      return null;
    }
  },

  /**
   * Update submission status in Airtable
   * Status workflow: 
   * 1. "Pending" → "Approved – Not Yet Published" (admin approval)
   * 2. "Approved – Not Yet Published" → "Published" (when live on site)
   * 3. "Published" submissions appear in featured carousel and public listings
   */
  async updateSubmissionStatus(id: string, status: string): Promise<void> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    const response = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Status': status
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    console.log(`✅ Updated submission ${id} status to: ${status}`);
  },

  /**
   * Convenience method to mark approved submissions as published
   */
  async markAsPublished(id: string): Promise<void> {
    await this.updateSubmissionStatus(id, 'Published');
  },

  async getPublishedSubmissions(): Promise<Submission[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('🔍 Fetching published submissions only...');

    // Filter for only published submissions
    const filterFormula = `{Status} = "Published"`;
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Airtable API error for published submissions:', response.status, response.statusText);
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data = await response.json();
    const records: AirtableSubmission[] = data.records || [];

    console.log('📦 Published submissions count:', records.length);

    // Transform Airtable records to normalized format
    const transformed = records.map(this.transformSubmission);
    console.log('✨ Published submissions transformed:', transformed);
    
    return transformed;
  },

  // Helper method to transform Airtable records to normalized format
  transformSubmission(record: AirtableSubmission): Submission {
    console.log('🔄 Transforming submission record:', record.id);
    
    const fields = record.fields;
    
    // Helper function to extract URL from Airtable attachment field
    const getAttachmentUrl = (attachmentField: any): string | undefined => {
      if (!attachmentField || !Array.isArray(attachmentField) || attachmentField.length === 0) {
        return undefined;
      }
      
      const attachment = attachmentField[0];
      
      // Try different possible properties for the URL
      const url = attachment.url || 
             attachment.URL || 
             attachment.link || 
             attachment.Link ||
             attachment.thumbnails?.large?.url ||
             attachment.thumbnails?.full?.url ||
             undefined;
             
      return url;
    };
    
    // Helper function to find rating screenshot field dynamically
    const findRatingScreenshotUrl = (): string | undefined => {
      // First try exact field name
      const exactField = fields['Rating (X/5) & Reviews (#) Screenshot'];
      if (exactField) {
        return getAttachmentUrl(exactField);
      }
      
      // Then try to find any attachment field with rating/review/screenshot keywords
      const ratingAttachmentFields = Object.keys(fields).filter(key => {
        const isRatingRelated = key.toLowerCase().includes('rating') || 
                               key.toLowerCase().includes('review') || 
                               key.toLowerCase().includes('screenshot');
        const value = fields[key as keyof typeof fields];
        const hasAttachment = Array.isArray(value) && value.length > 0 && 
                             typeof value[0] === 'object' && value[0] !== null && 'url' in value[0];
        return isRatingRelated && hasAttachment;
      });
      
      if (ratingAttachmentFields.length > 0) {
        const foundFieldName = ratingAttachmentFields[0];
        console.log('📸 Using rating screenshot field:', foundFieldName);
        return getAttachmentUrl(fields[foundFieldName as keyof typeof fields]);
      }
      
      return undefined;
    };
    
    // Helper function to safely parse arrays
    const parseArray = (value: string | string[] | undefined): string[] => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return value.split(',').map(item => item.trim()).filter(Boolean);
    };

    const transformed = {
      id: record.id,
      brandName: fields['Brand Name'] || '',
      website: fields['Direct Booking Website'] || '',
      numberOfListings: fields['Number of Listings'] || 0,
      email: fields['Email'] || '',
      oneLineDescription: fields['One-line Description'] || '',
      whyBookWithYou: fields['Why Book With You'] || '',
      plan: fields['Plan'] || '',
      topStats: fields['Top Stats'] || '',
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
      logo: getAttachmentUrl(fields['Logo']),
      highlightImage: getAttachmentUrl(fields['Highlight Image']),
      ratingScreenshot: findRatingScreenshotUrl(),
      status: fields['Status'] || '',
      submissionDate: fields['Submission Date'] || '',
      createdTime: record.createdTime
    };

    console.log('✅ Transformed:', transformed.brandName, '- Status:', transformed.status);
    
    return transformed;
  }
};

// Export for use in components
export default airtableService; 