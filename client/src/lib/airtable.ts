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

  // Method to update status from "Approved Not Published" to "Published"
  async updateStatusToPublished(recordId: string): Promise<void> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('🔄 Updating record status to Published:', recordId);

    const url = `${AIRTABLE_API_URL}/${recordId}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Status': 'Published'
        }
      })
    });

    if (!response.ok) {
      console.error('❌ Failed to update status:', response.status, response.statusText);
      const errorData = await response.json();
      console.error('❌ Error details:', errorData);
    } else {
      console.log('✅ Successfully updated status to Published for record:', recordId);
    }
  },

  async getApprovedSubmissions(): Promise<Submission[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('📋 Fetching all approved/published submissions...');

    // Filter for records that should be visible on frontend
    // "Approved" = ready to show + trigger status change to "Published"  
    // "Published" = already showing on frontend
    const filterFormula = `OR({Status} = "Approved", {Status} = "Published")`;
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;
    
    console.log('🔗 API URL:', url);
    console.log('📝 Filter formula:', filterFormula);
    console.log('🎯 Looking for statuses: "Approved" OR "Published"');

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
    
    console.log('📦 Raw Airtable response for approved submissions:', data);
    console.log('📊 Number of approved/published records found:', records.length);

    if (records.length > 0) {
      console.log('🏠 First approved record:', records[0]);
      console.log('📝 First record status:', records[0].fields['Status']);
      
      // Log all statuses found
      const statuses = records.map(r => r.fields['Status']);
      console.log('📋 All statuses found:', statuses);
    } else {
      console.log('❌ No records found with status "Approved" or "Published"');
      console.log('🔍 This might indicate a status name mismatch');
    }

    const transformedSubmissions = records.map((record, index) => {
      try {
        console.log(`🔄 Transforming approved record ${index + 1}/${records.length}:`, record.id);
        console.log(`📝 Record status: ${record.fields['Status']}`);
        
        // If status is "Approved", update it to "Published"
        if (record.fields['Status'] === 'Approved') {
          console.log('🚀 Triggering status update to Published for:', record.id);
          // Fire and forget - don't wait for this to complete
          this.updateStatusToPublished(record.id).catch(error => {
            console.error('❌ Failed to update status to Published:', error);
          });
        }
        
        const transformed = this.transformSubmission(record);
        console.log(`✅ Successfully transformed approved record ${index + 1}:`, transformed.brandName);
        return transformed;
      } catch (error) {
        console.error(`❌ Error transforming approved record ${index + 1}:`, error);
        console.error('📋 Problematic record:', record);
        throw error;
      }
    });
    
    console.log('✨ All transformed approved submissions:', transformedSubmissions.length);
    return transformedSubmissions;
  },

  async getSubmissionsByCountry(countryName: string): Promise<Submission[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('🔍 Fetching submissions for country:', countryName);

    // Filter for approved/published submissions in specific country (case-insensitive)
    const filterFormula = `AND(OR({Status} = "Approved", {Status} = "Published"), OR(FIND(UPPER("${countryName.toUpperCase()}"), UPPER({Countries})) > 0, FIND(LOWER("${countryName.toLowerCase()}"), LOWER({Countries})) > 0, FIND("${countryName}", {Countries}) > 0))`;
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
        
        // If status is "Approved", update it to "Published"
        if (record.fields['Status'] === 'Approved') {
          console.log('🚀 Triggering status update to Published for:', record.id);
          // Fire and forget - don't wait for this to complete
          this.updateStatusToPublished(record.id).catch(error => {
            console.error('❌ Failed to update status to Published:', error);
          });
        }
        
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
      
      // Check if record should be visible (has approved/published status)
      const status = record.fields['Status'];
      if (status !== 'Approved' && status !== 'Published') {
        console.log('❌ Record not approved/published, status:', status);
        return null;
      }
      
      // If status is "Approved", update it to "Published"
      if (status === 'Approved') {
        console.log('🚀 Triggering status update to Published for single record:', record.id);
        // Fire and forget - don't wait for this to complete
        this.updateStatusToPublished(record.id).catch(error => {
          console.error('❌ Failed to update status to Published:', error);
        });
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