import { pb, COLLECTIONS, getFileUrl } from './pocketbase';

// Types
export interface Submission {
  id: string;
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
  id: string;
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
  id: string;
  name: string;
  slug: string;
  code: string;
  listingCount: number;
}

export interface Subscription {
  id: string;
  email: string;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'traveler' | 'host';
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

// Submission Services
export const submissionService = {
  async create(submission: Omit<Submission, 'id' | 'status' | 'createdAt'> | FormData): Promise<Submission> {
    let data: any;
    
    if (submission instanceof FormData) {
      // Handle FormData
      submission.append('status', 'pending');
      submission.append('createdAt', new Date().toISOString());
      data = submission;
    } else {
      // Handle regular object
      data = {
        ...submission,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    }
    
    const record = await pb.collection(COLLECTIONS.SUBMISSIONS).create(data);
    return record as unknown as Submission;
  },

  async getAll(): Promise<Submission[]> {
    const records = await pb.collection(COLLECTIONS.SUBMISSIONS).getFullList();
    return records as unknown as Submission[];
  },

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Submission> {
    const record = await pb.collection(COLLECTIONS.SUBMISSIONS).update(id, { status });
    return record as unknown as Submission;
  },

  async getPending(): Promise<Submission[]> {
    const records = await pb.collection(COLLECTIONS.SUBMISSIONS).getFullList({
      filter: 'status = "pending"'
    });
    return records as unknown as Submission[];
  },

  async getApproved(): Promise<Submission[]> {
    const records = await pb.collection(COLLECTIONS.SUBMISSIONS).getFullList({
      filter: 'status = "approved"'
    });
    return records as unknown as Submission[];
  },

  async update(id: string, submission: Partial<Submission>): Promise<Submission> {
    const record = await pb.collection(COLLECTIONS.SUBMISSIONS).update(id, submission);
    return record as unknown as Submission;
  },

  async delete(id: string): Promise<void> {
    await pb.collection(COLLECTIONS.SUBMISSIONS).delete(id);
  }
};

// Listing Services
export const listingService = {
  async create(listing: Omit<Listing, 'id' | 'createdAt'>): Promise<Listing> {
    const data = {
      ...listing,
      createdAt: new Date().toISOString(),
    };
    
    const record = await pb.collection(COLLECTIONS.LISTINGS).create(data);
    return record as unknown as Listing;
  },

  async getAll(limit = 50, offset = 0): Promise<{ listings: Listing[]; total: number }> {
    const result = await pb.collection(COLLECTIONS.LISTINGS).getList(offset + 1, limit);
    
    return {
      listings: result.items as unknown as Listing[],
      total: result.totalItems
    };
  },

  async getByCountries(countries: string[]): Promise<Listing[]> {
    const filter = countries.map(country => `countries ?~ "${country}"`).join(' || ');
    const records = await pb.collection(COLLECTIONS.LISTINGS).getFullList({
      filter: filter || 'id != ""'
    });
    
    return records as unknown as Listing[];
  },

  async getFeatured(): Promise<Listing[]> {
    const records = await pb.collection(COLLECTIONS.LISTINGS).getFullList({
      filter: 'featured = true'
    });
    
    return records as unknown as Listing[];
  },

  async update(id: string, listing: Partial<Listing>): Promise<Listing> {
    const record = await pb.collection(COLLECTIONS.LISTINGS).update(id, listing);
    return record as unknown as Listing;
  },

  async delete(id: string): Promise<void> {
    await pb.collection(COLLECTIONS.LISTINGS).delete(id);
  }
};

// Country Services
export const countryService = {
  async getAll(): Promise<Country[]> {
    const records = await pb.collection(COLLECTIONS.COUNTRIES).getFullList();
    return records as unknown as Country[];
  },

  async getBySlug(slug: string): Promise<Country | null> {
    try {
      const records = await pb.collection(COLLECTIONS.COUNTRIES).getFullList({
        filter: `slug = "${slug}"`
      });
      
      return (records[0] as unknown as Country) || null;
    } catch (error) {
      return null;
    }
  },

  async create(country: Omit<Country, 'id'>): Promise<Country> {
    const record = await pb.collection(COLLECTIONS.COUNTRIES).create(country);
    return record as unknown as Country;
  },

  async update(id: string, country: Partial<Country>): Promise<Country> {
    const record = await pb.collection(COLLECTIONS.COUNTRIES).update(id, country);
    return record as unknown as Country;
  },

  async delete(id: string): Promise<void> {
    await pb.collection(COLLECTIONS.COUNTRIES).delete(id);
  }
};

// Subscription Services
export const subscriptionService = {
  async create(email: string): Promise<Subscription> {
    const data = {
      email,
      createdAt: new Date().toISOString(),
    };
    
    const record = await pb.collection(COLLECTIONS.SUBSCRIPTIONS).create(data);
    return record as unknown as Subscription;
  },

  async getAll(): Promise<Subscription[]> {
    const records = await pb.collection(COLLECTIONS.SUBSCRIPTIONS).getFullList();
    return records as unknown as Subscription[];
  },

  async delete(id: string): Promise<void> {
    await pb.collection(COLLECTIONS.SUBSCRIPTIONS).delete(id);
  }
};

// FAQ Services
export const faqService = {
  async getAll(): Promise<FAQ[]> {
    const records = await pb.collection(COLLECTIONS.FAQS).getFullList({
      sort: 'order'
    });
    return records as unknown as FAQ[];
  },

  async create(faq: Omit<FAQ, 'id'>): Promise<FAQ> {
    const record = await pb.collection(COLLECTIONS.FAQS).create(faq);
    return record as unknown as FAQ;
  },

  async update(id: string, faq: Partial<FAQ>): Promise<FAQ> {
    const record = await pb.collection(COLLECTIONS.FAQS).update(id, faq);
    return record as unknown as FAQ;
  },

  async delete(id: string): Promise<void> {
    await pb.collection(COLLECTIONS.FAQS).delete(id);
  }
};

// Testimonial Services
export const testimonialService = {
  async getAll(): Promise<Testimonial[]> {
    const records = await pb.collection(COLLECTIONS.TESTIMONIALS).getFullList();
    return records as unknown as Testimonial[];
  },

  async create(testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    const record = await pb.collection(COLLECTIONS.TESTIMONIALS).create(testimonial);
    return record as unknown as Testimonial;
  },

  async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const record = await pb.collection(COLLECTIONS.TESTIMONIALS).update(id, testimonial);
    return record as unknown as Testimonial;
  },

  async delete(id: string): Promise<void> {
    await pb.collection(COLLECTIONS.TESTIMONIALS).delete(id);
  }
};

// File Upload Services
export const fileService = {
  async uploadLogo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('logo', file);
    
    const record = await pb.collection(COLLECTIONS.SUBMISSIONS).create(formData);
    return getFileUrl(COLLECTIONS.SUBMISSIONS, record.id, record.logo);
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('highlightImage', file);
    
    const record = await pb.collection(COLLECTIONS.SUBMISSIONS).create(formData);
    return getFileUrl(COLLECTIONS.SUBMISSIONS, record.id, record.highlightImage);
  },

  async deleteFile(collection: string, recordId: string, filename: string): Promise<void> {
    await pb.collection(collection).update(recordId, {
      [filename]: null
    });
  }
}; 