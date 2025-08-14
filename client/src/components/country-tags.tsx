import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { getFlagByCountryName } from "@/lib/utils";

interface CountryTagsProps {
  countries: any[];
  isLoading: boolean;
  activeCountry?: string;
}

// Get flag emoji for country name
const getFlagEmoji = (countryName: string) => {
  // Use the comprehensive flag mapping from utils
  return getFlagByCountryName(countryName);
};

export default function CountryTags({ countries, isLoading, activeCountry }: CountryTagsProps) {
  return (
    <section className="py-6 bg-white shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto py-2 scrollbar-hide gap-2 no-scrollbar">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="inline-block h-9 w-20 rounded-full shrink-0" />
            ))
          ) : (
            countries.map((country) => (
              <Link 
                key={country.id} 
                href={`/country/${country.slug}`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${
                  activeCountry === country.slug
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-primary hover:text-white'
                }`}
              >
                <span className="text-lg">{getFlagEmoji(country.name)}</span>
                {country.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
