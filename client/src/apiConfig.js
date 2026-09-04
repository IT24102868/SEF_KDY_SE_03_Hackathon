// client/src/apiConfig.js

// In production, uses Vite env variable VITE_API_URL or defaults to your Render backend URL.
// In local development, falls back to http://localhost:5001 (or 5000).
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://adultinlk-backend.onrender.com' // Replace with your exact Render backend URL once deployed
    : 'http://localhost:5001');

export const GET_SERVICES_URL = `${API_BASE_URL}/api/services/going-abroad`;
