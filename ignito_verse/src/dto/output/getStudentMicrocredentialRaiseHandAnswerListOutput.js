/**
 * OUTPUT PARAMETER FILE: Get Student Microcredential Raise Hand Answer List Output DTO Parser
 * Parses response data for GetStudentMicrocredentialRaiseHandAnswerList POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with getStudentMicrocredentialRaiseHandAnswer list
 */
export function parseGetStudentMicrocredentialRaiseHandAnswerListOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    const rawList = rawJson?.getStudentMicrocredentialRaiseHandAnswer || rawJson?.GetStudentMicrocredentialRaiseHandAnswer || [];

    const getStudentMicrocredentialRaiseHandAnswer = Array.isArray(rawList)
        ? rawList.map(item => ({
            studentMicrocredentialRaiseHandAnswerId: item?.studentMicrocredentialRaiseHandAnswerId ?? item?.StudentMicrocredentialRaiseHandAnswerId ?? 0,
            studentId: item?.studentId ?? item?.StudentId ?? 0,
            studentDegreeAdmissionId: item?.studentDegreeAdmissionId ?? item?.StudentDegreeAdmissionId ?? 0,
            microcreditYoutubeDataMasterId: item?.microcreditYoutubeDataMasterId ?? item?.MicrocreditYoutubeDataMasterId ?? 0,
            question: item?.question || item?.Question || '',
            answer: item?.answer || item?.Answer || '',
            createdOn: item?.createdOn || item?.CreatedOn || ''
        }))
        : [];

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || '',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || '',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,

        getStudentMicrocredentialRaiseHandAnswer,
        rawData: rawJson
    };
}

export function parseGetStudentMicrocredentialRaiseHandAnswerListErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to fetch raise hand answer list',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || status,

        getStudentMicrocredentialRaiseHandAnswer: [],
        rawData: rawJson
    };
}
