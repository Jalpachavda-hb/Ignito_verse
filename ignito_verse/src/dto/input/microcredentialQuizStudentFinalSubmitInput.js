/**
 * INPUT PARAMETER FILE: Microcredential Quiz Student Final Submit Input DTO Builder
 * Builds input parameter body for MicrocredentialQuizStudentFinalSubmit POST request.
 * 
 * Supports passing attemptId directly, or passing the result of parseMicrocredentialQuizAttemptSaveOutput:
 * { success: true, attemptId: 123, rawData: ... }
 * 
 * @param {number|object} attemptIdOrData - Attempt ID number or attempt save response object
 * @param {number} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @returns {object} Formatted request headers, JSON stringified body payload, and payload object
 */
export function buildMicrocredentialQuizStudentFinalSubmitInput(attemptIdOrData = 0, studentId = 0) {
    let resolvedAttemptId = 0;
    let resolvedStudentId = 0;

    if (typeof attemptIdOrData === 'object' && attemptIdOrData !== null) {
        resolvedAttemptId = Number(
            attemptIdOrData.attemptId || 
            attemptIdOrData.AttemptId || 
            attemptIdOrData.rawData?.attemptId || 
            attemptIdOrData.rawData?.AttemptId || 
            0
        );
        resolvedStudentId = Number(
            attemptIdOrData.studentId || 
            attemptIdOrData.StudentId || 
            studentId || 
            0
        );
    } else {
        resolvedAttemptId = Number(attemptIdOrData) || 0;
        resolvedStudentId = Number(studentId) || 0;
    }

    // Storage fallback if attemptId is 0
    if (!resolvedAttemptId && typeof window !== 'undefined') {
        try {
            resolvedAttemptId = Number(
                window.sessionStorage?.getItem('ActiveQuizAttemptId') ||
                window.sessionStorage?.getItem('attemptId') ||
                window.sessionStorage?.getItem('AttemptId') ||
                window.localStorage?.getItem('ActiveQuizAttemptId') ||
                window.localStorage?.getItem('attemptId') ||
                0
            );
        } catch (_) {}
    }

    // Storage fallback for studentId if 0
    if (!resolvedStudentId && typeof window !== 'undefined') {
        try {
            resolvedStudentId = Number(
                window.sessionStorage?.getItem('StudentId') ||
                window.sessionStorage?.getItem('studentId') ||
                window.sessionStorage?.getItem('ignito_student_id') ||
                window.localStorage?.getItem('StudentId') ||
                window.localStorage?.getItem('studentId') ||
                0
            );
        } catch (_) {}
    }

    const payload = {
        studentId: resolvedStudentId,
        attemptId: resolvedAttemptId,
        StudentId: resolvedStudentId,
        AttemptId: resolvedAttemptId
    };

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        payload
    };
}

