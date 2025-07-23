import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from "wouter";
import { ExternalLink, Eye, MapPin } from "lucide-react";
import { airtableService, Submission } from "@/lib/airtable";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { generateSlug } from "@/lib/utils";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedHostsCarousel() {
  // Fetch all approved submissions and filter for featured ones
  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ["/api/featured-submissions"],
    queryFn: () => airtableService.getApprovedSubmissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Our Featured Hosts
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <CardContent className="text-center">
                <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !submissions) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Our Featured Hosts
        </h2>
        <p className="text-gray-600">Unable to load featured hosts at this time.</p>
      </div>
    );
  }

    // Filter for featured hosts (Premium plans that are approved/published)
  // Shows ALL featured companies with consistent card heights
  const featuredHosts = submissions?.filter(submission => {
    const isPremium = submission.plan?.includes('Premium') || 
                     submission.plan?.includes('€499.99') || 
                     submission.plan?.includes('499.99');
    const isApproved = submission.status === 'Approved – Published';
    
    return isPremium && isApproved;
  }) || [];

  if (featuredHosts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Our Featured Hosts
        </h2>
        <p className="text-gray-600">No featured hosts available at this time.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Our Featured Hosts
        </h2>
        <p className="text-xl text-gray-600">
          Trusted vacation rental brands chosen by thousands of travelers
        </p>
      </div>

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="featured-hosts-swiper [&_.swiper-pagination]:relative [&_.swiper-pagination]:mt-8 [&_.swiper-pagination-bullet]:bg-gray-300 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-blue-600 [&_.swiper-button-next]:text-blue-600 [&_.swiper-button-prev]:text-blue-600 [&_.swiper-button-next]:bg-white [&_.swiper-button-prev]:bg-white [&_.swiper-button-next]:rounded-full [&_.swiper-button-prev]:rounded-full [&_.swiper-button-next]:w-11 [&_.swiper-button-prev]:w-11 [&_.swiper-button-next]:h-11 [&_.swiper-button-prev]:h-11 [&_.swiper-button-next]:shadow-lg [&_.swiper-button-prev]:shadow-lg [&_.swiper-button-next:after]:text-base [&_.swiper-button-prev:after]:text-base [&_.swiper-button-next:after]:font-bold [&_.swiper-button-prev:after]:font-bold"
      >
        {featuredHosts.map((host) => (
          <SwiperSlide key={host.id}>
            <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 bg-white h-full">
              <CardContent className="p-8 text-center h-full flex flex-col">
                {/* Logo */}
                <div className="mb-6">
                  {host.logo ? (
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <img
                        src={host.logo}
                        alt={`${host.brandName} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">
                        {host.brandName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content - fills available space */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Brand Name */}
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {host.brandName}
                      </h3>
                    </div>

                    {/* Countries */}
                    <div className="text-sm text-gray-700 mb-3">
                      {host.countries.slice(0, 2).join(", ")}
                      {host.countries.length > 2 && ` +${host.countries.length - 2} more`}
                    </div>
                    
                    {/* Stats - always reserve space for consistent card height */}
                    <div className="text-sm text-gray-600 mb-4 min-h-[20px]">
                      {host.topStats && host.topStats.trim() ? (
                        <>
                          <span className="font-medium">Stats:</span> {host.topStats}
                        </>
                      ) : (
                        <span className="invisible">placeholder</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 mt-4">
                    <Button 
                      asChild
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <a 
                        href={host.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Book Direct
                      </a>
                    </Button>
                    
                    <Button 
                      asChild
                      variant="outline" 
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Link 
                        to={`/property/${generateSlug(host.brandName)}`} 
                        className="flex items-center justify-center gap-2"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 