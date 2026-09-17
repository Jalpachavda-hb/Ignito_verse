/**
 * INPUT PARAMETER FILE: Add/Update Microcredential Video Note Input DTO Builder
 * Builds input parameter body for AddUpdateMicrocredentialVideoNote POST request.
 * 
 * @param {object} params
 * @param {number|string} [params.noteId=0] - Note identifier (0 for new note)
 * @param {number|string} [params.studentId=0] - Logged in student identifier
 * @param {number|string} [params.courseId=0] - Microcredential course identifier
 * @param {string} [params.videoId=''] - YouTube or video identifier
 * @param {string} [params.noteText=''] - Text description of note
 * @param {number|string} [params.roundedpausedTime=0] - Timestamp in seconds when video paused
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildAddUpdateMicrocredentialVideoNoteInput({
    noteId = 0,
    studentId = 0,
    courseId = 0,
    videoId = '',
    noteText = '',
    roundedpausedTime = 0
} = {}) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            MicrocredentialVideoNotesId: parseInt(noteId, 10) || 0,
            StudentId: parseInt(studentId, 10) || 0,
            MicrocredentialCourseId: parseInt(courseId, 10) || 0,
            VideoId: String(videoId || ''),
            NoteDescription: String(noteText || ''),
            NoteTimeInSec: parseFloat(roundedpausedTime) || 0.0
        })
    };
}
