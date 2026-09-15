export function buildGetMicroCourseTopicDetailInput(
    microcredentialCourseId,
    studentId = 0,
    encryptedMicrocredentialCourseId = '',
    microcredentialModuleMasterId = 0
) {
    const numCourseId = Number(microcredentialCourseId);
    const resolvedCourseId = (!isNaN(numCourseId) && numCourseId > 0) ? numCourseId : microcredentialCourseId;
    const numStudentId = Number(studentId) || 0;
    const numModuleId = Number(microcredentialModuleMasterId) || 0;

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify({
            MicrocredentialCourseId: resolvedCourseId,
            microcredentialCourseId: resolvedCourseId,
            MicroCorseId: resolvedCourseId,
            microCorseId: resolvedCourseId,
            MicroCourseId: resolvedCourseId,
            microCourseId: resolvedCourseId,
            MicrocredentialModuleMasterId: numModuleId,
            microcredentialModuleMasterId: numModuleId,
            StudentId: numStudentId,
            studentId: numStudentId,
            EncryptedMicrocredentialCourseId: encryptedMicrocredentialCourseId || '',
            encryptedMicrocredentialCourseId: encryptedMicrocredentialCourseId || ''
        })
    };
}