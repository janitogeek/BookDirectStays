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
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3">🌍 Global Traveler & STR Industry Expert</h3>
                <p className="text-blue-800 mb-4">
                  My journey spans <strong>30+ countries across 6 continents</strong>, experiencing vacation rentals firsthand as a consumer. This global perspective, combined with my expertise in <strong>short-term rental technology and property management systems (PMS)</strong>, gives me unique insights into what travelers want and how PMCs can deliver it.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-green-900 mb-3">💼 100+ PMCs Trust My Expertise</h3>
                <p className="text-green-800 mb-4">
                  I've collaborated with industry leaders including <strong>We Host, Brickon, StayC, Astay, In Playa Rentals, and Momentum Cabo</strong>. My work focuses on helping property managers adopt <strong>cutting-edge technology, optimize direct booking strategies, and maximize profitability</strong> through smart automation and workflow optimization.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🎯 The BookDirectStays Solution</h3>
                <p className="text-purple-800">
                  I discovered that while most PMCs have direct booking websites, they're often <strong>hard to discover compared to OTA listings</strong>. BookDirectStays solves this by providing a <strong>global directory of verified professional hosts</strong>, making it easier for travelers to find and trust direct booking options while helping PMCs increase their direct booking revenue.
                </p>
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
              {/* Jan - Founder (First) */}
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="/uploads/jan-profile.png" 
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
                    I've worked with over 100+ property management companies (PMCs) including industry leaders like We Host, Brickon, StayC, Astay, In Playa Rentals, and Momentum Cabo. My expertise spans from helping PMCs adopt cutting-edge technology to optimizing their direct booking strategies for maximum profitability.
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

              {/* Elsa - Co-Founder (Second) */}
              <div className="flex items-start space-x-6">
                <div className="flex-1 text-right">
                  <h3 className="text-2xl font-bold text-purple-900 mb-3">Elsa Ibos</h3>
                  <p className="text-purple-700 font-medium mb-4">Co-Founder & Content Strategist</p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Strategic Planner, Brand Strategist and Content Creator with 5+ years of experience. Elsa leads our social media strategy and content partnerships with property managers worldwide. She has already collaborated with vacation rental companies while traveling, helping them tell their stories and grow their direct bookings.
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
              Our Vision
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                We believe in a world where booking direct is the default choice:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>More affordable for travelers.</strong></li>
                <li><strong>More profitable and sustainable for professional hosts and property managers.</strong></li>
                <li><strong>More transparent for the entire short-term rental industry.</strong></li>
              </ul>
              <p className="mb-6">
                And where direct booking websites — no matter how big or small — can be discovered and trusted worldwide.
              </p>
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
