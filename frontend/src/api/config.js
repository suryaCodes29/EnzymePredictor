/**
 * Production-ready API configuration.
 * Uses environment variables for live deployments and local defaults for development.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default {
  API_BASE_URL,
  isProduction: import.meta.env.PROD
};
