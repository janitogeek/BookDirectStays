import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Info } from "lucide-react";

interface PropertyCardProps {
  listing: {
    id: number;
    name: string;
    description: string;
    website: string;
    logo: string;
    image: string;
    featured: boolean;
    countries: string[];
    whyBookWith?: string;
    socials: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <Card className="rounded-xl shadow-md overflow-hidden card-hover group">
      <div className="relative overflow-hidden">
        <img 
          src={listing.image} 
          alt={`${listing.name} properties`} 
          className="listing-image transform transition-transform duration-300 group-hover:scale-105"
        />
        {listing.featured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
            Featured
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <Avatar className="w-10 h-10 rounded-full mr-3">
            <AvatarImage 
              src={listing.logo} 
              alt={`${listing.name} logo`}
              className="object-cover"
            />
            <AvatarFallback>{listing.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold text-gray-800">{listing.name}</h3>
        </div>
        <p className="text-gray-600 mb-3">{listing.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {listing.countries.map((country, index) => (
            <Link key={index} href={`/country/${slugify(country)}`}>
              <Badge variant="outline" className="bg-gray-100 hover:bg-primary hover:text-white cursor-pointer">
                {country}
              </Badge>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {listing.socials.facebook && (
              <a 
                href={listing.socials.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary"
                aria-label={`${listing.name} Facebook`}
              >
                <i className="fab fa-facebook"></i>
              </a>
            )}
            {listing.socials.instagram && (
              <a 
                href={listing.socials.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary"
                aria-label={`${listing.name} Instagram`}
              >
                <i className="fab fa-instagram"></i>
              </a>
            )}
            {listing.socials.linkedin && (
              <a 
                href={listing.socials.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary"
                aria-label={`${listing.name} LinkedIn`}
              >
                <i className="fab fa-linkedin"></i>
              </a>
            )}
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
          >
            <a 
              href={listing.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <span className="hidden sm:inline-block">Visit</span>
              <span className="font-bold">Direct Booking Site</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to convert country name to slug
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
