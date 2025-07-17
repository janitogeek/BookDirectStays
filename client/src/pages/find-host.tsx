import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { airtableService } from "@/lib/airtable";
import { getActiveCountries, getSubmissionsForCountry } from "@/lib/submission-processor";
import { getCountryCode } from "@/lib/geonames";
import { slugify } from "@/lib/utils";

export default function FindHost() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch active countries (countries that have approved submissions)
  const { data: activeCountryNames = [], isLoading: isCountriesLoading } = useQuery({
    queryKey: ["/api/active-countries"],
    queryFn: () => getActiveCountries(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform active country names into country objects with metadata
  const countries = activeCountryNames.map((countryName, index) => {
    const countryCode = getCountryCode(countryName) || "XX";
    const slug = slugify(countryName);
    
    return {
      id: index + 1,
      name: countryName,
      slug: slug,
      code: countryCode,
    };
  });

  // Fetch submission counts for each active country
  const { data: countriesWithCounts = [], isLoading: isCountsLoading } = useQuery({
    queryKey: ["/api/countries-with-counts", activeCountryNames],
    queryFn: async () => {
      const countriesWithCounts = [];
      
      for (const country of countries) {
        const submissions = await getSubmissionsForCountry(country.name);
        countriesWithCounts.push({
          ...country,
          listingCount: submissions.length
        });
      }
      
      return countriesWithCounts.sort((a, b) => b.listingCount - a.listingCount);
    },
    enabled: activeCountryNames.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log('🌍 Find Host - Active countries:', activeCountryNames);
  console.log('📊 Find Host - Countries with counts:', countriesWithCounts);

  const isLoading = isCountriesLoading || isCountsLoading;

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countriesWithCounts;
    }
    
    return countriesWithCounts.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [countriesWithCounts, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Find a Host by Country
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Select a country to discover verified direct booking vacation rental hosts
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
              <p className="text-lg">
                <span className="font-semibold text-blue-200">Over 1000+</span> verified hosts across{" "}
                <span className="font-semibold text-blue-200">50+ countries</span> worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Choose Your Destination
            </h2>
            
            {/* Search Input */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for a country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 py-3 text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredCountries.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">No countries found</h3>
                    <p>Try searching for a different country name.</p>
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        onClick={clearSearch}
                        className="mt-4"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                filteredCountries.map((country) => (
                <Card key={country.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardContent className="p-6">
                    <Link href={`/country/${country.slug}`} className="block">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getFlagEmoji(country.code)}</span>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {country.name}
                          </h3>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {country.listingCount} hosts
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Discover verified vacation rental hosts offering direct booking in {country.name}
                      </p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        View Hosts in {country.name}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Can't Find Your Country?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We're constantly adding new destinations. Submit your direct booking site to be featured.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/submit">
                Add Your Direct Booking Site
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
} 