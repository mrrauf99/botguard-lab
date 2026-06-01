/**
 * API base URL for bot-detection-platform client
 */
export const getApiUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:5000';
};

export const getAuthHeaders = (extra = {}) => {
  const headers = { 'Content-Type': 'application/json', ...extra };
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('botguard_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
};

export default getApiUrl;
