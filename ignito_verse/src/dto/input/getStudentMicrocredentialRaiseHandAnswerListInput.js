/**
 * INPUT PARAMETER FILE: Get Student Microcredential Raise Hand Answer List Input DTO Builder
 * Builds input parameter body for GetStudentMicrocredentialRaiseHandAnswerList POST request.
 * 
 * @param {number} [studentId=0] - Student identifier
 * @param {number} [studentDegreeAdmissionId=0] - Student degree admission identifier
 * @param {number} [microcredentialCourseId=0] - Microcredential course identifier
 * @param {string} [videoId=''] - Video identifier
 * @param {number} [pageNumber=1] - Page number
 * @param {number} [pageSize=10] - Page size
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildGetStudentMicrocredentialRaiseHandAnswerListInput(
    studentId = 0,
    studentDegreeAdmissionId = 0,
    microcredentialCourseId = 0,
    videoId = '',
    pageNumber = 1,
    pageSize = 10
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            StudentId: Number(studentId) || 0,
            StudentDegreeAdmissionId: Number(studentDegreeAdmissionId) || 0,
            MicrocredentialCourseId: Number(microcredentialCourseId) || 0,
            VideoId: videoId || '',
            PageNumber: Number(pageNumber) || 1,
            PageSize: Number(pageSize) || 10
        })
    };
}
