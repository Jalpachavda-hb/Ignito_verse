/**
 * INPUT PARAMETER FILE: Microcredential Student Review Like Insert Input DTO Builder
 * Builds input parameter body for MicrocredentialStudentReviewLikeInsert POST request.
 * 
 * @param {number} microcredentialReviewId - Microcredential review identifier
 * @param {number} studentId - Student identifier
 * @param {number} microcredentialCourseId - Microcredential course identifier
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildMicrocredentialStudentReviewLikeInsertInput(
    microcredentialReviewId = 0,
    studentId = 0,
    microcredentialCourseId = 0
) {
    const numReviewId = Number(microcredentialReviewId) || 0;
    const numStudentId = Number(studentId) || 0;
    const numCourseId = Number(microcredentialCourseId) || 0;

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            MicrocredentialReviewId: numReviewId,
            microcredentialReviewId: numReviewId,
            MicrocredentialCourseReviewId: numReviewId,
            microcredentialCourseReviewId: numReviewId,
            StudentId: numStudentId,
            studentId: numStudentId,
            MicrocredentialCourseId: numCourseId,
            microcredentialCourseId: numCourseId
        })
    };
}
