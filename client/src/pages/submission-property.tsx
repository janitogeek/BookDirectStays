import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ExternalLink, MapPin, Building2, Users, Star, Heart, Sparkles } from "lucide-react";
import { SiInstagram, SiFacebook, SiLinkedin, SiTiktok, SiYoutube } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { airtableService, Submission } from "@/lib/airtable";

export default function SubmissionProperty() {
  const [, params] = useRoute('/property/:id');
  const submissionId = params?.id;

  const { data: submission, isLoading, error } = useQuery({
    queryKey: ["/api/submission", submissionId],
    queryFn: () => submissionId ? airtableService.getSubmissionById(submissionId) : null,
    enabled: !!submissionId,
  });

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
      'Turkey': '🇹🇷'
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Why Book With */}
              {submission.whyBookWithYou && (
                <Card>
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

              {/* Host's Stats */}
              {submission.topStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      Host's Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-lg font-medium">
                      {submission.topStats}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Ideal For */}
              {submission.idealFor && submission.idealFor.length > 0 && (
                <Card>
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

              {/* Perks & Amenities */}
              {submission.perksAmenities && submission.perksAmenities.length > 0 && (
                <Card>
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

              {/* Vibe & Aesthetic */}
              {submission.vibeAesthetic && submission.vibeAesthetic.length > 0 && (
                <Card>
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Property Types */}
              {submission.typesOfStays && submission.typesOfStays.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Property Types</CardTitle>
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

              {/* Locations */}
              <Card>
                <CardHeader>
                  <CardTitle>Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {submission.countries.map((country, index) => (
                      <div key={country} className="flex items-center gap-2">
                        <span className="text-xl">{getFlagEmoji(country)}</span>
                        <span className="font-medium">{country}</span>
                      </div>
                    ))}
                    
                    {/* Cities/Regions in Sidebar */}
                    {submission.citiesRegions && submission.citiesRegions.length > 0 && (
                      <div className="pt-2 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Cities & Regions:</h4>
                        <div className="flex flex-wrap gap-1">
                          {submission.citiesRegions.map((city, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {city.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
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