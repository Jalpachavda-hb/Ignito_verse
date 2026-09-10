/**
 * INPUT PARAMETER FILE: Microcredential Quiz Attempt Save Input DTO Builder
 * Builds input parameter body for MicrocredentialQuizAttemptSave POST request.
 * 
 * Supports both full attempt payload objects and individual field parameter passing.
 * 
 * @param {object|number} attemptDataOrQuizId - Attempt data object or Quiz ID
 * @param {number} [lastActivityTime=0] - Remaining or elapsed timer value
 * @param {number} [totalTimeAllowed=0] - Total time allowed
 * @param {Array} [answers=[]] - MCQ/Select answers
 * @param {Array} [blankAnswers=[]] - Fill in the blank answers
 * @param {Array} [matchingAnswers=[]] - Matching question answers
 * @param {Array} [orderingAnswers=[]] - Ordering question answers
 * @param {Array} [numericAnswers=[]] - Arithmetic / Sig Fig answers
 * @param {Array} [likertAnswers=[]] - Likert scale answers
 * @param {boolean} [isFinalSubmission=false] - Final submission flag
 * @param {number} [attemptNumber=0] - Attempt number
 * @param {number} [studentId=0] - Student ID
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildMicrocredentialQuizAttemptSaveInput(
    attemptDataOrQuizId = {},
    lastActivityTime = 0,
    totalTimeAllowed = 0,
    answers = [],
    blankAnswers = [],
    matchingAnswers = [],
    orderingAnswers = [],
    numericAnswers = [],
    likertAnswers = [],
    isFinalSubmission = false,
    attemptNumber = 0,
    studentId = 0
) {
    let payload = {};

    if (typeof attemptDataOrQuizId === 'object' && attemptDataOrQuizId !== null) {
        payload = {
            StudentId: Number(attemptDataOrQuizId.studentId ?? attemptDataOrQuizId.StudentId ?? 0),
            QuizId: Number(attemptDataOrQuizId.quizId ?? attemptDataOrQuizId.QuizId ?? 0),
            TotalTimeAllowed: Number(attemptDataOrQuizId.totalTimeAllowed ?? attemptDataOrQuizId.TotalTimeAllowed ?? 0),
            LastActivityTime: Number(attemptDataOrQuizId.lastActivityTime ?? attemptDataOrQuizId.LastActivityTime ?? 0),
            Answers: Array.isArray(attemptDataOrQuizId.answers ?? attemptDataOrQuizId.Answers) ? (attemptDataOrQuizId.answers ?? attemptDataOrQuizId.Answers) : [],
            BlankAnswers: Array.isArray(attemptDataOrQuizId.blankAnswers ?? attemptDataOrQuizId.BlankAnswers) ? (attemptDataOrQuizId.blankAnswers ?? attemptDataOrQuizId.BlankAnswers) : [],
            MatchingAnswers: Array.isArray(attemptDataOrQuizId.matchingAnswers ?? attemptDataOrQuizId.MatchingAnswers) ? (attemptDataOrQuizId.matchingAnswers ?? attemptDataOrQuizId.MatchingAnswers) : [],
            OrderingAnswers: Array.isArray(attemptDataOrQuizId.orderingAnswers ?? attemptDataOrQuizId.OrderingAnswers) ? (attemptDataOrQuizId.orderingAnswers ?? attemptDataOrQuizId.OrderingAnswers) : [],
            NumericAnswers: Array.isArray(attemptDataOrQuizId.numericAnswers ?? attemptDataOrQuizId.NumericAnswers) ? (attemptDataOrQuizId.numericAnswers ?? attemptDataOrQuizId.NumericAnswers) : [],
            LikertAnswers: Array.isArray(attemptDataOrQuizId.likertAnswers ?? attemptDataOrQuizId.LikertAnswers) ? (attemptDataOrQuizId.likertAnswers ?? attemptDataOrQuizId.LikertAnswers) : [],
            IsFinalSubmission: Boolean(attemptDataOrQuizId.isFinalSubmission ?? attemptDataOrQuizId.IsFinalSubmission ?? false),
            AttemptNumber: Number(attemptDataOrQuizId.attemptNumber ?? attemptDataOrQuizId.AttemptNumber ?? 0)
        };
    } else {
        payload = {
            StudentId: Number(studentId) || 0,
            QuizId: Number(attemptDataOrQuizId) || 0,
            TotalTimeAllowed: Number(totalTimeAllowed) || 0,
            LastActivityTime: Number(lastActivityTime) || 0,
            Answers: Array.isArray(answers) ? answers : [],
            BlankAnswers: Array.isArray(blankAnswers) ? blankAnswers : [],
            MatchingAnswers: Array.isArray(matchingAnswers) ? matchingAnswers : [],
            OrderingAnswers: Array.isArray(orderingAnswers) ? orderingAnswers : [],
            NumericAnswers: Array.isArray(numericAnswers) ? numericAnswers : [],
            LikertAnswers: Array.isArray(likertAnswers) ? likertAnswers : [],
            IsFinalSubmission: Boolean(isFinalSubmission),
            AttemptNumber: Number(attemptNumber) || 0
        };
    }

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    };
}
