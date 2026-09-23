/**
 * INPUT PARAMETER FILE: Microcredential Quiz Student Attempt Detail Input DTO Builder
 * Builds input parameter body for MicrocredentialQuizStudentAttemptDetail POST request.
 * 
 * @param {number} [microcredentialCourseId=0] - Microcredential course identifier
 * @param {number} [studentId=0] - Student identifier (0 defaults to session StudentId on backend)
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildMicrocredentialQuizStudentAttemptDetailInput(
    microcredentialCourseId = 0,
    studentId = 0,
    microcredentialModuleMasterId = 0
) {
    const cId = Number(microcredentialCourseId) || 0;
    const sId = Number(studentId) || 0;
    const mId = Number(microcredentialModuleMasterId) || 0;

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            MicrocredentialCourseId: cId,
            StudentId: sId,
            MicrocredentialModuleMasterId: mId,
            microcredentialCourseId: cId,
            studentId: sId,
            microcredentialModuleMasterId: mId
        })
    };
}
