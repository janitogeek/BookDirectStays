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
    // Step 1: Validate all city-country combinations
    const cityObjects = submission.citiesRegions.map((city: any) => ({
      name: typeof city === 'string' ? city : (city?.name || city),
      geonameId: typeof city === 'object' && city?.geonameId ? city.geonameId : undefined
    }));
    
    const validationResults = await validateCitiesForCountries(
      cityObjects,
      submission.countries
    );

    console.log(`📊 Validation results for ${submission.brandName}:`, validationResults);

    // Step 2: Filter valid combinations and create city records
    const validCities = validationResults.filter(result => result.isValid);
    
    if (validCities.length === 0) {
      console.log(`❌ No valid cities found for ${submission.brandName}`);
      return;
    }

    // Step 3: Process each valid city
    for (const validCity of validCities) {
      await processValidCity(validCity, submission);
    }

    console.log(`✅ Successfully processed ${validCities.length} cities for ${submission.brandName}`);
    
  } catch (error) {
    console.error(`❌ Error processing submission ${submission.brandName}:`, error);
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
 * Properly capitalize country names
 */
function capitalizeCountryName(countryName: string): string {
  // Handle special cases first
  const specialCases: Record<string, string> = {
    'usa': 'United States',
    'uk': 'United Kingdom',
    'uae': 'United Arab Emirates',
    'drc': 'Democratic Republic of Congo',
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
    // Get city submission counts first
    const cityCounts = await getCitySubmissionCounts(countryName);
    
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
    const countrySubmissions = await getSubmissionsForCountry(countryName);
    const cityCounts: Record<string, number> = {};
    
    for (const submission of countrySubmissions) {
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        const cityObjects = submission.citiesRegions.map((city: any) => ({
          name: typeof city === 'string' ? city : (city?.name || city),
          geonameId: typeof city === 'object' && city?.geonameId ? city.geonameId : undefined
        }));
        
        const validations = await validateCitiesForCountries(
          cityObjects,
          [countryName]
        );
        
        validations
          .filter(validation => validation.isValid)
          .forEach(validation => {
            const cityName = validation.validatedName || validation.cityName;
            cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
          });
      }
    }
    
    return cityCounts;
    
  } catch (error) {
    console.error(`❌ Error getting city submission counts for country ${countryName}:`, error);
    return {};
  }
} 