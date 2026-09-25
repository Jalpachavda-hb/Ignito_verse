/**
 * Helper to safely extract a valid QuizId (> 0) from an object, parameters, or storage.
 * Resolves QuizId across multiple casing variations, nested answer structures,
 * and browser session/local storage fallbacks.
 *
 * @param {any} data - Input data object or primitive
 * @param {any} [directVal=0] - Direct value candidate
 * @returns {number} Resolved positive Quiz ID or 0
 */
function resolveQuizId(data = {}, directVal = 0) {
    // 1. Direct positive check on explicit candidate
    const directNum = Number(directVal);
    if (!isNaN(directNum) && directNum > 0) {
        return directNum;
    }

    // 2. Direct check if data itself is a valid positive number / numeric string
    if (typeof data === 'number' && data > 0) {
        return data;
    }
    if (typeof data === 'string' && !isNaN(Number(data)) && Number(data) > 0) {
        return Number(data);
    }

    // 3. Inspect object properties across all common casing / naming conventions
    if (typeof data === 'object' && data !== null) {
        const candidateProps = [
            data.quizId,
            data.QuizId,
            data.microcredentialQuizId,
            data.MicrocredentialQuizId,
            data.microcredentialQuizMasterId,
            data.MicrocredentialQuizMasterId,
            data.quizMasterId,
            data.QuizMasterId,
            data.activeQuizId,
            data.ActiveQuizId,
            data.id,
            data.Id
        ];

        for (const val of candidateProps) {
            const num = Number(val);
            if (!isNaN(num) && num > 0) {
                return num;
            }
        }

        // Check inside answers array if available
        const ansList = data.answers || data.Answers;
        if (Array.isArray(ansList) && ansList.length > 0) {
            for (const a of ansList) {
                const aQuizId = Number(
                    a?.quizId || 
                    a?.QuizId || 
                    a?.microcredentialQuizId || 
                    a?.MicrocredentialQuizId || 
                    a?.quizMasterId || 
                    a?.QuizMasterId
                );
                if (!isNaN(aQuizId) && aQuizId > 0) {
                    return aQuizId;
                }
            }
        }
    }

    // 4. Client-side browser storage and context fallbacks
    if (typeof window !== 'undefined') {
        try {
            const storageKeys = [
                'MicrocredentialQuizId',
                'quizId',
                'QuizId',
                'activeQuizId',
                'microcredentialQuizId',
                'ignito_recent_quiz_id'
            ];

            for (const key of storageKeys) {
                const sVal = Number(
                    window.sessionStorage?.getItem(key) || 
                    window.localStorage?.getItem(key)
                );
                if (!isNaN(sVal) && sVal > 0) {
                    return sVal;
                }
            }

            // Check cached course object in session or local storage
            const storedCourseStr = window.sessionStorage?.getItem('ignito_selected_course') || 
                                    window.localStorage?.getItem('ignito_selected_course');
            if (storedCourseStr) {
                const parsed = JSON.parse(storedCourseStr);
                const sQuizId = Number(
                    parsed?.quizId || 
                    parsed?.QuizId || 
                    parsed?.microcredentialQuizId || 
                    parsed?.MicrocredentialQuizId || 
                    parsed?.quizMasterId || 
                    parsed?.QuizMasterId
                );
                if (!isNaN(sQuizId) && sQuizId > 0) {
                    return sQuizId;
                }
            }

            // URL parameter fallback
            const urlParams = new URLSearchParams(window.location.search);
            const urlQuizId = Number(
                urlParams.get('quizId') || 
                urlParams.get('QuizId') || 
                urlParams.get('qId')
            );
            if (!isNaN(urlQuizId) && urlQuizId > 0) {
                return urlQuizId;
            }

            // Global window variable fallback
            const winQuizId = Number(window.__activeQuizId || window.activeQuizId);
            if (!isNaN(winQuizId) && winQuizId > 0) {
                return winQuizId;
            }
        } catch (_) {
            // Ignore storage access errors
        }
    }

    return 0;
}

/**
 * Helper to safely extract a valid StudentId (> 0) from an object, parameters, or storage.
 *
 * @param {any} data - Input data object or primitive
 * @param {any} [directVal=0] - Direct value candidate
 * @returns {number} Resolved positive Student ID or 0
 */
function resolveStudentId(data = {}, directVal = 0) {
    const directNum = Number(directVal);
    if (!isNaN(directNum) && directNum > 0) {
        return directNum;
    }

    if (typeof data === 'number' && data > 0) {
        return data;
    }

    if (typeof data === 'object' && data !== null) {
        const candidateProps = [
            data.studentId,
            data.StudentId,
            data.userId,
            data.UserId,
            data.id,
            data.Id
        ];
        for (const val of candidateProps) {
            const num = Number(val);
            if (!isNaN(num) && num > 0) {
                return num;
            }
        }
    }

    if (typeof window !== 'undefined') {
        try {
            const sId = Number(
                window.sessionStorage?.getItem('StudentId') ||
                window.sessionStorage?.getItem('studentId') ||
                window.sessionStorage?.getItem('ignito_student_id') ||
                window.localStorage?.getItem('StudentId') ||
                window.localStorage?.getItem('studentId') ||
                window.localStorage?.getItem('ignito_student_id')
            );
            if (!isNaN(sId) && sId > 0) {
                return sId;
            }

            const rawUser = window.sessionStorage?.getItem('ignito_auth_user') || 
                            window.localStorage?.getItem('ignito_auth_user') ||
                            window.sessionStorage?.getItem('user') || 
                            window.localStorage?.getItem('user');
            if (rawUser) {
                const parsed = JSON.parse(rawUser);
                const uId = Number(parsed?.studentId || parsed?.StudentId || parsed?.id || parsed?.userId);
                if (!isNaN(uId) && uId > 0) {
                    return uId;
                }
            }
        } catch (_) {}
    }

    return 0;
}

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
        const resolvedQuizId = resolveQuizId(
            attemptDataOrQuizId, 
            attemptDataOrQuizId.quizId || attemptDataOrQuizId.QuizId
        );
        const resolvedStudentId = resolveStudentId(
            attemptDataOrQuizId, 
            attemptDataOrQuizId.studentId || attemptDataOrQuizId.StudentId || studentId
        );

        payload = {
            StudentId: resolvedStudentId,
            QuizId: resolvedQuizId,
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
        const resolvedQuizId = resolveQuizId(attemptDataOrQuizId, attemptDataOrQuizId);
        const resolvedStudentId = resolveStudentId({}, studentId);

        payload = {
            StudentId: resolvedStudentId,
            QuizId: resolvedQuizId,
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
