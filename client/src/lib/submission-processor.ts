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
    // SIMPLE: Just log the cities for this submission
    console.log(`📊 Cities for ${submission.brandName}:`, submission.citiesRegions);
    console.log(`📊 Countries for ${submission.brandName}:`, submission.countries);
    
    console.log(`✅ Successfully processed submission ${submission.brandName}`);
    
  } catch (error) {
    console.error(`❌ Error processing submission ${submission.brandName}:`, error);
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
 * Get city submission counts for a specific country
 * ALWAYS reads from Airtable - no caching, always fresh data
 */
export async function getCitySubmissionCounts(countryName: string): Promise<Record<string, number>> {
  try {
    console.log(`🔍 Getting city submission counts for country: ${countryName} - FRESH FROM AIRTABLE`);
    
    // ALWAYS get fresh data from Airtable
    const countrySubmissions = await getSubmissionsForCountry(countryName);
    console.log(`📊 Found ${countrySubmissions.length} submissions for ${countryName} in Airtable`);
    
    const cityCounts: Record<string, number> = {};
    
    for (const submission of countrySubmissions) {
      console.log(`🏙️ Processing submission: ${submission.brandName}`);
      console.log(`🏙️ Cities/regions in submission:`, submission.citiesRegions);
      console.log(`🏙️ Countries in submission:`, submission.countries);
      
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        // Extract ALL cities from this submission
        submission.citiesRegions.forEach((cityRegion: any) => {
          let cityName = '';
          
          if (typeof cityRegion === 'string') {
            cityName = cityRegion;
          } else if (cityRegion?.name) {
            cityName = cityRegion.name;
          }
          
          if (cityName) {
            // Count this city for the country
            cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
            console.log(`✅ Added city: ${cityName} (count: ${cityCounts[cityName]})`);
          }
        });
      } else {
        console.log(`⚠️ No cities/regions found in submission: ${submission.brandName}`);
      }
    }
    
    console.log(`🏙️ Final city counts for ${countryName} (FRESH FROM AIRTABLE):`, cityCounts);
    return cityCounts;
    
  } catch (error) {
    console.error(`❌ Error getting city submission counts for country ${countryName}:`, error);
    return {};
  }
}

/**
 * Get validated cities for a specific country
 * ALWAYS reads from Airtable - no caching, always fresh data
 */
export async function getValidatedCitiesForCountry(countryName: string): Promise<string[]> {
  try {
    console.log(`🔍 Getting validated cities for country: ${countryName} - FRESH FROM AIRTABLE`);
    
    // Get city submission counts directly from Airtable
    const cityCounts = await getCitySubmissionCounts(countryName);
    console.log(`📊 City counts received from Airtable:`, cityCounts);
    
    // Return only cities that have at least 1 submission
    const citiesWithSubmissions = Object.keys(cityCounts).filter(cityName => cityCounts[cityName] > 0);
    
    console.log(`🏙️ Cities with submissions for ${countryName} (FRESH FROM AIRTABLE):`, citiesWithSubmissions);
    console.log(`📊 City counts:`, cityCounts);
    
    return citiesWithSubmissions.sort();
    
  } catch (error) {
    console.error(`❌ Error getting validated cities for country ${countryName}:`, error);
    return [];
  }
}

/**
 * Get ALL active countries from Airtable (for dynamic country page creation)
 */
export async function getActiveCountriesFromAirtable(): Promise<string[]> {
  try {
    console.log('🌍 Getting ALL active countries from Airtable...');
    
    // ALWAYS get fresh data from Airtable
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    console.log(`📊 Found ${approvedSubmissions.length} approved submissions in Airtable`);
    
    const uniqueCountries = new Set<string>();
    
    approvedSubmissions.forEach(submission => {
      submission.countries.forEach(country => {
        const capitalizedCountry = capitalizeCountryName(country);
        uniqueCountries.add(capitalizedCountry);
        console.log(`🌍 Found country: ${capitalizedCountry} from submission: ${submission.brandName}`);
      });
    });
    
    const countryList = Array.from(uniqueCountries).sort();
    console.log(`🌍 All active countries from Airtable:`, countryList);
    return countryList;
    
  } catch (error) {
    console.error('❌ Error getting active countries from Airtable:', error);
    return [];
  }
}

/**
 * Get ALL active cities from Airtable (for dynamic city page creation)
 */
export async function getAllActiveCitiesFromAirtable(): Promise<Array<{
  cityName: string;
  countryName: string;
  submissionCount: number;
}>> {
  try {
    console.log('🏙️ Getting ALL active cities from Airtable...');
    
    // ALWAYS get fresh data from Airtable
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    console.log(`📊 Found ${approvedSubmissions.length} approved submissions in Airtable`);
    
    const cityMap = new Map<string, { cityName: string; countryName: string; submissionCount: number }>();
    
    for (const submission of approvedSubmissions) {
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        submission.citiesRegions.forEach((cityRegion: any) => {
          let cityName = '';
          
          if (typeof cityRegion === 'string') {
            cityName = cityRegion;
          } else if (cityRegion?.name) {
            cityName = cityRegion.name;
          }
          
          if (cityName) {
            // For each city, count submissions per country
            submission.countries.forEach(country => {
              const capitalizedCountry = capitalizeCountryName(country);
              const cityKey = `${cityName}-${capitalizedCountry}`;
              
              if (cityMap.has(cityKey)) {
                cityMap.get(cityKey)!.submissionCount++;
              } else {
                cityMap.set(cityKey, {
                  cityName,
                  countryName: capitalizedCountry,
                  submissionCount: 1
                });
              }
              
              console.log(`🏙️ City: ${cityName} in ${capitalizedCountry} (count: ${cityMap.get(cityKey)!.submissionCount})`);
            });
          }
        });
      }
    }
    
    const cityList = Array.from(cityMap.values());
    console.log(`🏙️ All active cities from Airtable:`, cityList);
    return cityList;
    
  } catch (error) {
    console.error('❌ Error getting all active cities from Airtable:', error);
    return [];
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