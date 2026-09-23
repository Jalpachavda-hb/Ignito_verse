/**
 * INPUT PARAMETER FILE: Get Student Micro Quiz By Microcredential Module Id Input DTO Builder
 * Builds input parameter body for GetStudentMicroQuizByMicrocredentialModuleId POST request.
 * 
 * Endpoint: POST /api/StudentMicrocredentialQuizAPI/GetStudentMicroQuizByMicrocredentialModuleId
 * 
 * @param {number|string} microcredentialCourseId - Microcredential Course ID
 * @param {number|string} microcredentialModuleMasterId - Microcredential Module Master ID
 * @param {number|string} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildGetStudentMicroQuizByMicrocredentialModuleIdInput(
    microcredentialCourseId = 0,
    microcredentialModuleMasterId = 0,
    studentId = 0
) {
    const courseId = Number(microcredentialCourseId) || 0;
    const moduleId = Number(microcredentialModuleMasterId) || 0;
    const sId = Number(studentId) || 0;

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            MicrocredentialCourseId: courseId,
            MicrocredentialModuleMasterId: moduleId,
            StudentId: sId,
            microcredentialCourseId: courseId,
            microcredentialModuleMasterId: moduleId,
            studentId: sId
        })
    };
}
