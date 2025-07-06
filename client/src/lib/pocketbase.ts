import PocketBase from 'pocketbase';

// PocketBase configuration
const POCKETBASE_URL = 'https://pocketbase-bookdirectstays.onrender.com';

// Debug: Log the URL being used
console.log('PocketBase URL:', POCKETBASE_URL);

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