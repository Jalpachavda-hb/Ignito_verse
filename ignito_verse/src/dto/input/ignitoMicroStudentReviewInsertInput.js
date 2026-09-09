/**
 * INPUT PARAMETER FILE: Ignito Micro Student Review Insert Input DTO Builder
 * Builds input parameter body for IgnitoMicroStudentReviewInsert POST request.
 * 
 * @param {number} studentId - Student identifier
 * @param {number} microcredentialCourseId - Microcredential course identifier
 * @param {number} reviewInStar - Rating in stars
 * @param {string} reviewDescription - Text review description
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildIgnitoMicroStudentReviewInsertInput(
    studentId = 0,
    microcredentialCourseId = 0,
    reviewInStar = 0,
    reviewDescription = ''
) {
    const numStudentId = Number(studentId) || 0;
    const numCourseId = Number(microcredentialCourseId) || 0;
    const numStar = Number(reviewInStar) || 5;

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            StudentId: numStudentId,
            studentId: numStudentId,
            MicrocredentialCourseId: numCourseId,
            microcredentialCourseId: numCourseId,
            ReviewInStar: numStar,
            reviewInStar: numStar,
            ReviewDescription: reviewDescription || '',
            reviewDescription: reviewDescription || ''
        })
    };
}
