import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from "wouter";
import { ExternalLink, MapPin, Building2 } from "lucide-react";
import { SiInstagram, SiFacebook, SiLinkedin, SiTiktok, SiYoutube } from "react-icons/si";
import { airtableService, Submission } from "@/lib/airtable";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { generateSlug } from "@/lib/utils";
import TopStats from "@/components/top-stats";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedHostsCarousel() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const swiperRef = useRef<any>(null);

  // Fetch all approved submissions and filter for featured ones
  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ["/api/featured-submissions"],
    queryFn: () => airtableService.getApprovedSubmissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle popover open/close for carousel pause/resume
  const handlePopoverChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (swiperRef.current?.swiper) {
      if (open) {
        swiperRef.current.swiper.autoplay.stop();
      } else {
        swiperRef.current.swiper.autoplay.start();
      }
    }
  };

  // Get flag emoji for country name
  const getFlagEmoji = (countryName: string) => {
    const countryMap: { [key: string]: string } = {
      'United States': '🇺🇸',
      'Spain': '🇪🇸',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Australia': '🇦🇺',
      'Canada': '🇨🇦',
      'Italy': '🇮🇹',
      'Portugal': '🇵🇹',
      'Thailand': '🇹🇭',
      'Greece': '🇬🇷',
      'Netherlands': '🇳🇱',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Belgium': '🇧🇪',
      'Croatia': '🇭🇷',
      'Czech Republic': '🇨🇿',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Hungary': '🇭🇺',
      'Ireland': '🇮🇪',
      'Norway': '🇳🇴',
      'Poland': '🇵🇱',
      'Sweden': '🇸🇪',
      'Turkey': '🇹🇷',
      'Albania': '🇦🇱'
    };
    return countryMap[countryName] || '🌍';
  };

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
        ref={swiperRef}
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
        className="featured-hosts-swiper h-[600px] [&_.swiper-pagination]:relative [&_.swiper-pagination]:mt-8 [&_.swiper-pagination-bullet]:bg-gray-300 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-blue-600 [&_.swiper-button-next]:text-blue-600 [&_.swiper-button-prev]:text-blue-600 [&_.swiper-button-next]:bg-white [&_.swiper-button-prev]:bg-white [&_.swiper-button-next]:rounded-full [&_.swiper-button-prev]:rounded-full [&_.swiper-button-next]:w-11 [&_.swiper-button-prev]:w-11 [&_.swiper-button-next]:h-11 [&_.swiper-button-prev]:h-11 [&_.swiper-button-next]:shadow-lg [&_.swiper-button-prev]:shadow-lg [&_.swiper-button-next:after]:text-base [&_.swiper-button-prev:after]:text-base [&_.swiper-button-next:after]:font-bold [&_.swiper-button-prev:after]:font-bold [&_.swiper-button-next]:top-1/2 [&_.swiper-button-prev]:top-1/2 [&_.swiper-button-next]:-translate-y-1/2 [&_.swiper-button-prev]:-translate-y-1/2"
      >
        {featuredHosts.map((host) => (
          <SwiperSlide key={host.id}>
            <Card className="group hover:shadow-lg transition-shadow duration-200 border border-gray-200 bg-white relative h-full">
              {/* Featured Badge */}
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-yellow-500 text-yellow-900 font-semibold">
                  Featured
                </Badge>
              </div>

              <CardContent className="p-6 flex flex-col h-full">
                {/* Header Image with Logo Overlay */}
                {host.highlightImage && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={host.highlightImage}
                      alt={host.brandName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    
                    {/* Logo Overlay */}
                    {host.logo && (
                      <div className="absolute top-3 left-3 right-3 flex justify-center">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-[80%]">
                          <img
                            src={host.logo}
                            alt={`${host.brandName} logo`}
                            className="max-w-full max-h-12 object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Brand Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">
                    {host.brandName}
                  </h3>
                  
                  {/* One-line Description */}
                  <div className="min-h-[3rem]">
                    {host.oneLineDescription && (
                      <p className="text-sm italic text-gray-600 leading-relaxed line-clamp-2">
                        {host.oneLineDescription}
                      </p>
                    )}
                  </div>
                </div>

                {/* Property Count */}
                {host.numberOfListings && (
                  <div className="flex items-center gap-1 mb-3 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>{host.numberOfListings} properties</span>
                  </div>
                )}

                {/* Types of Stays - Moved before Countries */}
                {host.typesOfStays && host.typesOfStays.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {host.typesOfStays.map((type, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {type.trim()}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Countries - Moved after Types of Stays */}
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-900">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="flex items-center gap-1 flex-wrap">
                    {host.countries.map((country, index) => (
                      <span key={country}>
                        {getFlagEmoji(country)} {country}
                        {index < host.countries.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                </div>

                {/* Top Stats Component */}
                {host.topStats && (
                  <div className="mb-4">
                    <TopStats 
                      topStats={host.topStats} 
                      brandName={host.brandName}
                      hostWebsite={host.website}
                      onOpenChange={handlePopoverChange}
                    />
                  </div>
                )}

                {/* Why Book With CTA */}
                <div className="mb-6">
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700 hover:text-gray-800"
                  >
                    <Link 
                      to={`/property/${generateSlug(host.brandName)}`}
                    >
                      Why book with {host.brandName}?
                    </Link>
                  </Button>
                </div>

                {/* Bottom Section: Social Links Left, Book Direct Right */}
                <div className="flex items-center justify-between mt-auto pt-4">
                  {/* Social Links - Left */}
                  <div className="flex items-center gap-3">
                    {host.instagram && (
                      <a
                        href={host.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:scale-110 transition-transform"
                        title="Instagram"
                      >
                        <SiInstagram className="w-5 h-5" />
                      </a>
                    )}
                    {host.facebook && (
                      <a
                        href={host.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:scale-110 transition-transform"
                        title="Facebook"
                      >
                        <SiFacebook className="w-5 h-5" />
                      </a>
                    )}
                    {host.linkedin && (
                      <a
                        href={host.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:scale-110 transition-transform"
                        title="LinkedIn"
                      >
                        <SiLinkedin className="w-5 h-5" />
                      </a>
                    )}
                    {host.tiktok && (
                      <a
                        href={host.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:scale-110 transition-transform"
                        title="TikTok"
                      >
                        <SiTiktok className="w-5 h-5" />
                      </a>
                    )}
                    {host.youtubeVideoTour && (
                      <a
                        href={host.youtubeVideoTour}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:scale-110 transition-transform"
                        title="YouTube"
                      >
                        <SiYoutube className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  {/* Book Direct - Right */}
                  {host.website && (
                    <Button 
                      asChild 
                      variant="default" 
                      size="sm"
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
                  )}
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 