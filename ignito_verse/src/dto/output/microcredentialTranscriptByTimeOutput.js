/**
 * OUTPUT PARAMETER FILE: Microcredential Transcript By Time Output DTO Parser
 * Parses response data for MicrocredentialTranscriptByTime POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with raise hand answer details
 */
export function parseMicrocredentialTranscriptByTimeOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || '',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || '',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,

        studentId: rawJson?.studentId ?? rawJson?.StudentId ?? 0,
        studentDegreeAdmissionId: rawJson?.studentDegreeAdmissionId ?? rawJson?.StudentDegreeAdmissionId ?? 0,
        studentMicrocredentialRaiseHandAnswerId: rawJson?.studentMicrocredentialRaiseHandAnswerId ?? rawJson?.StudentMicrocredentialRaiseHandAnswerId ?? 0,
        microcreditYoutubeDataMasterId: rawJson?.microcreditYoutubeDataMasterId ?? rawJson?.MicrocreditYoutubeDataMasterId ?? 0,
        microcredentialCourseId: rawJson?.microcredentialCourseId ?? rawJson?.MicrocredentialCourseId ?? 0,
        question: rawJson?.question || rawJson?.Question || '',
        answer: rawJson?.answer || rawJson?.Answer || '',

        rawData: rawJson
    };
}

export function parseMicrocredentialTranscriptByTimeErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to process transcript question',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || status,

        studentId: 0,
        studentDegreeAdmissionId: 0,
        studentMicrocredentialRaiseHandAnswerId: 0,
        microcreditYoutubeDataMasterId: 0,
        microcredentialCourseId: 0,
        question: '',
        answer: '',

        rawData: rawJson
    };
}
