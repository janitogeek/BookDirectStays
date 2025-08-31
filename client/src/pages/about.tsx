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
                Global directory connecting travelers with verified professional hosts — PMCs and owners using PMS — for direct vacation rental bookings across 50+ countries. No OTA fees, better rates, trusted operators worldwide.
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



      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">

                <div className="space-y-12">
                  {/* 🌍 A Life of Travel - Left-aligned */}
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">🌍 A Life of Travel</h3>
                    <p className="text-lg leading-relaxed text-gray-700">
                      Travel has always been part of my life. First with my family, later on my own, and now with my girlfriend. I've been in over 30 countries across all continents, collected stories, and stayed in countless short-term rentals along the way.
                    </p>
                  </div>
                  
                  {/* 🏡 The Roots of Hospitality - Right-aligned */}
                  <div className="text-right">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">🏡 The Roots of Hospitality</h3>
                    <p className="text-lg leading-relaxed text-gray-700">
                      From early on, my parents set the tone: we never stayed in hotels. Vacation rentals felt more personal, more genuine, and were always more affordable. That shaped how I see hospitality: not as a transaction, but as a human connection.
                    </p>
                  </div>
                  
                  {/* 🔎 A Problem I Couldn't Ignore - Left-aligned */}
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">🔎 A Problem I Couldn't Ignore</h3>
                    <p className="text-lg leading-relaxed text-gray-700">
                      Years later, working in STR tech, I noticed something striking. Nearly every property manager, and many owners using PMS systems, already had a direct booking website — often with better rates and perks you'd never find on OTAs. The problem was that most were outdated, and almost all were impossible to find compared to OTA listings.
                    </p>
                  </div>
                  
                  {/* 🚀 The Solution: BookDirectStays - Right-aligned */}
                  <div className="text-right">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 The Solution: BookDirectStays</h3>
                    <p className="text-lg leading-relaxed text-gray-700">
                      That's the gap I set out to close. BookDirectStays is my answer: a global directory that gives verified professional hosts the visibility they deserve and gives travelers a simple, trustworthy way to discover them.
                    </p>
                  </div>
                  
                  {/* 🤝 Building More Than Visibility - Centered (Highlighted) */}
                  <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-200">
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">🤝 Building More Than Visibility</h3>
                    <p className="text-xl leading-relaxed text-gray-700 max-w-4xl mx-auto">
                      But visibility alone isn't enough. That's why I teamed up with my girlfriend, Elsa. Beyond creating content, she helps property managers and companies build their personal brands, strengthen their presence on social platforms, and grow their communities — turning visibility into real, lasting direct bookings. Together, our mission is to help hosts reduce OTA dependency and build thriving brands of their own.
                    </p>
                  </div>
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
              <img 
                src="/uploads/elsa-jan-profile.jpg" 
                alt="Elsa and Jan - BookDirectStays Founders"
                className="w-80 h-80 rounded-2xl mx-auto shadow-lg object-cover"
              />
            </div>


            {/* Team Descriptions with Professional Boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Elsa - Co-Founder (Left Box) */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src="/uploads/elsa-profile.jpg" 
                      alt="Elsa Ibos"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Elsa Ibos</h3>
                  <p className="text-purple-600 font-semibold text-lg">Co-Founder</p>
                </div>
                <p className="text-gray-700 text-base leading-relaxed text-center mb-6">
                  Strategic Planner, Brand Strategist and Content Creator (5+ years). Elsa leads our social media strategy and content partnerships with property managers worldwide.
                </p>
                <div className="text-center">
                  <Button 
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                    onClick={() => window.open('https://www.linkedin.com/in/elsa-ibos/', '_blank')}
                  >
                    View LinkedIn
                  </Button>
                </div>
              </div>

              {/* Jan - Founder (Right Box) */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src="/uploads/jan-profile.jpg" 
                      alt="Jan Sahagun"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Jan Sahagun</h3>
                  <p className="text-blue-600 font-semibold text-lg">Founder</p>
                </div>
                <p className="text-gray-700 text-base leading-relaxed text-center mb-6">
                  Ex-athlete, traveler, lifelong STR consumer, and now STR tech professional dedicated to empowering PMCs with smart automation tools and visibility. I've worked with over 100 PMCs to help them automate their operations to save time and earn more money (e.g., StayC, We Host, Brickon, Astay, In Playa Rentals, Momentum Cabo).
                </p>
                <div className="text-center">
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
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-center text-gray-600 text-sm">
                    Whether you're looking for a villa in Greece, a cabin in Canada, an apartment in Paris, or a beach house in Mexico, BookDirectStays connects you directly with verified professional hosts.
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
