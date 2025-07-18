import { ExternalLink, MapPin, Star } from "lucide-react";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Listing } from "@/lib/data";
import { generateSlug } from "@/lib/utils";

interface PropertyCardProps {
  property: Listing;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Generate slug from property name
  const slug = generateSlug(property.name);

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Generate structured data for each property
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": property.name,
    "description": property.description,
    "url": property.website,
    "image": property.image,
    "logo": property.logo,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": property.countries
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31",
      "description": "Direct booking available - no OTA fees"
    },
    "provider": {
      "@type": "Organization",
      "name": property.name,
      "url": property.website,
      "sameAs": [
        property.socials.facebook,
        property.socials.instagram,
        property.socials.linkedin
      ].filter(Boolean)
    },
    "potentialAction": {
      "@type": "ReserveAction",
      "target": property.website,
      "result": {
        "@type": "Reservation",
        "name": `Book ${property.name} directly`
      }
    }
  };

  return (
    <>
      {/* Structured Data for AI/LLM Understanding */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
        <div className="relative">
          <img 
            src={property.image} 
            alt={`${property.name} - Direct booking vacation rental`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {property.featured && (
            <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
              ✦ Featured
            </Badge>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <img 
                src={property.logo} 
                alt={`${property.name} logo`}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                {property.name}
              </h3>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-1 mb-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            {property.countries.map((country, index) => (
              <span key={country} className="text-sm text-gray-600">
                {getFlagEmoji(country.substring(0, 2))} {country}
                {index < property.countries.length - 1 && ", "}
              </span>
            ))}
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>
          
          <div className="flex flex-col gap-2">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              asChild
            >
              <a 
                href={property.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <span>Visit Direct Booking Site</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link href={`/property/${slug}`}>
                View Details
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
