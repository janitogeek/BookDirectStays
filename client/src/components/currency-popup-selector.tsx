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
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden"
        >
            {/* Search Input */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Show prices in"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 h-9 text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Currency List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredCurrencies.length === 0 ? (
                <div className="px-3 py-4 text-center text-gray-500 text-sm">
                  No currencies found
                </div>
              ) : (
                <div className="py-1">
                  {filteredCurrencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{currency.symbol}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{currency.code}</span>
                          <span className="text-xs text-gray-500">{currency.name}</span>
                        </div>
                      </div>
                      {selectedCurrency === currency.code && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full h-9 text-sm font-medium"
              >
                Done
              </Button>
            </div>
          </div>
      )}
    </div>
  );
}
