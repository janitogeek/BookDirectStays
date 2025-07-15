// Submission processing service
// Handles validation and creation of cities when submissions are approved

import { validateCitiesForCountries } from './geonames';
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

/**
 * Process a single valid city and create/update records
 */
async function processValidCity(
  validationResult: CityValidationResult,
  submission: Submission
): Promise<void> {
  const { cityName, countryName, geonameId, validatedName } = validationResult;
  
  console.log(`🏙️ Processing city: ${validatedName || cityName} in ${countryName}`);
  
  // For now, we'll log what we would do
  // In a full implementation, this would interact with your database
  
  console.log(`📝 Would create/update city record:`, {
    name: validatedName || cityName,
    slug: slugify(validatedName || cityName),
    countryName,
    geonameId,
    submissionId: submission.id,
  });
  
  // TODO: Implement actual database operations
  // 1. Check if city already exists in this country
  // 2. Create city if it doesn't exist
  // 3. Link submission to city
  // 4. Update listing counts
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
 * Get unique countries from all approved submissions
 */
export async function getActiveCountries(): Promise<string[]> {
  try {
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    
    const uniqueCountries = new Set<string>();
    
    approvedSubmissions.forEach(submission => {
      submission.countries.forEach(country => {
        uniqueCountries.add(country);
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
      submission.countries.some(country => 
        country.toLowerCase() === countryName.toLowerCase()
      )
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
 * Get validated cities for a specific country
 */
export async function getValidatedCitiesForCountry(countryName: string): Promise<string[]> {
  try {
    const countrySubmissions = await getSubmissionsForCountry(countryName);
    
    const allCityValidations = [];
    
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
        
        allCityValidations.push(...validations);
      }
    }
    
    // Get unique valid cities
    const validCities = allCityValidations
      .filter(validation => validation.isValid)
      .map(validation => validation.validatedName || validation.cityName);
    
    return Array.from(new Set(validCities)).sort();
    
  } catch (error) {
    console.error(`❌ Error getting validated cities for country ${countryName}:`, error);
    return [];
  }
} 