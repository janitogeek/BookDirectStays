import { useState, useEffect } from "react";
import { Check, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Country {
  id: number;
  name: string;
  slug: string;
  code: string;
  listingCount: number;
}

interface CountryFilterProps {
  countries: Country[];
  selectedCountries: string[];
  onChange: (countrySlugs: string[]) => void;
  isLoading?: boolean;
}

export default function CountryFilter({ 
  countries, 
  selectedCountries, 
  onChange, 
  isLoading = false 
}: CountryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  
  // Handle search filter
  useEffect(() => {
    if (!countries) return;
    
    if (searchTerm.trim() === "") {
      setFilteredCountries(countries);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      setFilteredCountries(
        countries.filter(country => 
          country.name.toLowerCase().includes(lowerCaseSearch)
        )
      );
    }
  }, [countries, searchTerm]);
  
  // Toggle selection of a country
  const toggleCountry = (slug: string) => {
    let newSelected;
    
    if (selectedCountries.includes(slug)) {
      newSelected = selectedCountries.filter(s => s !== slug);
    } else {
      newSelected = [...selectedCountries, slug];
    }
    
    onChange(newSelected);
  };
  
  // Clear all selected countries
  const clearAllCountries = () => {
    onChange([]);
    setIsOpen(false);
  };
  
  // Get selected country names for display
  const getSelectedCountryNames = () => {
    if (!countries) return [];
    
    return selectedCountries
      .map(slug => countries.find(c => c.slug === slug)?.name)
      .filter(Boolean) as string[];
  };
  
  const selectedCountryNames = getSelectedCountryNames();
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between border border-gray-300 py-6"
        >
          {selectedCountryNames.length > 0 ? (
            <div className="flex flex-wrap gap-1 max-w-[300px] overflow-hidden">
              {selectedCountryNames.length <= 2 ? (
                selectedCountryNames.map(name => (
                  <Badge key={name} variant="secondary" className="mr-1">
                    {name}
                  </Badge>
                ))
              ) : (
                <>
                  <Badge variant="secondary" className="mr-1">
                    {selectedCountryNames[0]}
                  </Badge>
                  <Badge variant="secondary">
                    +{selectedCountryNames.length - 1} more
                  </Badge>
                </>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">Filter by country</span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search countries..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1.5 h-6 w-6 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <span>Loading countries...</span>
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="flex justify-center p-4">
                <span>No countries found</span>
              </div>
            ) : (
              filteredCountries.map(country => (
                <div
                  key={country.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => toggleCountry(country.slug)}
                >
                  <Checkbox
                    id={`country-${country.slug}`}
                    checked={selectedCountries.includes(country.slug)}
                    onCheckedChange={() => toggleCountry(country.slug)}
                  />
                  <label
                    htmlFor={`country-${country.slug}`}
                    className="flex-1 text-sm cursor-pointer flex justify-between"
                  >
                    <span>
                      {country.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({country.listingCount})
                    </span>
                  </label>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="p-2 border-t border-gray-100 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllCountries}
          >
            Clear all
          </Button>
          <Button
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}