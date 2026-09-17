/**
 * INPUT PARAMETER FILE: Delete Microcredential Video Note Input DTO Builder
 * Builds input parameter body for DeleteMicrocredentialVideoNote POST request.
 * 
 * @param {object} params
 * @param {number|string} params.noteId - Video note identifier to delete
 * @param {number|string} [params.studentId=0] - Student identifier
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildDeleteMicrocredentialVideoNoteInput({
    noteId = 0,
    studentId = 0
} = {}) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            MicrocredentialVideoNotesId: parseInt(noteId, 10) || 0,
            StudentId: parseInt(studentId, 10) || 0
        })
    };
}
