import React, { useState, useRef, useEffect } from 'react';
import { Search, Check, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

interface CurrencyPopupSelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  currencies: CurrencyOption[];
  isLoading?: boolean;
}

export function CurrencyPopupSelector({
  selectedCurrency,
  onCurrencyChange,
  currencies,
  isLoading = false
}: CurrencyPopupSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState<CurrencyOption[]>(currencies);
  const popupRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter currencies based on search term
  useEffect(() => {
    console.log('🔍 CurrencyPopupSelector - Filtering currencies:', { 
      searchTerm, 
      currenciesCount: currencies.length, 
      currencies: currencies.slice(0, 3) // Show first 3 for debugging
    });
    
    if (!searchTerm.trim()) {
      setFilteredCurrencies(currencies);
    } else {
      const filtered = currencies.filter(currency =>
        currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCurrencies(filtered);
    }
  }, [searchTerm, currencies]);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when popup opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleCurrencySelect = (currency: CurrencyOption) => {
    onCurrencyChange(currency.code);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);

  if (isLoading) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-10 bg-white border-gray-300 text-gray-500"
          disabled
        >
          <span>Loading currencies...</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        variant="outline"
        className="flex items-center gap-2 px-3 py-2 h-10 bg-white border-gray-300 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{selectedCurrencyData?.symbol}</span>
        <span className="text-sm font-medium">{selectedCurrencyData?.code}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Popup Box */}
      {isOpen && (
        <div 
          ref={popupRef}
          className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-96 max-h-80 overflow-hidden"
        >
            {/* Search Input */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search currencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-3 h-11 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Currency List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredCurrencies.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  {isLoading ? 'Loading currencies...' : `No currencies found (${currencies.length} total)`}
                </div>
              ) : (
                <div className="py-2">
                  {filteredCurrencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-gray-900">{currency.symbol}</span>
                        <div className="flex flex-col">
                          <span className="text-base font-semibold text-gray-900">{currency.code}</span>
                          <span className="text-sm text-gray-600">{currency.name}</span>
                        </div>
                      </div>
                      {selectedCurrency === currency.code && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full h-10 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              >
                Done
              </Button>
            </div>
          </div>
      )}
    </div>
  );
}
