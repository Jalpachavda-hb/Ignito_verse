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

    const attemptNumber = Number(rawJson?.attemptNumber ?? rawJson?.AttemptNumber ?? 1);
    const usedAttempts = Number(rawJson?.usedAttempts ?? rawJson?.UsedAttempts ?? 0);
    const remainingAttempts = Number(rawJson?.remainingAttempts ?? rawJson?.RemainingAttempts ?? 0);
    const isAttemptAllowed = rawJson?.isAttemptAllowed !== undefined 
        ? Boolean(rawJson.isAttemptAllowed) 
        : (rawJson?.IsAttemptAllowed !== undefined ? Boolean(rawJson.IsAttemptAllowed) : true);

    const isAttemptedFlag = rawJson?.isAttemptedFlag ?? rawJson?.IsAttemptedFlag ?? (usedAttempts > 0 ? 1 : 0);
    const quizId = rawJson?.quizId ?? rawJson?.QuizId ?? 0;
    const microcredentialCourseId = rawJson?.microcredentialCourseId ?? rawJson?.MicrocredentialCourseId ?? 0;
    const microcredentialModuleMasterId = rawJson?.microcredentialModuleMasterId ?? rawJson?.MicrocredentialModuleMasterId ?? 0;

    return {
        success: isSuccess,
        isSuccess,
        isAttemptedFlag: Number(isAttemptedFlag) || 0,
        quizId: Number(quizId) || 0,
        attemptNumber,
        usedAttempts,
        remainingAttempts,
        isAttemptAllowed,
        microcredentialCourseId,
        microcredentialModuleMasterId,
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
        attemptNumber: 1,
        usedAttempts: 0,
        remainingAttempts: 0,
        isAttemptAllowed: false,
        microcredentialCourseId: 0,
        microcredentialModuleMasterId: 0,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to check student quiz attempt status',
        rawData: rawJson
    };
}
