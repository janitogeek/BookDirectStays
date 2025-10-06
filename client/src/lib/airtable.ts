// Airtable API configuration for BookDirectStays

// Airtable configuration
const AIRTABLE_API_KEY = (import.meta as any).env?.VITE_AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = (import.meta as any).env?.VITE_AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE_NAME = 'tblG8dKlv033Kp7bl'; // TESTING: Use Table ID instead of name

// Airtable API endpoint - NO VIEW SPECIFIED to get all records
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
  'PMC General Website': string;
  'Direct Booking Engine URL': string;

    'Number of Listings': number;
    'Email': string;
    'One-line Description': string;
      'Why Book With You': string;
  'Why Rent With You': string;
  'Commission On Revenue': string;
    'Plan': string;
    'Top Stats': string;
    'Countries': string | string[];
    'Cities': string | string[];
    'Regions / States'?: string | string[];
    'Geonames Record'?: string;
    'Types of Stays': string | string[];
    'Ideal For': string | string[];
    'Properties Features': string | string[];
    'Services & Convenience': string | string[];
    'Lifestyle & Values': string | string[];
    'Design Style': string | string[];
    'Atmospheres': string | string[];
    'Settings/Locations': string | string[];
    'Instagram'?: string;
    'Facebook'?: string;
    'LinkedIn'?: string;
    'TikTok'?: string;
    'YouTube / Video Tour'?: string;
    'Logo'?: Array<{ url: string; filename: string }>;
    'Highlight Image'?: Array<{ url: string; filename: string }>;
    'Rating Screenshot'?: Array<{ url: string; filename: string }>;
    'Status': string;
    'Submission Date': string;
    // New fields
    'PMS Used'?: string;
    'Min Price'?: number;
    'Max Price'?: number;
    'Currency'?: string;
    'Google Reviews Link'?: string;
    'Cancellation Policy'?: string;
  };
  createdTime: string;
}

// Normalized submission interface for frontend use
export interface Submission {
  id: string;
  brandName: string;
  pmcGeneralWebsite: string;
  website: string;
  uniqueSlug?: string; // Optional unique slug for routing

  numberOfListings: number;
  email: string;
  oneLineDescription: string;
  whyBookWithYou: string;
  whyRentWithYou: string;
  commissionOnRevenue: string;
  plan: string;
  topStats: string;
  countries: string[];
  citiesRegions: string[];
  regionsStates?: string[];
  geonamesRecord?: string;
  typesOfStays: string[];
  idealFor: string[];
  propertiesFeatures: string[];
  servicesConvenience: string[];
  lifestyleValues: string[];
  designStyle: string[];
  atmospheres: string[];
  settingsLocations: string[];
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
  // New fields
  pmsUsed?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  googleReviewsLink?: string;
  cancellationPolicy?: string;
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
              'PMC General Website': submissionData.PMC_General_Website,
              'Direct Booking Engine URL': submissionData.Direct_Booking_Engine_URL,
              'Number of Listings': submissionData.Number_of_Listings,
              'Email': submissionData.E_mail,
              'One-line Description': submissionData.field9,
              'Why Book With You': submissionData.field10,
      'Why Rent With You': submissionData.field11,
      'Commission on Revenue': submissionData.field12,
              'Plan': submissionData.field11,
              'Countries': submissionData.Countries,
              'Cities': submissionData.Cities_Regions,
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

  // Temporary method to test different status variations
  async testStatusVariations(): Promise<void> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('🧪 Testing different status variations...');

    const statusVariations = [
      "Approved – Published", // ← This is the correct one (em dash)
      "Approved - Published",
      "Approved-Published", 
      "Approved - published",
      "approved - published",
      "APPROVED - PUBLISHED",
      "Approved  -  Published", // extra spaces
      "Published",
      "Approved"
    ];

    for (const testStatus of statusVariations) {
      try {
        const filterFormula = `{Status} = "${testStatus}"`;
        const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const count = data.records?.length || 0;
          console.log(`🎯 Status "${testStatus}": ${count} records found`);
          
          if (count > 0) {
            console.log(`✅ FOUND MATCH with "${testStatus}"!`);
            console.log('📝 First matching record:', data.records[0]);
          }
        }
      } catch (error) {
        console.error(`❌ Error testing status "${testStatus}":`, error);
      }
    }
  },

  // EMERGENCY FIX: Simple direct fetch bypassing all cache/complexity
  async getApprovedSubmissionsSimple(): Promise<Submission[]> {
    console.log('🚨 EMERGENCY: Using simple direct fetch to bypass all issues');
    
    try {
      const url = `https://api.airtable.com/v0/app0tFfsjLbI1qXq0/tblG8dKlv033Kp7bl`;
      console.log('🔗 Direct URL:', url);
      
      let allRecords: any[] = [];
      let offset: string | undefined = undefined;
      let page = 1;
      
      do {
        const params = new URLSearchParams({ maxRecords: '100' });
        if (offset) params.set('offset', offset);
        
        console.log(`📋 SIMPLE: Fetching page ${page}...`);
        
        const response = await fetch(`${url}?${params}`, {
          headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        allRecords = allRecords.concat(data.records);
        offset = data.offset;
        
        console.log(`✅ SIMPLE: Page ${page} got ${data.records.length} records`);
        console.log(`📊 SIMPLE: Total so far: ${allRecords.length}`);
        console.log(`🔄 SIMPLE: Has more pages? ${!!offset}`);
        
        page++;
        
      } while (offset);
      
      console.log(`🎉 SIMPLE: Final total: ${allRecords.length} records`);
      
      // Filter for approved
      const approved = allRecords.filter(r => {
        const status = r.fields?.Status;
        return status === 'Approved – Published';
      });
      
      console.log(`✅ SIMPLE: Found ${approved.length} approved out of ${allRecords.length} total`);
      
      return approved.map(record => ({
        id: record.id,
        brandName: record.fields['Brand Name'] || 'Unknown',
        status: record.fields['Status'] || 'Unknown',
        ...record.fields
      }));
      
    } catch (error) {
      console.error('🚨 SIMPLE: Error:', error);
      throw error;
    }
  },

  async getApprovedSubmissions(): Promise<Submission[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('📋 Fetching approved-published submissions (UNLIMITED)...');
    
    // DEBUG: List all tables in the base
    console.log('🔍 DEBUG: Checking base info...');
    console.log('🔍 DEBUG: Base ID:', AIRTABLE_BASE_ID);
    console.log('🔍 DEBUG: Table Name/ID:', AIRTABLE_TABLE_NAME);
    console.log('🔍 DEBUG: Full API URL:', AIRTABLE_API_URL);

    // 🚨 SYSTEMATIC DEBUGGING: Still getting 100 records even with view parameter!
    console.log('🚨 DEBUGGING: Testing multiple scenarios to find why we only get 100 records');
    const AIRTABLE_VIEW_ID = 'viwbLcYkUpsQoomUn'; // The view with 980 records from user's URL
    
    // 🧪 TEST 1: Try WITHOUT view parameter (baseline)
    console.log('🧪 TEST 1: Fetching WITHOUT view parameter (baseline test)');
    const testNoView = await fetch(`${AIRTABLE_API_URL}?maxRecords=5`, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
    });
    
    if (testNoView.ok) {
      const noViewData = await testNoView.json();
      console.log('🧪 TEST 1 RESULT: No view =', noViewData.records?.length, 'records, has more?', !!noViewData.offset);
    }
    
    // 🧪 TEST 2: Try WITH view parameter
    console.log('🧪 TEST 2: Fetching WITH view parameter');
    const testWithView = await fetch(`${AIRTABLE_API_URL}?maxRecords=5&view=${AIRTABLE_VIEW_ID}`, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
    });
    
    if (testWithView.ok) {
      const withViewData = await testWithView.json();
      console.log('🧪 TEST 2 RESULT: With view =', withViewData.records?.length, 'records, has more?', !!withViewData.offset);
      console.log('🧪 TEST 2 URL:', `${AIRTABLE_API_URL}?maxRecords=5&view=${AIRTABLE_VIEW_ID}`);
    } else {
      console.log('🧪 TEST 2 FAILED:', testWithView.status, testWithView.statusText);
    }
    
    // 🧪 TEST 3: Try with view name instead of ID
    console.log('🧪 TEST 3: Fetching with view name "Grid view"');
    const testViewName = await fetch(`${AIRTABLE_API_URL}?maxRecords=5&view=Grid%20view`, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
    });
    
    if (testViewName.ok) {
      const viewNameData = await testViewName.json();
      console.log('🧪 TEST 3 RESULT: View name =', viewNameData.records?.length, 'records, has more?', !!viewNameData.offset);
    } else {
      console.log('🧪 TEST 3 FAILED:', testViewName.status, testViewName.statusText);
    }

    // Run status variation test first (disabled - found the issue!)
    // await this.testStatusVariations();

        // First, let's get ALL records to see what statuses actually exist (WITH UNLIMITED PAGINATION)
    const allRecordsUrl = `${AIRTABLE_API_URL}`;
    console.log('🔍 First, fetching ALL records to debug statuses (UNLIMITED WITH VIEW)...');
    
    // UNLIMITED PAGINATION: Get ALL records to analyze statuses
    let allRecords: AirtableSubmission[] = [];
    let allRecordsOffset: string | undefined = undefined;
    let pageCount = 0;

    do {
      pageCount++;
      const params = new URLSearchParams({ 
        maxRecords: '100',
        view: AIRTABLE_VIEW_ID  // 🎯 FIX: Use the specific view with 980 records
      });
      if (allRecordsOffset) {
        params.set('offset', allRecordsOffset);
      }

      console.log(`📋 UNLIMITED: Fetching ALL records page ${pageCount} (WITH VIEW ${AIRTABLE_VIEW_ID})...`);

      const allResponse = await fetch(`${allRecordsUrl}?${params}`, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        },
      });

      if (allResponse.ok) {
        const allData = await allResponse.json();
        const pageRecords: AirtableSubmission[] = allData.records || [];
        allRecords = allRecords.concat(pageRecords);
        allRecordsOffset = allData.offset;

        console.log(`✅ UNLIMITED: Page ${pageCount} got ${pageRecords.length} records`);
        console.log(`📊 UNLIMITED: Total records so far: ${allRecords.length}`);
        console.log(`🔄 UNLIMITED: Has more pages? ${!!allRecordsOffset}`);

        // Safety limit: 100 pages = 10,000 records max
        if (pageCount >= 100) {
          console.warn('⚠️ UNLIMITED: Reached 100 pages (10k records), stopping to prevent timeout');
          break;
        }
      } else {
        console.error('❌ UNLIMITED: Error fetching page:', allResponse.status);
        break;
      }

    } while (allRecordsOffset);

    console.log(`🎉 UNLIMITED: Total records fetched: ${allRecords.length}`);
    
    if (allRecords.length > 0) {
      console.log('📝 First record for debugging:', allRecords[0]);
      console.log('📝 First record fields:', allRecords[0].fields);
      console.log('📝 First record status:', JSON.stringify(allRecords[0].fields['Status']));
      
      // Get all unique statuses
      const allStatuses = allRecords.map(r => r.fields['Status']).filter(Boolean);
      const uniqueStatuses = [...new Set(allStatuses)];
      console.log('📋 All unique statuses found:', uniqueStatuses);
      console.log('📋 All statuses (with quotes):', uniqueStatuses.map(s => `"${s}"`));
      
      // Count each status
      const statusCounts = allStatuses.reduce((acc: any, status) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      console.log('📊 Status breakdown:', statusCounts);
      
      // Check if any match our target
      const targetStatus = "Approved – Published"; // em dash
      const matchingRecords = allRecords.filter(r => r.fields['Status'] === targetStatus);
      console.log(`🎯 Records with exact status "${targetStatus}":`, matchingRecords.length);
      
      // Check for similar statuses
      const similarStatuses = uniqueStatuses.filter(status => 
        status && status.toLowerCase().includes('approved') && status.toLowerCase().includes('published')
      );
      console.log('🔍 Similar statuses containing "approved" and "published":', similarStatuses);
    }

    // Now try the filtered query WITH UNLIMITED PAGINATION
    const filterFormula = `{Status} = "Approved – Published"`;
    console.log('📝 Filter formula:', filterFormula);
    console.log('🎯 Looking for exact status: "Approved – Published" (with em dash)');

        // UNLIMITED PAGINATION: Get ALL matching records
    let approvedRecords: AirtableSubmission[] = [];
    let approvedOffset: string | undefined = undefined;
    let approvedPageCount = 0;

    do {
      approvedPageCount++;
      const params = new URLSearchParams({ 
        maxRecords: '100',
        filterByFormula: filterFormula,
        view: AIRTABLE_VIEW_ID  // 🎯 FIX: Use the specific view with 980 records
      });
      if (approvedOffset) {
        params.set('offset', approvedOffset);
      }

      const url = `${AIRTABLE_API_URL}?${params}`;
      console.log(`📋 APPROVED: Fetching approved records page ${approvedPageCount} (WITH VIEW ${AIRTABLE_VIEW_ID})...`);
      console.log('🔗 API URL:', url);

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
      const pageRecords: AirtableSubmission[] = data.records || [];
      approvedRecords = approvedRecords.concat(pageRecords);
      approvedOffset = data.offset;

      console.log(`✅ APPROVED: Page ${approvedPageCount} got ${pageRecords.length} approved records`);
      console.log(`📊 APPROVED: Total approved records so far: ${approvedRecords.length}`);
      console.log(`🔄 APPROVED: Has more pages? ${!!approvedOffset}`);

      // Safety limit: 100 pages = 10,000 records max
      if (approvedPageCount >= 100) {
        console.warn('⚠️ APPROVED: Reached 100 pages (10k records), stopping to prevent timeout');
        break;
      }

    } while (approvedOffset);

    console.log(`🎉 APPROVED: Total approved records fetched: ${approvedRecords.length}`);
    
    if (approvedRecords.length > 0) {
      console.log('🏠 First approved-published record:', approvedRecords[0]);
      console.log('📝 First record status:', approvedRecords[0].fields['Status']);
      console.log('✅ SUCCESS! Found approved records with em dash status!');
    } else {
      console.log('❌ No records found with status "Approved – Published"');
      console.log('🔍 This suggests a status string mismatch');
    }

    const transformedSubmissions = approvedRecords.map((record, index) => {
      try {
        console.log(`🔄 Transforming approved-published record ${index + 1}/${approvedRecords.length}:`, record.id);
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

  async getApprovedSubmissionsOLD(): Promise<Submission[]> {
    console.log('🚨 ENTRY: getApprovedSubmissions function called!');
    console.log('🚨 ENTRY: API Key exists:', !!AIRTABLE_API_KEY);
    console.log('🚨 ENTRY: Base ID exists:', !!AIRTABLE_BASE_ID);
    
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.log('🚨 EARLY EXIT: Missing Airtable configuration');
    throw new Error('Airtable configuration missing');
  }

  console.log('📋 FIXED: Fetching ALL records with pagination to detect all 980 records...');

  // STEP 1: Fetch ALL records using pagination
  let allRecords: AirtableSubmission[] = [];
  let offset: string | undefined = undefined;
  let pageCount = 0;

  do {
    pageCount++;
    const params = new URLSearchParams({ maxRecords: '100' });
    if (offset) {
      params.set('offset', offset);
    }

    const url = `${AIRTABLE_API_URL}?${params}`;
    console.log(`📋 FIXED: Fetching page ${pageCount}...`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data = await response.json();
    const pageRecords: AirtableSubmission[] = data.records || [];
    
    allRecords = allRecords.concat(pageRecords);
    offset = data.offset;

    console.log(`✅ FIXED: Page ${pageCount} got ${pageRecords.length} records`);
    console.log(`📊 FIXED: Total records so far: ${allRecords.length}`);
    console.log(`🔄 FIXED: Has more pages? ${!!offset}`);

    // Safety break to prevent infinite loops
    if (pageCount > 20) {
      console.warn('⚠️ FIXED: Breaking after 20 pages to prevent infinite loop');
      break;
    }

  } while (offset);

  console.log(`🎉 FIXED: Total records fetched: ${allRecords.length} (should be ~980)`);

  // STEP 2: Get status breakdown of ALL records
  const allStatuses = allRecords.map(r => r.fields['Status']).filter(Boolean);
  const uniqueStatuses = [...new Set(allStatuses)];
  const statusCounts = allStatuses.reduce((acc: any, status) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  console.log('📋 FIXED: All unique statuses found:', uniqueStatuses);
  console.log('📊 FIXED: Status breakdown:', statusCounts);

  // STEP 3: Filter for approved records
  const approvedRecords = allRecords.filter(record => {
    const status = record.fields['Status'];
    return status === 'Approved – Published' || 
           status === 'Approved - Published' || 
           status === 'Published';
  });

  console.log(`✅ FIXED: Found ${approvedRecords.length} approved records out of ${allRecords.length} total (should be ~313)`);

  // STEP 4: Transform to expected format
  const transformedSubmissions = approvedRecords.map((record, index) => {
    try {
      const transformedSubmission = this.transformSubmission(record);
      return transformedSubmission;
    } catch (error) {
      console.error(`❌ FIXED: Error transforming record ${index + 1}:`, error);
      throw error;
    }
  });
  
  console.log(`🎉 FIXED: Successfully transformed ${transformedSubmissions.length} approved submissions`);
  return transformedSubmissions;
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
              const exactField = fields['Rating Screenshot'];
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
      pmcGeneralWebsite: fields['PMC General Website'] || '',
      website: fields['Direct Booking Engine URL'] || '',

      numberOfListings: fields['Number of Listings'] || 0,
      email: fields['Email'] || '',
      oneLineDescription: fields['One-line Description'] || '',
              whyBookWithYou: fields['Why Book With You'] || '',
    whyRentWithYou: fields['Why Rent With You'] || '',
    commissionOnRevenue: fields['Commission On Revenue'] || '',
      plan: fields['Plan'] || '',
      topStats: fields['Top Stats'] || '',
      countries: parseArray(fields['Countries']),
      citiesRegions: parseArray(fields['Cities']),
      regionsStates: parseArray(fields['Regions / States']),
      geonamesRecord: fields['Geonames Record'] || undefined,
      typesOfStays: parseArray(fields['Types of Stays']),
      idealFor: parseArray(fields['Ideal For']),
      propertiesFeatures: parseArray(fields['Properties Features']),
      servicesConvenience: parseArray(fields['Services & Convenience']),
      lifestyleValues: parseArray(fields['Lifestyle & Values']),
      designStyle: parseArray(fields['Design Style']),
      atmospheres: parseArray(fields['Atmospheres']),
      settingsLocations: parseArray(fields['Settings/Locations']),
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
      createdTime: record.createdTime,
      // New fields
      pmsUsed: fields['PMS Used'] || undefined,
      minPrice: fields['Min Price'] || undefined,
      maxPrice: fields['Max Price'] || undefined,
      currency: fields['Currency'] || undefined,
      googleReviewsLink: fields['Google Reviews Link'] || undefined,
      cancellationPolicy: fields['Cancellation Policy'] || undefined,
    };



    console.log('✅ Transformed:', transformed.brandName, '- Status:', transformed.status);
    
    return transformed;
  }
};

// Export for use in components
export default airtableService; 