// Currency utilities for displaying local currencies based on country

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

// Country to currency mapping
export const COUNTRY_CURRENCIES: Record<string, CurrencyInfo> = {
  // North America
  'United States': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'USA': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'Canada': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  'Mexico': { code: 'MXN', symbol: '$', name: 'Mexican Peso' },

  // Europe
  'United Kingdom': { code: 'GBP', symbol: '£', name: 'British Pound' },
  'UK': { code: 'GBP', symbol: '£', name: 'British Pound' },
  'France': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Germany': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Italy': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Spain': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Portugal': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Greece': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Netherlands': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Belgium': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Austria': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Finland': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Ireland': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Luxembourg': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Slovenia': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Slovakia': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Estonia': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Latvia': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Lithuania': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Malta': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Cyprus': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Switzerland': { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  'Norway': { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  'Sweden': { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  'Denmark': { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  'Poland': { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  'Czech Republic': { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  'Hungary': { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  'Romania': { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  'Bulgaria': { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
  'Croatia': { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },

  // Asia-Pacific
  'Japan': { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  'China': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  'South Korea': { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  'India': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  'Thailand': { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  'Vietnam': { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  'Malaysia': { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  'Singapore': { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  'Indonesia': { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  'Philippines': { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  'Australia': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  'New Zealand': { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  'Hong Kong': { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  'Taiwan': { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar' },

  // Latin America & Caribbean
  'Brazil': { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  'Argentina': { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  'Chile': { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  'Colombia': { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  'Peru': { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
  'Uruguay': { code: 'UYU', symbol: '$', name: 'Uruguayan Peso' },
  'Jamaica': { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar' },
  'Bahamas': { code: 'BSD', symbol: 'B$', name: 'Bahamian Dollar' },
  'Barbados': { code: 'BBD', symbol: 'B$', name: 'Barbadian Dollar' },
  'Trinidad and Tobago': { code: 'TTD', symbol: 'TT$', name: 'Trinidad and Tobago Dollar' },
  'Costa Rica': { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón' },
  'Panama': { code: 'PAB', symbol: 'B/.', name: 'Panamanian Balboa' },

  // Africa & Middle East
  'South Africa': { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  'Egypt': { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  'Morocco': { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham' },
  'Nigeria': { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  'Kenya': { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  'Ghana': { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
  'Tanzania': { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  'Uganda': { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  'Ethiopia': { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  'Algeria': { code: 'DZD', symbol: 'د.ج', name: 'Algerian Dinar' },
  'Tunisia': { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar' },
  'UAE': { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  'United Arab Emirates': { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  'Saudi Arabia': { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  'Qatar': { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal' },
  'Kuwait': { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
  'Bahrain': { code: 'BHD', symbol: 'د.ب', name: 'Bahraini Dinar' },
  'Oman': { code: 'OMR', symbol: 'ر.ع', name: 'Omani Rial' },
  'Israel': { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  'Turkey': { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  'Lebanon': { code: 'LBP', symbol: 'ل.ل', name: 'Lebanese Pound' },
  'Jordan': { code: 'JOD', symbol: 'د.أ', name: 'Jordanian Dinar' },

  // Other major countries
  'Russia': { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  'Ukraine': { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  'Belarus': { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble' },
  'Kazakhstan': { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge' },
      'Uzbekistan': { code: 'UZS', symbol: "so'm", name: 'Uzbekistani Som' },
  'Azerbaijan': { code: 'AZN', symbol: '₼', name: 'Azerbaijani Manat' },
  'Georgia': { code: 'GEL', symbol: '₾', name: 'Georgian Lari' },
  'Armenia': { code: 'AMD', symbol: '֏', name: 'Armenian Dram' },
  'Moldova': { code: 'MDL', symbol: 'L', name: 'Moldovan Leu' },
  'Albania': { code: 'ALL', symbol: 'L', name: 'Albanian Lek' },
  'North Macedonia': { code: 'MKD', symbol: 'ден', name: 'Macedonian Denar' },
  'Serbia': { code: 'RSD', symbol: 'дин', name: 'Serbian Dinar' },
  'Bosnia and Herzegovina': { code: 'BAM', symbol: 'KM', name: 'Bosnia and Herzegovina Convertible Mark' },
  'Montenegro': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Kosovo': { code: 'EUR', symbol: '€', name: 'Euro' },
  
  // Specific countries mentioned by user
  'Belize': { code: 'BZD', symbol: 'BZ$', name: 'Belize Dollar' },
  'Dominica': { code: 'USD', symbol: '$', name: 'US Dollar' },
};

/**
 * Get currency information for a specific country
 * @param countryName - The name of the country
 * @returns CurrencyInfo object or null if not found
 */
export function getCountryCurrency(countryName: string): CurrencyInfo | null {
  if (!countryName) return null;
  
  // Try exact match first
  if (COUNTRY_CURRENCIES[countryName]) {
    return COUNTRY_CURRENCIES[countryName];
  }
  
  // Try case-insensitive match
  const normalizedCountry = countryName.trim();
  for (const [key, value] of Object.entries(COUNTRY_CURRENCIES)) {
    if (key.toLowerCase() === normalizedCountry.toLowerCase()) {
      return value;
    }
  }
  
  // Try partial match for common variations
  for (const [key, value] of Object.entries(COUNTRY_CURRENCIES)) {
    if (normalizedCountry.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalizedCountry.toLowerCase())) {
      return value;
    }
  }
  
  return null;
}

/**
 * Format a price with the appropriate currency symbol
 * @param amount - The price amount
 * @param countryName - The country name to determine currency
 * @param fallbackCurrency - Fallback currency if country not found (defaults to EUR)
 * @returns Formatted price string
 */
export function formatPriceForCountry(
  amount: number, 
  countryName: string, 
  fallbackCurrency: string = '€'
): string {
  const currency = getCountryCurrency(countryName);
  if (currency) {
    return `${currency.symbol}${amount.toLocaleString()}`;
  }
  
  // Fallback to EUR if country not found
  return `€${amount.toLocaleString()}`;
}

/**
 * Get the appropriate currency symbol for a country
 * @param countryName - The name of the country
 * @returns Currency symbol or € as fallback
 */
export function getCurrencySymbolForCountry(countryName: string): string {
  const currency = getCountryCurrency(countryName);
  return currency ? currency.symbol : '€';
}

/**
 * Check if a country uses Euro
 * @param countryName - The name of the country
 * @returns True if the country uses Euro
 */
export function isEuroCountry(countryName: string): boolean {
  const currency = getCountryCurrency(countryName);
  return currency ? currency.code === 'EUR' : false;
}

// Base currency mapping for all possible countries
const COUNTRY_CURRENCY_MAP: Record<string, { code: string; symbol: string; name: string }> = {
  'United States': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'Canada': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  'Australia': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  'Belize': { code: 'BZD', symbol: 'BZ$', name: 'Belize Dollar' },
  'Dominica': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'France': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Spain': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Italy': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Portugal': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Greece': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Croatia': { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
  'Mexico': { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  'Thailand': { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  'Indonesia': { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  'United Kingdom': { code: 'GBP', symbol: '£', name: 'British Pound' },
  'China': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
};

// Currency options based on your published countries: Canada, United States, Australia, Belize, Dominica, France, Spain
export const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', name: 'US Dollar' }, // United States, Dominica
  { code: 'EUR', symbol: '€', name: 'Euro' }, // France, Spain
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }, // Canada
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }, // Australia
  { code: 'BZD', symbol: 'BZ$', name: 'Belize Dollar' }, // Belize
] as const;

export type CurrencyCode = 'USD' | 'EUR' | 'CAD' | 'AUD' | 'BZD' | 'HRK' | 'MXN' | 'THB' | 'IDR' | 'GBP' | 'CNY';

// Exchange rates (these would ideally come from an API in production)
// For now, using approximate rates - in production, fetch from a real API
export const EXCHANGE_RATES: Record<string, number> = {
  'USD': 1.0,
  'EUR': 0.85,
  'AUD': 1.5,
  'BZD': 2.0, // Belize Dollar
  'GBP': 0.8,
  'CAD': 1.35,
  'CHF': 0.9,
  'JPY': 110,
  'CNY': 6.5,
  'INR': 75,
  'BRL': 5.2,
  'MXN': 20,
  'RUB': 75,
  'ZAR': 15,
  'AED': 3.67,
  'SAR': 3.75,
  'QAR': 3.64,
  'KWD': 0.3,
  'BHD': 0.38,
  'OMR': 0.38,
  'JOD': 0.71,
  'LBP': 1500,
  'TRY': 8.5,
  'ILS': 3.2,
  'EGP': 15.7,
  'MAD': 9.2,
  'TND': 2.8,
  'DZD': 135,
  'NGN': 410,
  'KES': 110,
  'GHS': 6.1,
  'TZS': 2300,
  'UGX': 3500,
  'ETB': 45,
  'NOK': 8.5,
  'SEK': 8.7,
  'DKK': 6.3,
  'PLN': 3.9,
  'CZK': 21.5,
  'HUF': 300,
  'RON': 4.2,
  'BGN': 1.66,
  'HRK': 6.4,
  'RSD': 100,
  'MKD': 52,
  'ALL': 104,
  'MDL': 18,
  'UAH': 27,
  'BYN': 2.5,
  'KZT': 425,
  'UZS': 10750,
  'AZN': 1.7,
  'GEL': 3.1,
  'AMD': 520,
  'BAM': 1.66,
  'KRW': 1180,
  'THB': 33,
  'VND': 23000,
  'MYR': 4.2,
  'SGD': 1.35,
  'IDR': 14300,
  'PHP': 50,
  'NZD': 1.45,
  'HKD': 7.8,
  'TWD': 28,
  'CLP': 800,
  'COP': 3800,
  'PEN': 3.7,
  'UYU': 43,
  'JMD': 155,
  'BSD': 1.0,
  'BBD': 2.0,
  'TTD': 6.8,
  'CRC': 620,
  'PAB': 1.0,
};

/**
 * Convert amount from one currency to another
 * @param amount - The amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @returns Converted amount
 */
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  const convertedAmount = usdAmount * toRate;
  
  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
}

/**
 * Format price with currency selection and conversion
 * @param amount - The price amount
 * @param originalCurrency - The original currency from Airtable
 * @param selectedCurrency - The user-selected currency
 * @param countryName - The country name for fallback
 * @returns Formatted price string
 */
export function formatPriceWithConversion(
  amount: number,
  originalCurrency: string | undefined,
  selectedCurrency: CurrencyCode,
  countryName?: string
): string {
  if (!originalCurrency) {
    // If no original currency, use country-based currency
    const countryCurrency = getCountryCurrency(countryName || '');
    if (countryCurrency) {
      const convertedAmount = convertCurrency(amount, countryCurrency.code, selectedCurrency);
      const selectedCurrencyInfo = CURRENCY_OPTIONS.find(c => c.code === selectedCurrency);
      return `${selectedCurrencyInfo?.symbol || '$'}${convertedAmount.toLocaleString()}`;
    }
    // Fallback to EUR
    const convertedAmount = convertCurrency(amount, 'EUR', selectedCurrency);
    const selectedCurrencyInfo = CURRENCY_OPTIONS.find(c => c.code === selectedCurrency);
    return `${selectedCurrencyInfo?.symbol || '$'}${convertedAmount.toLocaleString()}`;
  }

  // Convert from original currency to selected currency
  const convertedAmount = convertCurrency(amount, originalCurrency, selectedCurrency);
  const selectedCurrencyInfo = CURRENCY_OPTIONS.find(c => c.code === selectedCurrency);
  return `${selectedCurrencyInfo?.symbol || '$'}${convertedAmount.toLocaleString()}`;
}

/**
 * Get the appropriate currency for a country based on user's requirements
 * @param countryName - The name of the country
 * @returns Currency code based on user's rules
 */
export function getCountryCurrencyByRules(countryName: string): string {
  if (!countryName) return 'EUR';
  
  // European countries use EUR
  const europeanCountries = [
    'France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Greece', 'Netherlands', 
    'Belgium', 'Austria', 'Finland', 'Ireland', 'Luxembourg', 'Slovenia', 
    'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Malta', 'Cyprus', 
    'Montenegro', 'Kosovo'
  ];
  
  if (europeanCountries.some(country => 
    countryName.toLowerCase().includes(country.toLowerCase()) || 
    country.toLowerCase().includes(countryName.toLowerCase())
  )) {
    return 'EUR';
  }
  
  // United States uses USD
  if (countryName.toLowerCase().includes('united states') || 
      countryName.toLowerCase().includes('usa') ||
      countryName.toLowerCase().includes('us')) {
    return 'USD';
  }
  
  // Belize uses BZD
  if (countryName.toLowerCase().includes('belize')) {
    return 'BZD';
  }
  
  // Dominica uses USD
  if (countryName.toLowerCase().includes('dominica')) {
    return 'USD';
  }
  
  // Default to EUR for other countries
  return 'EUR';
}

/**
 * Convert budget range values for display in selected currency
 * @param minValue - Minimum value in EUR
 * @param maxValue - Maximum value in EUR
 * @param selectedCurrency - Target currency
 * @returns Object with converted min and max values rounded to nice numbers
 */
export function convertBudgetRange(
  minValue: number, 
  maxValue: number, 
  selectedCurrency: CurrencyCode
): { min: number; max: number } {
  if (selectedCurrency === 'EUR') {
    return { min: minValue, max: maxValue };
  }

  // Convert from EUR to selected currency
  const convertedMin = convertCurrency(minValue, 'EUR', selectedCurrency);
  const convertedMax = convertCurrency(maxValue, 'EUR', selectedCurrency);

  // Round to nice numbers based on currency
  const roundToNiceNumber = (value: number, currency: CurrencyCode): number => {
    if (currency === 'THB' || currency === 'IDR') {
      // For currencies with high values, round to nearest 50
      return Math.round(value / 50) * 50;
    } else if (currency === 'MXN' || currency === 'CAD' || currency === 'AUD') {
      // For currencies with moderate values, round to nearest 10
      return Math.round(value / 10) * 10;
    } else {
      // For USD, HRK, etc., round to nearest 5
      return Math.round(value / 5) * 5;
    }
  };

  return {
    min: roundToNiceNumber(convertedMin, selectedCurrency),
    max: roundToNiceNumber(convertedMax, selectedCurrency)
  };
}
