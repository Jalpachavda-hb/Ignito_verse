/**
 * INPUT PARAMETER FILE: Get Microcredential Student Watch Video Data Input DTO Builder
 * Builds input parameter body for GetMicrocredentialStudentWatchVideoData POST request.
 * 
 * @param {number} [studentId=0] - Student identifier (0 defaults to session StudentId on backend)
 * @param {number} [microcredentialCourseId=0] - Microcredential course identifier
 * @param {number} [microcredentialModuleMasterId=0] - Microcredential module master identifier
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildGetMicrocredentialStudentWatchVideoDataInput(
    studentId = 0,
    microcredentialCourseId = 0,
    microcredentialModuleMasterId = 0
) {
    const numStudentId = Number(studentId) || 0;
    const numCourseId = Number(microcredentialCourseId) || 0;
    const numModuleId = Number(microcredentialModuleMasterId) || 0;

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            StudentId: numStudentId,
            MicrocredentialCourseId: numCourseId,
            MicrocredentialModuleMasterId: numModuleId
        })
    };
}
