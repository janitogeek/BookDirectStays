import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import PropertyCard from "@/components/property-card";
import SubmissionPropertyCard from "@/components/submission-property-card";
import CountryTags from "@/components/country-tags";
import HostFilters, { FilterState } from "@/components/host-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { airtableService } from "@/lib/airtable";
import { getValidatedCitiesForCountry, getCitySubmissionCounts } from "@/lib/submission-processor";
import { getFlagByCountryName } from "@/lib/utils";

export default function Country() {
  const [, params] = useRoute('/country/:country');
  const countrySlug = params?.country;
  const [visibleCount, setVisibleCount] = useState(6);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    propertyTypes: [],
    idealFor: [],
    perksAmenities: [],
    vibeAesthetic: []
  });
  
  // Map country slugs to full country names for Airtable matching
  const getCountryNameFromSlug = (slug: string) => {
    const countryMap: { [key: string]: string } = {
      usa: 'United States',
      spain: 'Spain',
      uk: 'United Kingdom',
      germany: 'Germany',
      france: 'France',
      australia: 'Australia',
      canada: 'Canada',
      italy: 'Italy',
      portugal: 'Portugal',
      thailand: 'Thailand',
      greece: 'Greece',
      netherlands: 'Netherlands',
      switzerland: 'Switzerland',
      austria: 'Austria',
      belgium: 'Belgium',
      croatia: 'Croatia',
      'czech-republic': 'Czech Republic',
      denmark: 'Denmark',
      finland: 'Finland',
      hungary: 'Hungary',
      ireland: 'Ireland',
      norway: 'Norway',
      poland: 'Poland',
      sweden: 'Sweden',
      turkey: 'Turkey',
      albania: 'Albania'
    };
    return countryMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  const countryName = getCountryNameFromSlug(countrySlug || '');
  
  // Fetch validated cities for this country from submissions
  const { data: cities = [], isLoading: isCitiesLoading } = useQuery({
    queryKey: [`/api/validated-cities/${countryName}`],
    queryFn: () => getValidatedCitiesForCountry(countryName),
    enabled: !!countryName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch city submission counts
  const { data: citySubmissionCounts = {}, isLoading: isCityCountsLoading } = useQuery({
    queryKey: [`/api/city-submission-counts/${countryName}`],
    queryFn: () => getCitySubmissionCounts(countryName),
    enabled: !!countryName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch country
  const { data: country, isLoading: isCountryLoading } = useQuery({
    queryKey: [`/api/countries/${countrySlug}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/countries/${countrySlug}`, undefined);
      return res.json();
    },
    enabled: !!countrySlug
  });

  // Fetch listings for this country
  const { data: listingsData, isLoading: isListingsLoading } = useQuery({
    queryKey: [`/api/listings?country=${countrySlug}`, visibleCount],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/listings?country=${countrySlug}&limit=${visibleCount}`, undefined);
      return res.json();
    },
    enabled: !!countrySlug
  });

  // Query submissions for this country
  const { data: submissions = [], isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ['submissions', countrySlug],
    queryFn: () => airtableService.getSubmissionsByCountry(countryName),
    enabled: !!countryName,
    staleTime: 30 * 1000, // 30 seconds - back to normal
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  // Debug submissions in React component
  console.log('🎬 React component - submissions data:', submissions);
  console.log('🎬 React component - submissions length:', submissions.length);
  console.log('🎬 React component - isSubmissionsLoading:', isSubmissionsLoading);
  console.log('🎬 React component - countryName:', countryName);

  // Get submission count for a city from the fetched counts
  const getCitySubmissionCount = (cityName: string) => {
    return citySubmissionCounts[cityName] || 0;
  };

  console.log('🏙️ Cities for country:', cities);
  console.log('🏙️ City submission counts:', citySubmissionCounts);
  console.log('🏙️ Cities loading:', isCitiesLoading);
  console.log('🏙️ City counts loading:', isCityCountsLoading);

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

  // Fetch all countries for the tags
  // const { data: countries, isLoading: isCountriesLoading } = useQuery({
  //   queryKey: ["/api/countries"],
  //   queryFn: async () => {
  //     const res = await apiRequest("GET", "/api/countries", undefined);
  //     return res.json();
  //   }
  // });

  // Filter submissions based on active filters
  const filteredSubmissions = useMemo(() => {
    if (!submissions.length) return [];
    
    const hasActiveFilters = Object.values(filters).some(filterArray => Array.isArray(filterArray) ? filterArray.length > 0 : Boolean(filterArray));
    if (!hasActiveFilters) return submissions;

    return submissions.filter(submission => {
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
          ...(submission.perksAmenities || []),
          ...(submission.vibeAesthetic || [])
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

      // Check perks & amenities
      if (filters.perksAmenities.length > 0) {
        const hasMatchingPerks = submission.perksAmenities?.some(perk =>
          filters.perksAmenities.includes(perk)
        );
        if (!hasMatchingPerks) return false;
      }

      // Check vibe & aesthetic
      if (filters.vibeAesthetic.length > 0) {
        const hasMatchingVibe = submission.vibeAesthetic?.some(vibe =>
          filters.vibeAesthetic.includes(vibe)
        );
        if (!hasMatchingVibe) return false;
      }

      return true;
    });
  }, [submissions, filters]);

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  const hasMore = listingsData?.hasMore || false;
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
      "identifier": country.code
    },
    "touristType": "Vacation Rental Seekers",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${country.name} Direct Booking Vacation Rentals`,
      "numberOfItems": totalHosts
    }
  } : null;

  return (
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

      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            {isCountryLoading ? (
              <div className="h-8 bg-gray-300 w-64 mb-4 md:mb-0 rounded animate-pulse"></div>
            ) : (
              <h1 className="text-3xl font-bold mb-4 md:mb-0 flex items-center gap-3">
                <span className="text-4xl">{getFlagByCountryName(country?.name || countryName)}</span>
                <span>
                  {country?.name || countryName} Direct Booking Sites
                  <span className="text-gray-500 text-lg ml-2">({totalHosts} hosts)</span>
                </span>
              </h1>
            )}
            
            {/* City Navigation Button */}
            {cities.length > 0 && (
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
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Find Hosts by City
              </Button>
            )}
          </div>
          
          {/* Host Filters */}
          <HostFilters onFiltersChange={setFilters} />

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
                  <SubmissionPropertyCard key={`submission-${submission.id}`} submission={submission} />
                ))}
                
                {/* Display existing listings */}
                {listingsData?.listings?.map((listing: any) => (
                  <PropertyCard key={`listing-${listing.id}`} property={listing} />
                ))}
              </>
            )}
          </div>
          
          {/* Show More Button */}
          {hasMore && (
            <div className="mt-10 text-center">
              <Button 
                variant="outline"
                className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition"
                onClick={handleShowMore}
              >
                Show More
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* City Navigation Section */}
      {(isCitiesLoading || isCityCountsLoading || cities.length > 0) && (
        <section id="city-navigation" className="py-16 bg-gray-50">
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
                {isCitiesLoading || isCityCountsLoading ? (
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
                    <p className="text-gray-500">No cities found for this country yet.</p>
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
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {city}
                          </h3>
                          <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                            {getCitySubmissionCount(city)} hosts
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
      )}
    </main>
  );
}
