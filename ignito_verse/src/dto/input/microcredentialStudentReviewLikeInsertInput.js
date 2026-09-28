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
    microcredentialCourseId = 0,
    isLike = undefined
) {
    const numReviewId = Number(microcredentialReviewId) || 0;
    const numStudentId = Number(studentId) || 0;
    const numCourseId = Number(microcredentialCourseId) || 0;

    const payload = {
        MicrocredentialReviewId: numReviewId,
        microcredentialReviewId: numReviewId,
        MicrocredentialCourseReviewId: numReviewId,
        microcredentialCourseReviewId: numReviewId,
        ReviewId: numReviewId,
        reviewId: numReviewId,
        StudentId: numStudentId,
        studentId: numStudentId,
        MicrocredentialCourseId: numCourseId,
        microcredentialCourseId: numCourseId,
        CourseId: numCourseId,
        courseId: numCourseId,
        MicroCourseId: numCourseId,
        microCourseId: numCourseId
    };

    if (isLike !== undefined) {
        payload.IsLike = Boolean(isLike);
        payload.isLike = Boolean(isLike);
        payload.IsLiked = Boolean(isLike);
        payload.isLiked = Boolean(isLike);
    }

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    };
}
