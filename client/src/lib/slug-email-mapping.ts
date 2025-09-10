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
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Slug mapping timeout after 10 seconds')), 10000);
    });
    
    // Import dataPreloader dynamically to avoid circular imports
    const { dataPreloader } = await import('./data-preloader');
    
    // Get all submissions with timeout
    const allSubmissions = await Promise.race([
      dataPreloader.getSubmissions(),
      timeoutPromise
    ]) as any[];
    const slugMap = new Map<string, SlugMapping>();
    const usedSlugs = new Set<string>();

    allSubmissions.forEach(submission => {
      const baseSlug = generateSlug(submission.brandName);
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
        email: submission.email,
        brandName: submission.brandName,
        submissionId: submission.id
      };

      slugMap.set(uniqueSlug, mapping);
      
      console.log(`🏷️ Mapped: "${submission.brandName}" → "${uniqueSlug}" (${submission.email})`);
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
    
    // Import dataPreloader dynamically to avoid circular imports
    const { dataPreloader } = await import('./data-preloader');
    
    // Get submission by email (most reliable identifier)
    const allSubmissions = await dataPreloader.getSubmissions();
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
    // Import dataPreloader dynamically to avoid circular imports
    const { dataPreloader } = await import('./data-preloader');
    
    const allSubmissions = await dataPreloader.getSubmissions();
    const mappings = await getSlugEmailMappings();
    
    return allSubmissions.map(submission => {
      // Find the slug for this submission
      let uniqueSlug = null;
      for (const [slug, mapping] of mappings.entries()) {
        if (mapping.email === submission.email) {
          uniqueSlug = slug;
          break;
        }
      }
      
      return {
        ...submission,
        uniqueSlug: uniqueSlug || generateSlug(submission.brandName)
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