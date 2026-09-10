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
            microcredentialQuizAttemptNumber: item?.microcredentialQuizAttemptNumber ?? item?.MicrocredentialQuizAttemptNumber ?? item?.attemptNumber ?? item?.AttemptNumber ?? 0,
            quizCompletionTime: item?.quizCompletionTime || item?.QuizCompletionTime || item?.completionTime || item?.CompletionTime || '',
            scoreMessage: item?.scoreMessage || item?.ScoreMessage || item?.score || item?.Score || ''
        }))
        : [];

    const rawDetail = rawJson?.studentAttemptDetail || rawJson?.StudentAttemptDetail || {};
    const studentAttemptDetail = {
        isAllAttemptDone: Boolean(rawDetail?.isAllAttemptDone ?? rawDetail?.IsAllAttemptDone ?? false),
        quizTitle: rawDetail?.quizTitle || rawDetail?.QuizTitle || 'Final Module Assessment',
        quizAvailability: rawDetail?.quizAvailability || rawDetail?.QuizAvailability || 'Available',
        quizTimeLimit: rawDetail?.quizTimeLimit || rawDetail?.QuizTimeLimit || '30 mins',
        quizTotalAttempts: Number(rawDetail?.quizTotalAttempts ?? rawDetail?.QuizTotalAttempts ?? 3),
        usedAttempts: Number(rawDetail?.usedAttempts ?? rawDetail?.UsedAttempts ?? 0),
        remainingAttempts: Number(rawDetail?.remainingAttempts ?? rawDetail?.RemainingAttempts ?? 0),
        ...rawDetail
    };

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

        studentAttemptDetail: {
            isAllAttemptDone: false,
            quizTitle: 'Final Module Assessment',
            quizAvailability: 'Available',
            quizTimeLimit: '30 mins',
            quizTotalAttempts: 3,
            usedAttempts: 0,
            remainingAttempts: 3
        },
        microcredentialQuizStudentAttemptDetail: [],
        rawData: rawJson
    };
}
