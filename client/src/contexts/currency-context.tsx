import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CurrencyCode, generateCurrencyOptions, DEFAULT_CURRENCY_OPTIONS } from '@/lib/currency-utils';
import { dataPreloader } from '@/lib/data-preloader';

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

  // Fetch active countries to generate currency options
  const { data: countriesData = [], isLoading: isCountriesLoading } = useQuery({
    queryKey: ["/api/preloaded-countries"],
    queryFn: () => dataPreloader.getCountries(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Generate currency options based on active countries
  const currencyOptions = countriesData.length > 0 
    ? generateCurrencyOptions(countriesData.map(c => c.name))
    : DEFAULT_CURRENCY_OPTIONS;

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency') as CurrencyCode;
    if (savedCurrency && currencyOptions.some(option => option.code === savedCurrency)) {
      setSelectedCurrency(savedCurrency);
    } else if (currencyOptions.length > 0) {
      // If saved currency is not available, use the first available currency
      setSelectedCurrency(currencyOptions[0].code as CurrencyCode);
    }
  }, [currencyOptions]);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  return (
    <CurrencyContext.Provider value={{ 
      selectedCurrency, 
      setSelectedCurrency, 
      currencyOptions,
      isLoading: isCountriesLoading
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
