import React from "react"; // Added missing import for React
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
      {/* Hero Section with Image and Logo Overlay */}
      {submission.highlightImage && (
        <div className="relative h-96">
          <img
            src={submission.highlightImage}
            alt={submission.brandName}
            className="w-full h-full object-cover"
          />
          
          {/* Logo Overlay */}
          {submission.logo && (
            <div className="absolute top-6 left-6 right-6 flex justify-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 max-w-[60%]">
                <img
                  src={submission.logo}
                  alt={`${submission.brandName} logo`}
                  className="max-w-full max-h-16 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Section with Light Grey Background */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Brand Header Section */}
            <div className="mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{submission.brandName}</h1>
                
                {/* One-line Description */}
                {submission.oneLineDescription && (
                  <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    {submission.oneLineDescription}
                  </p>
                )}

                {/* Property Count & Pricing - Standardized with property cards */}
                <div className="flex items-center justify-between mb-3 text-sm">
                  {submission.numberOfListings && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{submission.numberOfListings} properties</span>
                    </div>
                  )}
                  

                  {(submission.minPrice || submission.maxPrice) && submission.currency && (
                    <div className="flex items-center gap-1 font-medium text-blue-600">
                      <span className="text-gray-500">💰</span>
                      <span>
                        {submission.minPrice && submission.maxPrice ? (
                          `from ${submission.minPrice} ${submission.currency.split(' – ')[1]} to ${submission.maxPrice} ${submission.currency.split(' – ')[1]}`
                        ) : submission.minPrice ? (
                          `from ${submission.minPrice} ${submission.currency.split(' – ')[1]}`
                        ) : (
                          `up to ${submission.maxPrice} ${submission.currency.split(' – ')[1]}`
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Property Types - Moved before Countries */}
                {submission.typesOfStays && submission.typesOfStays.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {submission.typesOfStays.map((type, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {type.trim()}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Countries - Moved after Property Types */}
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-900">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="flex items-center gap-1 flex-wrap">
                    {submission.countries.map((country, index) => (
                      <span key={country}>
                        {getFlagEmoji(country)} {country}
                        {index < submission.countries.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                </div>

                {/* Cities - Same styling as countries, positioned after countries */}
                {submission.citiesRegions && submission.citiesRegions.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-900">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="flex items-center gap-1 flex-wrap">
                      Cities: {submission.citiesRegions.join(", ")}
                    </span>
                  </div>
                )}

                {/* Bottom Section: Social Links Left, Book Direct Right - Standardized Layout */}
                <div className="flex items-center justify-between pt-4">
                  {/* Social Links - Left */}
                  <div className="flex items-center gap-3">
                    {submission.instagram && (
                      <a
                        href={submission.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:scale-110 transition-transform"
                        title="Instagram"
                        onClick={() => clickTracking?.trackInstagram()}
                      >
                        <SiInstagram className="w-6 h-6" />
                      </a>
                    )}
                    {submission.facebook && (
                      <a
                        href={submission.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:scale-110 transition-transform"
                        title="Facebook"
                        onClick={() => clickTracking?.trackFacebook()}
                      >
                        <SiFacebook className="w-6 h-6" />
                      </a>
                    )}
                    {submission.linkedin && (
                      <a
                        href={submission.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:scale-110 transition-transform"
                        title="LinkedIn"
                        onClick={() => clickTracking?.trackLinkedIn()}
                      >
                        <SiLinkedin className="w-6 h-6" />
                      </a>
                    )}
                    {submission.tiktok && (
                      <a
                        href={submission.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:scale-110 transition-transform"
                        title="TikTok"
                        onClick={() => clickTracking?.trackTikTok()}
                      >
                        <SiTiktok className="w-6 h-6" />
                      </a>
                    )}
                    {submission.youtubeVideoTour && (
                      <a
                        href={submission.youtubeVideoTour}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:scale-110 transition-transform"
                        title="YouTube"
                        onClick={() => clickTracking?.trackYouTube()}
                      >
                        <SiYoutube className="w-6 h-6" />
                      </a>
                    )}
                  </div>

                  {/* Book Direct - Right */}
                  {submission.website && (
                    <Button size="lg" asChild>
                      <a 
                        href={submission.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                        onClick={() => clickTracking?.trackWebsite()}
                      >
                        <ExternalLink className="w-5 h-5" />
                        Book Direct
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Mobile: Single column with proper order, Desktop: Two independent columns */}
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-8 lg:items-start">
            
            {/* Left Column - Company Content (Desktop) */}
            <div className="flex flex-col gap-8 lg:flex-1">
              
              {/* Why Book With - Mobile: 1st, Desktop: Left column 1st */}
              {submission.whyBookWithYou && (
                <Card className="order-1 lg:order-none">
                  <CardHeader>
                    <CardTitle>Why Book Direct with {submission.brandName}?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">
                        {submission.whyBookWithYou}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ideal For - Mobile: 4th, Desktop: Left column 2nd */}
              {submission.idealFor && submission.idealFor.length > 0 && (
                <Card className="order-4 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Ideal For
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {submission.idealFor.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {item.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Perks & Amenities - Mobile: 5th, Desktop: Left column 3rd */}
              {submission.perksAmenities && submission.perksAmenities.length > 0 && (
                <Card className="order-5 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-green-600" />
                      Perks & Amenities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {submission.perksAmenities.map((perk, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          {perk.trim()}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Vibe & Aesthetic - Mobile: 6th, Desktop: Left column 4th */}
              {submission.vibeAesthetic && submission.vibeAesthetic.length > 0 && (
                <Card className="order-6 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Vibe & Aesthetic
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {submission.vibeAesthetic.map((vibe, index) => (
                        <Badge key={index} variant="secondary" className="text-sm bg-purple-50 text-purple-700">
                          {vibe.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
            </div>

            {/* Right Column - Trust Signals & Contact (Desktop) */}
            <div className="flex flex-col gap-8 lg:flex-1">

              {/* Host's Stats - Mobile: 2nd, Desktop: Right column 1st */}
              {submission.topStats && (
                <Card className="order-2 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      📊 {submission.brandName} Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {submission.topStats}
                    </div>
                    <div className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100 italic">
                      This information was provided by the host and can be verified in{" "}
                      {submission.website ? (
                        <a 
                          href={submission.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          their own website
                        </a>
                      ) : (
                        "their own website"
                      )}.
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Guest Reviews & Ratings - Mobile: 3rd, Desktop: Right column 2nd */}
              {submission.ratingScreenshot && (
                <Card className="order-3 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Guest Reviews & Ratings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg overflow-hidden bg-gray-50 p-4">
                      <img
                        src={submission.ratingScreenshot}
                        alt={`${submission.brandName} ratings and reviews`}
                        className="w-full h-auto object-contain mx-auto max-w-lg"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center italic">
                      Real guest ratings and reviews from booking platforms
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Get in Touch - Mobile: 7th (last), Desktop: Right column 3rd */}
              <Card className="order-7 lg:order-none">
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {submission.website && (
                    <Button asChild className="w-full">
                      <a 
                        href={submission.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                        onClick={() => clickTracking?.trackWebsite()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  
                  {socialLinks.length > 0 && (
                    <div className="flex justify-center gap-4 pt-4">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform"
                          title={social.platform}
                          onClick={() => {
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
                </CardContent>
              </Card>
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
} 