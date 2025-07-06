import PocketBase from 'pocketbase';

// PocketBase configuration
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

// Initialize PocketBase client
export const pb = new PocketBase(POCKETBASE_URL);

// Collection names
export const COLLECTIONS = {
  SUBMISSIONS: 'submissions',
  LISTINGS: 'listings',
  COUNTRIES: 'countries',
  SUBSCRIPTIONS: 'subscriptions',
  FAQS: 'faqs',
  TESTIMONIALS: 'testimonials'
} as const;

// Helper function to get file URL
export const getFileUrl = (collection: string, recordId: string, filename: string) => {
  return `${POCKETBASE_URL}/api/files/${collection}/${recordId}/${filename}`;
}; 