/**
 * OUTPUT PARAMETER FILE: Microcredential Quiz Password Get Using Microcredential Course ID Output DTO Parser
 * Parses response data for MicrocredentialQuizPasswordGetUsingMicrocredentialCourseId POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with password, studentName, email, and microQuizIpRangeDetails
 */
export function parseMicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    const rawIpRanges = rawJson?.microQuizIpRangeDetails || rawJson?.MicroQuizIpRangeDetails || [];

    const microQuizIpRangeDetails = Array.isArray(rawIpRanges)
        ? rawIpRanges.map(item => ({
            ipRangeStart: item?.ipRangeStart || item?.IPRangeStart || '',
            ipRangeEnd: item?.ipRangeEnd || item?.IPRangeEnd || '',
            IPRangeStart: item?.IPRangeStart || item?.ipRangeStart || '',
            IPRangeEnd: item?.IPRangeEnd || item?.ipRangeEnd || ''
        }))
        : [];

    return {
        success: isSuccess,
        isSuccess: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || '',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || '',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,

        password: rawJson?.password || rawJson?.Password || '',
        studentName: rawJson?.studentName || rawJson?.StudentName || '',
        email: rawJson?.email || rawJson?.Email || '',

        Password: rawJson?.Password || rawJson?.password || '',
        StudentName: rawJson?.StudentName || rawJson?.studentName || '',
        Email: rawJson?.Email || rawJson?.email || '',
        MicroQuizIpRangeDetails: microQuizIpRangeDetails,

        microQuizIpRangeDetails,
        rawData: rawJson
    };
}

export function parseMicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        isSuccess: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to retrieve microcredential quiz password details',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || status,
