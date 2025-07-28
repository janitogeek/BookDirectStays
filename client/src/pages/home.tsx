import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import SubmissionPropertyCard from "@/components/submission-property-card";
import CountryTags from "@/components/country-tags";
import FeaturedHostsCarousel from "@/components/featured-hosts-carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { airtableService } from "@/lib/airtable";
import { slugify } from "@/lib/utils";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showAirbnbScreenshot, setShowAirbnbScreenshot] = useState(false);
  const [showDirectScreenshot, setShowDirectScreenshot] = useState(false);
 
  // Fetch recent approved submissions for property showcase
  const { data: recentSubmissions = [], isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ["/api/recent-submissions"],
    queryFn: () => airtableService.getApprovedSubmissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });



  return (
    <main className="min-h-screen">
      {/* Hero Section - Clean and Spacious */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Book Vacation Rentals Direct
            </h1>
            <p className="text-3xl lg:text-4xl mb-8">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold">No fees,</span> 
              <span className="text-white"> just better stays</span> 
              <span className="text-white"> - </span>
              <span className="text-white font-bold">Save 10-30%</span>
            </p>
            <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto font-medium">
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
                  <div className="text-sm font-medium">Verified Hosts</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Section - Clean Cards */}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center group hover:bg-white p-8 rounded-2xl transition-colors">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Save 10-30%</h3>
              <p className="text-gray-600 text-sm">Eliminate OTA booking fees averaging 15.7% per reservation</p>
            </div>

            <div className="text-center group hover:bg-white p-8 rounded-2xl transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Superior Support</h3>
              <p className="text-gray-600 text-sm">Direct communication with property managers (98% response rate)</p>
            </div>

            <div className="text-center group hover:bg-white p-8 rounded-2xl transition-colors">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Deals</h3>
              <p className="text-gray-600 text-sm">Access to 30% more promotional offers unavailable on OTAs</p>
            </div>

            <div className="text-center group hover:bg-white p-8 rounded-2xl transition-colors">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified professional hosts</h3>
              <p className="text-gray-600 text-sm">100% manually reviewed hosts using a PMS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Savings Section - Skol Example */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                💸 Real Savings, Real Listings
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                See actual savings from booking direct vs OTA platforms with real properties
              </p>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* OTA Booking */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="inline-block bg-red-100 px-4 py-2 rounded-full mb-4">
                    <span className="text-red-700 font-semibold">❌ Airbnb (OTA)</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Skol 927A</h3>
                  <p className="text-gray-600 text-sm">Sep 3rd to Sep 8th 2025</p>
                  <p className="text-gray-600 text-sm">• Same listing via Airbnb</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Guest pays</span>
                    <span className="text-red-600">€1,687</span>
                  </div>
                  <div className="flex justify-between">
                    <span>OTA Commission fees (15%)</span>
                    <span className="font-semibold text-red-600">€253</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Host Receives</span>
                    <span className="font-semibold text-red-600">€1,434</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => setShowAirbnbScreenshot(true)}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100 text-sm px-4 py-2"
                  >
                    📸 View Proof
                  </Button>
                </div>
              </div>

              {/* Direct Booking */}
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="inline-block bg-green-100 px-4 py-2 rounded-full mb-4">
                    <span className="text-green-700 font-semibold">✅ Book Direct</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Skol 927A</h3>
                  <p className="text-gray-600 text-sm">Sep 3rd to Sep 8th 2025</p>
                  <p className="text-gray-600 text-sm">• Same listing via Skol direct website</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Guest pays</span>
                    <span className="text-green-600">€1,287.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission fees (0%)</span>
                    <span className="font-semibold text-green-600">€0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Host Receives</span>
                    <span className="font-semibold text-green-600">€1,287.5</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => setShowDirectScreenshot(true)}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-100 text-sm px-4 py-2"
                  >
                    📸 View Proof
                  </Button>
                </div>
              </div>
            </div>

            {/* Savings Summary */}
            <div className="text-center mt-12">
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* Guest Savings */}
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">€399.5 - 24%</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">Guest's Savings</div>
                  <div className="text-green-600 font-medium">Booking Direct vs Airbnb (OTA)</div>
                </div>
                
                {/* Host Benefits */}
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">0%</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">Host Fees Direct</div>
                  <div className="text-green-600 font-medium">vs 15%+ via OTA</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-6 max-w-2xl mx-auto">
                *Real data comparison: Skol 927A on Airbnb vs Skol direct website. Guests pay 24% less (€399.5 savings), hosts pay 0% fees vs 15%+ commission to OTAs.
              </p>
              
              {/* See Other Examples CTA */}
              <div className="text-center mt-8">
                <Button 
                  onClick={() => setLocation("/testimonials?tab=travelers")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-semibold"
                >
                  📊 See Other Examples
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hosts Carousel Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedHostsCarousel />
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
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">23%</div>
              <div className="text-gray-600 text-sm font-medium">Higher Profit Margins</div>
              <div className="text-xs text-gray-500 mt-1">vs OTA bookings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">40%</div>
              <div className="text-gray-600 text-sm font-medium">Better Guest Satisfaction</div>
              <div className="text-xs text-gray-500 mt-1">direct vs OTA bookings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">15.7%</div>
              <div className="text-gray-600 text-sm font-medium">Average Guest Savings</div>
              <div className="text-xs text-gray-500 mt-1">booking direct</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600 text-sm font-medium">Host Response Rate</div>
              <div className="text-xs text-gray-500 mt-1">within 24 hours</div>
            </div>
          </div>
        </div>
      </section>



      {/* Expert Quote Section - Clean and Prominent */}
      <section className="py-20 bg-gray-50">
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

      {/* Properties Section - Clean Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Latest Direct Booking Properties
            </h2>
            <p className="text-xl text-gray-600">
              Recently added verified vacation rental hosts offering commission-free bookings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {isSubmissionsLoading ? (
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
            ) : recentSubmissions.length === 0 ? (
              <div className="col-span-3 text-center py-16">
                <div className="bg-white rounded-xl p-8 border border-gray-200 inline-block mx-auto">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties available yet</h3>
                  <p className="text-gray-500 mb-6">Check back soon for new direct booking properties.</p>
                  <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <a href="/submit">Add Your Property</a>
                  </Button>
                </div>
              </div>
            ) : (
              // Show first 6 recent submissions
              recentSubmissions.slice(0, 6).map((submission) => (
                <SubmissionPropertyCard key={`submission-${submission.id}`} submission={submission} />
              ))
            )}
          </div>

          {/* View All Properties Button */}
          {recentSubmissions.length > 6 && (
            <div className="text-center mt-12">
              <Button 
                onClick={() => setLocation("/find-host")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
              >
                View All {recentSubmissions.length} Properties
              </Button>
            </div>
          )}
        </div>
      </section>

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
             <Button 
               onClick={() => setLocation("/find-host")}
               className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-semibold"
             >
               Start Searching Stays
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

      {/* Airbnb Screenshot Dialog */}
      <Dialog open={showAirbnbScreenshot} onOpenChange={setShowAirbnbScreenshot}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">Airbnb Pricing Screenshot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Skol 927A - Sep 3rd to Sep 8th 2025</h4>
              <p className="text-red-600 font-bold text-xl mb-4">Total: €1,687.00</p>
            </div>
            <img 
              src="/uploads/airbnb-skol-927a-screenshot.png"
              alt="Airbnb booking screenshot showing €1,687 total for Skol 927A Sep 3-8 2025" 
              className="w-full rounded-lg border shadow-lg"
            />
            <p className="text-sm text-gray-600 text-center">
              Real Airbnb booking page showing €1,687.00 total for Skol 927A
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Direct Booking Screenshot Dialog */}
      <Dialog open={showDirectScreenshot} onOpenChange={setShowDirectScreenshot}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">Skol Direct Booking Screenshot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Skol 927A - Sep 3rd to Sep 8th 2025</h4>
              <p className="text-green-600 font-bold text-xl mb-4">Total: €1,287.50</p>
            </div>
            <img 
              src="/uploads/skol-direct-927a-screenshot.png"
              alt="Skol direct website screenshot showing €1,287.50 total for same listing Sep 3-8 2025" 
              className="w-full rounded-lg border shadow-lg"
            />
            <p className="text-sm text-gray-600 text-center">
              Real Skol direct booking website showing €1,287.50 total for the same property
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
