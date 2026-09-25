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
    let cId = 0;
    let sId = 0;
    let mId = 0;

    if (typeof microcredentialCourseId === 'object' && microcredentialCourseId !== null) {
        cId = Number(
            microcredentialCourseId.microcredentialCourseId || 
            microcredentialCourseId.MicrocredentialCourseId || 
            microcredentialCourseId.courseId || 
            microcredentialCourseId.id
        ) || 0;
        sId = Number(
            microcredentialCourseId.studentId || 
            microcredentialCourseId.StudentId
        ) || 0;
        mId = Number(
            microcredentialCourseId.microcredentialModuleMasterId || 
            microcredentialCourseId.MicrocredentialModuleMasterId || 
            microcredentialCourseId.selectedModuleMasterId || 
            microcredentialCourseId.selectedModuleId || 
            microcredentialCourseId.moduleId
        ) || 0;
    } else {
        cId = Number(microcredentialCourseId) || 0;
        sId = Number(studentId) || 0;
        mId = Number(microcredentialModuleMasterId) || 0;
    }

    // Fallback: recover moduleMasterId from sessionStorage if not passed or passed as 0
    if (mId === 0 && typeof window !== 'undefined') {
        try {
            const stored = JSON.parse(sessionStorage.getItem('ignito_selected_course') || '{}');
            mId = Number(
                stored.microcredentialModuleMasterId ||
                stored.MicrocredentialModuleMasterId ||
                stored.selectedModuleMasterId ||
                stored.selectedModuleId ||
                stored.moduleId ||
                sessionStorage.getItem('MicrocredentialModuleMasterId') ||
                localStorage.getItem('MicrocredentialModuleMasterId') ||
                0
            ) || 0;
        } catch (e) {}
    }

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
