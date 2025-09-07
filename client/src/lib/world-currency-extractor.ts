export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

/**
 * Comprehensive currency mapping with symbols and names
 */
const CURRENCY_MAP: Record<string, { symbol: string; name: string }> = {
  'USD': { symbol: '$', name: 'US Dollar' },
  'EUR': { symbol: '€', name: 'Euro' },
  'GBP': { symbol: '£', name: 'British Pound' },
  'CAD': { symbol: 'C$', name: 'Canadian Dollar' },
  'AUD': { symbol: 'A$', name: 'Australian Dollar' },
  'JPY': { symbol: '¥', name: 'Japanese Yen' },
  'CHF': { symbol: 'CHF', name: 'Swiss Franc' },
  'SEK': { symbol: 'kr', name: 'Swedish Krona' },
  'NOK': { symbol: 'kr', name: 'Norwegian Krone' },
  'DKK': { symbol: 'kr', name: 'Danish Krone' },
  'PLN': { symbol: 'zł', name: 'Polish Zloty' },
  'CZK': { symbol: 'Kč', name: 'Czech Koruna' },
  'HUF': { symbol: 'Ft', name: 'Hungarian Forint' },
  'RON': { symbol: 'lei', name: 'Romanian Leu' },
  'BGN': { symbol: 'лв', name: 'Bulgarian Lev' },
  'HRK': { symbol: 'kn', name: 'Croatian Kuna' },
  'RSD': { symbol: 'дин', name: 'Serbian Dinar' },
  'MKD': { symbol: 'ден', name: 'Macedonian Denar' },
  'BAM': { symbol: 'КМ', name: 'Bosnia and Herzegovina Mark' },
  'ALL': { symbol: 'L', name: 'Albanian Lek' },
  'MXN': { symbol: '$', name: 'Mexican Peso' },
  'BRL': { symbol: 'R$', name: 'Brazilian Real' },
  'ARS': { symbol: '$', name: 'Argentine Peso' },
  'CLP': { symbol: '$', name: 'Chilean Peso' },
  'COP': { symbol: '$', name: 'Colombian Peso' },
  'PEN': { symbol: 'S/', name: 'Peruvian Sol' },
  'UYU': { symbol: '$U', name: 'Uruguayan Peso' },
  'VEF': { symbol: 'Bs', name: 'Venezuelan Bolivar' },
  'BOB': { symbol: 'Bs', name: 'Bolivian Boliviano' },
  'PYG': { symbol: '₲', name: 'Paraguayan Guarani' },
  'CNY': { symbol: '¥', name: 'Chinese Yuan' },
  'HKD': { symbol: 'HK$', name: 'Hong Kong Dollar' },
  'SGD': { symbol: 'S$', name: 'Singapore Dollar' },
  'KRW': { symbol: '₩', name: 'South Korean Won' },
  'THB': { symbol: '฿', name: 'Thai Baht' },
  'VND': { symbol: '₫', name: 'Vietnamese Dong' },
  'IDR': { symbol: 'Rp', name: 'Indonesian Rupiah' },
  'MYR': { symbol: 'RM', name: 'Malaysian Ringgit' },
  'PHP': { symbol: '₱', name: 'Philippine Peso' },
  'INR': { symbol: '₹', name: 'Indian Rupee' },
  'PKR': { symbol: '₨', name: 'Pakistani Rupee' },
  'BDT': { symbol: '৳', name: 'Bangladeshi Taka' },
  'LKR': { symbol: '₨', name: 'Sri Lankan Rupee' },
  'NPR': { symbol: '₨', name: 'Nepalese Rupee' },
  'AFN': { symbol: '؋', name: 'Afghan Afghani' },
  'IRR': { symbol: '﷼', name: 'Iranian Rial' },
  'IQD': { symbol: 'ع.د', name: 'Iraqi Dinar' },
  'JOD': { symbol: 'د.ا', name: 'Jordanian Dinar' },
  'KWD': { symbol: 'د.ك', name: 'Kuwaiti Dinar' },
  'LBP': { symbol: 'ل.ل', name: 'Lebanese Pound' },
  'OMR': { symbol: 'ر.ع.', name: 'Omani Rial' },
  'QAR': { symbol: 'ر.ق', name: 'Qatari Riyal' },
  'SAR': { symbol: 'ر.س', name: 'Saudi Riyal' },
  'SYP': { symbol: 'ل.س', name: 'Syrian Pound' },
  'AED': { symbol: 'د.إ', name: 'UAE Dirham' },
  'YER': { symbol: '﷼', name: 'Yemeni Rial' },
  'ILS': { symbol: '₪', name: 'Israeli Shekel' },
  'TRY': { symbol: '₺', name: 'Turkish Lira' },
  'EGP': { symbol: '£', name: 'Egyptian Pound' },
  'MAD': { symbol: 'د.م.', name: 'Moroccan Dirham' },
  'TND': { symbol: 'د.ت', name: 'Tunisian Dinar' },
  'DZD': { symbol: 'د.ج', name: 'Algerian Dinar' },
  'LYD': { symbol: 'ل.د', name: 'Libyan Dinar' },
  'SDG': { symbol: 'ج.س.', name: 'Sudanese Pound' },
  'ETB': { symbol: 'Br', name: 'Ethiopian Birr' },
  'KES': { symbol: 'KSh', name: 'Kenyan Shilling' },
  'TZS': { symbol: 'TSh', name: 'Tanzanian Shilling' },
  'UGX': { symbol: 'USh', name: 'Ugandan Shilling' },
  'RWF': { symbol: 'RF', name: 'Rwandan Franc' },
  'BIF': { symbol: 'FBu', name: 'Burundian Franc' },
  'DJF': { symbol: 'Fdj', name: 'Djiboutian Franc' },
  'SOS': { symbol: 'S', name: 'Somali Shilling' },
  'ZAR': { symbol: 'R', name: 'South African Rand' },
  'BWP': { symbol: 'P', name: 'Botswana Pula' },
  'SZL': { symbol: 'L', name: 'Swazi Lilangeni' },
  'LSL': { symbol: 'L', name: 'Lesotho Loti' },
  'NAD': { symbol: 'N$', name: 'Namibian Dollar' },
  'ZMW': { symbol: 'ZK', name: 'Zambian Kwacha' },
  'ZWL': { symbol: 'Z$', name: 'Zimbabwean Dollar' },
  'MZN': { symbol: 'MT', name: 'Mozambican Metical' },
  'AOA': { symbol: 'Kz', name: 'Angolan Kwanza' },
  'XOF': { symbol: 'CFA', name: 'West African CFA Franc' },
  'XAF': { symbol: 'FCFA', name: 'Central African CFA Franc' },
  'GMD': { symbol: 'D', name: 'Gambian Dalasi' },
  'GHS': { symbol: '₵', name: 'Ghanaian Cedi' },
  'NGN': { symbol: '₦', name: 'Nigerian Naira' },
  'NZD': { symbol: 'NZ$', name: 'New Zealand Dollar' },
  'FJD': { symbol: 'FJ$', name: 'Fijian Dollar' },
  'PGK': { symbol: 'K', name: 'Papua New Guinea Kina' },
  'SBD': { symbol: 'SI$', name: 'Solomon Islands Dollar' },
  'VUV': { symbol: 'Vt', name: 'Vanuatu Vatu' },
  'WST': { symbol: 'WS$', name: 'Samoan Tala' },
  'TOP': { symbol: 'T$', name: 'Tongan Paʻanga' },
  'XPF': { symbol: '₣', name: 'CFP Franc' }
};

/**
 * Country to currency mapping
 */
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  'United States': 'USD',
  'Canada': 'CAD',
  'Mexico': 'MXN',
  'United Kingdom': 'GBP',
  'France': 'EUR',
  'Germany': 'EUR',
  'Italy': 'EUR',
  'Spain': 'EUR',
  'Portugal': 'EUR',
  'Netherlands': 'EUR',
  'Belgium': 'EUR',
  'Austria': 'EUR',
  'Switzerland': 'CHF',
  'Sweden': 'SEK',
  'Norway': 'NOK',
  'Denmark': 'DKK',
  'Finland': 'EUR',
  'Poland': 'PLN',
  'Czech Republic': 'CZK',
  'Hungary': 'HUF',
  'Romania': 'RON',
  'Bulgaria': 'BGN',
  'Croatia': 'HRK',
  'Serbia': 'RSD',
  'North Macedonia': 'MKD',
  'Bosnia and Herzegovina': 'BAM',
  'Albania': 'ALL',
  'Greece': 'EUR',
  'Turkey': 'TRY',
  'Russia': 'RUB',
  'Ukraine': 'UAH',
  'Belarus': 'BYN',
  'Moldova': 'MDL',
  'Lithuania': 'EUR',
  'Latvia': 'EUR',
  'Estonia': 'EUR',
  'Iceland': 'ISK',
  'Ireland': 'EUR',
  'Luxembourg': 'EUR',
  'Malta': 'EUR',
  'Cyprus': 'EUR',
  'Slovenia': 'EUR',
  'Slovakia': 'EUR',
  'Brazil': 'BRL',
  'Argentina': 'ARS',
  'Chile': 'CLP',
  'Colombia': 'COP',
  'Peru': 'PEN',
  'Uruguay': 'UYU',
  'Venezuela': 'VEF',
  'Bolivia': 'BOB',
  'Paraguay': 'PYG',
  'Ecuador': 'USD',
  'Guyana': 'GYD',
  'Suriname': 'SRD',
  'China': 'CNY',
  'Japan': 'JPY',
  'South Korea': 'KRW',
  'Hong Kong': 'HKD',
  'Singapore': 'SGD',
  'Thailand': 'THB',
  'Vietnam': 'VND',
  'Indonesia': 'IDR',
  'Malaysia': 'MYR',
  'Philippines': 'PHP',
  'India': 'INR',
  'Pakistan': 'PKR',
  'Bangladesh': 'BDT',
  'Sri Lanka': 'LKR',
  'Nepal': 'NPR',
  'Afghanistan': 'AFN',
  'Iran': 'IRR',
  'Iraq': 'IQD',
  'Jordan': 'JOD',
  'Kuwait': 'KWD',
  'Lebanon': 'LBP',
  'Oman': 'OMR',
  'Qatar': 'QAR',
  'Saudi Arabia': 'SAR',
  'Syria': 'SYP',
  'United Arab Emirates': 'AED',
  'Yemen': 'YER',
  'Israel': 'ILS',
  'Egypt': 'EGP',
  'Morocco': 'MAD',
  'Tunisia': 'TND',
  'Algeria': 'DZD',
  'Libya': 'LYD',
  'Sudan': 'SDG',
  'Ethiopia': 'ETB',
  'Kenya': 'KES',
  'Tanzania': 'TZS',
  'Uganda': 'UGX',
  'Rwanda': 'RWF',
  'Burundi': 'BIF',
  'Djibouti': 'DJF',
  'Somalia': 'SOS',
  'South Africa': 'ZAR',
  'Botswana': 'BWP',
  'Eswatini': 'SZL',
  'Lesotho': 'LSL',
  'Namibia': 'NAD',
  'Zambia': 'ZMW',
  'Zimbabwe': 'ZWL',
  'Mozambique': 'MZN',
  'Angola': 'AOA',
  'Gambia': 'GMD',
  'Ghana': 'GHS',
  'Nigeria': 'NGN',
  'Australia': 'AUD',
  'New Zealand': 'NZD',
  'Fiji': 'FJD',
  'Papua New Guinea': 'PGK',
  'Solomon Islands': 'SBD',
  'Vanuatu': 'VUV',
  'Samoa': 'WST',
  'Tonga': 'TOP'
};

/**
 * Extract all unique currencies from ALL submissions in Airtable
 */
export async function extractAllCurrenciesFromAirtable(): Promise<CurrencyOption[]> {
  try {
    // Import the airtable service to get all submissions
    const { airtableService } = await import('./airtable');
    const submissions = await airtableService.getAllSubmissions();
    
    const currencySet = new Set<string>();
    
    submissions.forEach(submission => {
      if (submission.currency) {
        const currency = submission.currency.trim().toUpperCase();
        if (currency && currency.length > 0) {
          currencySet.add(currency);
        }
      }
    });
    
    // Convert to CurrencyOption array
    return Array.from(currencySet).map(currency => {
      const currencyData = CURRENCY_MAP[currency] || { symbol: currency, name: currency };
      return {
        code: currency,
        symbol: currencyData.symbol,
        name: currencyData.name
      };
    }).sort((a, b) => a.code.localeCompare(b.code));
  } catch (error) {
    console.error('Failed to extract currencies from Airtable:', error);
    // Fallback to basic currencies
    return [
      { code: 'USD', symbol: '$', name: 'US Dollar' },
      { code: 'EUR', symbol: '€', name: 'Euro' },
      { code: 'GBP', symbol: '£', name: 'British Pound' },
      { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
      { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
      { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
    ];
  }
}

/**
 * Get currency for a specific country
 */
export function getCurrencyForCountry(countryName: string): string {
  return COUNTRY_CURRENCY_MAP[countryName] || 'USD'; // Default to USD
}

/**
 * Get all available currencies
 */
export function getAllCurrencies(): Promise<CurrencyOption[]> {
  return extractAllCurrenciesFromAirtable();
}
