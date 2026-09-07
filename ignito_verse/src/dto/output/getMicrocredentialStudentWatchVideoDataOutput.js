/**
 * OUTPUT PARAMETER FILE: Get Microcredential Student Watch Video Data Output DTO Parser
 * Parses response data for GetMicrocredentialStudentWatchVideoData POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with watch video details and metadata
 */
export function parseGetMicrocredentialStudentWatchVideoDataOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    const rawList = rawJson?.studentwatchvideodetails || rawJson?.Studentwatchvideodetails || [];

    const studentwatchvideodetails = Array.isArray(rawList)
        ? rawList.map(item => ({
            ...item,
            studentId: item?.studentId ?? item?.StudentId ?? 0,
            microcredentialCourseId: item?.microcredentialCourseId ?? item?.MicrocredentialCourseId ?? 0,
            topicId: item?.topicId ?? item?.TopicId ?? 0,
            subTopicId: item?.subTopicId ?? item?.SubTopicId ?? 0,
            videoId: item?.videoId || item?.VideoId || '',
            videoUrl: item?.videoUrl || item?.VideoUrl || '',
            percentageWatched: item?.percentageWatched ?? item?.PercentageWatched ?? 0,
            totalDuration: item?.totalDuration ?? item?.TotalDuration ?? 0,
            watchedSeconds: item?.watchedSeconds ?? item?.WatchedSeconds ?? 0
        }))
        : [];

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || '',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || '',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,

        overallPercentage: rawJson?.overallPercentage ?? rawJson?.OverallPercentage ?? 0,
        microcredentialCourseDuration: rawJson?.microcredentialCourseDuration || rawJson?.MicrocredentialCourseDuration || '',
        quizId: rawJson?.quizId ?? rawJson?.QuizId ?? 0,
        purchasedDate: rawJson?.purchasedDate || rawJson?.PurchasedDate || '',
        quizEligibleDate: rawJson?.quizEligibleDate || rawJson?.QuizEligibleDate || '',
        isQuizOpen: Boolean(rawJson?.isQuizOpen ?? rawJson?.IsQuizOpen ?? false),
        isResult: Boolean(rawJson?.isResult ?? rawJson?.IsResult ?? false),
        statusMessage: rawJson?.statusMessage || rawJson?.StatusMessage || '',

        studentwatchvideodetails,
        rawData: rawJson
    };
}

export function parseGetMicrocredentialStudentWatchVideoDataErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to fetch student watch video data',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || status,

        overallPercentage: 0,
        microcredentialCourseDuration: '',
        quizId: 0,
        purchasedDate: '',
        quizEligibleDate: '',
        isQuizOpen: false,
        isResult: false,
        statusMessage: '',

        studentwatchvideodetails: [],
        rawData: rawJson
    };
}
