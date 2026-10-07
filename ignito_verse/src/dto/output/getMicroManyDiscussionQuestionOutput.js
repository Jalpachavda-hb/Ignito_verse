import { formatDate } from '../../utils/dateFormatter';

/**
 * OUTPUT PARAMETER FILE: Get Micro Many Discussion Question Output DTO Parser
 * Parses response data for GetMicroManyDiscussionQuestion POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with microDiscussionQuestions list
 */
export function parseGetMicroManyDiscussionQuestionOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess || rawJson?.IsSuccess || isHttpOk);

    const rawList = rawJson?.microDiscussionQuestions || rawJson?.MicroDiscussionQuestions || [];

    const mappedList = Array.isArray(rawList)
        ? rawList.map(item => ({
            microCourseDiscussionQuestionId: item?.microCourseDiscussionQuestionId ?? item?.MicroCourseDiscussionQuestionId ?? 0,
            studentId: item?.studentId ?? item?.StudentId ?? 0,
            studentName: item?.studentName || item?.StudentName || '',
            studentProfileImage: item?.studentProfileImage || item?.StudentProfileImage || '',
            professorName: item?.professorName || item?.ProfessorName || '',
            professorProfileImage: item?.professorProfileImage || item?.ProfessorProfileImage || '',
            question: item?.question || item?.Question || '',
            description: item?.description || item?.Description || '',
            createdOn: formatDate(item?.createdOn || item?.CreatedOn || ''),
            likeCount: item?.likeCount ?? item?.LikeCount ?? 0,
            replyCount: item?.replyCount ?? item?.ReplyCount ?? 0,
            isLiked: Boolean(item?.isLiked ?? item?.IsLiked ?? false)
        }))
        : [];

    // Deduplicate questions to prevent duplicate items from SQL joins or repeated data
    const seenQuestions = new Set();
    const microDiscussionQuestions = [];
    mappedList.forEach(item => {
        const idKey = Number(item.microCourseDiscussionQuestionId) > 0 ? `id_${item.microCourseDiscussionQuestionId}` : null;
        const textKey = `${String(item.studentName || item.studentId).trim().toLowerCase()}:::${String(item.question).trim().toLowerCase()}:::${String(item.createdOn).trim().toLowerCase()}`;

        if (idKey && seenQuestions.has(idKey)) return;
        if (seenQuestions.has(textKey)) return;

        if (idKey) seenQuestions.add(idKey);
        seenQuestions.add(textKey);
        microDiscussionQuestions.push(item);
    });

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || '',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || '',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,

        microDiscussionQuestions,
        rawData: rawJson
    };
}

export function parseGetMicroManyDiscussionQuestionErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to fetch discussion questions',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || status,

        microDiscussionQuestions: [],
        rawData: rawJson
    };
}
