// Slug-to-Email Mapping System for Unique Brand Identification
// This creates unique slugs tied to email identifiers for duplicate brand names

import { airtableService, type Submission } from './airtable';

interface SlugEmailMapping {
  slug: string;          // e.g., "kjh", "kjh-2"
  brandName: string;     // e.g., "kjh"
  email: string;         // e.g., "hegi@gmail.com", "jooj@gmail.com"
  submissionId: string;  // Airtable record ID
}

// In-memory cache for slug mappings
let slugMappingCache: SlugEmailMapping[] | null = null;

/**
 * Generate a base slug from brand name
 */
function generateBaseSlug(brandName: string): string {
  return brandName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
}

/**
 * Build slug-to-email mapping table from all submissions
 * Creates unique slugs for duplicate brand names tied to email identifiers
 */
export async function buildSlugEmailMappings(): Promise<SlugEmailMapping[]> {
  try {
    console.log('🏗️ Building slug-to-email mapping table...');
    
    // Get all approved submissions
    const submissions = await airtableService.getApprovedSubmissions();
    console.log(`📊 Processing ${submissions.length} submissions for slug mapping`);
    
    const mappings: SlugEmailMapping[] = [];
    const usedSlugs = new Set<string>();
    
    // Process each submission to create unique slugs
    submissions.forEach(submission => {
      const baseSlug = generateBaseSlug(submission.brandName);
      let uniqueSlug = baseSlug;
      let counter = 2;
      
      // If slug already exists, add number suffix
      while (usedSlugs.has(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      // Mark this slug as used
      usedSlugs.add(uniqueSlug);
      
      // Create mapping entry
      const mapping: SlugEmailMapping = {
        slug: uniqueSlug,
        brandName: submission.brandName,
        email: submission.email,
        submissionId: submission.id
      };
      
      mappings.push(mapping);
      
      console.log(`📝 Mapped: "${submission.brandName}" → slug: "${uniqueSlug}" → email: "${submission.email}"`);
    });
    
    console.log(`✅ Created ${mappings.length} slug-to-email mappings`);
    
    // Cache the mappings
    slugMappingCache = mappings;
    
    return mappings;
    
  } catch (error) {
    console.error('❌ Error building slug-email mappings:', error);
    return [];
  }
}

/**
 * Get cached slug mappings (build if not cached)
 */
export async function getSlugEmailMappings(): Promise<SlugEmailMapping[]> {
  if (!slugMappingCache) {
    slugMappingCache = await buildSlugEmailMappings();
  }
  return slugMappingCache;
}

/**
 * Find submission by slug using email identifier
 */
export async function getSubmissionBySlug(slug: string): Promise<Submission | null> {
  try {
    console.log(`🔍 Looking up submission by slug: "${slug}"`);
    
    // Get slug mappings
    const mappings = await getSlugEmailMappings();
    
    // Find the mapping for this slug
    const mapping = mappings.find(m => m.slug === slug);
    
    if (!mapping) {
      console.log(`❌ No mapping found for slug: "${slug}"`);
      return null;
    }
    
    console.log(`✅ Found mapping: slug "${slug}" → email "${mapping.email}" → brand "${mapping.brandName}"`);
    
    // Get the submission by email identifier
    const submission = await airtableService.getSubmissionByEmail(mapping.email);
    
    if (!submission) {
      console.log(`❌ No submission found for email: "${mapping.email}"`);
      return null;
    }
    
    // Add the unique slug to the submission
    return {
      ...submission,
      uniqueSlug: mapping.slug
    };
    
  } catch (error) {
    console.error(`❌ Error getting submission by slug "${slug}":`, error);
    return null;
  }
}

/**
 * Get all submissions with their unique slugs
 */
export async function getAllSubmissionsWithSlugs(): Promise<Array<Submission & { uniqueSlug: string }>> {
  try {
    console.log('📋 Getting all submissions with unique slugs...');
    
    // Get slug mappings
    const mappings = await getSlugEmailMappings();
    
    // Get all submissions
    const submissions = await airtableService.getApprovedSubmissions();
    
    // Map submissions to their unique slugs
    const submissionsWithSlugs = submissions.map(submission => {
      const mapping = mappings.find(m => m.email === submission.email);
      
      return {
        ...submission,
        uniqueSlug: mapping?.slug || generateBaseSlug(submission.brandName)
      };
    });
    
    console.log(`✅ Mapped ${submissionsWithSlugs.length} submissions with unique slugs`);
    return submissionsWithSlugs;
    
  } catch (error) {
    console.error('❌ Error getting submissions with slugs:', error);
    return [];
  }
}

/**
 * Force rebuild of slug mappings (useful for updates)
 */
export async function rebuildSlugMappings(): Promise<void> {
  console.log('🔄 Force rebuilding slug mappings...');
  slugMappingCache = null;
  await buildSlugEmailMappings();
  console.log('✅ Slug mappings rebuilt');
}

/**
 * Debug: Show all slug mappings
 */
export async function debugSlugMappings(): Promise<void> {
  console.log('🐛 DEBUG: Slug-Email Mappings');
  const mappings = await getSlugEmailMappings();
  
  console.table(mappings.map(m => ({
    Slug: m.slug,
    BrandName: m.brandName,
    Email: m.email,
    SubmissionId: m.submissionId
  })));
}










