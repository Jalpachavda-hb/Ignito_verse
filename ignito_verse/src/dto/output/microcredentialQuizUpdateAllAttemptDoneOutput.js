/**
 * OUTPUT PARAMETER FILE: Microcredential Quiz Update All Attempt Done Output DTO Parser
 * Parses response data for MicrocredentialQuizUpdateAllAttemptDone POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO confirming update completion
 */
export function parseMicrocredentialQuizUpdateAllAttemptDoneOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    return {
        success: isSuccess,
        isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || (isSuccess ? 'All attempts marked as complete' : 'Failed to update attempts status'),
        rawData: rawJson
    };
}

export function parseMicrocredentialQuizUpdateAllAttemptDoneErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        isSuccess: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to update all attempts status',
        rawData: rawJson
    };
}
