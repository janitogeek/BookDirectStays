import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(
  (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

// Stripe price IDs - configured with real price IDs from Stripe Dashboard
const PRICE_IDS = {
  'Basic (€99.99/year)': 'price_1RqGFNAuRAOWZse80bVZnkJx',     // Basic Listing Plan - €99.99/year
  'Premium (€499.99/year)': 'price_1RqGIAAuRAOWZse8t2w1xXcE', // Premium Listing Plan - €499.99/year
};

export const createCheckoutSession = async (formData: any, plan: string, email: string) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];
    if (!priceId) {
      throw new Error(`Invalid plan: ${plan}`);
    }

    // Store form data in localStorage for processing after payment
    const submissionData = {
      formData,
      plan,
      email,
      timestamp: Date.now(),
    };
    localStorage.setItem('pendingSubmission', JSON.stringify(submissionData));

    // Auto-detect the current site URL for success/cancel redirects
    const baseUrl = window.location.origin;
    
    console.log('Creating Stripe checkout with:', { priceId, email, baseUrl });

    // Create checkout session directly with Stripe.js
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: `${baseUrl}/submit/success?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(plan)}`,
      cancelUrl: `${baseUrl}/submit?canceled=true`,
      customerEmail: email,
    });

    if (error) {
      throw new Error(error.message || 'Stripe checkout failed');
    }
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create customer portal session for subscription management
export const createPortalSession = async (customerId: string, returnUrl?: string) => {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: returnUrl || window.location.origin + '/account',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    
    // Redirect to Stripe Customer Portal
    window.location.href = url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Get subscription details
export const getSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch(`/api/stripe/subscription/${subscriptionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};

// Get customer subscriptions
export const getCustomerSubscriptions = async (customerId: string) => {
  try {
    const response = await fetch(`/api/stripe/customer/${customerId}/subscriptions`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch customer subscriptions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching customer subscriptions:', error);
    throw error;
  }
};

// Get invoice details
export const getInvoice = async (invoiceId: string) => {
  try {
    const response = await fetch(`/api/stripe/invoice/${invoiceId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
};