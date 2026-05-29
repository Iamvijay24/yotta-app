import { ENV, REQUIRED_ENV_KEYS } from './env';

const SENSITIVE_ENV_PATTERNS = {
  FIREBASE_API_KEY: /^AIza[0-9A-Za-z\-_]{20,}$/,
  AWS_USER_POOL_ID: /^[a-z]{2}(?:-gov)?-[a-z-]+-\d_[A-Za-z0-9_-]+$/,
  AWS_USER_POOL_CLIENT_ID: /^[a-z0-9]{10,}$/,
  STRIPE_PUBLISHABLE_KEY: /^pk_(test|live)_[A-Za-z0-9_-]+$/,
};

export const getEnvironmentValidationReport = () => {
  const missing = REQUIRED_ENV_KEYS.filter(key => !ENV[key]);

  const malformed = Object.entries(SENSITIVE_ENV_PATTERNS)
    .filter(([key, pattern]) => ENV[key] && !pattern.test(ENV[key]))
    .map(([key]) => key);

  const invalid = [];

  if (ENV.API_BASE_URL && !/^https?:\/\//.test(ENV.API_BASE_URL)) {
    invalid.push('API_BASE_URL');
  }

  const errors = [];

  if (missing.length > 0) {
    errors.push(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }

  if (malformed.length > 0) {
    errors.push(`Invalid environment variable format: ${malformed.join(', ')}`);
  }

  if (invalid.length > 0) {
    errors.push('API_BASE_URL must be a valid http(s) URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
    missing,
    malformed,
    invalid,
  };
};

export const validateEnvironment = ({ throwOnError = true } = {}) => {
  const report = getEnvironmentValidationReport();

  if (!report.isValid && throwOnError) {
    throw new Error(`[ENV] ${report.errors.join(' | ')}`);
  }

  return report;
};
