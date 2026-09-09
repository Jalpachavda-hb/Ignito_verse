export function buildGetMicroCourseTopicDetailInput(
    microcredentialCourseId,
    studentId = 0,
    encryptedMicrocredentialCourseId = ''
) {
    const numCourseId = Number(microcredentialCourseId);
    const resolvedCourseId = (!isNaN(numCourseId) && numCourseId > 0) ? numCourseId : microcredentialCourseId;
    const numStudentId = Number(studentId) || 0;

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            MicrocredentialCourseId: resolvedCourseId,
            microcredentialCourseId: resolvedCourseId,
            StudentId: numStudentId,
            studentId: numStudentId,
            EncryptedMicrocredentialCourseId: encryptedMicrocredentialCourseId || '',
            encryptedMicrocredentialCourseId: encryptedMicrocredentialCourseId || ''
        })
    };
}