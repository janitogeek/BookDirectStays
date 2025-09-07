import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode, CURRENCY_OPTIONS } from '@/lib/currency-utils';
import { getAllCurrencies } from '@/lib/world-currency-extractor';

interface CurrencyContextType {
  selectedCurrency: CurrencyCode;
  setSelectedCurrency: (currency: CurrencyCode) => void;
  currencyOptions: Array<{ code: string; symbol: string; name: string }>;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('EUR');
  const [currencyOptions, setCurrencyOptions] = useState<Array<{ code: string; symbol: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load currencies from Airtable
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Loading currencies from Airtable...');
        const currencies = await getAllCurrencies();
        console.log('✅ Loaded currencies:', currencies.length, currencies);
        
        // If no currencies loaded from Airtable, use CURRENCY_OPTIONS
        if (currencies.length === 0) {
          console.log('⚠️ No currencies from Airtable, using CURRENCY_OPTIONS');
          setCurrencyOptions(CURRENCY_OPTIONS);
        } else {
          setCurrencyOptions(currencies);
        }
        
        // Load saved currency from localStorage
        const savedCurrency = localStorage.getItem('selectedCurrency') as CurrencyCode;
        if (savedCurrency && (currencies.length > 0 ? currencies : CURRENCY_OPTIONS).some(option => option.code === savedCurrency)) {
          setSelectedCurrency(savedCurrency);
        } else if ((currencies.length > 0 ? currencies : CURRENCY_OPTIONS).length > 0) {
          // Set first currency as default if no saved currency
          setSelectedCurrency((currencies.length > 0 ? currencies : CURRENCY_OPTIONS)[0].code);
        }
      } catch (error) {
        console.error('❌ Failed to load currencies from Airtable:', error);
        // Fallback to CURRENCY_OPTIONS from commit 9bab664
        console.log('🔄 Using CURRENCY_OPTIONS fallback:', CURRENCY_OPTIONS.length);
        setCurrencyOptions(CURRENCY_OPTIONS);
        setSelectedCurrency('EUR'); // Set default currency
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  return (
    <CurrencyContext.Provider value={{ 
      selectedCurrency, 
      setSelectedCurrency, 
      currencyOptions,
      isLoading
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
