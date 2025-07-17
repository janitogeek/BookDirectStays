import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { ChevronDown, Filter, X, Info, Search } from "lucide-react";

// Filter options based on submission form data
const PROPERTY_TYPES = [
  "Villas", "Cabins", "Apartments", "Domes", "Chalets", "Beach Houses"
];

const IDEAL_FOR = [
  "Families", "Digital Nomads", "Retreats", "Couples", "Groups", "Companies", "Solo travelers"
];

const PERKS_AMENITIES = [
  "Pool", "Breakfast", "Self check-in", "WiFi", "Parking", "Pet-friendly", 
  "Eco-friendly", "Remote-work friendly", "Smoking friendly", "Concierge", 
  "Early check-in", "Late check-out", "Mid-stay cleaning"
];

const VIBE_AESTHETIC = [
  "Boho", "Minimalist", "Design-led", "Rustic", "Modern"
];

interface HostFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  propertyTypes: string[];
  idealFor: string[];
  perksAmenities: string[];
  vibeAesthetic: string[];
}

export default function HostFilters({ onFiltersChange }: HostFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    propertyTypes: [],
    idealFor: [],
    perksAmenities: [],
    vibeAesthetic: []
  });

  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const updateFilter = (category: keyof FilterState, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    
    if (category === 'search') {
      newFilters.search = value;
    } else {
      if (checked) {
        (newFilters[category] as string[]) = [...(newFilters[category] as string[]), value];
      } else {
        (newFilters[category] as string[]) = (newFilters[category] as string[]).filter(item => item !== value);
      }
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      search: "",
      propertyTypes: [],
      idealFor: [],
      perksAmenities: [],
      vibeAesthetic: []
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setOpenFilter(null);
  };

  const removeFilter = (category: keyof FilterState, value: string) => {
    updateFilter(category, value, false);
  };

  const clearSearch = () => {
    updateFilter('search', '', false);
  };

  const totalActiveFilters = 
    filters.propertyTypes.length + 
    filters.idealFor.length + 
    filters.perksAmenities.length + 
    filters.vibeAesthetic.length + 
    (filters.search ? 1 : 0);

  const renderFilterPopover = (
    title: string,
    options: string[],
    category: keyof FilterState,
    isOpen: boolean
  ) => (
    <Popover 
      open={isOpen} 
      onOpenChange={(open) => setOpenFilter(open ? category : null)}
    >
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`justify-between ${filters[category].length > 0 ? 'border-blue-500 bg-blue-50' : ''}`}
        >
          <span className="flex items-center gap-2">
            {title}
            {filters[category].length > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {filters[category].length}
              </Badge>
            )}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="font-medium">{title}</div>
          <ScrollArea className="h-60">
            <div className="space-y-2">
              {options.map(option => (
                <label 
                  key={option} 
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <Checkbox
                    checked={filters[category].includes(option)}
                    onCheckedChange={(checked) => 
                      updateFilter(category, option, checked as boolean)
                    }
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-between pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const emptyCategory = { ...filters, [category]: [] };
                setFilters(emptyCategory);
                onFiltersChange(emptyCategory);
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setOpenFilter(null)}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Hosts
            {totalActiveFilters > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {totalActiveFilters}
              </Badge>
            )}
          </CardTitle>
          {totalActiveFilters > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search hosts by name, description, amenities..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value, false)}
            className="pl-10 pr-10"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {renderFilterPopover(
            "Property Types", 
            PROPERTY_TYPES, 
            "propertyTypes", 
            openFilter === "propertyTypes"
          )}
          {renderFilterPopover(
            "Ideal For", 
            IDEAL_FOR, 
            "idealFor", 
            openFilter === "idealFor"
          )}
          {renderFilterPopover(
            "Perks & Amenities", 
            PERKS_AMENITIES, 
            "perksAmenities", 
            openFilter === "perksAmenities"
          )}
          {renderFilterPopover(
            "Vibe & Aesthetic", 
            VIBE_AESTHETIC, 
            "vibeAesthetic", 
            openFilter === "vibeAesthetic"
          )}
        </div>

        {/* Active Filters */}
        {totalActiveFilters > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Active Filters:</div>
              <div className="flex flex-wrap gap-2">
                {/* Search filter */}
                {filters.search && (
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 text-green-800 flex items-center gap-1"
                  >
                    <Search className="h-3 w-3" />
                    "{filters.search}"
                    <button
                      onClick={clearSearch}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {/* Category filters */}
                {Object.entries(filters).map(([category, values]) => {
                  if (category === 'search' || !Array.isArray(values)) return null;
                  return values.map((value: string) => (
                    <Badge 
                      key={`${category}-${value}`} 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-800 flex items-center gap-1"
                    >
                      {value}
                      <button
                        onClick={() => removeFilter(category as keyof FilterState, value)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                })}
              </div>
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Important Note:</p>
              <p>
                Features shown apply to some listings offered by each host (not all). 
                For exact details, visit the host's website.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 