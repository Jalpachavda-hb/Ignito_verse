/**
 * INPUT PARAMETER FILE: Get Student Enrolled Microcredential Course Input DTO Builder
 * Builds input payload for GetStudentEnrolledMicrocredentialCourse POST request.
 * 
 * @param {number} studentId - Student ID (default 0)
 * @param {number} enrolledMode - Enrolled Mode (default 1)
 * @returns {object} Object containing headers and stringified JSON body
 */
export function buildGetStudentEnrolledMicrocredentialCourseInput(
    studentId = 0,
    enrolledMode = 1
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            studentId: studentId,
            enrolledMode: enrolledMode
        })
    };
}
