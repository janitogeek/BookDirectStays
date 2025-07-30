import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(
  (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

export const createCheckoutSession = async (formData: any, plan: string, email: string) => {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan,
        email,
        metadata: formData, // Pass form data to store in session metadata
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { checkoutUrl } = await response.json();
    
    // Redirect to Stripe Checkout
    window.location.href = checkoutUrl;
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