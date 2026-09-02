/**
 * Centralized API Client for making HTTP requests to .NET Web API.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7107/api';

/**
 * Custom fetch wrapper for API communication.
 * 
 * @param {string} endpoint - API path (e.g. '/AdminAuthenticationAPI/ValidateAdminCredential')
 * @param {RequestInit} [options={}] - Standard fetch options (method, headers, body)
 * @returns {Promise<{ data: any, status: number, statusText: string, ok: boolean, headers: Headers }>}
 */
export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  // Get token if saved in localStorage
  const token = localStorage.getItem('ignito_auth_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    let data = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    return {
      data,
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      headers: res.headers,
    };
  } catch (error) {
    console.error('API Client Network Error:', error);
    return {
      data: null,
      status: 0,
      statusText: error.message || 'Network Error',
      ok: false,
      error,
    };
  }
}
