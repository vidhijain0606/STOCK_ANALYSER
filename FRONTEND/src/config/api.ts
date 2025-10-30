/**
 * API Configuration
 * 
 * IMPORTANT: Replace this URL with your deployed Flask backend address
 * 
 * Examples:
 * - Local development: 'http://localhost:5000'
 * - Heroku: 'https://your-app-name.herokuapp.com'
 * - Railway: 'https://your-app.railway.app'
 * - Render: 'https://your-app.onrender.com'
 * - Custom domain: 'https://api.yourdomain.com'
 */
export const API_BASE_URL = 'http://localhost:5000';

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  register: `${API_BASE_URL}/register`,
  login: `${API_BASE_URL}/login`,
  
  // Stock endpoints
  analyze: `${API_BASE_URL}/analyze`,
  addToWatchlist: `${API_BASE_URL}/watchlist/add`,
  removeFromWatchlist: `${API_BASE_URL}/watchlist/remove`,
  getWatchlist: (userId: number) => `${API_BASE_URL}/watchlist/${userId}`,
};
