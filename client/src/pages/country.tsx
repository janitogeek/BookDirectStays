import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import PropertyCard from "@/components/property-card";
import CountryTags from "@/components/country-tags";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

export default function Country() {
  const [, params] = useRoute('/country/:country');
  const countrySlug = params?.country;
  const [visibleCount, setVisibleCount] = useState(6);
  
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

  return (
    <main>
      {/* Country Tags Section */}
      <CountryTags countries={countries || []} isLoading={isCountriesLoading} activeCountry={countrySlug} />

      {/* Main Directory Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isCountryLoading ? (
            <div className="h-8 bg-gray-300 w-64 mb-8 rounded animate-pulse"></div>
          ) : (
            <h1 className="text-3xl font-bold mb-8">
              {country?.name} Direct Booking Sites
              <span className="text-gray-500 text-lg ml-2">({country?.listingCount} listings)</span>
            </h1>
          )}
          
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
              <div className="col-span-3 text-center py-12">
                <h3 className="text-xl font-medium text-gray-700">No listings found for {country?.name}</h3>
                <p className="text-gray-500 mt-2">Check back soon or browse other countries</p>
              </div>
            ) : (
              listingsData?.listings.map((listing: any) => (
                <PropertyCard key={listing.id} listing={listing} />
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
    </main>
  );
}
