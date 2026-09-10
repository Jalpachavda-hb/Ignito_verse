/**
 * INPUT PARAMETER FILE: Get Microcredential Quiz Student Attempt List Input DTO Builder
 * Builds input parameter body for GetMicrocredentialQuizStudentAttemptList POST request.
 * 
 * @param {number} quizId - Quiz ID
 * @param {number} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildGetMicrocredentialQuizStudentAttemptListInput(quizId = 0, studentId = 0) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            StudentId: Number(studentId) || 0,
            QuizId: Number(quizId) || 0
        })
    };
}
