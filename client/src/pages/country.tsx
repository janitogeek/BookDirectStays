import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import PropertyCard from "@/components/property-card";
import SubmissionPropertyCard from "@/components/submission-property-card";
import HostFilters, { FilterState } from "@/components/host-filters";
import AnimatedPage from "@/components/animated-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X, ArrowDown } from "lucide-react";
// import { apiRequest } from "@/lib/queryClient";
// import { airtableService } from "@/lib/airtable";
import { dataPreloader } from "@/lib/data-preloader";
import { getRegionSubmissionCounts } from "@/lib/submission-processor";
import { getFlagByCountryName } from "@/lib/utils";
import { useCurrency } from "@/contexts/currency-context";
import { getCurrencyForCountry } from "@/lib/world-currency-extractor";

export default function Country() {
  const [, params] = useRoute('/country/:country');
  const countrySlug = params?.country;
  // const [visibleCount, setVisibleCount] = useState(6);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [regionSearchQuery, setRegionSearchQuery] = useState("");
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
  
  // const queryClient = useQueryClient();

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
  
  // SYSTEMATIC country name resolver that works for ALL countries automatically
  // No hardcoded mappings - handles any country format dynamically
  const getCountryNameFromSlug = async (slug: string) => {
    try {
      console.log(`🔍 SYSTEMATIC: Resolving country name for slug: ${slug}`);
      
      // Step 1: Try to get from cached countries data first
      const countries = await dataPreloader.getCountries();
      const cachedCountry = countries.find(c => c.slug === slug);
      
      if (cachedCountry) {
        console.log(`✅ CACHE HIT: ${slug} → ${cachedCountry.name}`);
        return cachedCountry.name;
      }
      
      // Step 2: Try to find in submissions data (most reliable source)
      const submissions = await dataPreloader.getSubmissions();
      const allCountriesFromSubmissions = new Set<string>();
      
      // Extract ALL unique countries from submissions
      submissions.forEach(submission => {
        if (submission.countries && submission.countries.length > 0) {
          submission.countries.forEach(country => {
            allCountriesFromSubmissions.add(country.trim());
          });
        }
        
        // Also check citiesRegions for country information
        if (submission.citiesRegions && submission.citiesRegions.length > 0) {
          submission.citiesRegions.forEach((cityRegion: any) => {
            if (typeof cityRegion === 'string' && cityRegion.includes(', ')) {
              const parts = cityRegion.split(', ');
              if (parts.length >= 3) {
                const countryFromCity = parts[parts.length - 1].trim(); // Last part is country
                allCountriesFromSubmissions.add(countryFromCity);
              }
            }
          });
        }
      });
      
      console.log(`📊 Found ${allCountriesFromSubmissions.size} unique countries in submissions`);
      
      // Step 3: Find the best match using systematic slug comparison
      const countryArray = Array.from(allCountriesFromSubmissions);
      let bestMatch = null;
      let bestScore = 0;
      
      for (const country of countryArray) {
        // Generate slug from country name
        const countrySlug = country.toLowerCase()
          .replace(/\s+/g, '-')           // Replace spaces with hyphens
          .replace(/[^\w-]/g, '')         // Remove special characters
          .replace(/-+/g, '-')            // Replace multiple hyphens with single
          .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens
        
        // Calculate similarity score
        let score = 0;
        
        // Exact match gets highest score
        if (countrySlug === slug) {
          score = 100;
        }
        // Partial match gets medium score
        else if (countrySlug.includes(slug) || slug.includes(countrySlug)) {
          score = 50;
        }
        // Word-by-word comparison
        else {
          const slugWords = slug.split('-');
          const countryWords = countrySlug.split('-');
          
          let wordMatches = 0;
          slugWords.forEach(slugWord => {
            if (countryWords.some(countryWord => countryWord.includes(slugWord) || slugWord.includes(countryWord))) {
              wordMatches++;
            }
          });
          
          score = (wordMatches / slugWords.length) * 30;
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = country;
        }
      }
      
      if (bestMatch && bestScore > 20) {
        console.log(`✅ SYSTEMATIC MATCH: ${slug} → ${bestMatch} (score: ${bestScore})`);
        return bestMatch;
      }
      
      // Step 4: Smart fallback - convert slug to readable format
      const fallbackName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      console.log(`⚠️ FALLBACK: ${slug} → ${fallbackName}`);
      return fallbackName;
      
    } catch (error) {
      console.error(`❌ SYSTEMATIC RESOLVER ERROR for slug ${slug}:`, error);
      
      // Ultimate fallback - convert slug to readable format
      const ultimateFallback = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      console.log(`🆘 ULTIMATE FALLBACK: ${slug} → ${ultimateFallback}`);
      return ultimateFallback;
    }
  };

  const [countryName, setCountryName] = useState<string>('');
  const [isCountryNameLoading, setIsCountryNameLoading] = useState(true);
  
  // Resolve country name from slug
  useEffect(() => {
    if (countrySlug) {
      setIsCountryNameLoading(true);
      getCountryNameFromSlug(countrySlug)
        .then(setCountryName)
        .finally(() => setIsCountryNameLoading(false));
    }
  }, [countrySlug]);

  // Auto-set currency based on country
  useEffect(() => {
    if (countryName && currencyOptions.length > 0) {
      const countryCurrency = getCurrencyForCountry(countryName);
      console.log(`🌍 Country: ${countryName}, Suggested currency: ${countryCurrency}`);
      console.log('Available currencies:', currencyOptions.map(c => c.code));
      
      // Only set if the currency exists in our options
      if (currencyOptions.some(option => option.code === countryCurrency)) {
        console.log(`✅ Setting currency to ${countryCurrency} for ${countryName}`);
        setSelectedCurrency(countryCurrency);
      } else {
        console.log(`⚠️ Currency ${countryCurrency} not available, keeping current: ${selectedCurrency}`);
      }
    }
  }, [countryName, currencyOptions, setSelectedCurrency]);
  
  // Don't fetch cities until we have the country name
  const shouldFetchCities = Boolean(countryName) && !isCountryNameLoading;
  
  // Fetch validated cities for this country from submissions
  // Fetch cities for this country (instant if cached)  
  const { data: citiesWithCounts = [], isLoading: isCitiesLoading } = useQuery({
    queryKey: ["/api/preloaded-cities", countryName],
    queryFn: () => dataPreloader.getCitiesForCountry(countryName),
    enabled: shouldFetchCities,
    staleTime: 30 * 60 * 1000, // 30 minutes (longer since we have smart caching)
  });

  // Transform cities data to match existing format
  const cities = citiesWithCounts.map(city => city.name);
  const citySubmissionCounts = citiesWithCounts.reduce((acc, city) => {
    acc[city.name] = city.submissionCount;
    return acc;
  }, {} as Record<string, number>);

  // Fetch regions for this country  
  const { data: regionCounts = {}, isLoading: isRegionsLoading } = useQuery({
    queryKey: ["/api/region-counts", countryName],
    queryFn: () => getRegionSubmissionCounts(countryName),
    enabled: shouldFetchCities,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Transform regions data  
  const regions = Object.keys(regionCounts).filter(region => regionCounts[region] > 0);
  
  // Get country data from preloaded cache (instant)
  const { data: allCountries = [], isLoading: isCountryLoading } = useQuery({
    queryKey: ["/api/preloaded-countries-for-country-page"],
    queryFn: () => dataPreloader.getCountries(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
  
  // Find the specific country from preloaded data
  const country = useMemo(() => {
    return allCountries.find(c => c.slug === countrySlug || c.name.toLowerCase() === countryName.toLowerCase());
  }, [allCountries, countrySlug, countryName]);

  // Placeholder listings (instant - no real API call needed)
  const listingsData = { listings: [], total: 0, hasMore: false };
  const isListingsLoading = false;

  // Query submissions for this country
  const { data: submissions = [], isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ["/api/preloaded-submissions", countryName],
    queryFn: () => dataPreloader.getSubmissionsForCountry(countryName),
    enabled: shouldFetchCities,
    staleTime: 30 * 60 * 1000, // 30 minutes (longer since we have smart caching)
    refetchInterval: 60 * 1000, // Refetch every minute
  });





  // Get submission count for a city from the fetched counts
  const getCitySubmissionCount = (cityName: string) => {
    return citySubmissionCounts[cityName] || 0;
  };



  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) {
      return cities;
    }
    
    return cities.filter(city =>
      city.toLowerCase().includes(citySearchQuery.toLowerCase())
    );
  }, [cities, citySearchQuery]);

  const clearCitySearch = () => {
    setCitySearchQuery("");
  };

  // Filter regions based on search query
  const filteredRegions = useMemo(() => {
    if (!regionSearchQuery.trim()) {
      return regions;
    }
    
    return regions.filter(region =>
      region.toLowerCase().includes(regionSearchQuery.toLowerCase())
    );
  }, [regions, regionSearchQuery]);

  const clearRegionSearch = () => {
    setRegionSearchQuery("");
  };

  // Fetch all countries for the tags
  // const { data: countries, isLoading: isCountriesLoading } = useQuery({
  //   queryKey: ["/api/countries"],
  //   queryFn: async () => {
  //     const res = await apiRequest("GET", "/api/countries", undefined);
  //     return res.json();
  //   }
  // });

  // Filter and sort submissions based on active filters
  const filteredSubmissions = useMemo(() => {
    if (!submissions.length) return [];
    
    let filtered = submissions;
    
    // Apply featured filter first
    if (featuredOnly) {
      filtered = filtered.filter(submission => {
        // Check if it's a premium listing (Featured)
        return submission.plan?.includes('Premium') || submission.plan?.includes('€499.99');
      });
    }
    
    const hasActiveFilters = Object.values(filters).some(filterArray => Array.isArray(filterArray) ? filterArray.length > 0 : Boolean(filterArray));
    if (!hasActiveFilters && !featuredOnly) {
      // No filters, just sort
      return sortSubmissions(submissions);
    }

    if (hasActiveFilters) {
      filtered = filtered.filter(submission => {
      // Check keyword search first
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableContent = [
          submission.brandName,
          submission.oneLineDescription,
          submission.whyBookWithYou,
          submission.topStats,
          ...(submission.typesOfStays || []),
          ...(submission.idealFor || []),
          ...(submission.propertiesFeatures || []),
          ...(submission.servicesConvenience || []),
          ...(submission.lifestyleValues || []),
          ...(submission.designStyle || []),
          ...(submission.atmospheres || []),
          ...(submission.settingsLocations || [])
        ].join(' ').toLowerCase();
        
        if (!searchableContent.includes(searchTerm)) return false;
      }

      // Check property types (Types of Stays)
      if (filters.propertyTypes.length > 0) {
        const hasMatchingPropertyType = submission.typesOfStays?.some(type =>
          filters.propertyTypes.includes(type)
        );
        if (!hasMatchingPropertyType) return false;
      }

      // Check ideal for
      if (filters.idealFor.length > 0) {
        const hasMatchingIdealFor = submission.idealFor?.some(ideal =>
          filters.idealFor.includes(ideal)
        );
        if (!hasMatchingIdealFor) return false;
      }

      // Check properties features
      if (filters.propertiesFeatures.length > 0) {
        const hasMatchingFeatures = submission.propertiesFeatures?.some(feature =>
          filters.propertiesFeatures.includes(feature)
        );
        if (!hasMatchingFeatures) return false;
      }

      // Check services & convenience
      if (filters.servicesConvenience.length > 0) {
        const hasMatchingServices = submission.servicesConvenience?.some(service =>
          filters.servicesConvenience.includes(service)
        );
        if (!hasMatchingServices) return false;
      }

      // Check lifestyle & values
      if (filters.lifestyleValues.length > 0) {
        const hasMatchingValues = submission.lifestyleValues?.some(value =>
          filters.lifestyleValues.includes(value)
        );
        if (!hasMatchingValues) return false;
      }

      // Check design style
      if (filters.designStyle.length > 0) {
        const hasMatchingStyle = submission.designStyle?.some(style =>
          filters.designStyle.includes(style)
        );
        if (!hasMatchingStyle) return false;
      }

      // Check atmospheres
      if (filters.atmospheres.length > 0) {
        const hasMatchingAtmosphere = submission.atmospheres?.some(atmosphere =>
          filters.atmospheres.includes(atmosphere)
        );
        if (!hasMatchingAtmosphere) return false;
      }

      // Check settings/locations
      if (filters.settingsLocations.length > 0) {
        const hasMatchingLocation = submission.settingsLocations?.some(location =>
          filters.settingsLocations.includes(location)
        );
        if (!hasMatchingLocation) return false;
      }

      // Check price range filters
      if (filters.minPrice !== null || filters.maxPrice !== null) {
        // Only apply price filters if submission has pricing data
        if (submission.minPrice && submission.maxPrice && submission.currency) {
          const companyMin = submission.minPrice;
          const companyMax = submission.maxPrice;
          
          // If user sets only min price, show companies where max price >= user min
          if (filters.minPrice !== null && filters.maxPrice === null) {
            if (companyMax < filters.minPrice) return false;
          }
          
          // If user sets only max price, show companies where min price <= user max
          if (filters.maxPrice !== null && filters.minPrice === null) {
            if (companyMin > filters.maxPrice) return false;
          }
          
          // If user sets both min and max, check for range overlap
          if (filters.minPrice !== null && filters.maxPrice !== null) {
            // No overlap if company max < user min OR company min > user max
            if (companyMax < filters.minPrice || companyMin > filters.maxPrice) {
              return false;
            }
          }
        } else {
          // If submission doesn't have pricing data, exclude it when price filters are active
          return false;
        }
      }

      return true;
    });
    }
    
    // Sort submissions: Featured first, then alphabetical
    return sortSubmissions(filtered);
  }, [submissions, filters, featuredOnly]);

  // const handleShowMore = () => {
  //   setVisibleCount(prevCount => prevCount + 6);
  // };

  // const hasMore = listingsData?.hasMore || false;
  const totalHosts = (listingsData?.listings?.length || 0) + filteredSubmissions.length;

  // Breadcrumb structured data for AI understanding
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "BookDirectStays.com",
        "item": "https://bookdirectstays.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Countries",
        "item": "https://bookdirectstays.com/#countries"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${country?.name || countryName} Direct Booking Sites`,
        "item": `https://bookdirectstays.com/country/${countrySlug}`
      }
    ]
  };

  // Country-specific structured data
  const countryStructuredData = country ? {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": `${country.name} Vacation Rentals`,
    "description": `Find ${totalHosts} direct booking vacation rental websites in ${country.name}. Skip OTA fees and book directly with property managers.`,
    "url": `https://bookdirectstays.com/country/${countrySlug}`,
    "containsPlace": {
      "@type": "Country",
      "name": country.name,
      "identifier": country.slug
    },
    "touristType": "Vacation Rental Seekers",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${country.name} Direct Booking Vacation Rentals`,
      "numberOfItems": totalHosts
    }
  } : null;

  // Show loading state while resolving country name
  if (isCountryNameLoading) {
    return (
      <AnimatedPage key={`country-${countrySlug}`}>
        <main>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </main>
      </AnimatedPage>
    );
  }

  // Show error state if no country name resolved
  if (!countryName) {
    return (
      <AnimatedPage key={`country-${countrySlug}`}>
        <main>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h1 className="text-2xl font-bold text-red-800 mb-2">Country Not Found</h1>
                <p className="text-red-700">Could not resolve country name for slug: {countrySlug}</p>
              </div>
            </div>
          </div>
        </main>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage key={`country-${countrySlug}`}>
    <main>
      {/* Structured Data for AI Understanding */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
      
      {countryStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(countryStructuredData)
          }}
        />
      )}

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
                <li className="text-white font-semibold flex items-center gap-1">
                  <span className="text-lg">{getFlagByCountryName(country?.name || countryName)}</span>
                  {country?.name || countryName}
                </li>
              </ol>
            </nav>
            
            {isCountryLoading ? (
              <div className="h-12 bg-white/20 w-96 mx-auto rounded animate-pulse mb-6"></div>
            ) : (
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 flex items-center gap-4 justify-center">
                <span className="text-5xl">{getFlagByCountryName(country?.name || countryName)}</span>
                <span>{country?.name || countryName} Vacation Rental Hosts</span>
              </h1>
            )}
            <p className="text-xl text-blue-100 mb-8 text-center">
              Direct booking vacation rental hosts in <span className="inline-flex items-center gap-1">{getFlagByCountryName(country?.name || countryName)} {country?.name || countryName}</span>
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block mx-auto block text-center mb-8">
              <div className="flex items-center space-x-4 justify-center">
                <Badge className="bg-blue-500 text-white">
                  {totalHosts} {totalHosts === 1 ? 'host' : 'hosts'}
                </Badge>
                <span className="text-blue-100">•</span>
                <span className="text-blue-100">Skip OTA fees</span>
                <span className="text-blue-100">•</span>
                <span className="text-blue-100">Book direct</span>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={() => {
                    const element = document.getElementById('region-navigation');
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 text-lg font-semibold flex items-center gap-2 justify-center"
                >
                  Find Hosts by Region/State
                  <ArrowDown className="w-5 h-5" />
                </Button>
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
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 text-lg font-semibold flex items-center gap-2 justify-center"
                >
                  Find Hosts by City
                  <ArrowDown className="w-5 h-5" />
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Host Filters with Currency Selector */}
          <HostFilters 
            onFiltersChange={setFilters}
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
          />

          {/* Featured Only Toggle */}
          <div className="mb-6">
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
          </div>

          {/* Property Manager Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isListingsLoading || isSubmissionsLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                      <div className="h-6 bg-gray-300 w-2/3 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-300 w-1/2 mb-3 rounded"></div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="h-6 bg-gray-300 w-16 rounded"></div>
                      <div className="h-6 bg-gray-300 w-20 rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      </div>
                      <div className="h-10 bg-gray-300 w-32 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : totalHosts === 0 ? (
              <div className="col-span-3 text-center py-16">
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 inline-block mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No hosts found for {country?.name || countryName}</h3>
                  <p className="text-gray-500 mb-6">We couldn't find any direct booking sites for this country.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      asChild
                      variant="outline" 
                      className="border-blue-600 text-blue-600"
                    >
                      <Link href="/">
                        View all countries
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Display approved submissions first */}
                {filteredSubmissions.map((submission) => (
                  <SubmissionPropertyCard 
                    key={`submission-${submission.id}`} 
                    submission={submission} 
                    fromCountry={countryName}
                  />
                ))}
                
                {/* Display existing listings */}
                {listingsData?.listings?.map((listing: any) => (
                  <PropertyCard key={`listing-${listing.id}`} property={listing} />
                ))}
              </>
            )}
          </div>
          
          {/* Show More Button - Currently disabled */}
          {/* {hasMore && (
            <div className="mt-10 text-center">
              <Button 
                variant="outline"
                className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition"
                onClick={handleShowMore}
              >
                Show More
              </Button>
            </div>
          )} */}
        </div>
      </section>

      {/* Region Navigation Section */}
        <section id="region-navigation" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                  <span>Find Hosts by Region/State in</span> 
                  <span className="inline-flex items-center gap-2">
                    <span className="text-4xl">{getFlagByCountryName(country?.name || countryName)}</span>
                    {country?.name || countryName}
                  </span>
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Browse hosts by region or state to discover your perfect accommodation
                </p>
              </div>
              
              {/* Region Search */}
              <div className="mb-8">
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search regions/states..."
                    className="pl-10 pr-10"
                    value={regionSearchQuery}
                    onChange={(e) => setRegionSearchQuery(e.target.value)}
                  />
                  {regionSearchQuery && (
                    <button
                      onClick={clearRegionSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Regions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {isRegionsLoading ? (
                  // Loading skeletons
                  Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="h-20 bg-gray-300 rounded animate-pulse"></div>
                  ))
                ) : filteredRegions.length === 0 && regionSearchQuery ? (
                  <div className="col-span-full text-center py-8">
                    <div className="text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-xl font-semibold mb-2">No regions found</h3>
                      <p>Try searching for a different region name.</p>
                      <Button 
                        variant="outline" 
                        onClick={clearRegionSearch}
                        className="mt-4"
                      >
                        Clear search
                      </Button>
                    </div>
                  </div>
                ) : filteredRegions.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <div className="text-gray-500">
                      <h3 className="text-xl font-semibold mb-2">No regions found</h3>
                      <p>This country doesn't have region data yet.</p>
                    </div>
                  </div>
                ) : (
                  filteredRegions.map((region, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                      <CardContent className="p-4">
                        <Link 
                          href={`/country/${countrySlug}/region/${region.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-center"
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-lg">🏛️</span>
                            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              {region}
                            </h3>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {regionCounts[region]} {regionCounts[region] === 1 ? 'host' : 'hosts'}
                          </Badge>
                        </Link>
                      </CardContent>
                    </Card>
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
                    <span className="text-4xl">{getFlagByCountryName(country?.name || countryName)}</span>
                    {country?.name || countryName}
                  </span>
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Looking for something more specific? Browse hosts by city
                </p>
              

                
                {/* City Search Input */}
                {cities.length > 0 && (
                  <div className="max-w-md mx-auto mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Search for a city..."
                        value={citySearchQuery}
                        onChange={(e) => setCitySearchQuery(e.target.value)}
                        className="pl-10 pr-10 py-3"
                      />
                      {citySearchQuery && (
                        <button
                          onClick={clearCitySearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {isCitiesLoading ? (
                  // Loading skeleton
                  Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4">
                        <div className="animate-pulse text-center">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                          <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : cities.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-yellow-800 font-medium mb-2">No cities found for this country yet.</p>
                    <p className="text-yellow-700 text-sm mb-4">
                      This usually means either:
                    </p>
                    <ul className="text-yellow-700 text-sm text-left max-w-md mx-auto space-y-1">
                      <li>• No submissions have been approved yet for this country</li>
                      <li>• The city data hasn't been processed yet</li>
                      <li>• There might be a data processing issue</li>
                    </ul>
                    <p className="text-yellow-700 text-sm mt-4">
                      Check the console for debugging information.
                    </p>
                  </div>
                  </div>
                ) : filteredCities.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <div className="text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-xl font-semibold mb-2">No cities found</h3>
                      <p>Try searching for a different city name.</p>
                      {citySearchQuery && (
                        <Button 
                          variant="outline" 
                          onClick={clearCitySearch}
                          className="mt-4"
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  filteredCities.map((city, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                      <CardContent className="p-4">
                        <Link 
                          href={`/country/${countrySlug}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-center"
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-lg">📍</span>
                            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              {city}
                            </h3>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {getCitySubmissionCount(city)} {getCitySubmissionCount(city) === 1 ? 'host' : 'hosts'}
                          </Badge>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">
                  Can't find your city or region?
                </p>
                <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Link href="/submit">
                    Add Your Direct Booking Site
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
    </main>
    </AnimatedPage>
  );
}
