/**
 * OUTPUT PARAMETER FILE: Microcredential Quiz Student Final Submit Output DTO Parser
 * Parses response data for MicrocredentialQuizStudentFinalSubmit POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with score message and submission status
 */
export function parseMicrocredentialQuizStudentFinalSubmitOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    return {
        success: isSuccess,
        isSuccess,
        scoreMessage: rawJson?.scoreMessage || rawJson?.ScoreMessage || '',
        message: rawJson?.message || rawJson?.Message || (isSuccess ? 'Quiz submitted successfully' : 'Failed to submit quiz'),
        status,
        rawData: rawJson
    };
}

export function parseMicrocredentialQuizStudentFinalSubmitErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        isSuccess: false,
        scoreMessage: '',
        message: rawJson?.message || rawJson?.Message || 'Failed to submit quiz',
        status,
        rawData: rawJson
    };
}
