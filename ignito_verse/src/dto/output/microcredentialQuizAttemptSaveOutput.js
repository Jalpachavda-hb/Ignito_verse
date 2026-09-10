/**
 * OUTPUT PARAMETER FILE: Microcredential Quiz Attempt Save Output DTO Parser
 * Parses response data for MicrocredentialQuizAttemptSave POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with saved attempt ID
 */
export function parseMicrocredentialQuizAttemptSaveOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    return {
        success: isSuccess,
        isSuccess,
        attemptId: rawJson?.attemptId ?? rawJson?.AttemptId ?? 0,
        status,
        message: rawJson?.message || rawJson?.Message || (isSuccess ? 'Attempt saved successfully' : 'Failed to save attempt'),
        rawData: rawJson
    };
}

export function parseMicrocredentialQuizAttemptSaveErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        isSuccess: false,
        attemptId: 0,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to save quiz attempt',
        rawData: rawJson
    };
}
