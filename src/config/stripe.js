// Stripe configuration for React Native
// Get your publishable key from your Stripe dashboard: https://dashboard.stripe.com/apikeys

export const STRIPE_CONFIG = {
  // Replace with your actual Stripe publishable key
  // This should be: pk_test_... for test mode or pk_live_... for live mode
  // Merchant identifier for Apple Pay (optional)
  merchantIdentifier: 'merchant.com.yottaacademyapp',

  // Stripe configuration options
  options: {
    // Enable Apple Pay, Google Pay, etc.
    merchantIdentifier: 'merchant.com.yottaacademyapp',
  },
};

// For development, you can also use environment variables:
// const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...';

export default STRIPE_CONFIG;
