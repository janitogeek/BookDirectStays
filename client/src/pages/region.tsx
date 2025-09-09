import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import SubmissionPropertyCard from "@/components/submission-property-card";
import HostFilters, { FilterState } from "@/components/host-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowDown } from "lucide-react";
import { dataPreloader } from "@/lib/data-preloader";
import { getCitiesForCountryFromGeonamesRecord } from "@/lib/geonames-record-parser";
import { airtableService } from "@/lib/airtable";
import { getFlagByCountryName } from "@/lib/utils";
import { useCurrency } from "@/contexts/currency-context";
import { getCurrencyForCountry } from "@/lib/world-currency-extractor";

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
  
  // Query submissions for this country to extract cities in this region
  const { data: submissions = [], isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ["/api/region-submissions", countryName, regionName],
    queryFn: async () => {
      const allSubmissions = await airtableService.getApprovedSubmissions();
      
      // Filter submissions that have cities in this region
      return allSubmissions.filter(submission => {
        if (!submission.geonamesRecord) return false;
        
        // Parse geonames record to find cities in this region and country
        const records = submission.geonamesRecord.split(';').map(record => record.trim());
        
        return records.some(record => {
          const parts = record.split(',').map(part => part.trim());
          if (parts.length === 3) {
            const [city, region, country] = parts;
            return country.toLowerCase() === countryName.toLowerCase() && 
                   region.toLowerCase() === regionName.toLowerCase();
          }
          return false;
        });
      });
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

  // Sort function: Featured first, then alphabetical by brand name
  const sortSubmissions = (submissionsToSort: any[]) => {
    return submissionsToSort.sort((a, b) => {
      // Check if either is featured/premium
      const aIsPremium = a.plan?.includes('Premium') || a.plan?.includes('€499.99');
      const bIsPremium = b.plan?.includes('Premium') || b.plan?.includes('€499.99');
      
      // Featured first
      if (aIsPremium && !bIsPremium) return -1;
      if (!aIsPremium && bIsPremium) return 1;
      
      // Then alphabetical by brand name
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
        
        const submissionMinPrice = minPrice || 0;
        const submissionMaxPrice = maxPrice || Number.MAX_VALUE;
        
        const filterMinPrice = filters.minPrice || 0;
        const filterMaxPrice = filters.maxPrice || Number.MAX_VALUE;
        
        return submissionMaxPrice >= filterMinPrice && submissionMinPrice <= filterMaxPrice;
      });
    }

    return sortSubmissions(result);
  }, [submissions, filters, featuredOnly]);

  const totalHosts = submissions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link href={`/country/${countrySlug}`} className="hover:text-blue-600">
                {getFlagByCountryName(countryName)} {countryName}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{regionName}</span>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold flex items-center gap-3 justify-center">
                <span className="text-4xl">🏛️</span>
                <span>
                  {regionName}, {countryName} Direct Booking Sites
                  <span className="text-gray-500 text-lg ml-2">({totalHosts} {totalHosts === 1 ? 'host' : 'hosts'})</span>
                </span>
              </h1>
            </div>
              
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
              currencyOptions={currencyOptions}
              featuredOnly={featuredOnly}
              onFeaturedChange={setFeaturedOnly}
            />
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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <span>Find Hosts by City in</span> 
                <span className="inline-flex items-center gap-2">
                  <span className="text-lg">🏛️</span>
                  {regionName}
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Browse hosts in specific cities within {regionName}
              </p>
            </div>
            
            {/* City Search */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search cities..."
                  className="pl-10 pr-10"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                />
                {citySearchQuery && (
                  <button
                    onClick={clearCitySearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Cities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {filteredCities.length === 0 && citySearchQuery ? (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">No cities found</h3>
                    <p>Try searching for a different city name.</p>
                    <Button 
                      variant="outline" 
                      onClick={clearCitySearch}
                      className="mt-4"
                    >
                      Clear search
                    </Button>
                  </div>
                </div>
              ) : filteredCities.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-500">
                    <h3 className="text-xl font-semibold mb-2">No cities found</h3>
                    <p>This region doesn't have city data yet.</p>
                  </div>
                </div>
              ) : (
                filteredCities.map((city, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <Link 
                        href={`/country/${countrySlug}/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block text-center"
                      >
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-lg">📍</span>
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {city.name}
                          </h3>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {city.count} {city.count === 1 ? 'host' : 'hosts'}
                        </Badge>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                Don't see your city? <Link href="/submit" className="text-blue-600 hover:underline">Add your host site</Link> and we'll include it!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
