import PocketBase from 'pocketbase';

// PocketBase configuration - Environment aware
const getBaseUrl = () => {
  // Check if we're in development mode
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080';
  }
  
  // For production, use your Docker deployment
  // You can override this with VITE_POCKETBASE_URL environment variable
  return (import.meta as any).env?.VITE_POCKETBASE_URL || 'REPLACE_WITH_YOUR_NGROK_URL';
};

const POCKETBASE_URL = getBaseUrl();

// Debug: Log the URL being used
console.log('PocketBase URL:', POCKETBASE_URL);

// Initialize PocketBase client
export const pb = new PocketBase(POCKETBASE_URL);

// Collection names
export const COLLECTIONS = {
  SUBMISSIONS: 'Submissios',
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