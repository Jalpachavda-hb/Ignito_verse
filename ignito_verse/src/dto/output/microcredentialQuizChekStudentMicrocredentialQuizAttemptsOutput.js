/**
 * OUTPUT PARAMETER FILE: Microcredential Quiz Check Student Attempts Output DTO Parser
 * Parses response data for MicrocredentialQuizChekStudentMicrocredentialQuizAttempts POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with student attempt flag and quiz ID
 */
export function parseMicrocredentialQuizChekStudentMicrocredentialQuizAttemptsOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    return {
        success: isSuccess,
        isSuccess,
        isAttemptedFlag: rawJson?.isAttemptedFlag ?? rawJson?.IsAttemptedFlag ?? 0,
        quizId: rawJson?.quizId ?? rawJson?.QuizId ?? 0,
        status,
        message: rawJson?.message || rawJson?.Message || (isSuccess ? 'Attempt status retrieved successfully' : 'Failed to retrieve attempt status'),
        rawData: rawJson
    };
}

export function parseMicrocredentialQuizChekStudentMicrocredentialQuizAttemptsErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        isSuccess: false,
        isAttemptedFlag: 0,
        quizId: 0,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to check student quiz attempt status',
        rawData: rawJson
    };
}
