import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
    socials: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <Card className="rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] group">
      <div className="relative overflow-hidden">
        <img 
          src={listing.image} 
          alt={`${listing.name} properties`} 
          className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        {listing.featured && (
          <div className="absolute top-2 right-2 bg-secondary text-white px-3 py-1 rounded-full text-xs font-medium">
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
          >
            <a 
              href={listing.website} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Visit Direct Booking Site
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
