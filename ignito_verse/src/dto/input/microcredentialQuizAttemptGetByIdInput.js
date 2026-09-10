/**
 * INPUT PARAMETER FILE: Microcredential Quiz Attempt Get By ID Input DTO Builder
 * Builds input parameter body for MicrocredentialQuizAttemptGetById POST request.
 * 
 * @param {number} attemptId - Attempt ID
 * @param {number} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildMicrocredentialQuizAttemptGetByIdInput(attemptId = 0, studentId = 0) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            StudentId: Number(studentId) || 0,
            AttemptId: Number(attemptId) || 0
        })
    };
}
