import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode } from '@/lib/currency-utils';
import { dataPreloader } from '@/lib/data-preloader';
import { CurrencyInfo } from '@/lib/currency-extractor';

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

  // Load currencies from data preloader
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setIsLoading(true);
        const currencies = await dataPreloader.getCurrencies();
        
        // Convert CurrencyInfo to the format expected by the context
        const options = currencies.map(currency => ({
          code: currency.code,
          symbol: currency.symbol,
          name: currency.name
        }));
        
        setCurrencyOptions(options);
        
        // Load saved currency from localStorage
        const savedCurrency = localStorage.getItem('selectedCurrency') as CurrencyCode;
        if (savedCurrency && options.some(option => option.code === savedCurrency)) {
          setSelectedCurrency(savedCurrency);
        }
      } catch (error) {
        console.error('Failed to load currencies:', error);
        // Fallback to empty array
        setCurrencyOptions([]);
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
