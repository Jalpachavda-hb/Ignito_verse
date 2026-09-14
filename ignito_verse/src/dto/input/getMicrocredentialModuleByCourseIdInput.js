export function buildGetMicrocredentialModuleByCourseIdInput(microcredentialCourseId = 0) {
    const numCourseId = Number(microcredentialCourseId);
    const resolvedCourseId = (!isNaN(numCourseId) && numCourseId > 0) ? numCourseId : microcredentialCourseId;

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
            MicrocredentialCourseId: resolvedCourseId,
            microcredentialCourseId: resolvedCourseId
        })
    };
}
