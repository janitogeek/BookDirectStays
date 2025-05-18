import { 
  users, 
  type User, 
  type InsertUser, 
  type Country, 
  type InsertCountry,
  type Listing,
  type InsertListing,
  type Subscription,
  type InsertSubscription,
  type Submission,
  type InsertSubmission,
  type FAQ,
  type InsertFaq,
  type Testimonial,
  type InsertTestimonial,
} from "@shared/schema";

export interface IStorage {
  // User methods (inherited from template)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Country methods
  getCountries(): Promise<Country[]>;
  getCountryBySlug(slug: string): Promise<Country | undefined>;
  createCountry(country: InsertCountry): Promise<Country>;
  
  // Listing methods
  getListings(countrySlugs?: string[] | string, limit?: number, offset?: number): Promise<Listing[]>;
  getListingsCount(countrySlugs?: string[] | string): Promise<number>;
  createListing(listing: InsertListing): Promise<Listing>;
  
  // Subscription methods
  createSubscription(subscription: InsertSubscription & { createdAt: string }): Promise<Subscription>;
  
  // Submission methods
  createSubmission(submission: InsertSubmission & { status: string, createdAt: string }): Promise<Submission>;
  
  // FAQ methods
  getFAQs(): Promise<FAQ[]>;
  createFAQ(faq: InsertFaq): Promise<FAQ>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private countries: Map<number, Country>;
  private listings: Map<number, Listing>;
  private subscriptions: Map<number, Subscription>;
  private submissions: Map<number, Submission>;
  private faqs: Map<number, FAQ>;
  private testimonials: Map<number, Testimonial>;
  
  private userId: number;
  private countryId: number;
  private listingId: number;
  private subscriptionId: number;
  private submissionId: number;
  private faqId: number;
  private testimonialId: number;

  constructor() {
    this.users = new Map();
    this.countries = new Map();
    this.listings = new Map();
    this.subscriptions = new Map();
    this.submissions = new Map();
    this.faqs = new Map();
    this.testimonials = new Map();
    
    this.userId = 1;
    this.countryId = 1;
    this.listingId = 1;
    this.subscriptionId = 1;
    this.submissionId = 1;
    this.faqId = 1;
    this.testimonialId = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  // User methods (inherited from template)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Country methods
  async getCountries(): Promise<Country[]> {
    return Array.from(this.countries.values());
  }
  
  async getCountryBySlug(slug: string): Promise<Country | undefined> {
    return Array.from(this.countries.values()).find(
      (country) => country.slug === slug,
    );
  }
  
  async createCountry(insertCountry: InsertCountry): Promise<Country> {
    const id = this.countryId++;
    const country: Country = { ...insertCountry, id };
    this.countries.set(id, country);
    return country;
  }
  
  // Listing methods
  async getListings(countrySlugs?: string[] | string, limit: number = 6, offset: number = 0): Promise<Listing[]> {
    let listings = Array.from(this.listings.values());
    
    // Filter by countries if provided
    if (countrySlugs) {
      // Convert single string to array for consistent handling
      const slugsArray = Array.isArray(countrySlugs) ? countrySlugs : [countrySlugs];
      
      if (slugsArray.length > 0) {
        // Get country names from slugs
        const countryPromises = slugsArray.map(slug => this.getCountryBySlug(slug));
        const countries = await Promise.all(countryPromises);
        const countryNames = countries.filter(c => c !== undefined).map(c => c!.name);
        
        if (countryNames.length > 0) {
          // Filter listings that have at least one matching country
          listings = listings.filter(listing => 
            listing.countries.some(country => countryNames.includes(country))
          );
        }
      }
    }
    
    // Sort by featured first
    listings.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    
    // Apply pagination
    return listings.slice(offset, offset + limit);
  }
  
  async getListingsCount(countrySlugs?: string[] | string): Promise<number> {
    let listings = Array.from(this.listings.values());
    
    // Filter by countries if provided
    if (countrySlugs) {
      // Convert single string to array for consistent handling
      const slugsArray = Array.isArray(countrySlugs) ? countrySlugs : [countrySlugs];
      
      if (slugsArray.length > 0) {
        // Get country names from slugs
        const countryPromises = slugsArray.map(slug => this.getCountryBySlug(slug));
        const countries = await Promise.all(countryPromises);
        const countryNames = countries.filter(c => c !== undefined).map(c => c!.name);
        
        if (countryNames.length > 0) {
          // Filter listings that have at least one matching country
          listings = listings.filter(listing => 
            listing.countries.some(country => countryNames.includes(country))
          );
        }
      }
    }
    
    return listings.length;
  }
  
  async createListing(insertListing: InsertListing): Promise<Listing> {
    const id = this.listingId++;
    const listing: Listing = { ...insertListing, id };
    this.listings.set(id, listing);
    return listing;
  }
  
  // Subscription methods
  async createSubscription(insertSubscription: InsertSubscription & { createdAt: string }): Promise<Subscription> {
    const id = this.subscriptionId++;
    const subscription: Subscription = { ...insertSubscription, id };
    this.subscriptions.set(id, subscription);
    return subscription;
  }
  
  // Submission methods
  async createSubmission(insertSubmission: InsertSubmission & { status: string, createdAt: string }): Promise<Submission> {
    const id = this.submissionId++;
    const submission: Submission = { ...insertSubmission, id };
    this.submissions.set(id, submission);
    return submission;
  }
  
  // FAQ methods
  async getFAQs(): Promise<FAQ[]> {
    const faqs = Array.from(this.faqs.values());
    return faqs.sort((a, b) => a.order - b.order);
  }
  
  async createFAQ(insertFaq: InsertFaq): Promise<FAQ> {
    const id = this.faqId++;
    const faq: FAQ = { ...insertFaq, id };
    this.faqs.set(id, faq);
    return faq;
  }
  
  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  // Initialize with sample data
  private initSampleData() {
    // Initialize countries
    const countryData: InsertCountry[] = [
      { name: "Spain", slug: "spain", code: "ES", listingCount: 25 },
      { name: "Italy", slug: "italy", code: "IT", listingCount: 18 },
      { name: "France", slug: "france", code: "FR", listingCount: 32 },
      { name: "Portugal", slug: "portugal", code: "PT", listingCount: 15 },
      { name: "Greece", slug: "greece", code: "GR", listingCount: 22 },
      { name: "Croatia", slug: "croatia", code: "HR", listingCount: 12 },
      { name: "United States", slug: "united-states", code: "US", listingCount: 65 },
      { name: "Mexico", slug: "mexico", code: "MX", listingCount: 19 },
      { name: "Thailand", slug: "thailand", code: "TH", listingCount: 28 },
      { name: "Indonesia", slug: "indonesia", code: "ID", listingCount: 17 },
      { name: "Canada", slug: "canada", code: "CA", listingCount: 23 },
      { name: "Australia", slug: "australia", code: "AU", listingCount: 14 },
    ];
    
    countryData.forEach(country => {
      this.createCountry(country);
    });
    
    // Initialize listings
    const listingData: InsertListing[] = [
      {
        name: "Villa Escapes",
        description: "25 luxury villas in Spain & Portugal",
        website: "https://example.com/villa-escapes",
        logo: "https://images.unsplash.com/photo-1563906267088-b029e7101114?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        featured: true,
        countries: ["Spain", "Portugal"],
        whyBookWith: "Whether you're dreaming of a romantic weekend by the sea, a family escape to the countryside, or a remote work getaway with a view, Villa Escapes has the perfect place for you. Our handpicked collection of holiday homes across Spain and Portugal blends comfort, character, and convenience—so you can relax, explore, and enjoy every moment of your stay.\n\nFrom pet-friendly cottages and luxury apartments to hidden gems and unique stays, every property is carefully maintained and fully equipped for a stress-free, self-catering break. Enjoy crisp linens, fast Wi-Fi, thoughtful touches, and exceptional customer support available 24/7.\n\nPlus, with our commitment to sustainability and local partnerships, booking with Villa Escapes means supporting greener travel and vibrant communities.\n\nYour next unforgettable stay starts here—discover the Villa Escapes difference.",
        socials: {
          facebook: "https://facebook.com/villaescapes",
          instagram: "https://instagram.com/villaescapes",
          linkedin: "https://linkedin.com/company/villaescapes"
        }
      },
      {
        name: "Mediterranean Homes",
        description: "18 beachfront properties in Greece",
        website: "https://example.com/mediterranean-homes",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
        image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        featured: false,
        countries: ["Greece"],
        whyBookWith: "Experience the authentic beauty of Greece with Mediterranean Homes. Our stunning beachfront properties combine traditional Greek architecture with modern amenities to create the perfect vacation experience.\n\nAll our properties offer panoramic sea views, private pools, and are just steps from pristine beaches and charming villages. Our local staff provides personalized service, from arranging boat trips to recommending hidden tavernas only the locals know about.\n\nWith Mediterranean Homes, you'll enjoy more space, better value, and greater privacy than a hotel could ever offer. Our properties are perfect for families, groups of friends, or couples seeking a romantic getaway.\n\nBook directly with us and save on fees while enjoying tailored service that puts your needs first.",
        socials: {
          facebook: "https://facebook.com/medihomes",
          instagram: "https://instagram.com/medihomes"
        }
      },
      {
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
    
    listingData.forEach(listing => {
      this.createListing(listing);
    });
    
    // Initialize FAQs
    const faqData: InsertFaq[] = [
      {
        question: "What is BookDirectStays.com?",
        answer: "BookDirectStays.com is a global directory that connects travelers directly with short-term rental property managers, allowing you to book directly and avoid online travel agency (OTA) fees.",
        category: "traveler",
        order: 1
      },
      {
        question: "How do I book a property?",
        answer: "Once you find a property you're interested in, click on the 'Visit Booking Site' button. This will take you directly to the property manager's own booking site where you can check availability and make your reservation.",
        category: "traveler",
        order: 2
      },
      {
        question: "Why should I book direct instead of through an OTA?",
        answer: "Booking directly with property managers typically saves you money (no service fees), gives you access to special offers not available on OTAs, and creates a direct relationship with your host for better service.",
        category: "traveler",
        order: 3
      },
      {
        question: "Are these properties verified?",
        answer: "Yes, we verify all property managers before listing them in our directory to ensure they are legitimate businesses. However, we recommend you still exercise normal caution and read reviews before booking.",
        category: "traveler",
        order: 4
      },
      {
        question: "How do I list my property on BookDirectStays.com?",
        answer: "If you're a property manager, you can add your direct booking site by clicking on 'Add Your Direct Booking Site' and filling out our submission form. We offer both free and featured (paid) listings.",
        category: "host",
        order: 5
      },
      {
        question: "What is the difference between a free and featured listing?",
        answer: "Free listings include your basic information in our directory. Featured listings receive priority placement in search results, enhanced visual presentation, and are marked as 'Featured' to attract more attention from travelers.",
        category: "host",
        order: 6
      },
      {
        question: "How long does it take to get my listing approved?",
        answer: "We typically review and approve listings within 2-3 business days. For featured listings, we may request additional information to ensure quality standards.",
        category: "host",
        order: 7
      },
      {
        question: "Can I update my listing information?",
        answer: "Yes, you can update your listing at any time by contacting our support team with your changes. Featured listings have access to a self-service dashboard for instant updates.",
        category: "host",
        order: 8
      }
    ];
    
    faqData.forEach(faq => {
      this.createFAQ(faq);
    });
    
    // Initialize testimonials
    const testimonialData: InsertTestimonial[] = [
      {
        name: "Sarah Johnson",
        role: "guest",
        content: "I saved over $300 on my family vacation by booking directly with the villa owner through BookDirectStays. The process was simple and I got personal service that wouldn't have been possible through a big booking site.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "Michael Rodriguez",
        role: "host",
        content: "Since joining BookDirectStays, I've increased my direct bookings by 40%. I'm paying less in commissions and building better relationships with my guests. It's a win-win.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "Emma Davis",
        role: "guest",
        content: "I was hesitant about booking directly, but BookDirectStays made it so easy! I found an amazing apartment in Paris and the owner gave me local tips that made our trip special.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "James Wilson",
        role: "host",
        content: "The featured listing option has been great for my business. My properties are getting more visibility and I've noticed an increase in high-quality bookings from guests who appreciate direct communication.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "Lisa Thompson",
        role: "guest",
        content: "We booked a villa in Greece directly with the owner and got a 10% discount for a two-week stay. The booking process was straightforward and secure. Highly recommend!",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "Carlos Mendez",
        role: "host",
        content: "As a property manager with 15 properties, BookDirectStays has helped me reduce my dependency on OTAs. The platform is user-friendly and the support team is responsive to my needs.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      }
    ];
    
    testimonialData.forEach(testimonial => {
      this.createTestimonial(testimonial);
    });
  }
}

export const storage = new MemStorage();
