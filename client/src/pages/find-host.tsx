import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { airtableService } from "@/lib/airtable";

export default function FindHost() {
  // Fetch all approved submissions to count by country
  const { data: allSubmissions = [], isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ["/api/submissions/all"],
    queryFn: () => airtableService.getApprovedSubmissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Count submissions by country
  const getCountrySubmissionCount = (countryName: string) => {
    return allSubmissions.filter(submission => 
      submission.countries.some(country => 
        country.toLowerCase() === countryName.toLowerCase()
      )
    ).length;
  };

  // Static list of countries with dynamic counts
  const countries = [
    { id: 1, name: "United States", slug: "usa", code: "US" },
    { id: 2, name: "Spain", slug: "spain", code: "ES" },
    { id: 3, name: "United Kingdom", slug: "uk", code: "GB" },
    { id: 4, name: "Germany", slug: "germany", code: "DE" },
    { id: 5, name: "France", slug: "france", code: "FR" },
    { id: 6, name: "Australia", slug: "australia", code: "AU" },
    { id: 7, name: "Canada", slug: "canada", code: "CA" },
    { id: 8, name: "Italy", slug: "italy", code: "IT" },
    { id: 9, name: "Portugal", slug: "portugal", code: "PT" },
    { id: 10, name: "Thailand", slug: "thailand", code: "TH" },
    { id: 11, name: "Greece", slug: "greece", code: "GR" }
  ].map(country => ({
    ...country,
    listingCount: getCountrySubmissionCount(country.name)
  }));

  console.log('🌍 Find Host - All submissions:', allSubmissions);
  console.log('📊 Find Host - Countries with counts:', countries);

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
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Choose Your Destination
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map((country) => (
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
              ))}
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