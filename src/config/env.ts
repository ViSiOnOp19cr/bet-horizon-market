// Environment configuration for the application
export const config = {
  // API URL - uses environment variable or defaults to production domain
  apiUrl: import.meta.env.VITE_API_URL || 'https://paisamarket.chandancr.xyz/api/v1',
  
  // Environment check
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Base URL for the application
  baseUrl: import.meta.env.VITE_BASE_URL || 'https://paisamarket.chandancr.xyz',
} as const;

export default config; 