/**
 * INPUT PARAMETER FILE: Get Micro Many Discussion Question Input DTO Builder
 * Builds input parameter body for GetMicroManyDiscussionQuestion POST request.
 * 
 * @param {number} [microCorseId=0] - Microcredential course identifier
 * @param {number} [studentId=0] - Student identifier (0 defaults to session StudentId on backend)
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildGetMicroManyDiscussionQuestionInput(
    microCorseId = 0,
    studentId = 0
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            MicroCorseId: Number(microCorseId) || 0,
            StudentId: Number(studentId) || 0
        })
    };
}
