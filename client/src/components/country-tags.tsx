import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface CountryTagsProps {
  countries: any[];
  isLoading: boolean;
  activeCountry?: string;
}

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
              <Link key={country.id} href={`/country/${country.slug}`}>
                <a 
                  className={`inline-block px-4 py-2 rounded-full whitespace-nowrap transition ${
                    activeCountry === country.slug
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-primary hover:text-white'
                  }`}
                >
                  {country.name}
                </a>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
