import { Client, Databases, Storage, Account } from 'appwrite';

// Appwrite configuration
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';

// Initialize Appwrite client
export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize services
export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

// Database and collection IDs
export const DATABASE_ID = 'bookdirectstays';
export const COLLECTIONS = {
  SUBMISSIONS: 'submissions',
  LISTINGS: 'listings',
  COUNTRIES: 'countries',
  SUBSCRIPTIONS: 'subscriptions',
  FAQS: 'faqs',
  TESTIMONIALS: 'testimonials'
} as const;

// Storage bucket IDs
export const BUCKETS = {
  LOGOS: 'logos',
  IMAGES: 'images'
} as const; 