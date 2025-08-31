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
              <p className="mb-6">
                For as long as I can remember, I've been a traveler — first with my family, then on my own and now with my girlfriend. I've explored over 30 countries across Europe, North America, Latin America, Asia-Pacific, and Africa. From early on, I was also a consumer of short-term rentals. My parents always chose vacation rentals instead of hotels, since they were usually more genuine, personal, and affordable. That experience shaped the way I travel and how I see hospitality today.
              </p>
              <p className="mb-6">
                Now, after years of travel, I also work in the tech side of the STR industry — helping property managers adopt the right tools to save time, automate workflows, and grow profits. I've seen firsthand that most property managers — and even some owners using PMS systems — already have their own direct booking websites. But here's the challenge: some sites are modern and polished, most are outdated, but all of them are hard to find compared to OTA listings.
              </p>
              <p className="mb-6">
                That's why I built BookDirectStays: a global directory that gives visibility to these verified professional hosts, making it easier for travelers to discover and trust them.
              </p>
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
          
                      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Jan */}
              <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src="/uploads/jan-profile.png" 
                      alt="Jan Sahagun - Founder of BookDirectStays"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl text-blue-900">Jan Sahagun</CardTitle>
                  <p className="text-blue-700 font-medium">Founder</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">
                    Traveler, lifelong STR consumer, and now STR tech professional dedicated to empowering PMCs with smart tools and visibility.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    onClick={() => window.open('https://www.linkedin.com/in/jan-sahagun-escosa/', '_blank')}
                  >
                    View LinkedIn
                  </Button>
                </CardContent>
              </Card>

            {/* Elsa */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src="/uploads/elsa-profile.jpg" 
                    alt="Elsa Ibos - Co-Founder of BookDirectStays"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl text-purple-900">Elsa Ibos</CardTitle>
                <p className="text-purple-700 font-medium">Co-Founder</p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Strategic Planner, Brand Strategist and Content Creator (5+ years). Elsa leads our social media strategy and content partnerships with property managers worldwide.
                </p>
                <Button 
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                  onClick={() => window.open('https://www.linkedin.com/in/elsa-ibos/', '_blank')}
                >
                  View LinkedIn
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Book Direct Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Book Direct?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Save 10-30%</h3>
              <p className="text-gray-600 text-sm">Guests save compared to OTA prices (no service fees)</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Earn More</h3>
              <p className="text-gray-600 text-sm">Professional PMCs and owners earn more by cutting out OTA commissions</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Better Communication</h3>
              <p className="text-gray-600 text-sm">Guests connect directly with verified hosts</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Exclusive Perks</h3>
              <p className="text-gray-600 text-sm">Many operators share special deals only on their direct sites</p>
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
              <p className="mb-6">
                Listing your company on BookDirectStays is almost free (99.99 euros / year - probably less than the cost of a night in one of your properties). *Could not make it free as maintaining the website has costs.
              </p>
              <p className="mb-6">
                In addition, we offer partnership opportunities designed to help PMCs and owners boost their direct bookings:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Social media content creation & campaigns led by Elsa.</li>
                <li>Featured listings & enhanced visibility on the site.</li>
                <li>Custom collaborations and marketing partnerships.</li>
              </ul>
              <div className="text-center">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-semibold"
                  onClick={() => setLocation("/partnerships")}
                >
                  👉 Learn more on our Partnerships page
                </Button>
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
                <span className="text-2xl">🇺🇸</span>
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
