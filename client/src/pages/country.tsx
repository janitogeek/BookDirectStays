import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import PropertyCard from "@/components/property-card";
import CountryTags from "@/components/country-tags";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

export default function Country() {
  const [, params] = useRoute('/country/:country');
  const countrySlug = params?.country;
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Sample cities/regions for each country (in real app, this would come from API)
  const getCitiesForCountry = (slug: string) => {
    const cityMap: { [key: string]: string[] } = {
      usa: ['New York', 'Los Angeles', 'Miami', 'Las Vegas', 'San Francisco', 'Chicago', 'Boston', 'Seattle'],
      spain: ['Barcelona', 'Madrid', 'Valencia', 'Seville', 'Bilbao', 'Granada', 'Málaga', 'Palma'],
      uk: ['London', 'Edinburgh', 'Manchester', 'Liverpool', 'Bath', 'Brighton', 'Oxford', 'Cambridge'],
      germany: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Dresden', 'Heidelberg'],
      france: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Bordeaux', 'Toulouse', 'Strasbourg', 'Nantes'],
      australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Cairns', 'Darwin'],
      canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Quebec City', 'Halifax'],
      italy: ['Rome', 'Milan', 'Naples', 'Florence', 'Venice', 'Bologna', 'Turin', 'Palermo'],
      portugal: ['Lisbon', 'Porto', 'Faro', 'Coimbra', 'Braga', 'Aveiro', 'Évora', 'Funchal'],
      thailand: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Krabi', 'Koh Samui', 'Hua Hin', 'Ayutthaya'],
      greece: ['Athens', 'Thessaloniki', 'Mykonos', 'Santorini', 'Crete', 'Rhodes', 'Corfu', 'Delphi']
    };
    return cityMap[slug] || [];
  };
  
  const cities = getCitiesForCountry(countrySlug || '');
  
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

  // Fetch all countries for the tags
  const { data: countries, isLoading: isCountriesLoading } = useQuery({
    queryKey: ["/api/countries"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/countries", undefined);
      return res.json();
    }
  });

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  const hasMore = listingsData?.hasMore || false;

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
        "name": `${country?.name} Direct Booking Sites`,
        "item": `https://bookdirectstays.com/country/${countrySlug}`
      }
    ]
  };

  // Country-specific structured data
  const countryStructuredData = country ? {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": `${country.name} Vacation Rentals`,
    "description": `Find ${country.listingCount} direct booking vacation rental websites in ${country.name}. Skip OTA fees and book directly with property managers.`,
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
      "numberOfItems": country.listingCount
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

      {/* Country Tags Section */}
      <CountryTags countries={countries || []} isLoading={isCountriesLoading} activeCountry={countrySlug} />

      {/* Main Directory Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            {isCountryLoading ? (
              <div className="h-8 bg-gray-300 w-64 mb-4 md:mb-0 rounded animate-pulse"></div>
            ) : (
              <h1 className="text-3xl font-bold mb-4 md:mb-0">
                {country?.name} Direct Booking Sites
                <span className="text-gray-500 text-lg ml-2">({country?.listingCount} listings)</span>
              </h1>
            )}
            
            {/* City/Region Navigation Button */}
            {cities.length > 0 && (
              <Button 
                onClick={() => document.getElementById('city-navigation')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Find Hosts by City/Region
              </Button>
            )}
          </div>
          
          {/* Property Manager Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isListingsLoading ? (
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
            ) : listingsData?.listings.length === 0 ? (
              <div className="col-span-3 text-center py-16">
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 inline-block mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings found for {country?.name}</h3>
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
              listingsData?.listings.map((listing: any) => (
                <PropertyCard key={listing.id} property={listing} />
              ))
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

      {/* City/Region Navigation Section */}
      {cities.length > 0 && (
        <section id="city-navigation" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Find Hosts by City/Region in {country?.name}
                </h2>
                <p className="text-xl text-gray-600">
                  Looking for something more specific? Browse hosts by city or region
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cities.map((city, index) => (
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
                          0 hosts
                        </Badge>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
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
