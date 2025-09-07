import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode } from '@/lib/currency-utils';
import { extractAllCurrenciesFromAirtable } from '@/lib/airtable-currency-extractor';

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
        const currencies = await extractAllCurrenciesFromAirtable();
        setCurrencyOptions(currencies);
        
        // Load saved currency from localStorage
        const savedCurrency = localStorage.getItem('selectedCurrency') as CurrencyCode;
        if (savedCurrency && currencies.some(option => option.code === savedCurrency)) {
          setSelectedCurrency(savedCurrency);
        }
      } catch (error) {
        console.error('Failed to load currencies from Airtable:', error);
        // Fallback to basic currencies
        const fallbackCurrencies = [
          { code: 'USD', symbol: '$', name: 'US Dollar' },
          { code: 'EUR', symbol: '€', name: 'Euro' },
          { code: 'GBP', symbol: '£', name: 'British Pound' },
          { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
          { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
          { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
        ];
        setCurrencyOptions(fallbackCurrencies);
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
