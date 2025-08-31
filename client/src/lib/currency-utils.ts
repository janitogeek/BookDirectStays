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
