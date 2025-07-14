import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";

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

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
