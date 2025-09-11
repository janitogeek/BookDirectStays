#!/usr/bin/env node

/**
 * Server-side Migration Script
 * Run this to process ALL existing Airtable submissions
 */

import fetch from 'node-fetch';

// Configuration
const AIRTABLE_API_KEY = process.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = 'Directory Submissions';

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Missing environment variables:');
  console.error('   - VITE_AIRTABLE_API_KEY');
  console.error('   - VITE_AIRTABLE_BASE_ID');
  console.error('Please set these in your .env file');
  process.exit(1);
}

class ServerMigrationProcessor {
  
  /**
   * Fetch all approved submissions from Airtable
   */
  async fetchAllSubmissions() {
    console.log('📋 Fetching all approved submissions from Airtable...');
    
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    
    let allRecords = [];
    let offset = null;
    
    do {
      const params = new URLSearchParams({
        filterByFormula: "AND({Status} = 'Approved – Published', {Brand Name} != '')",
        maxRecords: '100'
      });
      
      if (offset) {
        params.set('offset', offset);
      }
      
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset;
      
      console.log(`   Fetched ${allRecords.length} records so far...`);
      
    } while (offset);
    
    console.log(`✅ Found ${allRecords.length} approved submissions`);
    return allRecords;
  }
  
  /**
   * Generate unique slug for a brand name
   */
  generateUniqueSlug(brandName, usedSlugs) {
    const baseSlug = brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (usedSlugs.has(uniqueSlug)) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    return uniqueSlug;
  }
  
  /**
   * Process all submissions and generate migration report
   */
  async processAllSubmissions() {
    console.log('🚀 MIGRATION: Starting processing of ALL existing submissions...');
    
    try {
      // Step 1: Fetch all submissions
      const records = await this.fetchAllSubmissions();
      
      // Step 2: Process each submission
      console.log('🔄 Processing submissions and generating unique slugs...');
      const slugMap = new Map();
      const usedSlugs = new Set();
      const processedSubmissions = [];
      const errors = [];
      
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const fields = record.fields;
        
        try {
          if (!fields['Brand Name']) {
            errors.push(`Record ${record.id}: Missing Brand Name`);
            continue;
          }
          
          const brandName = fields['Brand Name'];
          const email = fields['Submitted By (Email)'] || `no-email-${record.id}`;
          
          // Generate unique slug
          const uniqueSlug = this.generateUniqueSlug(brandName, usedSlugs);
          usedSlugs.add(uniqueSlug);
          slugMap.set(email, uniqueSlug);
          
          const processedSubmission = {
            id: record.id,
            brandName,
            email,
            uniqueSlug,
            status: fields['Status'],
            countries: fields['Countries'] ? fields['Countries'].split(', ') : [],
            cities: fields['Cities'] ? fields['Cities'].split(', ') : [],
            plan: fields['Plan'] || 'Basic',
            isFeatured: fields['Plan']?.includes('Premium') || fields['Plan']?.includes('€499.99')
          };
          
          processedSubmissions.push(processedSubmission);
          
          console.log(`✅ ${i + 1}/${records.length}: "${brandName}" → "${uniqueSlug}"`);
          
        } catch (error) {
          const errorMsg = `Error processing record ${record.id}: ${error.message}`;
          console.error(`❌ ${errorMsg}`);
          errors.push(errorMsg);
        }
      }
      
      // Step 3: Generate report
      console.log('\n📊 MIGRATION REPORT:');
      console.log('='.repeat(50));
      console.log(`Total Records Found: ${records.length}`);
      console.log(`Successfully Processed: ${processedSubmissions.length}`);
      console.log(`Unique Slugs Generated: ${usedSlugs.size}`);
      console.log(`Errors: ${errors.length}`);
      
      // Featured submissions
      const featuredSubmissions = processedSubmissions.filter(s => s.isFeatured);
      console.log(`Featured Submissions: ${featuredSubmissions.length}`);
      
      // Countries
      const allCountries = new Set();
      processedSubmissions.forEach(s => {
        s.countries.forEach(country => allCountries.add(country));
      });
      console.log(`Countries Represented: ${allCountries.size}`);
      
      // Cities
      const allCities = new Set();
      processedSubmissions.forEach(s => {
        s.cities.forEach(city => allCities.add(city));
      });
      console.log(`Cities Represented: ${allCities.size}`);
      
      console.log('='.repeat(50));
      
      if (errors.length > 0) {
        console.log('\n❌ ERRORS:');
        errors.forEach(error => console.log(`   - ${error}`));
      }
      
      console.log('\n🎉 MIGRATION ANALYSIS COMPLETE!');
      console.log('\nNext Steps:');
      console.log('1. Go to your website: /admin/migration');
      console.log('2. Click "Run Full Migration" to apply these changes');
      console.log('3. This will create proper company pages and integrate all submissions');
      
      return {
        totalSubmissions: records.length,
        processedSubmissions: processedSubmissions.length,
        createdSlugs: usedSlugs.size,
        featuredSubmissions: featuredSubmissions.length,
        countries: allCountries.size,
        cities: allCities.size,
        errors: errors.length,
        processedData: processedSubmissions
      };
      
    } catch (error) {
      console.error('❌ MIGRATION FAILED:', error);
      throw error;
    }
  }
}

// Run the migration
async function runMigration() {
  console.log('🛠️  BookDirectStays Migration Script');
  console.log('=====================================\n');
  
  const processor = new ServerMigrationProcessor();
  
  try {
    await processor.processAllSubmissions();
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration();
