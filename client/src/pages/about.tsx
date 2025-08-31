import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function About() {
  const [, setLocation] = useLocation();

  // SEO: Add structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "BookDirectStays",
      "url": "https://bookdirectstays.com",
      "sameAs": [
        "https://www.linkedin.com/in/jan-sahagun-escosa/",
        "https://www.linkedin.com/in/elsa-ibos/"
      ],
      "founder": [
        {
          "@type": "Person",
          "name": "Jan Sahagun",
          "jobTitle": "Founder",
          "description": "Traveler, lifelong STR consumer, and STR tech professional",
          "sameAs": "https://www.linkedin.com/in/jan-sahagun-escosa/"
        },
        {
          "@type": "Person",
          "name": "Elsa Ibos",
          "jobTitle": "Co-Founder",
          "description": "Strategic Planner, Brand Strategist and Content Creator",
          "sameAs": "https://www.linkedin.com/in/elsa-ibos/"
        }
      ]
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              About BookDirectStays
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              The Global Directory for Direct Vacation Rental Bookings
            </p>
                                        <p className="text-lg mb-8 opacity-90">
                Connecting travelers with verified professional hosts — property management companies (PMCs) and serious owners using a PMS — for direct bookings. No OTA middlemen, fewer fees, better service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                  onClick={() => setLocation("/find-host")}
                >
                  Find Your Stay
                </Button>
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold"
                  onClick={() => setLocation("/submit")}
                >
                  List Your Company
                </Button>
              </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              We list trusted operators across the whole world (Europe, North America, Latin America & the Caribbean, Asia-Pacific, Africa, and Oceania) covering everything from villas and apartments to cabins, chalets, domes, and boutique stays.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">🌍 Global Travelers & STR Industry Experts</h3>
                  <p className="text-blue-800">
                    Our journey spans <strong>30+ countries across 6 continents</strong>, experiencing vacation rentals firsthand as consumers. This global perspective, combined with our expertise in <strong>short-term rental technology and property management systems (PMS)</strong>, gives us unique insights into what travelers want and how PMCs can deliver it.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-green-900 mb-3">💼 100+ PMCs Trust Our Expertise</h3>
                  <p className="text-green-800">
                    We have worked with over 100 PMCs. Jan works in the tech side helping them automate their operations to save time and earn more money (e.g., StayC, We Host, Brickon, Astay, In Playa Rentals, Momentum Cabo). Elsa creates content to grow their brand and increase direct bookings (e.g., Kamili Villas).
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-purple-900 mb-3">🎯 The BookDirectStays Solution</h3>
                  <p className="text-purple-800">
                    We discovered that most of the listings on OTAs are professionally managed and can also be booked direct for way cheaper through their direct booking sites, but they're extremely hard to find. So we built the solution for that: a <strong>global directory of verified professional hosts</strong>, making it easier for travelers to find and trust direct booking options while helping PMCs increase their direct booking revenue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Who We Are
            </h2>
          </div>
          
                                <div className="max-w-4xl mx-auto">
            {/* Team Photo */}
            <div className="text-center mb-12">
              <div className="w-64 h-64 mx-auto mb-8 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/uploads/elsa-jan-profile.jpg" 
                  alt="Elsa Ibos and Jan Sahagun - Co-Founders of BookDirectStays"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Team Descriptions with Arrows */}
            <div className="space-y-12">
              {/* Elsa - Co-Founder (Left Side) */}
              <div className="flex items-start space-x-6">
                <div className="flex-1 text-right">
                  <h3 className="text-2xl font-bold text-purple-900 mb-3">Elsa Ibos</h3>
                  <p className="text-purple-700 font-medium mb-4">Co-Founder & Content Strategist</p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Strategic Planner, Brand Strategist and Content Creator with 5+ years of experience. Elsa leads our social media strategy and content partnerships with property managers worldwide. She has already collaborated with vacation rental companies while traveling, helping them tell their stories and grow their direct bookings (e.g., Kamili Villas).
                  </p>
                  <div className="mt-4">
                    <Button 
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                      onClick={() => window.open('https://www.linkedin.com/in/elsa-ibos/', '_blank')}
                    >
                      View LinkedIn
                    </Button>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
                <div className="w-32 h-32 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="/uploads/elsa-profile.jpg" 
                    alt="Elsa Ibos - Co-Founder of BookDirectStays"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Jan - Founder (Right Side) */}
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="/uploads/jan-profile.jpg" 
                    alt="Jan Sahagun - Founder of BookDirectStays"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-900 mb-3">Jan Sahagun</h3>
                  <p className="text-blue-700 font-medium mb-4">Founder & STR Tech Expert</p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We have worked with over 100 PMCs. Jan works in the tech side helping them automate their operations to save time and earn more money (e.g., StayC, We Host, Brickon, Astay, In Playa Rentals, Momentum Cabo).
                  </p>
                  <div className="mt-4">
                    <Button 
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      onClick={() => window.open('https://www.linkedin.com/in/jan-sahagun-escosa/', '_blank')}
                    >
                      View LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Directory + Partnerships Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
              Directory + Partnerships
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Smart Investment for Your Business</h3>
                <p className="text-blue-800 mb-4">
                  <strong>List your company for just €99.99/year</strong> - that's less than €0.28 per day, or roughly the cost of a coffee. 
                  <span className="text-blue-600 text-sm block mt-1">*Website maintenance costs require this small fee</span>
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🚀 Partnership Opportunities to Scale Your Direct Bookings</h3>
                <p className="text-purple-800 mb-4">
                  Beyond basic listing, unlock premium growth opportunities designed specifically for property managers:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📱</span>
                    </div>
                    <h4 className="font-semibold text-purple-900 mb-2">Social Media Growth</h4>
                    <p className="text-sm text-purple-700">Elsa creates engaging content & campaigns to boost your online presence</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <h4 className="font-semibold text-purple-900 mb-2">Featured Visibility</h4>
                    <p className="text-sm text-purple-700">Premium placement & enhanced visibility to attract more guests</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <h4 className="font-semibold text-purple-900 mb-2">Custom Partnerships</h4>
                    <p className="text-sm text-purple-700">Tailored consulting services and marketing collaborations to maximize your direct booking success</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setLocation("/partnerships")}
                >
                  🚀 Explore Partnership Opportunities
                </Button>
                <p className="text-gray-500 text-sm mt-2">Discover how we can help you grow your direct bookings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Coverage Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Global Coverage 🌍
            </h2>
            <p className="text-xl text-gray-600">
              BookDirectStays is global. We feature verified PMCs & owners using PMS across:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🇪🇺</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Europe</h3>
              <p className="text-gray-600 text-sm">France, Spain, Italy, Portugal, Greece, UK, Ireland…</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">North America</h3>
              <p className="text-gray-600 text-sm">USA, Canada, Mexico…</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Latin America & Caribbean</h3>
              <p className="text-gray-600 text-sm">Jamaica, Bahamas, Brazil, Argentina…</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌏</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Asia-Pacific</h3>
              <p className="text-gray-600 text-sm">Indonesia, Thailand, Australia, New Zealand…</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Africa & Middle East</h3>
              <p className="text-gray-600 text-sm">Morocco, South Africa, Egypt, UAE…</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Types</h3>
              <p className="text-gray-600 text-sm">Villas, cabins, apartments, chalets, domes, boutique stays</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-700 mb-6">
              Whether you're looking for a villa in Greece, a cabin in Canada, an apartment in Paris, or a beach house in Mexico, BookDirectStays connects you directly with verified professional hosts.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                🌍 Our Global Vision for Direct Bookings
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We believe in a world where booking direct becomes the default choice across all continents and property types
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Vision Statement */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Transforming Global Vacation Rental Industry
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Affordable Travel Worldwide</h4>
                      <p className="text-gray-600">Guests save 10-30% on vacation rentals across Europe, North America, Asia-Pacific, Latin America, Africa, and Oceania</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Profitable PMC Operations</h4>
                      <p className="text-gray-600">Professional property managers increase revenue by 15-25% through direct bookings and reduced OTA commissions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Industry Transparency</h4>
                      <p className="text-gray-600">Clear pricing, verified hosts, and direct communication create trust across the global short-term rental ecosystem</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Global Discovery Platform</h4>
                      <p className="text-gray-600">Direct booking websites of all sizes become discoverable and trusted worldwide through our verified directory</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Coverage Visual */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  🌍 Global Coverage & Property Types
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🇪🇺</span>
                      <span className="font-medium">Europe</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🌎</span>
                      <span className="font-medium">North America</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🌏</span>
                      <span className="font-medium">Asia-Pacific</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🏖️</span>
                      <span className="font-medium">Latin America</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🌍</span>
                      <span className="font-medium">Africa</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🦘</span>
                      <span className="font-medium">Oceania</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-center text-gray-600 text-sm">
                    <strong>Property Types:</strong> Villas, Apartments, Cabins, Chalets, Domes, Boutique Stays, Beach Houses, Mountain Retreats
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of travelers and hosts who've discovered the benefits of booking direct.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                onClick={() => setLocation("/find-host")}
              >
                Find Your Stay
              </Button>
              <Button 
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold"
                onClick={() => setLocation("/submit")}
              >
                List Your Company
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600">
              All companies listed are verified before publishing. If you see an issue, or outdated info contact us at{' '}
              <a href="mailto:bookdirectstays@gmail.com" className="text-blue-600 hover:underline">
                bookdirectstays@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
