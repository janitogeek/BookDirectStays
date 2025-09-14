/**
 * Migration Processor
 * 
 * One-time script to process ALL existing Airtable submissions
 * and integrate them properly into the system with unique slugs
 */

import { airtableService } from './airtable';
import { dataPreloader } from './data-preloader';
import { clearSlugMappingCache } from './slug-email-mapping';

interface MigrationStats {
  totalSubmissions: number;
  processedSubmissions: number;
  createdSlugs: number;
  errors: string[];
}

export class MigrationProcessor {
  
  /**
   * Process ALL existing Airtable submissions to integrate them properly
   */
  async processAllExistingSubmissions(): Promise<MigrationStats> {
    const stats: MigrationStats = {
      totalSubmissions: 0,
      processedSubmissions: 0,
      createdSlugs: 0,
      errors: []
    };

    try {
      console.log('🚀 MIGRATION: Starting processing of ALL existing submissions...');
      
      // Step 1: Get ALL approved submissions from Airtable
      console.log('📋 Step 1: Fetching all approved submissions from Airtable...');
      const allSubmissions = await airtableService.getApprovedSubmissions();
      stats.totalSubmissions = allSubmissions.length;
      console.log(`✅ Found ${stats.totalSubmissions} approved submissions to process`);

      // Step 2: Clear ALL existing caches to start fresh
      console.log('🗑️ Step 2: Clearing all existing caches...');
      await this.clearAllCaches();
      console.log('✅ All caches cleared');

      // Step 3: Process each submission individually
      console.log('🔄 Step 3: Processing each submission...');
      const slugMap = new Map<string, string>();
      const usedSlugs = new Set<string>();

      for (let i = 0; i < allSubmissions.length; i++) {
        const submission = allSubmissions[i];
        try {
          console.log(`📝 Processing ${i + 1}/${allSubmissions.length}: ${submission.brandName}`);
          
          // Generate unique slug
          const uniqueSlug = this.generateUniqueSlug(submission.brandName, usedSlugs);
          usedSlugs.add(uniqueSlug);
          slugMap.set(submission.email, uniqueSlug);
          
          console.log(`🏷️ Created slug: "${submission.brandName}" → "${uniqueSlug}"`);
          stats.createdSlugs++;
          stats.processedSubmissions++;
          
        } catch (error) {
          const errorMsg = `Error processing ${submission.brandName}: ${error}`;
          console.error(`❌ ${errorMsg}`);
          stats.errors.push(errorMsg);
        }
      }

      // Step 4: Force refresh the data preloader with new data
      console.log('🔄 Step 4: Force refreshing data preloader...');
      await dataPreloader.forceRefresh();
      console.log('✅ Data preloader refreshed with all submissions');

      // Step 5: Verify integration
      console.log('✅ Step 5: Verifying integration...');
      const countriesData = await dataPreloader.getCountries();
      const submissionsData = await dataPreloader.getSubmissions();
      
      console.log(`📊 Integration Results:`);
      console.log(`   - Countries with hosts: ${countriesData.length}`);
      console.log(`   - Submissions with unique slugs: ${submissionsData.length}`);
      console.log(`   - Unique slugs created: ${stats.createdSlugs}`);

      console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
      return stats;

    } catch (error) {
      console.error('❌ MIGRATION FAILED:', error);
      stats.errors.push(`Migration failed: ${error}`);
      return stats;
    }
  }

  /**
   * Generate unique slug for a brand name
   */
  private generateUniqueSlug(brandName: string, usedSlugs: Set<string>): string {
    const baseSlug = brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let uniqueSlug = baseSlug;
    let counter = 1;

    // If slug already exists, add number suffix
    while (usedSlugs.has(uniqueSlug)) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    return uniqueSlug;
  }

  /**
   * Clear all caches to start fresh
   */
  private async clearAllCaches(): Promise<void> {
    // Clear data preloader caches
    localStorage.removeItem('bds_submissions_with_slugs');
    localStorage.removeItem('bds_countries_data');
    localStorage.removeItem('bds_cities_data');
    localStorage.removeItem('bds_currencies');
    localStorage.removeItem('bds_cache_timestamp');
    localStorage.removeItem('bds_cache_version');
    
    // Clear other caches
    localStorage.removeItem('bds_submissions_cache');
    localStorage.removeItem('bds_preload_ready');
    localStorage.removeItem('bds_featured_hosts');
    
    // Clear slug mapping cache
    clearSlugMappingCache();
    
    // Clear any country/city specific caches
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('bds_country_') || key.startsWith('bds_city_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get migration status and statistics
   */
  async getMigrationStatus(): Promise<{ needsMigration: boolean; reason: string }> {
    try {
      const submissions = await dataPreloader.getSubmissions();
      const countries = await dataPreloader.getCountries();
      
      // Check if we have submissions with unique slugs
      const submissionsWithSlugs = submissions.filter(s => (s as any).uniqueSlug);
      
      if (submissions.length === 0) {
        return { needsMigration: true, reason: 'No submissions found in cache' };
      }
      
      if (submissionsWithSlugs.length < submissions.length) {
        return { needsMigration: true, reason: `${submissions.length - submissionsWithSlugs.length} submissions missing unique slugs` };
      }
      
      if (countries.length === 0) {
        return { needsMigration: true, reason: 'No countries found in cache' };
      }
      
      return { needsMigration: false, reason: 'All submissions properly integrated' };
      
    } catch (error) {
      return { needsMigration: true, reason: `Error checking status: ${error}` };
    }
  }
}

// Export singleton instance
export const migrationProcessor = new MigrationProcessor();


