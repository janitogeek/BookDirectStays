export interface GeonamesRecord {
  city: string;
  region: string | null;
  country: string;
  fullRecord: string;
}

export interface ParsedGeonamesData {
  records: GeonamesRecord[];
  countries: string[];
  citiesByCountry: Record<string, string[]>;
}

/**
 * Parses a Geonames record string that can contain multiple city entries
 * separated by semicolons. Supports both full format (City, Region, Country)
 * and simplified format (City, Country).
 * 
 * @param geonamesRecord - String like "Paris, France; Barcelona, Spain" or "Paris, Île-de-France, France; Barcelona, Catalonia, Spain"
 * @returns Parsed data with cities, countries, and relationships
 */
export function parseGeonamesRecord(geonamesRecord: string): ParsedGeonamesData {
  if (!geonamesRecord || typeof geonamesRecord !== 'string') {
    return {
      records: [],
      countries: [],
      citiesByCountry: {}
    };
  }

  const cityRecords = geonamesRecord.split(';').map(record => record.trim()).filter(record => record.length > 0);
  
  const records: GeonamesRecord[] = cityRecords.map(record => {
    const parts = record.split(',').map(part => part.trim());
    
    if (parts.length === 2) {
      // Format: "City, Country"
      return {
        city: parts[0],
        region: null,
        country: parts[1],
        fullRecord: record
      };
    } else if (parts.length === 3) {
      // Format: "City, Region, Country"
      return {
        city: parts[0],
        region: parts[1],
        country: parts[2],
        fullRecord: record
      };
    } else {
      // Fallback: treat as city only
      return {
        city: parts[0],
        region: null,
        country: null,
        fullRecord: record
      };
    }
  });

  // Extract unique countries
  const countries = [...new Set(records.map(r => r.country).filter(Boolean))];

  // Group cities by country
  const citiesByCountry: Record<string, string[]> = {};
  records.forEach(record => {
    if (record.country) {
      if (!citiesByCountry[record.country]) {
        citiesByCountry[record.country] = [];
      }
      if (!citiesByCountry[record.country].includes(record.city)) {
        citiesByCountry[record.country].push(record.city);
      }
    }
  });

  return {
    records,
    countries,
    citiesByCountry
  };
}

/**
 * Gets all unique countries from a Geonames record
 */
export function getCountriesFromGeonamesRecord(geonamesRecord: string): string[] {
  const parsed = parseGeonamesRecord(geonamesRecord);
  return parsed.countries;
}

/**
 * Gets all unique regions/states from a Geonames record for a specific country
 */
export function getRegionsForCountryFromGeonamesRecord(geonamesRecord: string, countryName: string): string[] {
  const parsed = parseGeonamesRecord(geonamesRecord);
  const regions = parsed.records
    .filter(record => record.country?.toLowerCase().trim() === countryName.toLowerCase().trim())
    .map(record => record.region)
    .filter(Boolean) as string[];
    
  return [...new Set(regions)];
}

/**
 * Gets all cities for a specific country from a Geonames record
 */
export function getCitiesForCountryFromGeonamesRecord(geonamesRecord: string, targetCountry: string): string[] {
  const parsed = parseGeonamesRecord(geonamesRecord);
  
  // Case-insensitive country matching
  const targetCountryLower = targetCountry.toLowerCase().trim();
  
  // Find the matching country key (case-insensitive)
  const matchingCountryKey = Object.keys(parsed.citiesByCountry).find(countryKey => 
    countryKey.toLowerCase().trim() === targetCountryLower
  );
  
  return matchingCountryKey ? parsed.citiesByCountry[matchingCountryKey] : [];
}

/**
 * Gets all cities from a Geonames record (regardless of country)
 */
export function getAllCitiesFromGeonamesRecord(geonamesRecord: string): string[] {
  const parsed = parseGeonamesRecord(geonamesRecord);
  return parsed.records.map(r => r.city);
}

/**
 * Validates if a Geonames record has valid data
 */
export function isValidGeonamesRecord(geonamesRecord: string): boolean {
  const parsed = parseGeonamesRecord(geonamesRecord);
  return parsed.records.length > 0 && parsed.countries.length > 0;
}

/**
 * Formats a Geonames record for display
 */
export function formatGeonamesRecordForDisplay(geonamesRecord: string): string {
  const parsed = parseGeonamesRecord(geonamesRecord);
  return parsed.records.map(record => {
    if (record.region) {
      return `${record.city}, ${record.region}, ${record.country}`;
    } else {
      return `${record.city}, ${record.country}`;
    }
  }).join('; ');
}