import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { dataPreloader } from "./lib/data-preloader";

// Register Service Worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Performance monitoring
const reportWebVitals = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const metrics = {
        // Time to First Byte
        ttfb: navigation.responseStart - navigation.requestStart,
        // First Contentful Paint
        fcp: 0,
        // Largest Contentful Paint
        lcp: 0,
        // First Input Delay
        fid: 0,
      };

      // Report metrics to console (can be sent to analytics)
      console.log('Performance Metrics:', metrics);
    }
  }
};

// Dynamic title and meta description based on route
const updatePageMeta = () => {
  const path = window.location.pathname;
  let title = "BookDirectStays.com - Global Directory of Direct Booking Vacation Rentals | Skip OTA Fees";
  let description = "Find and book vacation rentals directly with property managers worldwide. Skip Airbnb and booking.com fees. 1000+ verified direct booking sites across 50+ countries. Save 10-20% by booking direct.";

  if (path.startsWith('/country/')) {
    const countrySlug = path.split('/')[2];
    const countryName = countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1);
    title = `${countryName} Direct Booking Vacation Rentals | BookDirectStays.com`;
    description = `Find direct booking vacation rentals in ${countryName}. Skip OTA fees and book directly with property managers. Verified listings with 10-20% savings.`;
  } else if (path === '/submit') {
    title = "List Your Vacation Rental Property | BookDirectStays.com";
    description = "Add your vacation rental property to our global directory. Get direct bookings and avoid OTA commissions. Free and featured listing options available.";
  } else if (path === '/faq') {
    title = "Frequently Asked Questions | BookDirectStays.com";
    description = "Common questions about direct booking vacation rentals, saving money on OTA fees, and listing your property on BookDirectStays.com.";
  } else if (path === '/testimonials') {
    title = "Customer Testimonials | BookDirectStays.com";
    description = "Read reviews from travelers and property managers who use BookDirectStays.com for direct booking vacation rentals.";
  } else if (path === '/about') {
    title = "About BookDirectStays – Direct Vacation Rental Bookings";
    description = "BookDirectStays is the global directory for booking vacation rentals directly with verified professional hosts — PMCs and owners using PMS — across 50+ countries.";
  }

  document.title = title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
  
  // Update Open Graph meta tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', title);
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', description);
  }
  
  // Update canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', `https://bookdirectstays.com${path}`);
  }
};

// Update meta tags on initial load
updatePageMeta();

// Update meta tags on navigation
window.addEventListener('popstate', updatePageMeta);

// Also update on pushState/replaceState (for client-side routing)
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function(...args) {
  originalPushState.apply(history, args);
  setTimeout(updatePageMeta, 0);
};

history.replaceState = function(...args) {
  originalReplaceState.apply(history, args);
  setTimeout(updatePageMeta, 0);
};

// Start preloading data immediately when app starts
console.log('🚀 Starting background data preload...');
dataPreloader.preloadData().then(() => {
  console.log('✅ Background data preload completed!');
  
  // CRITICAL FIX: Auto-process existing submissions to create company pages
  autoFixExistingSubmissions();
}).catch((error) => {
  console.error('❌ Background data preload failed:', error);
});

// CRITICAL FIX: Auto-process all existing submissions
async function autoFixExistingSubmissions() {
  try {
    console.log('🔧 AUTO-FIX: Checking if existing submissions need processing...');
    
    // Check if we need to process existing submissions
    const submissions = await dataPreloader.getSubmissions();
    const submissionsWithSlugs = submissions.filter(s => (s as any).uniqueSlug);
    
    console.log(`📊 Found ${submissions.length} total submissions, ${submissionsWithSlugs.length} with unique slugs`);
    
    if (submissionsWithSlugs.length < submissions.length || submissions.length === 0) {
      console.log('🚀 AUTO-FIX: Processing existing submissions to create company pages...');
      
      // Force refresh to process all submissions with unique slugs
      await dataPreloader.forceRefresh();
      
      console.log('✅ AUTO-FIX: All existing submissions processed with unique company pages');
      
      // Verify the fix worked
      const updatedSubmissions = await dataPreloader.getSubmissions();
      const updatedSubmissionsWithSlugs = updatedSubmissions.filter(s => (s as any).uniqueSlug);
      console.log(`🎉 VERIFICATION: Now have ${updatedSubmissions.length} submissions, ${updatedSubmissionsWithSlugs.length} with unique slugs`);
      
    } else {
      console.log('✅ AUTO-FIX: All submissions already have unique company pages');
    }
  } catch (error) {
    console.error('❌ AUTO-FIX: Error processing existing submissions:', error);
  }
}

// Report performance metrics after page load
window.addEventListener('load', () => {
  setTimeout(reportWebVitals, 1000);
});

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
