/**
 * INPUT PARAMETER FILE: Ask Microcredential Topic AI Input DTO Builder
 * Builds input payload for AI assistant queries referencing embedded topic PDF content.
 * 
 * @param {object} params
 * @returns {object} Object containing headers and stringified JSON body
 */
export function buildAskMicrocredentialTopicAIInput({
    microcredentialCourseId = 1,
    topicId = 0,
    topicName = '',
    pdfUrl = '',
    pageContent = '',
    question = '',
    studentId = 3,
    matchedKeywords = []
} = {}) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            microcredentialCourseId,
            topicId,
            topicName,
            pdfUrl,
            pageContent,
            question,
            studentId,
            matchedKeywords
        })
    };
}
