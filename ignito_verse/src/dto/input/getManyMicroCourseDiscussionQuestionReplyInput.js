/**
 * INPUT PARAMETER FILE: Get Many Micro Course Discussion Question Reply Input DTO Builder
 * Builds input parameter body for GetManyMicroCourseDiscussionQuestionReply POST request.
 * 
 * @param {number} [microDiscussionQuestionId=0] - Discussion question ID
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildGetManyMicroCourseDiscussionQuestionReplyInput(microDiscussionQuestionId = 0) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            MicroDiscussionQuestionId: Number(microDiscussionQuestionId) || 0
        })
    };
}
