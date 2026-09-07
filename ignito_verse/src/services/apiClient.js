/**
 * Centralized API Client for making HTTP requests to .NET Web API.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Static development token (replace with your development bearer token if needed)
const DEV_STATIC_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IndESWJPVm1hNnNTbXd5NTEtU1dGViJ9.eyJuaWNrbmFtZSI6ImhhY2tiZXJyeTEyMyIsIm5hbWUiOiJIYWNrYmVycnlzb2Z0ZWNoIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzlhMTU1ZjBmYjU4NzlkMzdiNDRkYzU2OTM2OWI3YzU0P3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGaGEucG5nIiwidXBkYXRlZF9hdCI6IjIwMjYtMDItMjhUMDY6NTA6MzIuNzUzWiIsImVtYWlsIjoiaGFja2JlcnJ5MTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9kZXYtYmZpeDFjZnpscG50d3QzOC51cy5hdXRoMC5jb20vIiwiYXVkIjoiYkVTZVlObWtNN3Vab0RPcm9ieFZHVEVSb2FYa3M2bk8iLCJzdWIiOiJhdXRoMHw2OTZhMjk4ZmRiZmFjNGJlNGIxY2YwYTkiLCJpYXQiOjE3NzIyNjE0MzIsImV4cCI6MTc3MjI5NzQzMn0.W-V24PgukePt2Th2qmDab0yVsciDCUhd3TfdYXd0rhiafh9Wa4IVz_gDjjl0tLEaHZBdIyC0y06ZTlwNlaIHGTx7sK3mgv_KfLOHTrrNUjHWVISC3D9JpDiPc583GPJiu61NB3aPqzlkMb4PRMYkJntFVTb_whYjVcyCQNWAcOyPW2nJ5LtqmqWtf1QcpsW6rs7oPGlHn9knroDv1xf_9NuSZDQWQ9D8gw2jOsI-ANaeeyqIZQXzNXfJxmhxv-lachm_9h-yEYs08_fDCS9vYwndo51kd1kiqMYOTeaqIDi_GFzAmI1wCHj3tsv5mW_vRe7pRTQt_0tInU5FKJJFSQ';

/**
 * Custom fetch wrapper for API communication.
 * 
 * @param {string} endpoint - API path (e.g. '/AdminAuthenticationAPI/ValidateAdminCredential')
 * @param {RequestInit} [options={}] - Standard fetch options (method, headers, body)
 * @returns {Promise<{ data: any, status: number, statusText: string, ok: boolean, headers: Headers }>}
 */
export async function apiClient(endpoint, options = {}) {
  const cleanEndpoint = endpoint.replace(/^\/?api\//i, '').replace(/^\//, '');
  const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${BASE_URL.replace(/\/$/, '')}/${cleanEndpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  // If request body is FormData, browser must set Content-Type header with boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  // Only attach token if endpoint is not explicitly marked public and header not disabled
  const isExplicitPublic = options.isPublic === true || options.requiresAuth === false;
  if (!isExplicitPublic && !headers['Authorization']) {
    const token = localStorage.getItem('ignito_auth_token')
      || localStorage.getItem('AccessToken')
      || DEV_STATIC_TOKEN;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Remove Authorization if explicitly set to null/false/empty
  if (headers['Authorization'] === null || headers['Authorization'] === false || headers['Authorization'] === '') {
    delete headers['Authorization'];
  }

  try {
    const res = await fetch(url, {
      credentials: options.credentials || 'include',
      ...options,
      headers,
    });

    let data = null;
    const contentType = res.headers.get('content-type');
    if (options.responseType === 'blob' || (contentType && (contentType.includes('spreadsheetml') || contentType.includes('octet-stream') || contentType.includes('application/vnd')))) {
      data = await res.blob();
    } else if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    // Auto-clean stale token if 401 occurs on protected endpoint
    if (res.status === 401) {
      localStorage.removeItem('ignito_auth_token');
      localStorage.removeItem('AccessToken');
      localStorage.removeItem('ignito_auth_user');
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
