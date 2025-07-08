// PocketBase client configuration for BookDirectStays

import PocketBase from 'pocketbase';

// Environment-aware PocketBase URL
const getPocketBaseURL = () => {
  // Check if we're in development mode
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080'; // Local development
  }
  
  // For production, use Render deployment
  return 'https://pocketbase-bookdirectstays.onrender.com';
};

const PB_URL = getPocketBaseURL();

// Debug: Log the URL being used
console.log('PocketBase URL:', PB_URL);

// Create PocketBase instance
export const pb = new PocketBase(PB_URL);

// Collection names
export const COLLECTIONS = {
  SUBMISSIONS: 'Submissions',
  LISTINGS: 'listings',
  COUNTRIES: 'countries',
  SUBSCRIPTIONS: 'subscriptions',
  FAQS: 'faqs',
  TESTIMONIALS: 'testimonials'
} as const;

// Helper function to get file URL
export const getFileUrl = (collection: string, recordId: string, filename: string) => {
  return `${pb.baseUrl}/api/files/${collection}/${recordId}/${filename}`;
}; 