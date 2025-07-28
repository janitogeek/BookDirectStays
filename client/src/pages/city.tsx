import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import PropertyCard from "@/components/property-card";
import SubmissionPropertyCard from "@/components/submission-property-card";
import HostFilters, { FilterState } from "@/components/host-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { airtableService } from "@/lib/airtable";
import { getFlagByCountryName } from "@/lib/utils";

export default function City() {
  const [, params] = useRoute('/country/:country/:city');
  const countrySlug = params?.country;
  const citySlug = params?.city;
  const [visibleCount, setVisibleCount] = useState(6);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    propertyTypes: [],
    idealFor: [],
    perksAmenities: [],
    vibeAesthetic: []
  });
  
  // Convert slug back to readable city name with proper accents
  const getCityNameFromSlug = (slug: string) => {
    // Map of common city slugs to their proper names with accents
    const cityNameMap: { [key: string]: string } = {
      'durres': 'Durrës',
      'nice': 'Nice',
      'malaga': 'Málaga',
      'cordoba': 'Córdoba',
      'leon': 'León',
      'caceres': 'Cáceres',
      'alicante': 'Alicante',
      'santander': 'Santander',
      'san-sebastian': 'San Sebastián',
      'a-coruna': 'A Coruña',
      'monte-carlo': 'Monte-Carlo',
      'zurich': 'Zürich',
      'dusseldorf': 'Düsseldorf',
      'cologne': 'Köln',
      'munich': 'München',
      'montreal': 'Montréal',
      'quebec': 'Québec',
      'sao-paulo': 'São Paulo',
      'brasilia': 'Brasília',
      'rio-de-janeiro': 'Rio de Janeiro'
    };
    
    // Return mapped name if exists, otherwise capitalize normally
    return cityNameMap[slug] || slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const cityName = getCityNameFromSlug(citySlug || '');
  
  // Get country name from slug
  const getCountryName = (slug: string) => {
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
      albania: 'Albania'
    };
    return countryMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  };
  
  const countryName = getCountryName(countrySlug || '');

  // Fetch submissions for this country and filter by city
  const { data: allSubmissions = [], isLoading: isSubmissionsLoading } = useQuery({
    queryKey: [`/api/submissions/country/${countryName}`],
    queryFn: () => airtableService.getSubmissionsByCountry(countryName),
    enabled: !!countryName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter submissions by city (handle accented characters)
  const normalizeForComparison = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics/accents
  };

  const citySubmissions = allSubmissions.filter(submission => 
    submission.citiesRegions.some(city => {
      const normalizedCity = normalizeForComparison(city);
      const normalizedCityName = normalizeForComparison(cityName || '');
      return normalizedCity.includes(normalizedCityName) ||
             normalizedCityName.includes(normalizedCity);
    })
  );

  // Filter submissions by all active filters
  const filteredSubmissions = useMemo(() => {
    if (!citySubmissions.length) return [];
    
    const hasActiveFilters = Object.values(filters).some(filterArray => Array.isArray(filterArray) ? filterArray.length > 0 : Boolean(filterArray));
    if (!hasActiveFilters) return citySubmissions;

    return citySubmissions.filter(submission => {
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
  }, [citySubmissions, filters]);

  console.log('🏙️ City page - cityName:', cityName);
  console.log('🏙️ City page - countryName:', countryName);
  console.log('🏙️ City page - allSubmissions:', allSubmissions);
  console.log('🏙️ City page - citySubmissions:', citySubmissions);
  console.log('🏙️ City page - citySubmissions length:', citySubmissions.length);
  
  // Fetch listings for this city (placeholder - would be real API call)
  const { data: listingsData, isLoading: isListingsLoading } = useQuery({
    queryKey: [`/api/listings?country=${countrySlug}&city=${citySlug}`, visibleCount],
    queryFn: async () => {
      // Placeholder - return empty for now
      return { listings: [], total: 0, hasMore: false };
    },
    enabled: !!countrySlug && !!citySlug
  });

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  const hasMore = listingsData?.hasMore || false;

  // Breadcrumb structured data
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
        "name": "Find a Host",
        "item": "https://bookdirectstays.com/find-host"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${countryName}`,
        "item": `https://bookdirectstays.com/country/${countrySlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": `${cityName} Hosts`,
        "item": `https://bookdirectstays.com/country/${countrySlug}/${citySlug}`
      }
    ]
  };

  return (
    <main>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />

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
                <li className="text-white font-semibold">{cityName}</li>
              </ol>
            </nav>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 flex items-center gap-4">
              <span className="text-5xl">{getFlagByCountryName(countryName)}</span>
              <span>{cityName} Vacation Rental Hosts</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Direct booking vacation rental hosts in {cityName}, <span className="inline-flex items-center gap-1">{getFlagByCountryName(countryName)} {countryName}</span>
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
              <div className="flex items-center space-x-4">
                <Badge className="bg-blue-500 text-white">
                  {(listingsData?.total || 0) + filteredSubmissions.length} hosts
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
            
            {/* Host Filters */}
            {citySubmissions.length > 0 && (
              <HostFilters onFiltersChange={setFilters} />
            )}
            
            {/* Property Manager Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(isListingsLoading || isSubmissionsLoading) ? (
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
              ) : (listingsData?.listings.length === 0 && filteredSubmissions.length === 0) ? (
                <div className="col-span-3 text-center py-16">
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 inline-block mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {filters.search ? `No hosts found matching "${filters.search}"` : `No hosts found in ${cityName}`}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {filters.search ? "Try adjusting your search terms or filters." : "We couldn't find any direct booking hosts in this city yet."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
                <>
                  {/* Display approved submissions first */}
                  {filteredSubmissions.map((submission) => (
                    <SubmissionPropertyCard key={`submission-${submission.id}`} submission={submission} />
                  ))}
                  
                  {/* Display existing listings */}
                  {listingsData?.listings.map((listing: any) => (
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
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-3">
              <span>Have a vacation rental in</span> 
              <span className="inline-flex items-center gap-2">
                <span className="text-4xl">{getFlagByCountryName(countryName)}</span>
                {cityName}?
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our directory and connect directly with travelers. No commission fees, just direct bookings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/submit">
                  Add Your Direct Booking Site
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Link href="/find-host">
                  Explore Other Destinations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 