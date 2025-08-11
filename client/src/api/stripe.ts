// API endpoint for creating Stripe checkout sessions with mixed payments
export const createCheckoutSessionAPI = async (data: {
  plan: string;
  email: string;
  verificationSelected: boolean;
  pendingSubmissionKey: string;
}) => {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
