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
        const airtableCurrencies = await getAllCurrencies();
        console.log('✅ Loaded currencies from Airtable:', airtableCurrencies.length, airtableCurrencies);
        
        // Combine Airtable currencies with CURRENCY_OPTIONS to ensure we have all options
        const allCurrencies = [...airtableCurrencies];
        
        // Add CURRENCY_OPTIONS if they're not already present
        CURRENCY_OPTIONS.forEach(option => {
          if (!allCurrencies.some(currency => currency.code === option.code)) {
            allCurrencies.push(option);
          }
        });
        
        // Sort by currency code
        allCurrencies.sort((a, b) => a.code.localeCompare(b.code));
        
        console.log('✅ Total currencies available:', allCurrencies.length, allCurrencies);
        setCurrencyOptions(allCurrencies);
        
        // Load saved currency from localStorage
        const savedCurrency = localStorage.getItem('selectedCurrency') as CurrencyCode;
        if (savedCurrency && allCurrencies.some(option => option.code === savedCurrency)) {
          setSelectedCurrency(savedCurrency);
        } else if (allCurrencies.length > 0) {
          // Set first currency as default if no saved currency
          setSelectedCurrency(allCurrencies[0].code);
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
