/**
 * OUTPUT PARAMETER FILE: Homepage Response DTO Parsers
 * Parses raw HTTP response payloads from POST /api/HomePageAPI/HomePage into clean data objects.
 */

// Dynamically use API / Image base URL from environment config instead of hardcoded domain
const API_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';

/**
 * Normalizes image relative paths using configured base URL.
 * @param {string} path - Relative image path (e.g. '/HomePageImages/HomeBannerImage/...')
 * @returns {string} Formatted image URL
 */
export function formatImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
    try {
      const urlObj = new URL(API_BASE_URL);
      return `${urlObj.origin}/${path.replace(/^\//, '')}`;
    } catch {
      return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    }
  }

  // Relative path fallback (e.g. when served via Vite proxy or same-origin domain)
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Parses raw Homepage API response.
 * @param {object} rawJson - Raw JSON response from backend API
 * @param {number} status - HTTP status code
 * @returns {object} Standardized Homepage Data Object containing homePageDataBindList and homePageSectionDataList
 */
export function parseHomePageOutput(rawJson = {}, status = 200) {
  const isHttpOk = status >= 200 && status < 300;
  const isSuccess = Boolean(rawJson?.isSuccess ?? isHttpOk);

  return {
    success: isSuccess,
    status,
    message: rawJson?.message || '',
    errorDescription: rawJson?.errorDescription || '',
    errorNo: rawJson?.errorNo || 0,
    homePageDataBindList: rawJson?.homePageDataBindList || [],
    homePageSectionDataList: rawJson?.homePageSectionDataList || [],
    rawData: rawJson
  };
}

/**
 * Parses Error API response for Homepage endpoint.
 * @param {object} rawJson - Raw error JSON
 * @param {number} status - HTTP status code
 */
export function parseHomePageErrorOutput(rawJson = {}, status = 500) {
  return {
    success: false,
    status,
    message: rawJson?.message || 'Failed to load homepage data',
    errorDescription: rawJson?.errorDescription || rawJson?.error || 'Network/Server Error',
    errorNo: rawJson?.errorNo || status,
    homePageDataBindList: [],
    homePageSectionDataList: []
  };
}
