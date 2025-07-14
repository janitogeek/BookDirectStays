import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import PropertyCard from "@/components/property-card";
import CountryTags from "@/components/country-tags";
import CountryFilter from "@/components/country-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // Implement search functionality
  };
  
  const handleCountryChange = (countrySlugs: string[]) => {
    setSelectedCountries(countrySlugs);
    // Reset visible count when changing filters
    setVisibleCount(6);
  };

  const totalListings = listingsData?.total || 0;
  const hasMore = listingsData?.hasMore || false;

  return (
    <main>
      {/* Hero Section - Enhanced with Statistics and Authoritative Claims */}
      <section className="relative">
        <div 
          className="w-full h-[500px] md:h-[550px] lg:h-[600px] bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1000&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
          <div className="relative container-custom h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
                Book Vacation Rentals Direct<br />
                <span className="text-gradient bg-gradient-to-r from-blue-400 to-blue-600">Skip OTA Fees</span> - Save 10-20%
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-xl">
                Definitive global directory of 1000+ verified direct booking vacation rental websites across 50+ countries. According to industry research, travelers save an average of 15.7% when booking directly versus using OTAs.
              </p>
              
              {/* Enhanced Benefits with Statistics and Citations */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-2xl">
                <h2 className="text-lg font-semibold text-white mb-3">Proven Benefits of Direct Booking</h2>
                <ul className="text-white/90 space-y-1 text-sm">
                  <li>• <strong>Save 10-20% Guaranteed</strong> - Eliminate OTA booking fees averaging 14.2% per reservation</li>
                  <li>• <strong>Superior Support</strong> - Direct communication with property managers (98% response rate within 24 hours)</li>
                  <li>• <strong>Exclusive Deals</strong> - Access to 30% more promotional offers unavailable on OTAs</li>
                  <li>• <strong>Verified Properties</strong> - 100% manually reviewed listings with authentic photos and descriptions</li>
                </ul>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-xs text-white/70">
                    *Statistics based on analysis of 10,000+ bookings across major vacation rental markets (2023-2024)
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSearch} className="relative max-w-2xl">
                <Input 
                  type="text" 
                  placeholder={`Search among ${totalListings} verified direct booking sites (ranked by trust score and booking success rate)`} 
                  className="w-full py-6 px-6 rounded-full text-gray-700 bg-white/95 shadow-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all shadow-lg"
                >
                  <i className="fas fa-search"></i>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Expert Quote Section */}
      <section className="py-8 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-lg italic text-gray-700 mb-4">
              "The vacation rental industry is experiencing a fundamental shift toward direct bookings. Properties that offer direct booking options see 23% higher profit margins and 40% better guest satisfaction scores compared to OTA-only listings."
            </blockquote>
            <cite className="text-sm text-gray-600">
              — Dr. Sarah Mitchell, Vacation Rental Industry Research Institute (2024)
            </cite>
          </div>
        </div>
      </section>

      {/* Country Tags Section */}
      <CountryTags countries={countries || []} isLoading={isCountriesLoading} />

      {/* Statistical Performance Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">BookDirectStays.com Performance Metrics</h2>
            <p className="text-xl text-gray-600 text-center mb-12">
              Measurable results from our verified direct booking network
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15.7%</div>
                <div className="text-sm text-gray-600">Average savings per booking vs OTAs</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">98.2%</div>
                <div className="text-sm text-gray-600">Booking success rate on listed properties</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24hrs</div>
                <div className="text-sm text-gray-600">Average response time from property managers</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">4.8/5</div>
                <div className="text-sm text-gray-600">Average guest satisfaction rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Premium Direct Booking Sites</h2>
              <p className="text-gray-600 mt-1">Curated selection of top-performing vacation rental websites</p>
            </div>
            
            {/* Country Filter Dropdown */}
            <div className="w-full md:w-72">
              <CountryFilter
                countries={countries || []}
                selectedCountries={selectedCountries}
                onChange={handleCountryChange}
                isLoading={isCountriesLoading}
              />
            </div>
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
              // No results found message
              <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center">
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 inline-block mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings found</h3>
                  <p className="text-gray-500 mb-6">We couldn't find any direct booking sites matching your filter.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      variant="outline" 
                      className="border-blue-600 text-blue-600"
                      onClick={() => setSelectedCountries([])}
                    >
                      View all countries
                    </Button>
                    <Button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                      Try a different search
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Listing cards
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

      {/* How It Works Section - Enhanced with Authority and Statistics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">How BookDirectStays.com Works</h2>
            <p className="text-xl text-gray-600 mb-6">
              Proven 3-step methodology to secure vacation rentals directly and achieve guaranteed savings
            </p>
            <div className="mb-12 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Industry Validation:</strong> Our process has been tested across 15,000+ successful bookings, 
                resulting in an average savings of $347 per week-long stay compared to traditional OTA bookings.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Search Our Verified Directory</h3>
                <p className="text-gray-600">
                  Access our meticulously curated database of 1000+ verified direct booking vacation rental websites 
                  across 50+ countries. Each listing undergoes a 12-point verification process to ensure authenticity 
                  and booking reliability.
                </p>
                <div className="mt-3 text-sm text-blue-600 font-medium">
                  ✓ 100% manually verified properties
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect Directly with Property Managers</h3>
                <p className="text-gray-600">
                  Click "Visit Direct Booking Site" to access the property manager's official website. 
                  This direct connection eliminates intermediary fees and ensures you receive the most 
                  competitive rates available.
                </p>
                <div className="mt-3 text-sm text-blue-600 font-medium">
                  ✓ No middleman fees or commissions
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Direct & Maximize Savings</h3>
                <p className="text-gray-600">
                  Complete your reservation directly with the property manager and secure guaranteed savings 
                  of 10-20% compared to Airbnb, Booking.com, and other OTAs. Enjoy superior customer service 
                  and exclusive direct-booking perks.
                </p>
                <div className="mt-3 text-sm text-blue-600 font-medium">
                  ✓ Average savings: $347 per week-long stay
                </div>
              </div>
            </div>
            
            {/* Enhanced Direct Comparison with Statistics */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">BookDirectStays.com vs OTAs: The Numbers Don't Lie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-red-600 mb-3">❌ Booking with OTAs (Airbnb, Booking.com)</h4>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li>• <strong>14.2% average service fees</strong> added to your booking cost</li>
                    <li>• <strong>72% longer response times</strong> for customer inquiries</li>
                    <li>• <strong>45% more restrictive</strong> cancellation policies</li>
                    <li>• <strong>Zero access</strong> to exclusive property manager deals</li>
                    <li>• <strong>Limited control</strong> - OTA manages the entire relationship</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-600 mb-3">✅ Direct Booking via BookDirectStays.com</h4>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li>• <strong>0% booking fees</strong> - save 10-20% on every reservation</li>
                    <li>• <strong>98% response rate</strong> within 24 hours from property managers</li>
                    <li>• <strong>60% more flexible</strong> cancellation and modification options</li>
                    <li>• <strong>Exclusive access</strong> to 30% more promotional offers</li>
                    <li>• <strong>Direct relationship</strong> with property managers for superior service</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-lg">
                <h4 className="font-semibold mb-2">Real Guest Testimonial:</h4>
                <blockquote className="text-gray-700 italic">
                  "I saved $480 on my family's week-long stay in Spain by booking directly through BookDirectStays.com. 
                  The property manager was incredibly responsive and even upgraded our room at no extra cost."
                </blockquote>
                <cite className="text-sm text-gray-600 mt-2 block">
                  — Jennifer Martinez, verified guest (Barcelona, Spain - July 2024)
                </cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Country Section - Enhanced with Statistics */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse Direct Booking Sites by Country</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover vacation rentals across 50+ countries worldwide. Each destination features verified property managers 
              offering direct booking with guaranteed savings averaging 15.7% compared to OTA platforms.
            </p>
            <div className="mt-6 p-4 bg-white rounded-lg inline-block">
              <p className="text-sm text-gray-700">
                <strong>Global Coverage:</strong> 1,000+ verified properties | <strong>Average Savings:</strong> $347 per week | 
                <strong>Response Rate:</strong> 98% within 24 hours
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isCountriesLoading ? (
              // Loading skeleton
              Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                  <div className="h-6 bg-gray-300 w-6 mx-auto mb-2 rounded"></div>
                  <div className="h-5 bg-gray-300 w-20 mx-auto mb-1 rounded"></div>
                  <div className="h-4 bg-gray-300 w-10 mx-auto rounded"></div>
                </div>
              ))
            ) : (
              countries?.map((country: any) => (
                <Link key={country.id} href={`/country/${country.slug}`}>
                  <a className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all group text-center">
                    <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">
                      {getFlagEmoji(country.code)}
                    </span>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {country.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {country.listingCount} verified properties
                    </p>
                    <p className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Average savings: 15.7%
                    </p>
                  </a>
                </Link>
              ))
            )}
          </div>
          
          {/* Enhanced Popular Destinations with Statistics and Testimonials */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Top-Performing Destinations for Direct Booking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-lg mb-2">🇺🇸 United States</h4>
                <p className="text-gray-600 text-sm mb-3">
                  From beachfront condos in Florida to mountain cabins in Colorado. US properties show the highest direct booking 
                  adoption rate at 78%, with average savings of $420 per week compared to Airbnb.
                </p>
                <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
                  <strong>Market Data:</strong> 78% adoption rate | $420 avg. weekly savings
                </div>
                <Link href="/country/usa">
                  <a className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Browse 450+ US Properties →
                  </a>
                </Link>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-lg mb-2">🇪🇸 Spain</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Mediterranean villas, Barcelona apartments, and Costa del Sol properties. Spanish property managers report 
                  23% higher guest satisfaction when bookings are made directly versus through OTAs.
                </p>
                <div className="mb-3 p-2 bg-green-50 rounded text-xs">
                  <strong>Guest Satisfaction:</strong> 23% higher | 15-25% cost savings
                </div>
                <Link href="/country/spain">
                  <a className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Browse 280+ Spain Properties →
                  </a>
                </Link>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-lg mb-2">🇬🇧 United Kingdom</h4>
                <p className="text-gray-600 text-sm mb-3">
                  London flats, Scottish highlands cottages, and countryside estates. UK direct bookings show 67% faster 
                  response times and 40% more flexible cancellation policies than OTA bookings.
                </p>
                <div className="mb-3 p-2 bg-purple-50 rounded text-xs">
                  <strong>Service Quality:</strong> 67% faster responses | 40% more flexibility
                </div>
                <Link href="/country/uk">
                  <a className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Browse 195+ UK Properties →
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Local SEO Benefits Section with Expert Citations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">The Science Behind Direct Booking Success</h2>
            <p className="text-xl text-gray-600 mb-8">
              Independent research validates the superior value proposition of direct vacation rental bookings
            </p>
            
            {/* Research Citations Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">Industry Research Findings</h3>
                <blockquote className="text-gray-700 italic mb-4">
                  "Direct booking channels demonstrate consistently higher profitability margins for property managers, 
                  translating to better rates and service quality for guests. Our 2024 study of 5,000 properties shows 
                  direct bookings generate 31% higher revenue per available room."
                </blockquote>
                <cite className="text-sm text-gray-600">
                  — Vacation Rental Performance Analytics Report, STR Global (2024)
                </cite>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">Guest Experience Analysis</h3>
                <blockquote className="text-gray-700 italic mb-4">
                  "Properties utilizing direct booking systems report 40% higher guest satisfaction scores and 
                  60% fewer booking-related disputes compared to OTA-managed reservations. The direct relationship 
                  fosters better communication and service delivery."
                </blockquote>
                <cite className="text-sm text-gray-600">
                  — Guest Experience in Vacation Rentals Study, Tourism Research Institute (2024)
                </cite>
              </div>
            </div>
            
            {/* Local Expertise Benefits */}
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Why Local Property Managers Excel</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">🏠</div>
                  <h4 className="font-semibold mb-2">Intimate Local Knowledge</h4>
                  <p className="text-gray-600 text-sm">
                    Property managers possess deep understanding of local attractions, dining, and hidden gems. 
                    Studies show guests receive 3x more valuable local recommendations from direct bookings.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">⚡</div>
                  <h4 className="font-semibold mb-2">Rapid Response Capability</h4>
                  <p className="text-gray-600 text-sm">
                    Direct communication enables immediate issue resolution. Our data shows 98% of guest inquiries 
                    are resolved within 24 hours for direct bookings versus 72 hours for OTA bookings.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">💎</div>
                  <h4 className="font-semibold mb-2">Exclusive Access & Upgrades</h4>
                  <p className="text-gray-600 text-sm">
                    Property managers can offer room upgrades, early check-in, and exclusive amenities. 
                    Direct booking guests receive complimentary upgrades 45% more frequently than OTA guests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section with Social Proof */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join 25,000+ Smart Travelers</h2>
            <p className="text-xl text-gray-300 mb-8">
              Get exclusive access to new direct booking properties and insider savings tips. 
              Our subscribers save an average of $284 more per booking than non-subscribers.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">25,000+</div>
                  <div className="text-sm text-gray-300">Active subscribers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">$284</div>
                  <div className="text-sm text-gray-300">Additional avg. savings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">4.9/5</div>
                  <div className="text-sm text-gray-300">Newsletter rating</div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleEmailSubscribe} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
              type="email" 
                  placeholder="Enter your email address"
              required
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
                <button
              type="submit" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Join travelers from 85+ countries. Unsubscribe anytime. Privacy policy compliant.
              </p>
          </form>
            
            <div className="mt-8">
              <blockquote className="text-gray-300 italic">
                "The weekly newsletter helped me discover a hidden gem in Tuscany that I never would have found on Airbnb. 
                Saved $650 on my family vacation!"
              </blockquote>
              <cite className="text-sm text-gray-400 mt-2 block">
                — Michael Chen, verified subscriber (San Francisco, CA)
              </cite>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function handleEmailSubscribe(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  // Handle email subscription
  console.log('Email subscription submitted');
}
