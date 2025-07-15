// GeoNames API utilities for city validation
// Used to validate if a city exists in a specific country

interface GeoNamesResponse {
  geonames: Array<{
    name: string;
    countryName: string;
    countryCode: string;
    adminName1?: string;
    geonameId: number;
  }>;
}

// Country name to code mapping
const COUNTRY_CODES: Record<string, string> = {
  "USA": "US",
  "United States": "US",
  "Spain": "ES",
  "UK": "GB",
  "United Kingdom": "GB",
  "Germany": "DE",
  "France": "FR",
  "Australia": "AU",
  "Canada": "CA",
  "Italy": "IT",
  "Portugal": "PT",
  "Thailand": "TH",
  "Greece": "GR",
  "Albania": "AL",
  "Colombia": "CO",
  "Mexico": "MX",
  "Brazil": "BR",
  "Argentina": "AR",
  "Chile": "CL",
  "Peru": "PE",
  "Ecuador": "EC",
  "Uruguay": "UY",
  "Paraguay": "PY",
  "Bolivia": "BO",
  "Venezuela": "VE",
  "Guyana": "GY",
  "Suriname": "SR",
  "French Guiana": "GF",
  "Croatia": "HR",
  "Slovenia": "SI",
  "Serbia": "RS",
  "Montenegro": "ME",
  "Bosnia and Herzegovina": "BA",
  "North Macedonia": "MK",
  "Bulgaria": "BG",
  "Romania": "RO",
  "Moldova": "MD",
  "Ukraine": "UA",
  "Belarus": "BY",
  "Poland": "PL",
  "Czech Republic": "CZ",
  "Slovakia": "SK",
  "Hungary": "HU",
  "Austria": "AT",
  "Switzerland": "CH",
  "Liechtenstein": "LI",
  "Netherlands": "NL",
  "Belgium": "BE",
  "Luxembourg": "LU",
  "Denmark": "DK",
  "Sweden": "SE",
  "Norway": "NO",
  "Finland": "FI",
  "Iceland": "IS",
  "Ireland": "IE",
  "Estonia": "EE",
  "Latvia": "LV",
  "Lithuania": "LT",
  // Add more as needed
};

/**
 * Get country code from country name
 */
export function getCountryCode(countryName: string): string | null {
  return COUNTRY_CODES[countryName] || null;
}

/**
 * Validate if a city exists in a specific country using GeoNames API
 */
export async function validateCityInCountry(
  cityName: string, 
  countryName: string
): Promise<{ isValid: boolean; geonameId?: number; exactMatch?: string }> {
  const countryCode = getCountryCode(countryName);
  
  if (!countryCode) {
    console.warn(`⚠️ Country code not found for: ${countryName}`);
    return { isValid: false };
  }

  try {
    console.log(`🔍 Validating "${cityName}" in ${countryName} (${countryCode})`);
    
    const response = await fetch(
      `https://secure.geonames.org/searchJSON?name=${encodeURIComponent(cityName)}&country=${countryCode}&featureClass=P&maxRows=5&username=janito`
    );
    
    if (!response.ok) {
      console.error(`❌ GeoNames API error: ${response.status}`);
      return { isValid: false };
    }
    
    const data: GeoNamesResponse = await response.json();
    
    if (!data.geonames || data.geonames.length === 0) {
      console.log(`❌ No cities found for "${cityName}" in ${countryName}`);
      return { isValid: false };
    }
    
    // Look for exact match first
    const exactMatch = data.geonames.find(city => 
      city.name.toLowerCase() === cityName.toLowerCase()
    );
    
    if (exactMatch) {
      console.log(`✅ Exact match found: "${exactMatch.name}" in ${countryName}`);
      return { 
        isValid: true, 
        geonameId: exactMatch.geonameId,
        exactMatch: exactMatch.name 
      };
    }
    
    // If no exact match, use the first result (closest match)
    const firstResult = data.geonames[0];
    console.log(`✅ Closest match found: "${firstResult.name}" for "${cityName}" in ${countryName}`);
    
    return { 
      isValid: true, 
      geonameId: firstResult.geonameId,
      exactMatch: firstResult.name 
    };
    
  } catch (error) {
    console.error(`❌ Error validating city "${cityName}" in ${countryName}:`, error);
    return { isValid: false };
  }
}

/**
 * Batch validate multiple cities for multiple countries
 */
export async function validateCitiesForCountries(
  cities: Array<{ name: string; geonameId?: number }>,
  countries: string[]
): Promise<Array<{
  cityName: string;
  countryName: string;
  isValid: boolean;
  geonameId?: number;
  validatedName?: string;
}>> {
  const results = [];
  
  for (const country of countries) {
    for (const city of cities) {
      const validation = await validateCityInCountry(city.name, country);
      
      results.push({
        cityName: city.name,
        countryName: country,
        isValid: validation.isValid,
        geonameId: validation.geonameId,
        validatedName: validation.exactMatch,
      });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

/**
 * Get comprehensive city information from GeoNames
 */
export async function getCityInfo(geonameId: number): Promise<any> {
  try {
    const response = await fetch(
      `https://secure.geonames.org/getJSON?geonameId=${geonameId}&username=janito`
    );
    
    if (!response.ok) {
      throw new Error(`GeoNames API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching city info for geonameId ${geonameId}:`, error);
    return null;
  }
} 