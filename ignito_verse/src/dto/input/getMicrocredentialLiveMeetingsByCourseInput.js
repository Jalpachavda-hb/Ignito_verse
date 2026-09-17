export function buildGetMicrocredentialLiveMeetingsByCourseInput(
    microcredentialCourseId,
    studentId = 0
) {
    const numCourseId = Number(microcredentialCourseId) || 0;
    const numStudentId = Number(studentId) || 0;

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
            StudentId: numStudentId,
            studentId: numStudentId,
            MicrocredentialCourseId: numCourseId,
            microcredentialCourseId: numCourseId
        })
    };
}
