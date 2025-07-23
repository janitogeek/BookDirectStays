import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ExternalLink, MapPin, Building2, Users, Star, Heart, Sparkles } from "lucide-react";
import { SiInstagram, SiFacebook, SiLinkedin, SiTiktok, SiYoutube } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { airtableService, Submission } from "@/lib/airtable";
import { isAirtableId } from "@/lib/utils";
import { useClickTracking } from "@/lib/click-tracking";

export default function SubmissionProperty() {
  const [, params] = useRoute('/property/:id');
  const submissionId = params?.id;

  const { data: submission, isLoading, error } = useQuery({
    queryKey: ["/api/submission", submissionId],
    queryFn: () => {
      if (!submissionId) return null;
      
      // Check if it's an Airtable ID or a slug
      if (isAirtableId(submissionId)) {
        return airtableService.getSubmissionById(submissionId);
      } else {
        return airtableService.getSubmissionBySlug(submissionId);
      }
    },
    enabled: !!submissionId,
  });

  // Initialize click tracking when submission data is available
  const clickTracking = submission ? useClickTracking(submission.id) : null;

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

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <SiInstagram className="w-5 h-5 text-pink-600" />;
      case 'facebook':
        return <SiFacebook className="w-5 h-5 text-blue-600" />;
      case 'linkedin':
        return <SiLinkedin className="w-5 h-5 text-blue-700" />;
      case 'tiktok':
        return <SiTiktok className="w-5 h-5 text-black" />;
      case 'youtube':
        return <SiYoutube className="w-5 h-5 text-red-600" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/">← Back to Home</a>
          </Button>
        </div>
      </div>
    );
  }

  // Parse social media links
  const socialLinks = [];
  if (submission.instagram) {
    socialLinks.push({ platform: 'Instagram', url: submission.instagram });
  }
  if (submission.facebook) {
    socialLinks.push({ platform: 'Facebook', url: submission.facebook });
  }
  if (submission.linkedin) {
    socialLinks.push({ platform: 'LinkedIn', url: submission.linkedin });
  }
  if (submission.tiktok) {
    socialLinks.push({ platform: 'TikTok', url: submission.tiktok });
  }
  if (submission.youtubeVideoTour) {
    socialLinks.push({ platform: 'YouTube', url: submission.youtubeVideoTour });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      {submission.highlightImage && (
        <div className="relative h-96">
          <img
            src={submission.highlightImage}
            alt={submission.brandName}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content Section with Light Grey Background */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Brand Header Section */}
            <div className="flex items-start gap-4 mb-6">
              {submission.logo && (
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                  <img
                    src={submission.logo}
                    alt={`${submission.brandName} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{submission.brandName}</h1>
                
                {/* One-line Description */}
                {submission.oneLineDescription && (
                  <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    {submission.oneLineDescription}
                  </p>
                )}

                {/* Countries */}
                <div className="flex items-center gap-2 text-gray-900 mb-2">
                  {submission.countries.map((country, index) => (
                    <span key={country} className="flex items-center gap-1">
                      {getFlagEmoji(country)} {country}
                      {index < submission.countries.length - 1 && ", "}
                    </span>
                  ))}
                </div>

                {/* Cities/Regions */}
                {submission.citiesRegions && submission.citiesRegions.length > 0 && (
                  <div className="text-gray-700 mb-4">
                    <span className="font-medium">Cities:</span> {submission.citiesRegions.join(", ")}
                  </div>
                )}

                {/* Property Count */}
                {submission.numberOfListings && (
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <Building2 className="w-5 h-5" />
                    <span className="font-medium">{submission.numberOfListings} Properties</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  {submission.website && (
                    <Button size="lg" asChild>
                      <a 
                        href={submission.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                        onClick={() => clickTracking?.trackWebsite()} // Track website clicks
                      >
                        <ExternalLink className="w-5 h-5" />
                        Book Direct
                      </a>
                    </Button>
                  )}
                  
                  {socialLinks.length > 0 && (
                    <div className="flex items-center gap-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform"
                          title={social.platform}
                          onClick={() => {
                            // Track social media clicks based on platform
                            switch (social.platform.toLowerCase()) {
                              case 'instagram':
                                clickTracking?.trackInstagram();
                                break;
                              case 'facebook':
                                clickTracking?.trackFacebook();
                                break;
                              case 'linkedin':
                                clickTracking?.trackLinkedIn();
                                break;
                              case 'tiktok':
                                clickTracking?.trackTikTok();
                                break;
                              case 'youtube':
                                clickTracking?.trackYouTube();
                                break;
                              default:
                                clickTracking?.track('website');
                            }
                          }}
                        >
                          {getSocialIcon(social.platform)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2">
                {/* Why Book With Section */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-6 h-6 text-red-500" />
                      Why book with {submission.brandName}?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {submission.whyBookWithYou}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats & Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Property Count */}
                  {submission.numberOfListings && (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{submission.numberOfListings}</div>
                        <div className="text-sm text-gray-600">Properties Available</div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Countries Count */}
                  <Card>
                    <CardContent className="p-6 text-center">
                      <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{submission.countries.length}</div>
                      <div className="text-sm text-gray-600">
                        {submission.countries.length === 1 ? 'Country' : 'Countries'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Info Sections */}
                {/* Types of Stays */}
                {submission.typesOfStays && submission.typesOfStays.length > 0 && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Types of Stays</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {submission.typesOfStays.map((type, index) => (
                          <Badge key={index} variant="secondary">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Ideal For */}
                {submission.idealFor && submission.idealFor.length > 0 && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Ideal For</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {submission.idealFor.map((ideal, index) => (
                          <Badge key={index} variant="outline">
                            {ideal}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Perks & Amenities */}
                {submission.perksAmenities && submission.perksAmenities.length > 0 && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Perks & Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {submission.perksAmenities.map((perk, index) => (
                          <Badge key={index} variant="secondary">
                            {perk}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Rating Screenshot */}
              <div className="lg:col-span-1">
                {/* Rating Screenshot Card */}
                {submission.ratingScreenshot && (
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Guest Reviews & Ratings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg overflow-hidden bg-gray-50 p-2">
                        <img
                          src={submission.ratingScreenshot}
                          alt={`${submission.brandName} ratings and reviews`}
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Real guest ratings and reviews from booking platforms
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 