/**
 * INPUT PARAMETER FILE: Get Microcredential Video Notes Input DTO Builder
 * Builds input parameter body for GetMicrocredentialVideoNotes POST request.
 * 
 * @param {object} params
 * @param {number|string} [params.studentId=0] - Logged in student identifier
 * @param {number|string} [params.courseId=0] - Microcredential course identifier
 * @param {string} [params.videoId=''] - Video identifier
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildGetMicrocredentialVideoNotesInput({
    studentId = 0,
    courseId = 0,
    videoId = ''
} = {}) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            StudentId: parseInt(studentId, 10) || 0,
            MicrocredentialCourseId: parseInt(courseId, 10) || 0,
            VideoId: String(videoId || '')
        })
    };
}
