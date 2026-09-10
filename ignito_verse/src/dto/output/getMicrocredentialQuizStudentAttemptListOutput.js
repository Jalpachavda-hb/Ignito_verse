/**
 * OUTPUT PARAMETER FILE: Get Microcredential Quiz Student Attempt List Output DTO Parser
 * Parses response data for GetMicrocredentialQuizStudentAttemptList POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with quiz attempt history list
 */
export function parseGetMicrocredentialQuizStudentAttemptListOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    const rawList = Array.isArray(rawJson?.quizAttemptList || rawJson?.QuizAttemptList)
        ? (rawJson?.quizAttemptList || rawJson?.QuizAttemptList)
        : (Array.isArray(rawJson) ? rawJson : []);

    const quizAttemptList = rawList.map(item => ({
        attemptId: item?.attemptId ?? item?.AttemptId ?? 0,
        quizId: item?.quizId ?? item?.QuizId ?? 0,
        studentId: item?.studentId ?? item?.StudentId ?? 0,
        attemptNumber: item?.attemptNumber ?? item?.AttemptNumber ?? 0,
        attemptDate: item?.attemptDate || item?.AttemptDate || '',
        score: item?.score ?? item?.Score ?? 0,
        totalMarks: item?.totalMarks ?? item?.TotalMarks ?? 0,
        percentage: item?.percentage ?? item?.Percentage ?? 0,
        isPassed: Boolean(item?.isPassed ?? item?.IsPassed ?? false),
        isFinalSubmission: Boolean(item?.isFinalSubmission ?? item?.IsFinalSubmission ?? false),
        status: item?.status || item?.Status || '',
        timeSpent: item?.timeSpent ?? item?.TimeSpent ?? 0,
        grade: item?.grade || item?.Grade || ''
    }));

    return {
        success: isSuccess,
        isSuccess,
        quizAttemptList,
        totalAttempts: quizAttemptList.length,
        status,
        message: rawJson?.message || rawJson?.Message || (isSuccess ? 'Attempt list fetched successfully' : 'Failed to fetch attempt list'),
        rawData: rawJson
    };
}

export function parseGetMicrocredentialQuizStudentAttemptListErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        isSuccess: false,
        quizAttemptList: [],
        totalAttempts: 0,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to fetch student attempt list',
        rawData: rawJson
    };
}
