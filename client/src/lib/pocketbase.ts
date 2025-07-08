// API client for Vercel backend

// API configuration - Environment aware
const getBaseUrl = () => {
  // Check if we're in development mode
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api'; // Local development server
  }
  
  // For production, use Vercel API
  return 'https://bookdirectstays.vercel.app/api';
};

const API_BASE_URL = getBaseUrl();

// Debug: Log the URL being used
console.log('API Base URL:', API_BASE_URL);

// Create a simple API client that mimics PocketBase
export const pb = {
  collection: (name: string) => ({
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/collections/${name}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    }
  })
};

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
  return `${API_BASE_URL}/files/${collection}/${recordId}/${filename}`;
}; 