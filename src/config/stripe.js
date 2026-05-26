// Stripe configuration for React Native
// Get your publishable key from your Stripe dashboard: https://dashboard.stripe.com/apikeys
import { ENV } from './env';

export const STRIPE_CONFIG = {
  publishableKey: ENV.STRIPE_PUBLISHABLE_KEY,
  // Merchant identifier for Apple Pay (optional)
  merchantIdentifier: ENV.STRIPE_MERCHANT_IDENTIFIER,

  // Stripe configuration options
  options: {
    // Enable Apple Pay, Google Pay, etc.
    merchantIdentifier: ENV.STRIPE_MERCHANT_IDENTIFIER,
  },
};

export default STRIPE_CONFIG;
