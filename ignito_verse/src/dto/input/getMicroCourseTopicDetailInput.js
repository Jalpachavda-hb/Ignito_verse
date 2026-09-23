export function buildGetMicroCourseTopicDetailInput(
    microcredentialCourseId,
    studentId = 0,
    encryptedMicrocredentialCourseId = '',
    microcredentialModuleMasterId = 0
) {
    const cleanCourseStr = String(microcredentialCourseId || '').trim().replace(/^\/+|\/+$/g, '');
    const numCourseId = Number(cleanCourseStr);
    const resolvedCourseId = (!isNaN(numCourseId) && numCourseId > 0) ? numCourseId : (cleanCourseStr || 0);
    const numStudentId = Number(studentId) || 0;
    const numModuleId = Number(microcredentialModuleMasterId) || 0;

    // Sanitize encrypted course ID: never allow plain numeric strings or strings with slashes like "1" or "1/"
    const rawEnc = String(encryptedMicrocredentialCourseId || '').trim().replace(/^\/+|\/+$/g, '');
    const validEncryptedId = (/^\d+$/.test(rawEnc) || rawEnc.length <= 4) ? '' : rawEnc;

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
            EncryptedMicrocredentialCourseId: validEncryptedId,
            encryptedMicrocredentialCourseId: validEncryptedId
        })
    };
}