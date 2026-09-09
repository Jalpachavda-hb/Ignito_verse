/**
 * INPUT PARAMETER FILE: Micro Course Discussion Question Like Input DTO Builder
 * Builds input parameter body for MicroCourseDiscussionQuestionLike POST request.
 * 
 * @param {number} [microCourseDiscussionQuestionId=0] - Microcourse discussion question identifier
 * @param {number} [studentId=0] - Student identifier (0 defaults to session StudentId on backend)
 * @param {number} [microCourseId=0] - Microcredential course identifier
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildMicroCourseDiscussionQuestionLikeInput(
    microCourseDiscussionQuestionId = 0,
    studentId = 0,
    microCourseId = 0
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            MicroCourseDiscussionQuestionId: Number(microCourseDiscussionQuestionId) || 0,
            StudentId: Number(studentId) || 0,
            MicroCourseId: Number(microCourseId) || 0
        })
    };
}
