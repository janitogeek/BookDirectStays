import { ExternalLink, MapPin, Building2, Globe, Users, Heart } from "lucide-react";
import { SiInstagram, SiFacebook, SiLinkedin, SiTiktok, SiYoutube } from "react-icons/si";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Submission } from "@/lib/airtable";
import { generateSlug } from "@/lib/utils";
import { useClickTracking } from "@/lib/click-tracking";
import TopStats from "@/components/top-stats";

interface SubmissionPropertyCardProps {
  submission: Submission;
}

export default function SubmissionPropertyCard({ submission }: SubmissionPropertyCardProps) {
  // Generate slug from brand name
  const slug = generateSlug(submission.brandName);

  // Initialize click tracking for this submission
  const {
    trackWebsite,
    trackInstagram,
    trackFacebook,
    trackLinkedIn,
    trackYouTube,
    trackTikTok,
    trackCompany,
    track
  } = useClickTracking(submission.id);

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
      'Mexico': '🇲🇽',
      'Brazil': '🇧🇷',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Netherlands': '🇳🇱',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Belgium': '🇧🇪',
      'Croatia': '🇭🇷',
      'Czech Republic': '🇨🇿',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Hungary': '🇭🇺',
      'Iceland': '🇮🇸',
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
        return <SiInstagram className="w-4 h-4 text-pink-600" />;
      case 'facebook':
        return <SiFacebook className="w-4 h-4 text-blue-600" />;
      case 'linkedin':
        return <SiLinkedin className="w-4 h-4 text-blue-700" />;
      case 'tiktok':
        return <SiTiktok className="w-4 h-4 text-black" />;
      case 'youtube':
        return <SiYoutube className="w-4 h-4 text-red-600" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  // Parse social media links if they exist
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

  // Check if it's a premium listing
  const isPremium = submission.plan?.includes('Premium Listing') || submission.plan?.includes('€499.99');

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow duration-200 border border-gray-200 bg-white relative">
        {/* Featured Badge */}
        {isPremium && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-yellow-500 text-yellow-900 font-semibold">
              Featured
            </Badge>
          </div>
        )}

        <CardContent className="p-6">
          {/* Header Image */}
          {submission.highlightImage && (
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <img
                src={submission.highlightImage}
                alt={submission.brandName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}

          {/* Brand Header */}
          <div className="flex items-start gap-3 mb-4">
            {submission.logo && (
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                  src={submission.logo}
                  alt={`${submission.brandName} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">
                {submission.brandName}
              </h3>
              
              {/* One-line Description in Italic */}
              {submission.oneLineDescription && (
                <p className="text-sm italic text-gray-600 mb-2 leading-relaxed line-clamp-2">
                  {submission.oneLineDescription}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="flex items-center gap-1">
                  {submission.countries.map((country, index) => (
                    <span key={country}>
                      {getFlagEmoji(country)} {country}
                      {index < submission.countries.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>

          {/* Property Count */}
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            {submission.numberOfListings && (
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{submission.numberOfListings} properties</span>
              </div>
            )}
          </div>

          {/* Top Stats Component */}
          {submission.topStats && (
            <div className="mb-4">
              <TopStats 
                topStats={submission.topStats} 
                brandName={submission.brandName}
              />
            </div>
          )}

          {/* Types of Stays */}
          {submission.typesOfStays && submission.typesOfStays.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {submission.typesOfStays.map((type, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {type.trim()}
                </Badge>
              ))}
            </div>
          )}

          {/* Why Book With CTA */}
          <div className="mb-4">
            <Button 
              asChild 
              variant="outline" 
              size="sm"
              className="w-full flex items-center justify-center gap-2"
            >
              <Link 
                href={`/property/${slug}`}
                onClick={() => trackCompany()} // Track company page clicks
              >
                Why book with {submission.brandName}?
              </Link>
            </Button>
          </div>

          {/* Bottom Section: Social Links Left, Book Direct Right */}
          <div className="flex items-center justify-between">
            {/* Social Links - Left */}
            <div className="flex items-center gap-3">
              {submission.instagram && (
                <a
                  href={submission.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:scale-110 transition-transform"
                  title="Instagram"
                  onClick={() => trackInstagram()}
                >
                  <SiInstagram className="w-5 h-5" />
                </a>
              )}
              {submission.facebook && (
                <a
                  href={submission.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:scale-110 transition-transform"
                  title="Facebook"
                  onClick={() => trackFacebook()}
                >
                  <SiFacebook className="w-5 h-5" />
                </a>
              )}
              {submission.linkedin && (
                <a
                  href={submission.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:scale-110 transition-transform"
                  title="LinkedIn"
                  onClick={() => trackLinkedIn()}
                >
                  <SiLinkedin className="w-5 h-5" />
                </a>
              )}
              {submission.tiktok && (
                <a
                  href={submission.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:scale-110 transition-transform"
                  title="TikTok"
                  onClick={() => trackTikTok()}
                >
                  <SiTiktok className="w-5 h-5" />
                </a>
              )}
              {submission.youtubeVideoTour && (
                <a
                  href={submission.youtubeVideoTour}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:scale-110 transition-transform"
                  title="YouTube"
                  onClick={() => trackYouTube()}
                >
                  <SiYoutube className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Book Direct - Right */}
            {submission.website && (
              <Button 
                asChild 
                variant="default" 
                size="sm"
              >
                <a 
                  href={submission.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                  onClick={() => trackWebsite()}
                >
                  <ExternalLink className="w-4 h-4" />
                  Book Direct
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
} 