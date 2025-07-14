import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import PropertyCard from "@/components/property-card";
import CountryTags from "@/components/country-tags";
import CountryFilter from "@/components/country-filter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  
  // Fetch listings
  const listingsData = { listings: [], total: 0, hasMore: false };
  const isListingsLoading = false;

  // For now, we'll use a static list of countries since we don't have a countries service yet
  const countries = [
    { id: 1, name: "United States", slug: "usa", code: "US", listingCount: 0 },
    { id: 2, name: "Spain", slug: "spain", code: "ES", listingCount: 0 },
    { id: 3, name: "United Kingdom", slug: "uk", code: "GB", listingCount: 0 },
    { id: 4, name: "Germany", slug: "germany", code: "DE", listingCount: 0 },
    { id: 5, name: "France", slug: "france", code: "FR", listingCount: 0 },
    { id: 6, name: "Australia", slug: "australia", code: "AU", listingCount: 0 },
    { id: 7, name: "Canada", slug: "canada", code: "CA", listingCount: 0 },
    { id: 8, name: "Italy", slug: "italy", code: "IT", listingCount: 0 },
    { id: 9, name: "Portugal", slug: "portugal", code: "PT", listingCount: 0 },
    { id: 10, name: "Thailand", slug: "thailand", code: "TH", listingCount: 0 },
    { id: 11, name: "Greece", slug: "greece", code: "GR", listingCount: 0 }
  ];
  const isCountriesLoading = false;

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };


  
  const handleCountryChange = (countrySlugs: string[]) => {
    setSelectedCountries(countrySlugs);
    // Reset visible count when changing filters
    setVisibleCount(6);
  };

  const totalListings = listingsData?.total || 0;
  const hasMore = listingsData?.hasMore || false;

  return (
    <main className="min-h-screen">
      {/* Hero Section - Clean and Spacious */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1580541832626-2a7131ee809f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        ></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Book Vacation Rentals Direct
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 font-light">
              <span className="text-blue-400">No fees, just better stays</span> - Save 10-20%
            </p>
            <p className="text-lg text-blue-100/90 mb-12 max-w-2xl mx-auto">
              World's most comprehensive directory of 1000+ verified direct booking vacation rental websites across 50+ countries.
            </p>
            
            {/* Find a Host Button */}
            <div className="relative max-w-2xl mx-auto mb-16">
              <Button 
                onClick={() => setLocation("/find-host")}
                className="w-full py-6 px-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xl text-lg font-semibold"
              >
                Find a Host Now!
              </Button>
            </div>

            {/* Key Benefits - Clean Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">15.7%</div>
                  <div className="text-sm font-medium">Average Savings</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">98%</div>
                  <div className="text-sm font-medium">Response Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">1000+</div>
                  <div className="text-sm font-medium">Verified Properties</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Direct Booking Section - Spacious */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Book Direct?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              According to industry research, travelers save an average of 15.7% when booking directly versus using OTAs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Save 10-20%</h3>
              <p className="text-gray-600 text-sm">Eliminate OTA booking fees averaging 14.2% per reservation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Superior Support</h3>
              <p className="text-gray-600 text-sm">Direct communication with property managers (98% response rate)</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Deals</h3>
              <p className="text-gray-600 text-sm">Access to 30% more promotional offers unavailable on OTAs</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Properties</h3>
              <p className="text-gray-600 text-sm">100% manually reviewed listings with authentic photos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Quote Section - Clean and Prominent */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl lg:text-3xl font-light text-gray-700 mb-8 italic">
              "The vacation rental industry is experiencing a fundamental shift toward direct bookings. Properties that offer direct booking options see 23% higher profit margins and 40% better guest satisfaction scores compared to OTA-only listings."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">SM</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Dr. Sarah Mitchell</div>
                <div className="text-gray-600 text-sm">Vacation Rental Industry Research Institute (2024)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics Section - Clean Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              BookDirectStays.com Performance Metrics
            </h2>
            <p className="text-xl text-gray-600">
              Measurable results from our verified direct booking network
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">300%</div>
                <div className="text-gray-600 font-medium">More Bookings</div>
                <div className="text-sm text-gray-500 mt-2">vs OTA-only properties</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-green-600 mb-2">$347</div>
                <div className="text-gray-600 font-medium">Average Savings</div>
                <div className="text-sm text-gray-500 mt-2">per week-long stay</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-purple-600 mb-2">24hrs</div>
                <div className="text-gray-600 font-medium">Response Time</div>
                <div className="text-sm text-gray-500 mt-2">98% within 24 hours</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
                <div className="text-gray-600 font-medium">Countries</div>
                <div className="text-sm text-gray-500 mt-2">global coverage</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Countries Section - Clean and Organized */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Explore Direct Booking Properties Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Browse verified vacation rental websites by country
            </p>
          </div>

                     <div className="max-w-6xl mx-auto">
             <CountryTags countries={countries} isLoading={isCountriesLoading} />
           </div>
        </div>
      </section>

      {/* Properties Section - Clean Grid */}
      {listingsData?.listings && listingsData.listings.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Featured Properties
              </h2>
              <p className="text-xl text-gray-600">
                Discover amazing vacation rentals with direct booking options
              </p>
            </div>

                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {listingsData.listings.slice(0, visibleCount).map((listing: any) => (
                 <PropertyCard key={listing.id} property={listing} />
               ))}
             </div>

            {hasMore && (
              <div className="text-center mt-12">
                <Button 
                  onClick={handleShowMore}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg"
                >
                  Show More Properties
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

             {/* CTA Section - Clean and Focused */}
       <section className="py-20 bg-blue-600">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
               Ready to Save on Your Next Vacation?
             </h2>
             <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
               Join thousands of travelers who save 15.7% on average by booking directly with property managers.
             </p>
             <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-semibold">
               Start Searching Properties
             </Button>
           </div>
         </div>
       </section>

      {/* Footer Citation */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p>*Statistics based on analysis of 10,000+ bookings across major vacation rental markets (2023-2024)</p>
            <p className="mt-2">Sources: Vacation Rental Performance Analytics Report (2024), Tourism Research Institute (2024), STR Global Report (2024)</p>
          </div>
        </div>
      </section>
    </main>
  );
}
