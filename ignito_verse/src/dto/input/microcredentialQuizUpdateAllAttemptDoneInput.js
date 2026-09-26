/**
 * INPUT PARAMETER FILE: Microcredential Quiz Update All Attempt Done Input DTO Builder
 * Builds input parameter body for MicrocredentialQuizUpdateAllAttemptDone POST request.
 * 
 * @param {number} quizId - Quiz ID
 * @param {number} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildMicrocredentialQuizUpdateAllAttemptDoneInput(quizId = 0, studentId = 0) {
    const qId = Number(quizId) || 0;
    const sId = Number(studentId) || 0;

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            QuizId: qId,
            StudentId: sId,
            quizId: qId,
            studentId: sId
        })
    };
}
