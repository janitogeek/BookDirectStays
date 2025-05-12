import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { ExternalLink } from "lucide-react";
import { SiInstagram, SiFacebook, SiLinkedin } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import WhyBookWith from "@/components/why-book-with";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiRequest } from "@/lib/queryClient";
import { getFlagEmoji } from "@/lib/utils";
import { Listing } from "@/lib/data";

export default function Property() {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["/api/property", id],
    queryFn: () => apiRequest<Listing>(`/api/property/${id}`),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full rounded-xl mb-6" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-xl mb-4" />
            <Skeleton className="h-10 w-full mb-8 rounded-lg" />
            <Skeleton className="h-6 w-1/2 mb-3" />
            <Skeleton className="h-4 w-3/4 mb-3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
        <p className="mb-8">The property you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Left Column - Main Content */}
        <div className="md:col-span-2">
          <img 
            src={listing.image} 
            alt={listing.name}
            className="w-full h-72 md:h-96 object-cover rounded-xl mb-6"
          />
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{listing.name}</h1>
          
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {listing.countries.map((country) => (
              <span 
                key={country} 
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <span className="mr-1">{getFlagEmoji(country.substring(0, 2))}</span>
                {country}
              </span>
            ))}
            
            {listing.featured && (
              <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                ✦ Featured
              </span>
            )}
          </div>
          
          <div className="text-gray-700 mb-8 text-lg">
            <p>{listing.description}</p>
          </div>
          
          {/* Display the Why Book With section */}
          {listing.whyBookWith && (
            <WhyBookWith 
              companyName={listing.name} 
              content={listing.whyBookWith}
            />
          )}
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center mb-6">
            <img 
              src={listing.logo} 
              alt={`${listing.name} logo`}
              className="w-16 h-16 rounded-full mr-4 object-cover border border-gray-200"
            />
            <h2 className="text-xl font-semibold">{listing.name}</h2>
          </div>
          
          <Button 
            className="w-full py-6 mb-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all"
            asChild
          >
            <a 
              href={listing.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <span className="font-semibold">Visit Direct Booking Site</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          
          {/* Social Media Links */}
          {(listing.socials?.facebook || listing.socials?.instagram || listing.socials?.linkedin) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Connect Online</h3>
              <div className="flex gap-3">
                {listing.socials?.facebook && (
                  <a 
                    href={listing.socials.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="bg-gray-100 p-3 rounded-full text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-all"
                  >
                    <SiFacebook className="h-5 w-5" />
                  </a>
                )}
                {listing.socials?.instagram && (
                  <a 
                    href={listing.socials.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="bg-gray-100 p-3 rounded-full text-gray-700 hover:bg-pink-100 hover:text-pink-700 transition-all"
                  >
                    <SiInstagram className="h-5 w-5" />
                  </a>
                )}
                {listing.socials?.linkedin && (
                  <a 
                    href={listing.socials.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="bg-gray-100 p-3 rounded-full text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-all"
                  >
                    <SiLinkedin className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            <p>Remember: By booking directly with this property, you'll avoid unnecessary booking fees and enjoy a more personalized experience!</p>
          </div>
        </div>
      </div>
    </main>
  );
}