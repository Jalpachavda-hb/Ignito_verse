/**
 * OUTPUT PARAMETER FILE: Log JS Error Output DTO Parser
 * Parses response data for LogJsError POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO
 */
export function parseLogJsErrorOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.success ?? rawJson?.Success ?? rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || 'JS Error logged successfully',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || '',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,
        rawData: rawJson
    };
}

/**
 * Parses error response when LogJsError API call fails.
 * 
 * @param {object} rawJson - Raw error JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted error output DTO
 */
export function parseLogJsErrorErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to log JS error',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || status,
        rawData: rawJson
    };
}
