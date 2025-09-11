/**
 * Data Preloader Service
 * 
 * Preloads and caches all heavy data processing in the background
 * to eliminate loading delays when users navigate to find-host page
 */

import { Submission } from './airtable';
import { getAllSubmissionsWithSlugs } from './slug-email-mapping';
import { getCountriesFromGeonamesRecord, getCitiesForCountryFromGeonamesRecord } from './geonames-record-parser';
import { extractAllCurrencies, CurrencyOption } from './currency-list-extractor';

// Cache keys
const CACHE_KEYS = {
  SUBMISSIONS_WITH_SLUGS: 'bds_submissions_with_slugs',
  COUNTRIES_DATA: 'bds_countries_data',
  CITIES_DATA: 'bds_cities_data',
  CURRENCIES: 'bds_currencies',
  CACHE_TIMESTAMP: 'bds_cache_timestamp',
  CACHE_VERSION: 'bds_cache_version'
};

// Cache version - increment this when data structure changes
const CACHE_VERSION = 'v3.2'; // FORCE CACHE CLEAR - Fixed unique slug generation bug

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
  currencies: CurrencyOption[];
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

      const currencies = localStorage.getItem(CACHE_KEYS.CURRENCIES) || '[]';
      
      const data: CachedData = {
        submissions: JSON.parse(submissions),
        countries: JSON.parse(countries),
        currencies: JSON.parse(currencies),
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
      console.log('📊 Step 1/4: Processing submissions with unique slugs...');
      const submissions = await this.processRawSubmissions(rawSubmissions);
      console.log(`✅ Processed ${submissions.length} submissions with unique slugs`);

      // Step 2: Extract all currencies from currency column
      console.log('💰 Step 2/4: Extracting all currencies from currency column...');
      const currencies = extractAllCurrencies(submissions);
      console.log(`✅ Found ${currencies.length} unique currencies from all submissions`);

      // Step 3: Extract countries from Geonames records
      console.log('🌍 Step 3/4: Extracting countries from Geonames records...');
      const countryNames = this.getCountriesFromGeonamesRecords(submissions);
      console.log(`✅ Found ${countryNames.length} countries from Geonames records`);

      // Step 4: Process each country and its cities from Geonames records
      console.log('🏙️ Step 4/4: Processing cities for each country from Geonames records...');
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
        currencies,
        lastUpdated: Date.now(),
        version: CACHE_VERSION
      };

      const processingTime = Date.now() - startTime;
      console.log(`🎉 Instant cache processing completed in ${processingTime}ms`, {
        submissions: submissions.length,
        countries: countriesData.length,
        currencies: currencies.length,
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
    try {
      console.log('🔄 Processing submissions with unique slugs...');
      
      // Generate unique slugs directly without circular dependency
      const slugMap = new Map<string, string>();
      const usedSlugs = new Set<string>();
      
      const submissionsWithSlugs = rawSubmissions.map(submission => {
        const brandName = submission.brandName || submission['Brand Name'];
        const baseSlug = this.generateSlug(brandName);
        let uniqueSlug = baseSlug;
        let counter = 1;

        // If slug already exists, add number suffix
        while (usedSlugs.has(uniqueSlug)) {
          counter++;
          uniqueSlug = `${baseSlug}-${counter}`;
        }

        usedSlugs.add(uniqueSlug);
        // Map by submission ID, not email (multiple submissions can have same email)
        slugMap.set(submission.id, uniqueSlug);
        
        // Debug log for problematic submissions
        if (submission.email === 'jansahagun@gmail.com') {
          console.log(`🔍 SLUG DEBUG: "${brandName}" (${submission.id}) → "${uniqueSlug}"`);
        }
        
        return {
          ...submission,
          uniqueSlug
        };
      });
      
      console.log(`✅ Generated ${slugMap.size} unique slugs for submissions`);
      return submissionsWithSlugs;
    } catch (error) {
      console.error('❌ Error processing submissions with slugs:', error);
      return rawSubmissions.map(s => ({ ...s, uniqueSlug: this.generateSlug(s.brandName) }));
    }
  }
  
  /**
   * Generate URL-friendly slug from text
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Process all data in the background - GEONAMES RECORD ONLY
   */
  private async processAllData(): Promise<CachedData> {
    console.log('🚀 Starting background data processing with Geonames Records only...');
    const startTime = Date.now();

    try {
      // Step 1: Get all submissions with unique slugs
      console.log('📊 Step 1/4: Loading submissions with unique slugs...');
      const submissions = await getAllSubmissionsWithSlugs();
      console.log(`✅ Loaded ${submissions.length} submissions with unique slugs`);

      // Step 2: Extract all currencies from currency column
      console.log('💰 Step 2/4: Extracting all currencies from currency column...');
      const currencies = extractAllCurrencies(submissions);
      console.log(`✅ Found ${currencies.length} unique currencies from all submissions`);

      // Step 3: Extract countries from Geonames records
      console.log('🌍 Step 3/4: Extracting countries from Geonames records...');
      const countryNames = this.getCountriesFromGeonamesRecords(submissions);
      console.log(`✅ Found ${countryNames.length} countries from Geonames records`);

      // Step 4: Process each country and its cities from Geonames records
      console.log('🏙️ Step 4/4: Processing cities for each country from Geonames records...');
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
        currencies,
        lastUpdated: Date.now(),
        version: CACHE_VERSION
      };

      const processingTime = Date.now() - startTime;
      console.log(`🎉 Background processing completed in ${processingTime}ms`, {
        submissions: submissions.length,
        countries: countriesData.length,
        currencies: currencies.length,
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
   * Get cached submissions (instant) - Featured submissions first
   */
  async getSubmissions(): Promise<Array<Submission & { uniqueSlug: string }>> {
    if (this.cachedData) {
      // Sort submissions: Featured first, then alphabetical
      const sortedSubmissions = this.cachedData.submissions.sort((a, b) => {
        const aIsFeatured = a.plan?.includes('Premium') || a.plan?.includes('€499.99');
        const bIsFeatured = b.plan?.includes('Premium') || b.plan?.includes('€499.99');
        
        // Featured submissions first
        if (aIsFeatured && !bIsFeatured) return -1;
        if (!aIsFeatured && bIsFeatured) return 1;
        
        // Then alphabetical by brand name
        return a.brandName.localeCompare(b.brandName);
      });
      
      return sortedSubmissions;
    }

    // If not cached yet, wait for preload to complete
    if (this.loadingPromise) {
      await this.loadingPromise;
      const submissions = (this.cachedData as CachedData | null)?.submissions || [];
      
      // Sort submissions: Featured first, then alphabetical
      return submissions.sort((a: any, b: any) => {
        const aIsFeatured = a.plan?.includes('Premium') || a.plan?.includes('€499.99');
        const bIsFeatured = b.plan?.includes('Premium') || b.plan?.includes('€499.99');
        
        // Featured submissions first
        if (aIsFeatured && !bIsFeatured) return -1;
        if (!aIsFeatured && bIsFeatured) return 1;
        
        // Then alphabetical by brand name
        return a.brandName.localeCompare(b.brandName);
      });
    }

    // If no data and not loading, trigger preload
    await this.preloadData();
    const submissions = (this.cachedData as CachedData | null)?.submissions || [];
    
    // Sort submissions: Featured first, then alphabetical
    return submissions.sort((a: any, b: any) => {
      const aIsFeatured = a.plan?.includes('Premium') || a.plan?.includes('€499.99');
      const bIsFeatured = b.plan?.includes('Premium') || b.plan?.includes('€499.99');
      
      // Featured submissions first
      if (aIsFeatured && !bIsFeatured) return -1;
      if (!aIsFeatured && bIsFeatured) return 1;
      
      // Then alphabetical by brand name
      return a.brandName.localeCompare(b.brandName);
    });
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
      return (this.cachedData as CachedData | null)?.countries || [];
    }

    // If no data and not loading, trigger preload
    await this.preloadData();
    return (this.cachedData as CachedData | null)?.countries || [];
  }

  /**
   * Get cached currencies data (instant)
   */
  async getCurrencies(): Promise<CurrencyOption[]> {
    if (this.cachedData) {
      return this.cachedData.currencies;
    }

    // If not cached yet, wait for preload to complete
    if (this.loadingPromise) {
      await this.loadingPromise;
      return (this.cachedData as CachedData | null)?.currencies || [];
    }

    // If no data and not loading, trigger preload
    await this.preloadData();
    return (this.cachedData as CachedData | null)?.currencies || [];
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
      // Must be published (handle different status formats and variations)
      const isPublished = submission.status === 'published' || 
                         submission.status === 'Approved – Published' ||
                         submission.status === 'Approved - Published' ||
                         submission.status === 'Approved – Published' ||  // en-dash
                         submission.status === 'Approved-Published' ||
                         submission.status?.includes('Approved') ||
                         submission.status?.includes('Published');
      
      if (!isPublished) {
        console.log(`❌ Submission ${submission.brandName} not published. Status: "${submission.status}"`);
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
      
      // Fallback: Check the Countries field directly
      if (submission.countries && Array.isArray(submission.countries)) {
        const belongsToCountry = submission.countries.some(country => 
          country && country.toLowerCase().trim() === countryName.toLowerCase().trim()
        );
        
        if (belongsToCountry) {
          console.log(`✅ FALLBACK: Submission ${submission.brandName} belongs to ${countryName} (Countries field: ${submission.countries.join(', ')})`);
          return true;
        }
      }
      
      console.log(`❌ Submission ${submission.brandName} has no matching country data for ${countryName}`);
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
