/**
 * OUTPUT PARAMETER FILE: Get Many Micro Course Discussion Question Reply Output DTO Parser
 * Parses response data for GetManyMicroCourseDiscussionQuestionReply POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with getMicroManyDiscussionQuestionReplay list
 */
export function parseGetManyMicroCourseDiscussionQuestionReplyOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    const rawList = rawJson?.getMicroManyDiscussionQuestionReplay || 
                    rawJson?.GetMicroManyDiscussionQuestionReplay || 
                    rawJson?.getMicroManyDiscussionQuestionReply ||
                    rawJson?.GetMicroManyDiscussionQuestionReply ||
                    [];

    const getMicroManyDiscussionQuestionReplay = Array.isArray(rawList)
        ? rawList.map((item, idx) => ({
            microCourseDiscussionQuestionReplyId: item?.microCourseDiscussionQuestionReplyId ?? item?.MicroCourseDiscussionQuestionReplyId ?? (idx + 1),
            microCourseDiscussionQuestionId: item?.microCourseDiscussionQuestionId ?? item?.MicroCourseDiscussionQuestionId ?? 0,
            studentId: item?.studentId ?? item?.StudentId ?? 0,
            studentName: item?.studentName || item?.StudentName || item?.userName || item?.UserName || 'Learner',
            studentProfileImage: item?.studentProfileImage || item?.StudentProfileImage || '',
            professorName: item?.professorName || item?.ProfessorName || '',
            professorProfileImage: item?.professorProfileImage || item?.ProfessorProfileImage || '',
            createdOn: item?.createdOn || item?.CreatedOn || '',
            reply: item?.reply || item?.Reply || item?.comment || item?.Comment || ''
        }))
        : [];

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || '',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || '',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,

        getMicroManyDiscussionQuestionReplay,
        rawData: rawJson
    };
}

export function parseGetManyMicroCourseDiscussionQuestionReplyErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to fetch discussion replies',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || status,

        getMicroManyDiscussionQuestionReplay: [],
        rawData: rawJson
    };
}
