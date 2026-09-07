/**
 * INPUT PARAMETER FILE: Get Student Microcredential Quiz Result Get By Quiz Id Input DTO Builder
 * Builds input payload for GetStudentMicrocredentialQuizResultGetByQuizId POST request.
 * 
 * @param {number} [quizId=0] - Quiz ID
 * @param {number} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @param {number} [attemptId=0] - Quiz attempt ID
 * @returns {object} Object containing headers and stringified JSON body
 */
export function buildGetStudentMicrocredentialQuizResultGetByQuizIdInput(
    quizId = 0,
    studentId = 0,
    attemptId = 0
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            quizId: quizId,
            studentId: studentId,
            attemptId: attemptId
        })
    };
}
