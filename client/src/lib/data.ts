import { slugify, getFlagEmoji } from "@/lib/utils";

/**
 * This file contains fallback static data that is used when API calls fail or for development purposes.
 * In production, this data should be fetched from the API.
 */

export interface Country {
  id: number;
  name: string;
  slug: string;
  code: string;
  listingCount: number;
}

export interface Listing {
  id: number;
  name: string;
  description: string;
  website: string;
  logo: string;
  image: string;
  featured: boolean;
  countries: string[];
  whyBookWith?: string;
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface Testimonial {
  id: number;
  name: string;
  role: "host" | "guest";
  content: string;
  avatar?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: "traveler" | "host";
  order: number;
}

export const countries: Country[] = [
  { id: 1, name: "Spain", slug: "spain", code: "ES", listingCount: 25 },
  { id: 2, name: "Italy", slug: "italy", code: "IT", listingCount: 18 },
  { id: 3, name: "France", slug: "france", code: "FR", listingCount: 32 },
  { id: 4, name: "Portugal", slug: "portugal", code: "PT", listingCount: 15 },
  { id: 5, name: "Greece", slug: "greece", code: "GR", listingCount: 22 },
  { id: 6, name: "Croatia", slug: "croatia", code: "HR", listingCount: 12 },
  { id: 7, name: "United States", slug: "united-states", code: "US", listingCount: 65 },
  { id: 8, name: "Mexico", slug: "mexico", code: "MX", listingCount: 19 },
  { id: 9, name: "Thailand", slug: "thailand", code: "TH", listingCount: 28 },
  { id: 10, name: "Indonesia", slug: "indonesia", code: "ID", listingCount: 17 },
  { id: 11, name: "Canada", slug: "canada", code: "CA", listingCount: 23 },
  { id: 12, name: "Australia", slug: "australia", code: "AU", listingCount: 14 }
];

export const listings: Listing[] = [
  {
    id: 1,
    name: "Villa Escapes",
    description: "25 luxury villas in Spain & Portugal",
    website: "https://example.com/villa-escapes",
    logo: "https://images.unsplash.com/photo-1563906267088-b029e7101114?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: true,
    countries: ["Spain", "Portugal"],
    socials: {
      facebook: "https://facebook.com/villaescapes",
      instagram: "https://instagram.com/villaescapes",
      linkedin: "https://linkedin.com/company/villaescapes"
    }
  },
  {
    id: 2,
    name: "Mediterranean Homes",
    description: "18 beachfront properties in Greece",
    website: "https://example.com/mediterranean-homes",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Greece"],
    socials: {
      facebook: "https://facebook.com/medihomes",
      instagram: "https://instagram.com/medihomes"
    }
  },
  {
    id: 3,
    name: "Mountain Retreats",
    description: "35 cabins in the US and Canada",
    website: "https://example.com/mountain-retreats",
    logo: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["United States", "Canada"],
    socials: {
      facebook: "https://facebook.com/mountainretreats",
      instagram: "https://instagram.com/mountainretreats",
      linkedin: "https://linkedin.com/company/mountainretreats"
    }
  },
  {
    id: 4,
    name: "Tropical Hideaways",
    description: "20 villas in Bali and Thailand",
    website: "https://example.com/tropical-hideaways",
    logo: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: true,
    countries: ["Indonesia", "Thailand"],
    socials: {
      instagram: "https://instagram.com/tropicalhideaways"
    }
  },
  {
    id: 5,
    name: "City Apartments",
    description: "42 apartments in Paris and Rome",
    website: "https://example.com/city-apartments",
    logo: "https://images.unsplash.com/photo-1549517045-bc93de075e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1549517045-bc93de075e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["France", "Italy"],
    socials: {
      facebook: "https://facebook.com/cityapartments",
      linkedin: "https://linkedin.com/company/cityapartments"
    }
  },
  {
    id: 6,
    name: "Adriatic Homes",
    description: "15 coastal properties in Croatia",
    website: "https://example.com/adriatic-homes",
    logo: "https://images.unsplash.com/photo-1495756111155-45cb19b8aeee?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Croatia"],
    socials: {
      facebook: "https://facebook.com/adriatichomes",
      instagram: "https://instagram.com/adriatichomes"
    }
  },
  {
    id: 7,
    name: "Mexican Villas",
    description: "28 beachfront villas in Mexico",
    website: "https://example.com/mexican-villas",
    logo: "https://images.unsplash.com/photo-1565373677928-80b93d5dc3a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1597365657409-3e0c5ad94910?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Mexico"],
    socials: {
      facebook: "https://facebook.com/mexicanvillas",
      instagram: "https://instagram.com/mexicanvillas"
    }
  },
  {
    id: 8,
    name: "Tuscan Dreams",
    description: "15 countryside estates in Italy",
    website: "https://example.com/tuscan-dreams",
    logo: "https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: true,
    countries: ["Italy"],
    socials: {
      facebook: "https://facebook.com/tuscandreams",
      instagram: "https://instagram.com/tuscandreams",
      linkedin: "https://linkedin.com/company/tuscandreams"
    }
  },
  {
    id: 9,
    name: "Australian Beach Houses",
    description: "22 oceanfront properties in Australia",
    website: "https://example.com/australian-beach-houses",
    logo: "https://images.unsplash.com/photo-1516419591857-14c5e4c3de3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Australia"],
    socials: {
      instagram: "https://instagram.com/ausbeachhouses",
      facebook: "https://facebook.com/ausbeachhouses"
    }
  },
  {
    id: 10,
    name: "Alpine Chalets",
    description: "30 ski-in ski-out chalets in France",
    website: "https://example.com/alpine-chalets",
    logo: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1452784444945-3f422708fe5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["France"],
    socials: {
      facebook: "https://facebook.com/alpinechalets",
      instagram: "https://instagram.com/alpinechalets",
      linkedin: "https://linkedin.com/company/alpinechalets"
    }
  },
  {
    id: 11,
    name: "Thai Island Retreats",
    description: "18 island properties in Thailand",
    website: "https://example.com/thai-island-retreats",
    logo: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Thailand"],
    socials: {
      instagram: "https://instagram.com/thaiislandretreats"
    }
  },
  {
    id: 12,
    name: "Costa Brava Villas",
    description: "15 beachfront villas in Spain",
    website: "https://example.com/costa-brava-villas",
    logo: "https://images.unsplash.com/photo-1601144531169-d65b87c10c24?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Spain"],
    socials: {
      facebook: "https://facebook.com/costabrava",
      instagram: "https://instagram.com/costabrava"
    }
  }
];

export const faqs: FAQ[] = [
  {
    id: 1,
    question: "What is BookDirectStays.com?",
    answer: "BookDirectStays.com is a global directory that connects travelers directly with short-term rental property managers, allowing you to book directly and avoid online travel agency (OTA) fees.",
    category: "traveler",
    order: 1
  },
  {
    id: 2,
    question: "How do I book a property?",
    answer: "Once you find a property you're interested in, click on the 'Visit Booking Site' button. This will take you directly to the property manager's own booking site where you can check availability and make your reservation.",
    category: "traveler",
    order: 2
  },
  {
    id: 3,
    question: "Why should I book direct instead of through an OTA?",
    answer: "Booking directly with property managers typically saves you money (no service fees), gives you access to special offers not available on OTAs, and creates a direct relationship with your host for better service.",
    category: "traveler",
    order: 3
  },
  {
    id: 4,
    question: "Are these properties verified?",
    answer: "Yes, we verify all property managers before listing them in our directory to ensure they are legitimate businesses. However, we recommend you still exercise normal caution and read reviews before booking.",
    category: "traveler",
    order: 4
  },
  {
    id: 5,
    question: "How do I list my property on BookDirectStays.com?",
    answer: "If you're a property manager, you can add your direct booking site by clicking on 'Add Your Direct Booking Site' and filling out our submission form. We offer both free and featured (paid) listings.",
    category: "host",
    order: 5
  },
  {
    id: 6,
    question: "What is the difference between a free and featured listing?",
    answer: "Free listings include your basic information in our directory. Featured listings receive priority placement in search results, enhanced visual presentation, and are marked as 'Featured' to attract more attention from travelers.",
    category: "host",
    order: 6
  },
  {
    id: 7,
    question: "How long does it take to get my listing approved?",
    answer: "We typically review and approve listings within 2-3 business days. For featured listings, we may request additional information to ensure quality standards.",
    category: "host",
    order: 7
  },
  {
    id: 8,
    question: "Can I update my listing information?",
    answer: "Yes, you can update your listing at any time by contacting our support team with your changes. Featured listings have access to a self-service dashboard for instant updates.",
    category: "host",
    order: 8
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "guest",
    content: "I saved over $300 on my family vacation by booking directly with the villa owner through BookDirectStays. The process was simple and I got personal service that wouldn't have been possible through a big booking site.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "host",
    content: "Since joining BookDirectStays, I've increased my direct bookings by 40%. I'm paying less in commissions and building better relationships with my guests. It's a win-win.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "guest",
    content: "I was hesitant about booking directly, but BookDirectStays made it so easy! I found an amazing apartment in Paris and the owner gave me local tips that made our trip special.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 4,
    name: "James Wilson",
    role: "host",
    content: "The featured listing option has been great for my business. My properties are getting more visibility and I've noticed an increase in high-quality bookings from guests who appreciate direct communication.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "guest",
    content: "We booked a villa in Greece directly with the owner and got a 10% discount for a two-week stay. The booking process was straightforward and secure. Highly recommend!",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 6,
    name: "Carlos Mendez",
    role: "host",
    content: "As a property manager with 15 properties, BookDirectStays has helped me reduce my dependency on OTAs. The platform is user-friendly and the support team is responsive to my needs.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  }
];

// Helper functions to work with the static data

export function getListings(countrySlug?: string, limit: number = 6, offset: number = 0): { listings: Listing[], total: number, hasMore: boolean } {
  let filteredListings = [...listings];

  // Filter by country if provided
  if (countrySlug) {
    const countryName = countries.find(c => c.slug === countrySlug)?.name;
    if (countryName) {
      filteredListings = filteredListings.filter(listing => 
        listing.countries.includes(countryName)
      );
    }
  }

  // Sort by featured first
  filteredListings.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const total = filteredListings.length;
  const paginatedListings = filteredListings.slice(offset, offset + limit);
  const hasMore = offset + paginatedListings.length < total;

  return { 
    listings: paginatedListings,
    total,
    hasMore
  };
}

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find(country => country.slug === slug);
}

export function getTotalListingsCount(): number {
  return listings.length;
}

export function getFAQsByCategory(category?: "traveler" | "host"): FAQ[] {
  if (!category) return faqs.sort((a, b) => a.order - b.order);
  return faqs
    .filter(faq => faq.category === category)
    .sort((a, b) => a.order - b.order);
}

export function getTestimonialsByRole(role?: "host" | "guest"): Testimonial[] {
  if (!role) return testimonials;
  return testimonials.filter(testimonial => testimonial.role === role);
}
