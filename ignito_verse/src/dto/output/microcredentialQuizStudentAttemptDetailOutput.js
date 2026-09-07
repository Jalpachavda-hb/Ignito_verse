/**
 * OUTPUT PARAMETER FILE: Microcredential Quiz Student Attempt Detail Output DTO Parser
 * Parses response data for MicrocredentialQuizStudentAttemptDetail POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with student attempt details and attempt history list
 */
export function parseMicrocredentialQuizStudentAttemptDetailOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    const rawList = rawJson?.microcredentialQuizStudentAttemptDetail || rawJson?.MicrocredentialQuizStudentAttemptDetail || [];

    const microcredentialQuizStudentAttemptDetail = Array.isArray(rawList)
        ? rawList.map(item => ({
            microcredentialQuizAttemptNumber: item?.microcredentialQuizAttemptNumber ?? item?.MicrocredentialQuizAttemptNumber ?? 0,
            quizCompletionTime: item?.quizCompletionTime || item?.QuizCompletionTime || '',
            scoreMessage: item?.scoreMessage || item?.ScoreMessage || ''
        }))
        : [];

    const studentAttemptDetail = rawJson?.studentAttemptDetail || rawJson?.StudentAttemptDetail || {};

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || '',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || '',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,

        studentAttemptDetail,
        microcredentialQuizStudentAttemptDetail,
        rawData: rawJson
    };
}

export function parseMicrocredentialQuizStudentAttemptDetailErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to fetch student quiz attempt details',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || status,

        studentAttemptDetail: {},
        microcredentialQuizStudentAttemptDetail: [],
        rawData: rawJson
    };
}
