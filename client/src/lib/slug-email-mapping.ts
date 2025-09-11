/**
 * Unique Slug Generation for Companies
 * Ensures each company has a unique URL regardless of duplicate brand names
 */

import { generateSlug } from './utils';

interface SlugMapping {
  slug: string;
  email: string;
  brandName: string;
  submissionId: string;
}

let slugMappingCache: Map<string, SlugMapping> | null = null;

export const buildSlugEmailMappings = async (): Promise<Map<string, SlugMapping>> => {
  try {
    console.log('🔗 Building unique slug mappings...');
    
    // Import airtableService directly to avoid circular dependency
    const { airtableService } = await import('./airtable');
    
    // Get raw submissions directly from Airtable
    const allSubmissions = await airtableService.getApprovedSubmissions();
    const slugMap = new Map<string, SlugMapping>();
    const usedSlugs = new Set<string>();

    allSubmissions.forEach(submission => {
      // Debug what fields the submission actually has during mapping
      const emailField = submission.email || submission.Email;
      const brandField = submission.brandName || submission['Brand Name'];
      
      if (emailField === 'jansahagun@gmail.com') {
        console.log(`🏷️ BUILD MAPPING DEBUG:`, {
          id: submission.id,
          brandName: brandField,
          email: emailField,
          keys: Object.keys(submission)
        });
      }
      
      const baseSlug = generateSlug(brandField);
      let uniqueSlug = baseSlug;
      let counter = 1;

      // If slug already exists, add number suffix
      while (usedSlugs.has(uniqueSlug)) {
        counter++;
        uniqueSlug = `${baseSlug}-${counter}`;
      }

      usedSlugs.add(uniqueSlug);
      
      const mapping: SlugMapping = {
        slug: uniqueSlug,
        email: emailField,
        brandName: brandField,
        submissionId: submission.id
      };

      slugMap.set(uniqueSlug, mapping);
      
      // Debug log for problematic submissions
      if (emailField === 'jansahagun@gmail.com') {
        console.log(`🏷️ MAPPING DEBUG: "${brandField}" (${submission.id}) → "${uniqueSlug}"`);
      } else {
        console.log(`🏷️ Mapped: "${brandField}" → "${uniqueSlug}" (${emailField})`);
      }
    });

    console.log(`✅ Created ${slugMap.size} unique slug mappings`);
    return slugMap;
  } catch (error) {
    console.error('❌ Error building slug mappings:', error);
    return new Map();
  }
};

export const getSlugEmailMappings = async (): Promise<Map<string, SlugMapping>> => {
  if (!slugMappingCache) {
    slugMappingCache = await buildSlugEmailMappings();
  }
  return slugMappingCache;
};

export const getSubmissionBySlug = async (slug: string) => {
  try {
    const mappings = await getSlugEmailMappings();
    const mapping = mappings.get(slug);
    
    if (!mapping) {
      console.error(`❌ No mapping found for slug: ${slug}`);
      return null;
    }

    console.log(`🔍 Found mapping for slug "${slug}": ${mapping.brandName} (${mapping.email})`);
    
    // Import airtableService directly to avoid circular dependency
    const { airtableService } = await import('./airtable');
    
    // Get submission by email (most reliable identifier)
    const allSubmissions = await airtableService.getApprovedSubmissions();
    const submission = allSubmissions.find(s => s.email === mapping.email);
    
    if (submission) {
      // Add the unique slug to the submission
      (submission as any).uniqueSlug = slug;
      console.log(`✅ Found submission: ${submission.brandName}`);
      return submission;
    }

    console.error(`❌ No submission found for email: ${mapping.email}`);
    return null;
  } catch (error) {
    console.error('❌ Error getting submission by slug:', error);
    return null;
  }
};

export const getAllSubmissionsWithSlugs = async () => {
  try {
    // Import airtableService directly to avoid circular dependency
    const { airtableService } = await import('./airtable');
    
    const allSubmissions = await airtableService.getApprovedSubmissions();
    const mappings = await getSlugEmailMappings();
    
    return allSubmissions.map(submission => {
      // Debug what fields the submission actually has
      if (submission.email === 'jansahagun@gmail.com' || submission.Email === 'jansahagun@gmail.com') {
        console.log(`🔍 SUBMISSION STRUCTURE DEBUG:`, {
          id: submission.id,
          brandName: submission.brandName || submission['Brand Name'],
          email: submission.email || submission.Email,
          keys: Object.keys(submission)
        });
      }
      
      // Find the slug for this submission BY SUBMISSION ID, NOT EMAIL
      let uniqueSlug = null;
      for (const [slug, mapping] of mappings.entries()) {
        if (mapping.submissionId === submission.id) {  // ← FIXED: Match by ID
          uniqueSlug = slug;
          break;
        }
      }
      
      // Debug log for problematic submissions
      const emailField = submission.email || submission.Email;
      if (emailField === 'jansahagun@gmail.com') {
        console.log(`🔍 SLUG MAPPING DEBUG: "${submission.brandName || submission['Brand Name']}" (${submission.id}) → "${uniqueSlug}"`);
      }
      
      return {
        ...submission,
        uniqueSlug: uniqueSlug || generateSlug(submission.brandName || submission['Brand Name'])
      };
    });
  } catch (error) {
    console.error('❌ Error getting submissions with slugs:', error);
    return [];
  }
};

// Clear the cache when needed
export const clearSlugMappingCache = () => {
  slugMappingCache = null;
  console.log('🗑️ Slug mapping cache cleared');
};