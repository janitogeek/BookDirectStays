// Submission processing service
// Handles validation and creation of cities when submissions are approved

import { validateCitiesForCountries, getCountryCode } from './geonames';
import { airtableService, type Submission } from './airtable';
import { slugify } from './utils';

interface CityValidationResult {
  cityName: string;
  countryName: string;
  isValid: boolean;
  geonameId?: number;
  validatedName?: string;
}

interface ProcessedCity {
  name: string;
  slug: string;
  countryName: string;
  countryCode: string;
  geonameId?: number;
}

/**
 * Process an approved submission and create/link cities
 */
export async function processApprovedSubmission(submission: Submission): Promise<void> {
  console.log(`🔄 Processing approved submission: ${submission.brandName}`);
  
  if (!submission.citiesRegions || submission.citiesRegions.length === 0) {
    console.log(`⚠️ No cities/regions found for ${submission.brandName}`);
    return;
  }

  try {
    // Step 1: Process cities from Geo API format
    const processedCities = await processCitiesFromGeoAPI(submission.citiesRegions, submission.countries);
    console.log(`📊 Processed cities for ${submission.brandName}:`, processedCities);

    if (processedCities.length === 0) {
      console.log(`❌ No valid cities processed for ${submission.brandName}`);
      return;
    }

    // Step 2: Store city-country relationships
    for (const cityData of processedCities) {
      await storeCityCountryRelationship(cityData, submission);
    }

    console.log(`✅ Successfully processed ${processedCities.length} cities for ${submission.brandName}`);
    
  } catch (error) {
    console.error(`❌ Error processing submission ${submission.brandName}:`, error);
  }
}

/**
 * Process cities from Geo API format (city, region, country)
 */
async function processCitiesFromGeoAPI(citiesRegions: any[], countries: string[]): Promise<Array<{
  cityName: string;
  regionName: string;
  countryName: string;
  fullLocation: string;
}>> {
  const processedCities: Array<{
    cityName: string;
    regionName: string;
    countryName: string;
    fullLocation: string;
  }> = [];

  for (const cityRegion of citiesRegions) {
    try {
      // Handle different data formats
      let cityText = '';
      if (typeof cityRegion === 'string') {
        cityText = cityRegion;
      } else if (cityRegion?.name) {
        cityText = cityRegion.name;
      } else {
        console.log(`⚠️ Skipping invalid city format:`, cityRegion);
        continue;
      }

      // Parse Geo API format: "city, region, country"
      const parts = cityText.split(',').map(part => part.trim());
      
      if (parts.length >= 3) {
        // Format: "city, region, country"
        const cityName = parts[0];
        const regionName = parts[1];
        const countryName = parts[2];
        
        // Validate that this country is in the submission's countries list
        const isValidCountry = countries.some(country => 
          country.toLowerCase() === countryName.toLowerCase() ||
          country.toLowerCase() === countryName.toLowerCase().replace(/\s+/g, '')
        );

        if (isValidCountry) {
          processedCities.push({
            cityName,
            regionName,
            countryName,
            fullLocation: cityText
          });
          console.log(`✅ Processed city: ${cityName} in ${countryName}`);
        } else {
          console.log(`⚠️ City ${cityName} country ${countryName} not in submission countries:`, countries);
        }
      } else if (parts.length === 2) {
        // Format: "city, country" (no region)
        const cityName = parts[0];
        const countryName = parts[1];
        
        const isValidCountry = countries.some(country => 
          country.toLowerCase() === countryName.toLowerCase() ||
          country.toLowerCase() === countryName.toLowerCase().replace(/\s+/g, '')
        );

        if (isValidCountry) {
          processedCities.push({
            cityName,
            regionName: '',
            countryName,
            fullLocation: cityText
          });
          console.log(`✅ Processed city: ${cityName} in ${countryName}`);
        }
      } else if (parts.length === 1) {
        // Single city name - try to match with countries
        const cityName = parts[0];
        
        // For single cities, we'll need to validate against countries later
        // This is a fallback for legacy data
        console.log(`⚠️ Single city format detected: ${cityName} - will validate later`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing city: ${cityRegion}`, error);
    }
  }

  return processedCities;
}

/**
 * Store city-country relationship in the system
 */
async function storeCityCountryRelationship(cityData: {
  cityName: string;
  regionName: string;
  countryName: string;
  fullLocation: string;
}, submission: Submission): Promise<void> {
  const { cityName, countryName, fullLocation } = cityData;
  
  console.log(`🏙️ Storing city relationship: ${cityName} in ${countryName}`);
  
  // Add to the in-memory cache (in production, this would be a database)
  const cityKey = `${countryName}`;
  const existingCities = validatedCitiesCache.get(cityKey) || [];
  
  // Check if city already exists for this country
  const existingCity = existingCities.find(city => 
    city.name.toLowerCase() === cityName.toLowerCase() ||
    city.name.toLowerCase() === fullLocation.toLowerCase()
  );
  
  if (!existingCity) {
    // Create new city record
    const newCity: ProcessedCity = {
      name: cityName,
      slug: slugify(cityName),
      countryName: capitalizeCountryName(countryName),
      countryCode: getCountryCode(countryName) || 'XX',
      geonameId: undefined
    };
    
    existingCities.push(newCity);
    validatedCitiesCache.set(cityKey, existingCities);
    
    console.log(`✅ Added new city: ${cityName} to ${countryName}`);
  } else {
    console.log(`ℹ️ City ${cityName} already exists for ${countryName}`);
  }
}

// In-memory storage for validated cities (in production, this would be a proper database)
const validatedCitiesCache = new Map<string, ProcessedCity[]>();

/**
 * Process a single valid city and create/update records
 */
async function processValidCity(
  validationResult: CityValidationResult,
  submission: Submission
): Promise<void> {
  const { cityName, countryName, geonameId, validatedName } = validationResult;
  
  console.log(`🏙️ Processing city: ${validatedName || cityName} in ${countryName}`);
  
  const cityKey = `${countryName}`;
  const existingCities = validatedCitiesCache.get(cityKey) || [];
  
  // Check if city already exists for this country
  const existingCity = existingCities.find(city => 
    city.geonameId === geonameId || 
    city.name.toLowerCase() === (validatedName || cityName).toLowerCase()
  );
  
  if (!existingCity) {
    // Create new city record
    const newCity: ProcessedCity = {
      name: validatedName || cityName,
      slug: slugify(validatedName || cityName),
      countryName: capitalizeCountryName(countryName),
      countryCode: getCountryCode(countryName) || 'XX',
      geonameId: geonameId
    };
    
    existingCities.push(newCity);
    validatedCitiesCache.set(cityKey, existingCities);
    
    console.log(`✅ Created city record:`, newCity);
  } else {
    console.log(`🔄 City already exists: ${existingCity.name} in ${countryName}`);
  }
}

/**
 * Process all pending approved submissions
 */
export async function processAllApprovedSubmissions(): Promise<void> {
  console.log(`🔄 Processing all approved submissions...`);
  
  try {
    // Get all approved/published submissions
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    
    console.log(`📋 Found ${approvedSubmissions.length} approved submissions to process`);
    
    for (const submission of approvedSubmissions) {
      await processApprovedSubmission(submission);
      
      // Small delay between submissions to avoid overwhelming APIs
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`✅ Finished processing all approved submissions`);
    
  } catch (error) {
    console.error(`❌ Error processing approved submissions:`, error);
  }
}

/**
 * Reprocess all approved submissions to populate city data
 * This should be called once to fix existing data
 */
export async function reprocessAllApprovedSubmissions(): Promise<void> {
  try {
    console.log('🔄 Starting reprocessing of all approved submissions...');
    
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    console.log(`📊 Found ${approvedSubmissions.length} approved submissions to reprocess`);
    
    for (const submission of approvedSubmissions) {
      console.log(`🔄 Reprocessing submission: ${submission.brandName}`);
      await processApprovedSubmission(submission);
    }
    
    console.log('✅ Successfully reprocessed all approved submissions');
    
  } catch (error) {
    console.error('❌ Error reprocessing approved submissions:', error);
  }
}

/**
 * Properly capitalize country names
 */
function capitalizeCountryName(countryName: string): string {
  // Handle special cases first
  const specialCases: Record<string, string> = {
    'usa': 'United States',
    'uk': 'United Kingdom',
    'uae': 'United Arab Emirates',
    'drc': 'Democratic Republic of Congo',
    'andorra': 'Andorra'
  };
  
  const lowerName = countryName.toLowerCase().trim();
  if (specialCases[lowerName]) {
    return specialCases[lowerName];
  }
  
  // Standard capitalization for other countries
  return countryName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get unique countries from all approved submissions
 */
export async function getActiveCountries(): Promise<string[]> {
  try {
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    
    const uniqueCountries = new Set<string>();
    
    approvedSubmissions.forEach(submission => {
      submission.countries.forEach(country => {
        const capitalizedCountry = capitalizeCountryName(country);
        uniqueCountries.add(capitalizedCountry);
      });
    });
    
    return Array.from(uniqueCountries).sort();
    
  } catch (error) {
    console.error(`❌ Error getting active countries:`, error);
    return [];
  }
}

/**
 * Get submissions for a specific country
 */
export async function getSubmissionsForCountry(countryName: string): Promise<Submission[]> {
  try {
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    
    return approvedSubmissions.filter(submission =>
      submission.countries.some(country => {
        const capitalizedOriginal = capitalizeCountryName(country);
        const capitalizedQuery = capitalizeCountryName(countryName);
        
        // Match either the original or capitalized version
        return country.toLowerCase() === countryName.toLowerCase() ||
               capitalizedOriginal.toLowerCase() === capitalizedQuery.toLowerCase();
      })
    );
    
  } catch (error) {
    console.error(`❌ Error getting submissions for country ${countryName}:`, error);
    return [];
  }
}

/**
 * Get submissions for a specific city in a country
 */
export async function getSubmissionsForCity(
  cityName: string, 
  countryName: string
): Promise<Submission[]> {
  try {
    const countrySubmissions = await getSubmissionsForCountry(countryName);
    
    return countrySubmissions.filter(submission =>
      submission.citiesRegions?.some((city: any) => {
        const cityName_lower = (typeof city === 'string' ? city : (city?.name || city)).toLowerCase();
        return cityName_lower === cityName.toLowerCase();
      })
    );
    
  } catch (error) {
    console.error(`❌ Error getting submissions for city ${cityName} in ${countryName}:`, error);
    return [];
  }
}

/**
 * Get validated cities for a specific country (only those with actual submissions)
 */
export async function getValidatedCitiesForCountry(countryName: string): Promise<string[]> {
  try {
    console.log(`🔍 Getting validated cities for country: ${countryName}`);
    
    // Get city submission counts first
    const cityCounts = await getCitySubmissionCounts(countryName);
    console.log(`📊 City counts received:`, cityCounts);
    
    // Return only cities that have at least 1 submission
    const citiesWithSubmissions = Object.keys(cityCounts).filter(cityName => cityCounts[cityName] > 0);
    
    console.log(`🏙️ Cities with submissions for ${countryName}:`, citiesWithSubmissions);
    console.log(`📊 City counts:`, cityCounts);
    
    return citiesWithSubmissions.sort();
    
  } catch (error) {
    console.error(`❌ Error getting validated cities for country ${countryName}:`, error);
    return [];
  }
}

/**
 * Get city submission counts for a specific country
 */
export async function getCitySubmissionCounts(countryName: string): Promise<Record<string, number>> {
  try {
    console.log(`🔍 Getting city submission counts for country: ${countryName}`);
    const countrySubmissions = await getSubmissionsForCountry(countryName);
    console.log(`📊 Found ${countrySubmissions.length} submissions for ${countryName}`);
    
    const cityCounts: Record<string, number> = {};
    
    for (const submission of countrySubmissions) {
      console.log(`🏙️ Processing submission: ${submission.brandName}`);
      console.log(`🏙️ Cities/regions in submission:`, submission.citiesRegions);
      console.log(`🏙️ Countries in submission:`, submission.countries);
      
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        // Process cities using the new Geo API parser
        const processedCities = await processCitiesFromGeoAPI(submission.citiesRegions, submission.countries);
        console.log(`🏙️ Processed cities for ${submission.brandName}:`, processedCities);
        
        // Count cities for this specific country
        processedCities
          .filter(cityData => 
            cityData.countryName.toLowerCase() === countryName.toLowerCase() ||
            cityData.countryName.toLowerCase().replace(/\s+/g, '') === countryName.toLowerCase().replace(/\s+/g, '')
          )
          .forEach(cityData => {
            const cityName = cityData.cityName;
            cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
            console.log(`✅ Added city: ${cityName} (count: ${cityCounts[cityName]})`);
          });
      } else {
        console.log(`⚠️ No cities/regions found in submission: ${submission.brandName}`);
      }
    }
    
    console.log(`🏙️ Final city counts for ${countryName}:`, cityCounts);
    return cityCounts;
    
  } catch (error) {
    console.error(`❌ Error getting city submission counts for country ${countryName}:`, error);
    return {};
  }
} 

/**
 * Get top countries with submission counts
 */
export async function getTopCountriesWithCounts(): Promise<Array<{name: string, count: number}>> {
  try {
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    const countryCounts: Record<string, number> = {};
    
    approvedSubmissions.forEach(submission => {
      submission.countries.forEach(country => {
        const capitalizedCountry = capitalizeCountryName(country);
        countryCounts[capitalizedCountry] = (countryCounts[capitalizedCountry] || 0) + 1;
      });
    });
    
    // Sort by count descending, then alphabetically and take top 5
    const sortedCountries = Object.entries(countryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        // Primary sort: by count descending
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        // Secondary sort: alphabetically by name
        return a.name.localeCompare(b.name);
      })
      .slice(0, 5);
    
    console.log(`🏆 Top 5 countries:`, sortedCountries);
    return sortedCountries;
    
  } catch (error) {
    console.error(`❌ Error getting top countries:`, error);
    return [];
  }
}

/**
 * Get top cities with submission counts (across all countries)
 */
export async function getTopCitiesWithCounts(): Promise<Array<{name: string, country: string, count: number}>> {
  try {
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    const cityCounts: Record<string, {country: string, count: number}> = {};
    
    for (const submission of approvedSubmissions) {
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        
        // Process each country the submission operates in
        for (const country of submission.countries) {
          const capitalizedCountry = capitalizeCountryName(country);
          
          const cityObjects = submission.citiesRegions.map((city: any) => ({
            name: typeof city === 'string' ? city : (city?.name || city),
            geonameId: typeof city === 'object' && city?.geonameId ? city.geonameId : undefined
          }));
          
          const validations = await validateCitiesForCountries(
            cityObjects,
            [country]
          );
          
          validations
            .filter(validation => validation.isValid)
            .forEach(validation => {
              const cityName = validation.validatedName || validation.cityName;
              const cityKey = `${cityName}, ${capitalizedCountry}`;
              
              if (!cityCounts[cityKey]) {
                cityCounts[cityKey] = { country: capitalizedCountry, count: 0 };
              }
              cityCounts[cityKey].count += 1;
            });
        }
      }
    }
    
    // Sort by count descending, then alphabetically and take top 5
    const sortedCities = Object.entries(cityCounts)
      .map(([cityCountryKey, data]) => {
        const cityName = cityCountryKey.split(', ')[0];
        return {
          name: cityName,
          country: data.country,
          count: data.count
        };
      })
      .sort((a, b) => {
        // Primary sort: by count descending
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        // Secondary sort: alphabetically by name
        return a.name.localeCompare(b.name);
      })
      .slice(0, 5);
    
    console.log(`🏆 Top 5 cities:`, sortedCities);
    return sortedCities;
    
  } catch (error) {
    console.error(`❌ Error getting top cities:`, error);
    return [];
  }
} 