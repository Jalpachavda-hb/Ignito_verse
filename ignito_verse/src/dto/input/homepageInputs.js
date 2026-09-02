/**
 * INPUT PARAMETER FILE: Homepage Request DTO Builders
 * Constructs input parameters for .NET Web API Homepage endpoints.
 */

/**
 * Builds input parameter body for Homepage POST request (POST /api/HomePageAPI/HomePage).
 * @returns {object} Formatted input request headers and body payload
 */
export function buildHomePageInput() {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({})
  };
}
