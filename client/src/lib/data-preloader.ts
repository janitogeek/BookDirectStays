/**
 * Data Preloader Service
 * 
 * Preloads and caches all heavy data processing in the background
 * to eliminate loading delays when users navigate to find-host page
 */

import { Submission } from './airtable';
import { getAllSubmissionsWithSlugs } from './slug-email-mapping';
import { parseGeonamesRecord, getCountriesFromGeonamesRecord, getCitiesForCountryFromGeonamesRecord } from './geonames-record-parser';

// Cache keys
const CACHE_KEYS = {
  SUBMISSIONS_WITH_SLUGS: 'bds_submissions_with_slugs',
  COUNTRIES_DATA: 'bds_countries_data',
  CITIES_DATA: 'bds_cities_data',
  CACHE_TIMESTAMP: 'bds_cache_timestamp',
  CACHE_VERSION: 'bds_cache_version'
};

// Cache version - increment this when data structure changes
const CACHE_VERSION = 'v3.0'; // Match the instant preload version

// Cache duration - 1 hour
const CACHE_DURATION = 60 * 60 * 1000;

interface CachedCountryData {
  name: string;
  slug: string;
  submissionCount: number;
  cities: Array<{
    name: string;
    slug: string;
    submissionCount: number;
  }>;
}

interface CachedData {
  submissions: Array<Submission & { uniqueSlug: string }>;
  countries: CachedCountryData[];
  lastUpdated: number;
  version: string;
}

class DataPreloader {
  private isLoading = false;
  private cachedData: CachedData | null = null;
  private loadingPromise: Promise<CachedData> | null = null;

  /**
   * Check if cached data is valid and fresh
   */
  private isCacheValid(): boolean {
    try {
      const timestamp = localStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
      const version = localStorage.getItem(CACHE_KEYS.CACHE_VERSION);
      
      if (!timestamp || !version || version !== CACHE_VERSION) {
        return false;
      }
      
      const age = Date.now() - parseInt(timestamp);
      return age < CACHE_DURATION;
    } catch (error) {
      console.warn('🚨 Cache validation error:', error);
      return false;
    }
  }

  /**
   * Load cached data from localStorage
   */
  private loadFromCache(): CachedData | null {
    try {
      if (!this.isCacheValid()) {
        this.clearCache();
        return null;
      }

      const submissions = localStorage.getItem(CACHE_KEYS.SUBMISSIONS_WITH_SLUGS);
      const countries = localStorage.getItem(CACHE_KEYS.COUNTRIES_DATA);
      
      if (!submissions || !countries) {
        return null;
      }

      const data: CachedData = {
        submissions: JSON.parse(submissions),
        countries: JSON.parse(countries),
        lastUpdated: parseInt(localStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP) || '0'),
        version: CACHE_VERSION
      };

      console.log('📦 Loaded data from cache:', {
        submissions: data.submissions.length,
        countries: data.countries.length,
        age: Math.round((Date.now() - data.lastUpdated) / 1000 / 60) + ' minutes'
      });

      return data;
    } catch (error) {
      console.warn('🚨 Failed to load from cache:', error);
      this.clearCache();
      return null;
    }
  }

  /**
   * Save data to localStorage cache
   */
  private saveToCache(data: CachedData): void {
    try {
      const timestamp = Date.now().toString();
      
      localStorage.setItem(CACHE_KEYS.SUBMISSIONS_WITH_SLUGS, JSON.stringify(data.submissions));
      localStorage.setItem(CACHE_KEYS.COUNTRIES_DATA, JSON.stringify(data.countries));
      localStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, timestamp);
      localStorage.setItem(CACHE_KEYS.CACHE_VERSION, CACHE_VERSION);

      console.log('💾 Saved data to cache:', {
        submissions: data.submissions.length,
        countries: data.countries.length,
        timestamp: new Date(parseInt(timestamp)).toLocaleTimeString()
      });
    } catch (error) {
      console.warn('🚨 Failed to save to cache:', error);
    }
  }

  /**
   * Clear all cached data
   */
  private clearCache(): void {
    try {
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('🗑️ Cache cleared');
    } catch (error) {
      console.warn('🚨 Failed to clear cache:', error);
    }
  }

  /**
   * Generate slug from country name - SYSTEMATIC approach for ALL countries
   */
  private generateCountrySlug(countryName: string): string {
    if (!countryName || typeof countryName !== 'string') {
      console.warn('⚠️ Invalid country name for slug generation:', countryName);
      return 'unknown';
    }
    
    return countryName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^\w-]/g, '')         // Remove special characters
      .replace(/-+/g, '-')            // Replace multiple hyphens with single
      .replace(/^-|-$/g, '')          // Remove leading/trailing hyphens
      .replace(/^the-/, '')           // Remove "the" prefix for consistency
      .replace(/^united-/, 'united-') // Keep "united" prefix for clarity
      .replace(/^new-/, 'new-')       // Keep "new" prefix for clarity
      .replace(/^south-/, 'south-')   // Keep directional prefixes
      .replace(/^north-/, 'north-')   // Keep directional prefixes
      .replace(/^east-/, 'east-')     // Keep directional prefixes
      .replace(/^west-/, 'west-');    // Keep directional prefixes
  }

  /**
   * Generate slug from city name - SYSTEMATIC approach for ALL cities
   */
  private generateCitySlug(cityName: string): string {
    if (!cityName || typeof cityName !== 'string') {
      console.warn('⚠️ Invalid city name for slug generation:', cityName);
      return 'unknown';
    }
    
    return cityName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^\w-]/g, '')         // Remove special characters
      .replace(/-+/g, '-')            // Replace multiple hyphens with single
      .replace(/^-|-$/g, '')          // Remove leading/trailing hyphens
      .replace(/^new-/, 'new-')       // Keep "new" prefix for clarity
      .replace(/^south-/, 'south-')   // Keep directional prefixes
      .replace(/^north-/, 'north-')   // Keep directional prefixes
      .replace(/^east-/, 'east-')     // Keep directional prefixes
      .replace(/^west-/, 'west-');    // Keep directional prefixes
  }

  /**
   * Extract unique countries from Geonames records
   */
  private getCountriesFromGeonamesRecords(submissions: Array<Submission & { uniqueSlug: string }>): string[] {
    const allCountries = new Set<string>();
    
    submissions.forEach(submission => {
      if (submission.geonamesRecord && typeof submission.geonamesRecord === 'string') {
        const countries = getCountriesFromGeonamesRecord(submission.geonamesRecord);
        countries.forEach(country => allCountries.add(country));
      }
    });
    
    return Array.from(allCountries).sort();
  }

  /**
   * Get cities for a specific country from Geonames records
   */
  private getCitiesForCountryFromGeonamesRecords(submissions: Array<Submission & { uniqueSlug: string }>, countryName: string): Record<string, number> {
    const cityCounts: Record<string, number> = {};
    
    submissions.forEach(submission => {
      if (submission.geonamesRecord && typeof submission.geonamesRecord === 'string') {
        const cities = getCitiesForCountryFromGeonamesRecord(submission.geonamesRecord, countryName);
        cities.forEach(city => {
          cityCounts[city] = (cityCounts[city] || 0) + 1;
        });
      }
    });
    
    return cityCounts;
  }

  /**
   * Process submissions data (for instant cache) - GEONAMES RECORD ONLY
   */
  private async processSubmissionsData(rawSubmissions: any[]): Promise<CachedData> {
    console.log('🚀 Processing instant cache data with Geonames Records only...');
    const startTime = Date.now();

    try {
      // Step 1: Process submissions with unique slugs
      console.log('📊 Step 1/3: Processing submissions with unique slugs...');
      const submissions = await this.processRawSubmissions(rawSubmissions);
      console.log(`✅ Processed ${submissions.length} submissions with unique slugs`);

      // Step 2: Extract countries from Geonames records
      console.log('🌍 Step 2/3: Extracting countries from Geonames records...');
      const countryNames = this.getCountriesFromGeonamesRecords(submissions);
      console.log(`✅ Found ${countryNames.length} countries from Geonames records`);

      // Step 3: Process each country and its cities from Geonames records
      console.log('🏙️ Step 3/3: Processing cities for each country from Geonames records...');
      const countriesData: CachedCountryData[] = [];

      for (const countryName of countryNames) {
        // Get submissions for this country using Geonames records
        const countrySubmissions = submissions.filter(submission => {
          if (submission.geonamesRecord && typeof submission.geonamesRecord === 'string') {
            const countries = getCountriesFromGeonamesRecord(submission.geonamesRecord);
            return countries.some(country => country.toLowerCase() === countryName.toLowerCase());
          }
          return false;
        });

        // Get cities for this country from Geonames records
        const cityData = this.getCitiesForCountryFromGeonamesRecords(submissions, countryName);
        const cities = Object.entries(cityData).map(([cityName, count]) => ({
          name: cityName,
          slug: this.generateCitySlug(cityName),
          submissionCount: count
        })).sort((a, b) => a.name.localeCompare(b.name));

        countriesData.push({
          name: countryName,
          slug: this.generateCountrySlug(countryName),
          submissionCount: countrySubmissions.length,
          cities
        });

        console.log(`✅ Processed ${countryName}: ${countrySubmissions.length} submissions, ${cities.length} cities`);
      }

      // Sort countries alphabetically
      countriesData.sort((a, b) => a.name.localeCompare(b.name));

      const data: CachedData = {
        submissions,
        countries: countriesData,
        lastUpdated: Date.now(),
        version: CACHE_VERSION
      };

      const processingTime = Date.now() - startTime;
      console.log(`🎉 Instant cache processing completed in ${processingTime}ms`, {
        submissions: submissions.length,
        countries: countriesData.length,
        totalCities: countriesData.reduce((sum, country) => sum + country.cities.length, 0)
      });

      return data;
    } catch (error) {
      console.error('❌ Instant cache processing failed:', error);
      throw error;
    }
  }

  /**
   * Process raw submissions data into format with unique slugs
   */
  private async processRawSubmissions(rawSubmissions: any[]): Promise<Array<Submission & { uniqueSlug: string }>> {
    // Import and use the slug processing functions
    const { buildSlugEmailMappings, getAllSubmissionsWithSlugs } = await import('./slug-email-mapping');
    
    // Build slug mappings first (this processes the raw data)
    await buildSlugEmailMappings();
    
    // Then get all submissions with unique slugs
    return getAllSubmissionsWithSlugs();
  }

  /**
   * Process all data in the background - GEONAMES RECORD ONLY
   */
  private async processAllData(): Promise<CachedData> {
    console.log('🚀 Starting background data processing with Geonames Records only...');
    const startTime = Date.now();

    try {
      // Step 1: Get all submissions with unique slugs
      console.log('📊 Step 1/3: Loading submissions with unique slugs...');
      const submissions = await getAllSubmissionsWithSlugs();
      console.log(`✅ Loaded ${submissions.length} submissions with unique slugs`);

      // Step 2: Extract countries from Geonames records
      console.log('🌍 Step 2/3: Extracting countries from Geonames records...');
      const countryNames = this.getCountriesFromGeonamesRecords(submissions);
      console.log(`✅ Found ${countryNames.length} countries from Geonames records`);

      // Step 3: Process each country and its cities from Geonames records
      console.log('🏙️ Step 3/3: Processing cities for each country from Geonames records...');
      const countriesData: CachedCountryData[] = [];

      for (const countryName of countryNames) {
        // Get submissions for this country using Geonames records
        const countrySubmissions = submissions.filter(submission => {
          if (submission.geonamesRecord && typeof submission.geonamesRecord === 'string') {
            const countries = getCountriesFromGeonamesRecord(submission.geonamesRecord);
            return countries.some(country => country.toLowerCase() === countryName.toLowerCase());
          }
          return false;
        });

        // Get cities for this country from Geonames records
        const cityData = this.getCitiesForCountryFromGeonamesRecords(submissions, countryName);
        const cities = Object.entries(cityData).map(([cityName, count]) => ({
          name: cityName,
          slug: this.generateCitySlug(cityName),
          submissionCount: count
        })).sort((a, b) => a.name.localeCompare(b.name));

        countriesData.push({
          name: countryName,
          slug: this.generateCountrySlug(countryName),
          submissionCount: countrySubmissions.length,
          cities
        });

        console.log(`✅ Processed ${countryName}: ${countrySubmissions.length} submissions, ${cities.length} cities`);
      }

      // Sort countries alphabetically
      countriesData.sort((a, b) => a.name.localeCompare(b.name));

      const data: CachedData = {
        submissions,
        countries: countriesData,
        lastUpdated: Date.now(),
        version: CACHE_VERSION
      };

      const processingTime = Date.now() - startTime;
      console.log(`🎉 Background processing completed in ${processingTime}ms`, {
        submissions: submissions.length,
        countries: countriesData.length,
        totalCities: countriesData.reduce((sum, country) => sum + country.cities.length, 0)
      });

      return data;
    } catch (error) {
      console.error('❌ Background processing failed:', error);
      throw error;
    }
  }

  /**
   * Preload data (called from app initialization)
   */
  async preloadData(): Promise<void> {
    // If already loading, wait for existing process
    if (this.loadingPromise) {
      console.log('⏳ Data preloading already in progress...');
      await this.loadingPromise;
      return;
    }

    // First check if instant preload has already cached the data
    const instantCacheReady = localStorage.getItem('bds_preload_ready');
    if (instantCacheReady === 'true') {
      console.log('⚡ INSTANT CACHE detected - using pre-cached data!');
      
      // Try to load from cache first (instant cache should have created it)
      this.cachedData = this.loadFromCache();
      if (this.cachedData) {
        console.log('✅ Instant cache data loaded successfully!');
        return;
      }
      
      // If instant cache flag is set but no processed data, process the raw instant cache
      const rawCachedData = localStorage.getItem('bds_submissions_cache');
      if (rawCachedData) {
        console.log('🔄 Processing instant cache data...');
        this.isLoading = true;
        
        try {
          const submissions = JSON.parse(rawCachedData);
          this.loadingPromise = this.processSubmissionsData(submissions);
          this.cachedData = await this.loadingPromise;
          this.saveToCache(this.cachedData);
          console.log('✅ Instant cache data processed and ready!');
        } catch (error) {
          console.error('❌ Failed to process instant cache:', error);
        } finally {
          this.isLoading = false;
          this.loadingPromise = null;
        }
        return;
      }
    }

    // Try to load from cache first
    this.cachedData = this.loadFromCache();
    if (this.cachedData) {
      console.log('⚡ Using cached data - instant load!');
      return;
    }

    // If no valid cache, start background processing
    console.log('🔄 No valid cache found, starting background processing...');
    this.isLoading = true;
    
    this.loadingPromise = this.processAllData();
    
    try {
      this.cachedData = await this.loadingPromise;
      this.saveToCache(this.cachedData);
    } catch (error) {
      console.error('❌ Failed to preload data:', error);
    } finally {
      this.isLoading = false;
      this.loadingPromise = null;
    }
  }

  /**
   * Get cached submissions (instant)
   */
  async getSubmissions(): Promise<Array<Submission & { uniqueSlug: string }>> {
    if (this.cachedData) {
      return this.cachedData.submissions;
    }

    // If not cached yet, wait for preload to complete
    if (this.loadingPromise) {
      await this.loadingPromise;
      return this.cachedData?.submissions || [];
    }

    // If no data and not loading, trigger preload
    await this.preloadData();
    return this.cachedData?.submissions || [];
  }

  /**
   * Get cached countries data (instant)
   */
  async getCountries(): Promise<CachedCountryData[]> {
    if (this.cachedData) {
      return this.cachedData.countries;
    }

    // If not cached yet, wait for preload to complete
    if (this.loadingPromise) {
      await this.loadingPromise;
      return this.cachedData?.countries || [];
    }

    // If no data and not loading, trigger preload
    await this.preloadData();
    return this.cachedData?.countries || [];
  }

  /**
   * Get submissions for a specific country (instant) - GEONAMES RECORD ONLY
   */
  async getSubmissionsForCountry(countryName: string): Promise<Array<Submission & { uniqueSlug: string }>> {
    const submissions = await this.getSubmissions();
    
    console.log(`🔍 Looking for submissions for country: ${countryName}`);
    console.log(`📊 Total submissions available: ${submissions.length}`);
    
    // Filter for published submissions that belong to the country using Geonames records
    const countrySubmissions = submissions.filter(submission => {
      // Must be published (handle different status formats)
      const isPublished = submission.status === 'published' || 
                         submission.status === 'Approved – Published' ||
                         submission.status === 'Approved - Published';
      
      if (!isPublished) {
        return false;
      }
      
      // Use Geonames Record field for accurate country matching
      if (submission.geonamesRecord && typeof submission.geonamesRecord === 'string') {
        const countries = getCountriesFromGeonamesRecord(submission.geonamesRecord);
        const belongsToCountry = countries.some(country => 
          country && country.toLowerCase().trim() === countryName.toLowerCase().trim()
        );
        
        if (belongsToCountry) {
          console.log(`✅ Submission ${submission.brandName} belongs to ${countryName} (Geonames countries: ${countries.join(', ')})`);
        }
        
        return belongsToCountry;
      }
      
      console.log(`❌ Submission ${submission.brandName} has no Geonames Record field`);
      return false;
    });
    
    console.log(`🌍 Found ${countrySubmissions.length} published submissions for ${countryName}`);
    
    // Debug: Show what countries each submission has
    countrySubmissions.forEach((submission, index) => {
      console.log(`📝 Submission ${index + 1} (${submission.brandName}):`, {
        geonamesRecord: submission.geonamesRecord,
        status: submission.status
      });
    });
    
    return countrySubmissions;
  }

  /**
   * Get cities for a specific country (instant)
   */
  async getCitiesForCountry(countryName: string): Promise<Array<{name: string; slug: string; submissionCount: number}>> {
    console.log(`🔍 getCitiesForCountry called for: ${countryName}`);
    
    // Try to get from processed countries data first
    const countries = await this.getCountries();
    console.log(`📊 Found ${countries.length} countries in cache`);
    
    const country = countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    if (country && country.cities && country.cities.length > 0) {
      console.log(`✅ Found ${country.cities.length} cities for ${countryName} in cache`);
      return country.cities;
    }
    
    console.log(`⚠️ No cities found in cache for ${countryName}, falling back to direct submission processing`);
    
    // Fallback: Process cities directly from submissions using Geonames records
    const submissions = await this.getSubmissions();
    console.log(`🔍 Total submissions available: ${submissions.length}`);
    
    const cityCounts: Record<string, number> = {};
    
    for (const submission of submissions) {
      // Must be published
      const isPublished = submission.status === 'published' || 
                         submission.status === 'Approved – Published' ||
                         submission.status === 'Approved - Published';
      
      if (!isPublished) {
        continue;
      }
      
      // Use Geonames Record field for accurate city-country matching
      if (submission.geonamesRecord && typeof submission.geonamesRecord === 'string') {
        const citiesForCountry = getCitiesForCountryFromGeonamesRecord(submission.geonamesRecord, countryName);
        
        if (citiesForCountry.length > 0) {
          console.log(`🏙️ Geonames Record for ${submission.brandName}:`, submission.geonamesRecord);
          console.log(`✅ Cities for ${countryName}:`, citiesForCountry);
          
          citiesForCountry.forEach(cityName => {
            if (cityName && cityName.length > 2 && cityName.length < 50) {
              cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
              console.log(`    ✅ City "${cityName}" for ${countryName} added (count: ${cityCounts[cityName]})`);
            }
          });
        }
      } else {
        console.log(`⚠️ No Geonames Record for ${submission.brandName}:`, submission.geonamesRecord);
      }
    }
    
    const cities = Object.entries(cityCounts).map(([cityName, count]) => ({
      name: cityName,
      slug: this.generateCitySlug(cityName),
      submissionCount: count
    })).sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`🏙️ GEONAMES RECORD processing found ${cities.length} cities for ${countryName}:`, cities);
    return cities;
  }

  /**
   * Check if data is currently loading
   */
  isLoadingData(): boolean {
    return this.isLoading;
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { cached: boolean; loading: boolean; age?: number } {
    return {
      cached: !!this.cachedData,
      loading: this.isLoading,
      age: this.cachedData ? Date.now() - this.cachedData.lastUpdated : undefined
    };
  }

  /**
   * Force refresh data (clears cache and reloads)
   */
  async forceRefresh(): Promise<void> {
    console.log('🔄 Force refreshing data...');
    this.clearCache();
    this.cachedData = null;
    await this.preloadData();
  }
}

// Export singleton instance
export const dataPreloader = new DataPreloader();
