import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import BudgetRangeSlider from "@/components/budget-range-slider";
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
  "Villas", "Cabins", "Apartments", "Domes", "Chalets", "Houses", "Guesthouses", "Hostels", "Tents", "Rooms", "Bungalows", "Hotels", "Condos", "Campervans"
];

const IDEAL_FOR = [
  "Families", "Digital Nomads", "Retreats", "Couples", "Groups", "Companies", "Solo travelers", "Seniors/Elderly"
];

const PROPERTIES_FEATURES = [
  "Pool", "Hot Tub/Jacuzzi", "Garden/Outdoor Space", "Balcony/Terrace", "Fireplace", 
  "Air Conditioning", "Heating", "Washer", "Dryer", "Kitchen/Kitchenette", "Dishwasher", 
  "BBQ/Grill", "Parking", "Garage", "EV Charging", "Hair dryer", "Iron", "WiFi", "Dedicated workspace"
];

const SERVICES_CONVENIENCE = [
  "Self check-in", "Concierge", "Early check-in", "Late check-out", "Mid-stay cleaning", 
  "Breakfast included", "Room service", "Luggage storage", "Airport transfer", "Car rental", 
  "Bike rental", "Grocery delivery", "24/7 Support"
];

const LIFESTYLE_VALUES = [
  "Pet-friendly", "Eco-friendly", "Smoking friendly", "Family-friendly", "Adults only", 
  "LGBTQ+ friendly", "Wheelchair accessible", "Quiet/Peaceful", "Party-friendly", 
  "Luxury amenities", "Budget-friendly", "Sustainable practices", "Remote-work friendly"
];

const DESIGN_STYLE = [
  "Modern", "Minimalist", "Design-led/Contemporary", "Traditional/Classic", "Industrial", 
  "Scandinavian", "Mid-century Modern", "Art Deco"
];

const ATMOSPHERES = [
  "Boho/Bohemian", "Rustic/Countryside", "Luxury/Upscale", "Cozy/Intimate", "Bright/Airy", 
  "Romantic", "Artistic/Creative", "Zen/Peaceful"
];

const SETTINGS_LOCATIONS = [
  "Urban/City", "Beach/Coastal", "Mountain/Alpine", "Forest/Nature", "Historic/Heritage", 
  "Countryside/Rural", "Wine Country", "Desert/Unique Landscape"
];

interface HostFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  propertyTypes: string[];
  idealFor: string[];
  propertiesFeatures: string[];
  servicesConvenience: string[];
  lifestyleValues: string[];
  designStyle: string[];
  atmospheres: string[];
  settingsLocations: string[];
  minPrice: number | null;
  maxPrice: number | null;
}

export default function HostFilters({ onFiltersChange }: HostFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    propertyTypes: [],
    idealFor: [],
    propertiesFeatures: [],
    servicesConvenience: [],
    lifestyleValues: [],
    designStyle: [],
    atmospheres: [],
    settingsLocations: [],
    minPrice: null,
    maxPrice: null
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

  const updatePriceRange = (min: number | null, max: number | null) => {
    const newFilters = { ...filters };
    newFilters.minPrice = min;
    newFilters.maxPrice = max;
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      search: "",
      propertyTypes: [],
      idealFor: [],
      propertiesFeatures: [],
      servicesConvenience: [],
      lifestyleValues: [],
      designStyle: [],
      atmospheres: [],
      settingsLocations: [],
      minPrice: null,
      maxPrice: null
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
    filters.propertiesFeatures.length + 
    filters.servicesConvenience.length + 
    filters.lifestyleValues.length + 
    filters.designStyle.length + 
    filters.atmospheres.length + 
    filters.settingsLocations.length + 
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

        {/* Budget Range Slider */}
        <BudgetRangeSlider
          minValue={filters.minPrice}
          maxValue={filters.maxPrice}
          onRangeChange={updatePriceRange}
          className="px-2"
        />

        {/* Filter Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
            "Properties Features", 
            PROPERTIES_FEATURES, 
            "propertiesFeatures", 
            openFilter === "propertiesFeatures"
          )}
          {renderFilterPopover(
            "Services & Convenience", 
            SERVICES_CONVENIENCE, 
            "servicesConvenience", 
            openFilter === "servicesConvenience"
          )}
          {renderFilterPopover(
            "Lifestyle & Values", 
            LIFESTYLE_VALUES, 
            "lifestyleValues", 
            openFilter === "lifestyleValues"
          )}
          {renderFilterPopover(
            "Design Style", 
            DESIGN_STYLE, 
            "designStyle", 
            openFilter === "designStyle"
          )}
          {renderFilterPopover(
            "Atmospheres", 
            ATMOSPHERES, 
            "atmospheres", 
            openFilter === "atmospheres"
          )}
          {renderFilterPopover(
            "Settings/Locations", 
            SETTINGS_LOCATIONS, 
            "settingsLocations", 
            openFilter === "settingsLocations"
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