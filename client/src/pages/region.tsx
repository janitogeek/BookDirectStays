import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import SubmissionPropertyCard from "@/components/submission-property-card";
import HostFilters, { FilterState } from "@/components/host-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowDown } from "lucide-react";
import { dataPreloader } from "@/lib/data-preloader";
import { getCitiesForCountryFromGeonamesRecord } from "@/lib/geonames-record-parser";
import { getFlagByCountryName } from "@/lib/utils";
import { useCurrency } from "@/contexts/currency-context";
import { getCurrencyForCountry } from "@/lib/world-currency-extractor";
import { convertCurrency } from "@/lib/currency-utils";
import AlphabeticalDirectory from "@/components/alphabetical-directory";

export default function Region() {
  const [, params] = useRoute('/country/:country/region/:region');
  const countrySlug = params?.country;
  const regionSlug = params?.region;
  
  const [citySearchQuery, setCitySearchQuery] = useState("");
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
  
  // Featured filter state
  const [featuredOnly, setFeaturedOnly] = useState(false);
  
  // Price sorting state
  const [priceSorting, setPriceSorting] = useState<'none' | 'least-expensive' | 'most-expensive'>('none');
  
  // Currency context
  const { selectedCurrency, setSelectedCurrency, currencyOptions, isLoading: currencyLoading } = useCurrency();
  
  // Convert slug to display names
  const countryName = useMemo(() => {
    if (!countrySlug) return "";
    return countrySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, [countrySlug]);
  
  const regionName = useMemo(() => {
    if (!regionSlug) return "";
    return regionSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, [regionSlug]);

  // Set currency based on country when country changes
  useEffect(() => {
    if (countryName && !currencyLoading) {
      const countryCurrency = getCurrencyForCountry(countryName);
      if (currencyOptions.some(option => option.code === countryCurrency)) {
        console.log(`✅ Setting currency to ${countryCurrency} for ${countryName}`);
        setSelectedCurrency(countryCurrency);
      } else {
        console.log(`⚠️ Currency ${countryCurrency} not available, keeping current: ${selectedCurrency}`);
      }
    }
  }, [countryName, currencyOptions, setSelectedCurrency]);
  
  // Query submissions for this region
  const { data: submissions = [], isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ["/api/region-submissions", countryName, regionName],
    queryFn: async () => {
      // Use dataPreloader for better caching and reliability
      const allSubmissions = await dataPreloader.getSubmissionsForCountry(countryName);
      
      console.log(`🏛️ Region ${regionName} - Total submissions for ${countryName}:`, allSubmissions.length);
      
      // Filter submissions that have cities in this region
      const regionSubmissions = allSubmissions.filter(submission => {
        // Check geonamesRecord first (preferred)
        if (submission.geonamesRecord) {
          const records = submission.geonamesRecord.split(';').map(record => record.trim());
          
          const hasRegionMatch = records.some(record => {
            const parts = record.split(',').map(part => part.trim());
            if (parts.length === 3) {
              const [city, region, country] = parts;
              return country.toLowerCase() === countryName.toLowerCase() && 
                     region.toLowerCase() === regionName.toLowerCase();
            }
            return false;
          });
          
          if (hasRegionMatch) return true;
        }
        
        // Fallback to legacy fields for older submissions
        if (submission.regionsStates && submission.countries) {
          const matchesCountry = submission.countries.some(country => 
            country.toLowerCase() === countryName.toLowerCase()
          );
          const matchesRegion = submission.regionsStates.some(region => 
            region.toLowerCase() === regionName.toLowerCase()
          );
          return matchesCountry && matchesRegion;
        }
        
        return false;
      });
      
      console.log(`🏛️ Region ${regionName} - Filtered submissions:`, regionSubmissions.length);
      return regionSubmissions;
    },
    enabled: Boolean(countryName && regionName),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Extract cities in this region from submissions
  const citiesInRegion = useMemo(() => {
    const cityCountMap: Record<string, number> = {};
    
    submissions.forEach(submission => {
      if (submission.geonamesRecord) {
        const cities = getCitiesForCountryFromGeonamesRecord(submission.geonamesRecord, countryName);
        
        // Filter cities that are in this region
        const records = submission.geonamesRecord.split(';').map(record => record.trim());
        records.forEach(record => {
          const parts = record.split(',').map(part => part.trim());
          if (parts.length === 3) {
            const [city, region, country] = parts;
            if (country.toLowerCase() === countryName.toLowerCase() && 
                region.toLowerCase() === regionName.toLowerCase()) {
              cityCountMap[city] = (cityCountMap[city] || 0) + 1;
            }
          }
        });
      }
    });
    
    return Object.entries(cityCountMap).map(([name, count]) => ({ name, count }));
  }, [submissions, countryName, regionName]);

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) return citiesInRegion;
    return citiesInRegion.filter(city => 
      city.name.toLowerCase().includes(citySearchQuery.toLowerCase())
    );
  }, [citiesInRegion, citySearchQuery]);

  // Clear city search
  const clearCitySearch = () => setCitySearchQuery("");

  // Sort function: Featured first, then price or alphabetical
  const sortSubmissions = (submissionsToSort: any[]) => {
    return submissionsToSort.sort((a, b) => {
      // Check if either is featured/premium
      const aIsPremium = a.plan?.includes('Premium') || a.plan?.includes('€499.99');
      const bIsPremium = b.plan?.includes('Premium') || b.plan?.includes('€499.99');
      
      // Featured first
      if (aIsPremium && !bIsPremium) return -1;
      if (!aIsPremium && bIsPremium) return 1;
      
      // Then sort by price if price sorting is enabled
      if (priceSorting !== 'none') {
        if (priceSorting === 'least-expensive' && a.minPrice && b.minPrice && a.currency && b.currency) {
          const aMinPrice = convertCurrency(a.minPrice, a.currency, selectedCurrency);
          const bMinPrice = convertCurrency(b.minPrice, b.currency, selectedCurrency);
          return aMinPrice - bMinPrice; // Least expensive first
        } else if (priceSorting === 'most-expensive' && a.maxPrice && b.maxPrice && a.currency && b.currency) {
          const aMaxPrice = convertCurrency(a.maxPrice, a.currency, selectedCurrency);
          const bMaxPrice = convertCurrency(b.maxPrice, b.currency, selectedCurrency);
          return bMaxPrice - aMaxPrice; // Most expensive first (using max prices)
        }
      }
      
      // Finally alphabetical by brand name
      return a.brandName.localeCompare(b.brandName);
    });
  };

  // Apply filters and sorting to submissions
  const filteredSubmissions = useMemo(() => {
    let result = [...submissions];

    // Apply featured filter
    if (featuredOnly) {
      result = result.filter(submission => 
        submission.plan?.includes('Premium') || submission.plan?.includes('€499.99')
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(submission =>
        submission.brandName.toLowerCase().includes(searchTerm) ||
        submission.oneLineDescription.toLowerCase().includes(searchTerm)
      );
    }

    // Apply other filters
    if (filters.propertyTypes.length > 0) {
      result = result.filter(submission =>
        filters.propertyTypes.some(type =>
          submission.typesOfStays?.includes(type)
        )
      );
    }

    if (filters.idealFor.length > 0) {
      result = result.filter(submission =>
        filters.idealFor.some(ideal =>
          submission.idealFor?.includes(ideal)
        )
      );
    }

    if (filters.propertiesFeatures.length > 0) {
      result = result.filter(submission =>
        filters.propertiesFeatures.some(feature =>
          submission.propertiesFeatures?.includes(feature)
        )
      );
    }

    if (filters.servicesConvenience.length > 0) {
      result = result.filter(submission =>
        filters.servicesConvenience.some(service =>
          submission.servicesConvenience?.includes(service)
        )
      );
    }

    if (filters.lifestyleValues.length > 0) {
      result = result.filter(submission =>
        filters.lifestyleValues.some(lifestyle =>
          submission.lifestyleValues?.includes(lifestyle)
        )
      );
    }

    if (filters.designStyle.length > 0) {
      result = result.filter(submission =>
        filters.designStyle.some(design =>
          submission.designStyle?.includes(design)
        )
      );
    }

    if (filters.atmospheres.length > 0) {
      result = result.filter(submission =>
        filters.atmospheres.some(atmosphere =>
          submission.atmospheres?.includes(atmosphere)
        )
      );
    }

    if (filters.settingsLocations.length > 0) {
      result = result.filter(submission =>
        filters.settingsLocations.some(setting =>
          submission.settingsLocations?.includes(setting)
        )
      );
    }

    // Apply price filters
    if (filters.minPrice !== null || filters.maxPrice !== null) {
      result = result.filter(submission => {
        const minPrice = submission.minPrice;
        const maxPrice = submission.maxPrice;
        
        if (!minPrice && !maxPrice) return false;
        
        // Convert submission prices to the selected currency for comparison
        // Extract currency code from formats like "USD – $", "THB – ฿", "EUR – €"
        const submissionCurrency = (() => {
          if (!submission.currency) return 'USD';
          
          // Try to extract currency code from the beginning of the string
          const currencyMatch = submission.currency.match(/^([A-Z]{3})/);
          if (currencyMatch) {
            return currencyMatch[1];
          }
          
          // Fallback to checking for common currencies
          if (submission.currency.includes('USD')) return 'USD';
          if (submission.currency.includes('EUR')) return 'EUR';
          if (submission.currency.includes('GBP')) return 'GBP';
          if (submission.currency.includes('THB')) return 'THB';
          if (submission.currency.includes('INR')) return 'INR';
          if (submission.currency.includes('JPY')) return 'JPY';
          if (submission.currency.includes('RUB')) return 'RUB';
          
          return 'USD'; // Final fallback
        })();
        
        const submissionMinConverted = convertCurrency(minPrice || 0, submissionCurrency, selectedCurrency);
        const submissionMaxConverted = convertCurrency(maxPrice || Number.MAX_VALUE, submissionCurrency, selectedCurrency);
        
        const filterMinPrice = filters.minPrice || 0;
        const filterMaxPrice = filters.maxPrice || Number.MAX_VALUE;
        
        return submissionMaxConverted >= filterMinPrice && submissionMinConverted <= filterMaxPrice;
      });
    }

    return sortSubmissions(result);
  }, [submissions, filters, featuredOnly]);

  const totalHosts = submissions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-blue-200">
                <li>
                  <Link href="/find-host" className="hover:text-white transition-colors">
                    Find a Host
                  </Link>
                </li>
                <li className="text-blue-300">›</li>
                <li>
                  <Link href={`/country/${countrySlug}`} className="hover:text-white transition-colors inline-flex items-center gap-1">
                    {getFlagByCountryName(countryName)} {countryName}
                  </Link>
                </li>
                <li className="text-blue-300">›</li>
                <li className="text-white font-semibold">{regionName}</li>
              </ol>
            </nav>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 flex items-center gap-4">
              <span className="text-5xl">🏛️</span>
              <span>{regionName} Vacation Rental Hosts</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Direct booking vacation rental hosts in {regionName}, <span className="inline-flex items-center gap-1">{getFlagByCountryName(countryName)} {countryName}</span>
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
              <div className="flex items-center space-x-4">
                <Badge className="bg-blue-500 text-white">
                  {totalHosts} {totalHosts === 1 ? 'host' : 'hosts'}
                </Badge>
                <span className="text-blue-100">•</span>
                <span className="text-blue-100">Skip OTA fees</span>
                <span className="text-blue-100">•</span>
                <span className="text-blue-100">Book direct</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
              
            {/* City Navigation Button */}
            <div className="flex justify-center mb-8">
                <Button 
                  onClick={() => {
                    const element = document.getElementById('city-navigation');
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold flex items-center gap-2"
                >
                  Find Hosts by City
                  <ArrowDown className="w-5 h-5" />
                </Button>
            </div>
            
            {/* Host Filters with Currency Selector */}
            <HostFilters 
              onFiltersChange={setFilters}
              selectedCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
              submissions={submissions}
            />

            {/* Featured Only Toggle and Price Sorting */}
            <div className="mt-6 mb-6 flex flex-wrap items-center gap-4">
              <Button
                variant={featuredOnly ? "default" : "outline"}
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`${
                  featuredOnly 
                    ? "bg-yellow-500 hover:bg-yellow-600 text-yellow-900 border-yellow-500" 
                    : "border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                }`}
              >
                {featuredOnly ? "✓ Featured Only" : "Featured Only"}
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <Select value={priceSorting} onValueChange={(value) => setPriceSorting(value as typeof priceSorting)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Default</SelectItem>
                    <SelectItem value="least-expensive">Least Expensive</SelectItem>
                    <SelectItem value="most-expensive">Most Expensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submissions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Submissions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isSubmissionsLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="h-64 bg-gray-300 rounded-lg animate-pulse"></div>
                ))
              ) : filteredSubmissions.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">
                    <h3 className="text-xl font-semibold mb-2">No hosts found</h3>
                    <p>Try adjusting your filters or search criteria.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                      <Button 
                        asChild
                        variant="outline" 
                        className="border-blue-600 text-blue-600"
                      >
                        <Link href={`/country/${countrySlug}`} className="inline-flex items-center gap-1">
                          View all {getFlagByCountryName(countryName)} {countryName} hosts
                        </Link>
                      </Button>
                      <Button 
                        asChild
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Link href="/submit">
                          Add Your Host Site
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                filteredSubmissions.map((submission) => (
                  <SubmissionPropertyCard 
                    key={`submission-${submission.id}`} 
                    submission={submission} 
                    fromRegion={regionName}
                    fromCountry={countryName}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* City Navigation Section */}
      <section id="city-navigation" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <AlphabeticalDirectory
              title={`Find Hosts by City in 🏛️ ${regionName}`}
              description={`Browse hosts in specific cities within ${regionName}`}
              items={citiesInRegion.map(city => ({
                name: city.name,
                slug: city.name.toLowerCase().replace(/\s+/g, '-'),
                count: city.count,
                href: `/country/${countrySlug}/${city.name.toLowerCase().replace(/\s+/g, '-')}`
              }))}
              searchPlaceholder="Search cities..."
              emptyStateTitle="No cities found"
              emptyStateDescription="This region doesn't have city data yet."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
