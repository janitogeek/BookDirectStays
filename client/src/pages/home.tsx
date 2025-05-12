import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import PropertyCard from "@/components/property-card";
import CountryTags from "@/components/country-tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [, setLocation] = useLocation();
  
  // Fetch listings
  const { data: listingsData, isLoading: isListingsLoading } = useQuery({
    queryKey: ["/api/listings", visibleCount, selectedCountry],
    queryFn: async () => {
      const countryParam = selectedCountry ? `&country=${selectedCountry}` : '';
      const res = await apiRequest("GET", `/api/listings?limit=${visibleCount}${countryParam}`, undefined);
      return res.json();
    }
  });

  // Fetch countries
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // Implement search functionality
  };

  const totalListings = listingsData?.total || 0;
  const hasMore = listingsData?.hasMore || false;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="w-full h-[500px] bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1000&q=80')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Discover and book direct.<br />
              <span className="text-primary">No fees</span>, just better stays.
            </h1>
            <p className="text-xl text-white mb-8 max-w-xl">
              Explore trusted rentals worldwide — skip the middleman.
            </p>
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <Input 
                type="text" 
                placeholder={`Search among ${totalListings} direct booking sites...`} 
                className="w-full py-6 px-6 rounded-full text-gray-700 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition"
              >
                <i className="fas fa-search"></i>
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Country Tags Section */}
      <CountryTags countries={countries || []} isLoading={isCountriesLoading} />

      {/* Main Directory Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold">Featured Direct Booking Sites</h2>
            
            {/* Country Filter Dropdown */}
            <div className="w-full md:w-64">
              <Select 
                value={selectedCountry} 
                onValueChange={(value) => {
                  setSelectedCountry(value);
                  // Reset visible count when changing filters
                  setVisibleCount(6);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  {countries?.map((country: any) => (
                    <SelectItem key={country.id} value={country.slug}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Browse by Country Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Browse direct booking sites by country</h2>
          
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
                  <a className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-center">
                    <span className="text-xl block mb-1">
                      {getFlagEmoji(country.code)}
                    </span>
                    <span className="font-medium">{country.name}</span>
                    <span className="text-gray-500 text-sm block">({country.listingCount})</span>
                  </a>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Email Subscription Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Be the first to know when we launch</h2>
          <p className="mb-8 max-w-xl mx-auto">
            Join our mailing list to receive updates about new listings and features.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4" onSubmit={handleEmailSubscribe}>
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
            <Button 
              type="submit" 
              className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg transition"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

// Helper function to convert country code to flag emoji
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Email subscription handler
function handleEmailSubscribe(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const form = e.currentTarget;
  const email = new FormData(form).get('email') as string;
  
  apiRequest("POST", "/api/subscribe", { email })
    .then(() => {
      alert("Thank you for subscribing!");
      form.reset();
    })
    .catch((error) => {
      console.error("Subscription failed:", error);
      alert("Subscription failed. Please try again.");
    });
}
