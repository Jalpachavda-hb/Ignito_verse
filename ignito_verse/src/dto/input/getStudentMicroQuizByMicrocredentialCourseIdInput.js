/**
 * INPUT PARAMETER FILE: Get Student Micro Quiz By Microcredential Course Id Input DTO Builder
 * Builds input parameter body for GetStudentMicroQuizByMicrocredentialCourseId POST request.
 * 
 * @param {number|string} microcredentialCourseId - Microcredential Course ID
 * @param {number} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @param {number} [educationTypeId=2] - Education Type ID (default 2)
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildGetStudentMicroQuizByMicrocredentialCourseIdInput(
    microcredentialCourseId = 0,
    studentId = 0,
    educationTypeId = 2
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            StudentId: Number(studentId) || 0,
            MicrocredentialCourseId: Number(microcredentialCourseId) || 0,
            EductionTypeId: Number(educationTypeId) || 2
        })
    };
}
