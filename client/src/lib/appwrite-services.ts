import { ID, Query } from 'appwrite';
import { databases, storage, DATABASE_ID, COLLECTIONS, BUCKETS } from './appwrite';

// Types
export interface Submission {
  $id?: string;
  name: string;
  website: string;
  listingCount: number;
  countries: string[];
  citiesRegions: Array<{ name: string; geonameId: number }>;
  logo: string;
  highlightImage: string;
  submittedByEmail: string;
  oneLineDescription: string;
  whyBookWithYou: string;
  typesOfStays?: string[];
  idealFor?: string[];
  isPetFriendly?: boolean;
  perksAmenities?: string[];
  isEcoConscious?: boolean;
  isRemoteWorkFriendly?: boolean;
  vibeAesthetic?: string[];
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  youtubeVideoTour?: string;
  listingType: 'Free' | 'Featured ($49.99)';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Listing {
  $id?: string;
  name: string;
  description: string;
  website: string;
  logo: string;
  image: string;
  featured: boolean;
  countries: string[];
  whyBookWith?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt: string;
}

export interface Country {
  $id?: string;
  name: string;
  slug: string;
  code: string;
  listingCount: number;
}

export interface Subscription {
  $id?: string;
  email: string;
  createdAt: string;
}

export interface FAQ {
  $id?: string;
  question: string;
  answer: string;
  category: 'traveler' | 'host';
  order: number;
}

export interface Testimonial {
  $id?: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

// Submission Services
export const submissionService = {
  async create(submission: Omit<Submission, '$id' | 'status' | 'createdAt'>): Promise<Submission> {
    const data = {
      ...submission,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    const result = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SUBMISSIONS,
      ID.unique(),
      data
    );
    
    return result as unknown as Submission;
  },

  async getAll(): Promise<Submission[]> {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SUBMISSIONS
    );
    
    return result.documents as unknown as Submission[];
  },

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Submission> {
    const result = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.SUBMISSIONS,
      id,
      { status }
    );
    
    return result as unknown as Submission;
  },

  async getPending(): Promise<Submission[]> {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SUBMISSIONS,
      [Query.equal('status', 'pending')]
    );
    
    return result.documents as unknown as Submission[];
  }
};

// Listing Services
export const listingService = {
  async create(listing: Omit<Listing, '$id' | 'createdAt'>): Promise<Listing> {
    const data = {
      ...listing,
      createdAt: new Date().toISOString(),
    };
    
    const result = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.LISTINGS,
      ID.unique(),
      data
    );
    
    return result as unknown as Listing;
  },

  async getAll(limit = 50, offset = 0): Promise<{ listings: Listing[]; total: number }> {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.LISTINGS,
      [Query.limit(limit), Query.offset(offset)]
    );
    
    return {
      listings: result.documents as unknown as Listing[],
      total: result.total
    };
  },

  async getByCountries(countries: string[]): Promise<Listing[]> {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.LISTINGS,
      [Query.equal('countries', countries)]
    );
    
    return result.documents as unknown as Listing[];
  },

  async getFeatured(): Promise<Listing[]> {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.LISTINGS,
      [Query.equal('featured', true)]
    );
    
    return result.documents as unknown as Listing[];
  }
};

// Country Services
export const countryService = {
  async getAll(): Promise<Country[]> {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.COUNTRIES
    );
    
    return result.documents as unknown as Country[];
  },

  async getBySlug(slug: string): Promise<Country | null> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COUNTRIES,
        [Query.equal('slug', slug)]
      );
      
      return (result.documents[0] as unknown as Country) || null;
    } catch (error) {
      return null;
    }
  }
};

// Subscription Services
export const subscriptionService = {
  async create(email: string): Promise<Subscription> {
    const data = {
      email,
      createdAt: new Date().toISOString(),
    };
    
    const result = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SUBSCRIPTIONS,
      ID.unique(),
      data
    );
    
    return result as unknown as Subscription;
  }
};

// FAQ Services
export const faqService = {
  async getAll(): Promise<FAQ[]> {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FAQS,
      [Query.orderAsc('order')]
    );
    
    return result.documents as unknown as FAQ[];
  }
};

// Testimonial Services
export const testimonialService = {
  async getAll(): Promise<Testimonial[]> {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TESTIMONIALS
    );
    
    return result.documents as unknown as Testimonial[];
  }
};

// File Upload Services
export const fileService = {
  async uploadLogo(file: File): Promise<string> {
    const result = await storage.createFile(
      BUCKETS.LOGOS,
      ID.unique(),
      file
    );
    
    return storage.getFileView(BUCKETS.LOGOS, result.$id);
  },

  async uploadImage(file: File): Promise<string> {
    const result = await storage.createFile(
      BUCKETS.IMAGES,
      ID.unique(),
      file
    );
    
    return storage.getFileView(BUCKETS.IMAGES, result.$id);
  },

  async deleteFile(bucketId: string, fileId: string): Promise<void> {
    await storage.deleteFile(bucketId, fileId);
  }
}; 