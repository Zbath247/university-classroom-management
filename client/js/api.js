// client/js/api.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: A reusable helper for making API calls to the backend.
//
// WHAT IS AN API CALL?
//   When the frontend (browser) needs data from the backend (server), it sends
//   an HTTP request. This file provides a simple function to do that cleanly,
//   automatically attaching the authentication token to every request.
//
// HOW TO USE:
//   // GET request:
//   const result = await api.get('/students');
//
//   // POST request (create):
//   const result = await api.post('/students', { name: 'Sambath', ... });
//
//   // PUT request (update):
//   const result = await api.put('/students/1', { name: 'New Name' });
//
//   // DELETE request:
//   const result = await api.delete('/students/1');
// ─────────────────────────────────────────────────────────────────────────────

// ─── Configuration ────────────────────────────────────────────────────────────
// The base URL for all API calls. In development this is localhost:3000.
// Using a relative URL ('/api') works because Express serves both the frontend
// and the API from the same server.
const API_BASE_URL = '/api';

// ─── Core Fetch Function ──────────────────────────────────────────────────────
/**
 * Makes an HTTP request to the backend API.
 * Automatically adds Content-Type and Authorization headers.
 *
 * @param {string} endpoint - The API path, e.g. '/students' or '/auth/login'
 * @param {string} method   - HTTP method: 'GET', 'POST', 'PUT', 'DELETE'
 * @param {object} body     - Request body data (for POST/PUT requests)
 * @returns {Promise<object>} - The JSON response from the server
 */
async function request(endpoint, method = 'GET', body = null) {
  const isFormData = (typeof FormData !== 'undefined' && body instanceof FormData);

  // Build request options
  const options = {
    method: method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' }
  };

  // If a JWT token is stored, add it to every request as an Authorization header.
  const token = localStorage.getItem('token');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  // If we have a body (data to send), serialize if JSON or pass through if FormData
  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  // Make the actual HTTP request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  // Parse the JSON response
  const data = await response.json();

  // If the server returned an error status (4xx or 5xx), throw an error
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ─── Convenient HTTP Method Shortcuts ─────────────────────────────────────────
const api = {
  get:    (endpoint)         => request(endpoint, 'GET'),
  post:   (endpoint, body)   => request(endpoint, 'POST', body),
  put:    (endpoint, body)   => request(endpoint, 'PUT', body),
  delete: (endpoint)         => request(endpoint, 'DELETE'),
  patch:  (endpoint, body)   => request(endpoint, 'PATCH', body),
  upload: (endpoint, formData) => request(endpoint, 'POST', formData),
  uploadPut: (endpoint, formData) => request(endpoint, 'PUT', formData)
};

// ─── Auth Helpers ─────────────────────────────────────────────────────────────
// These functions manage the token and user info stored in localStorage.

/**
 * Save login data after successful authentication.
 * @param {string} token   - JWT token received from server
 * @param {object} user    - User object {id, username, role, ...}
 */
function saveAuthData(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Get the currently logged-in user from localStorage.
 * @returns {object|null} - User object or null if not logged in
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if a user is currently logged in.
 * @returns {boolean}
 */
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

/**
 * Clear all auth data — used during logout.
 */
function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Get the user's role.
 * @returns {string|null} - 'admin', 'teacher', 'student', or null
 */
function getUserRole() {
  const user = getCurrentUser();
  return user ? user.role : null;
}
