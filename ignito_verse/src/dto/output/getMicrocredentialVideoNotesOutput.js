/**
 * OUTPUT DTO FILE: Get Microcredential Video Notes Output Parser
 * Normalizes list of notes for a video/course.
 */

export function parseGetMicrocredentialVideoNotesOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? isHttpOk);

    // Extract list: could be raw array, rawJson.data, rawJson.notes, or rawJson.list
    let rawList = [];
    if (Array.isArray(rawJson)) {
        rawList = rawJson;
    } else if (Array.isArray(rawJson?.data)) {
        rawList = rawJson.data;
    } else if (Array.isArray(rawJson?.microcredentialVideoNotes)) {
        rawList = rawJson.microcredentialVideoNotes;
    } else if (Array.isArray(rawJson?.notes)) {
        rawList = rawJson.notes;
    } else if (Array.isArray(rawJson?.videoNotes)) {
        rawList = rawJson.videoNotes;
    } else if (Array.isArray(rawJson?.list)) {
        rawList = rawJson.list;
    }

    const notes = rawList.map(item => {
        const id = item?.microcredentialVideoNotesId ?? 
                   item?.MicrocredentialVideoNotesId ?? 
                   item?.id ?? 
                   item?.Id ?? 
                   0;
        const studentId = item?.studentId ?? item?.StudentId ?? 0;
        const courseId = item?.microcredentialCourseId ?? item?.MicrocredentialCourseId ?? 0;
        const videoId = String(item?.videoId ?? item?.VideoId ?? '');
        const noteDescription = String(item?.noteDescription ?? item?.NoteDescription ?? item?.description ?? item?.noteText ?? item?.NoteText ?? '').trim();
        const noteTimeInSec = parseFloat(item?.noteTimeInSec ?? item?.NoteTimeInSec ?? item?.timeInSec ?? item?.TimeInSec ?? 0) || 0;
        const createdOn = item?.createdOn ?? item?.CreatedOn ?? '';

        return {
            microcredentialVideoNotesId: Number(id) || 0,
            studentId: Number(studentId) || 0,
            microcredentialCourseId: Number(courseId) || 0,
            videoId,
            noteDescription,
            noteTimeInSec,
            createdOn,
            rawData: item
        };
    }).sort((a, b) => a.noteTimeInSec - b.noteTimeInSec);

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || 'Video notes loaded successfully',
        notes,
        totalNotes: notes.length,
        isSuccess,
        rawData: rawJson
    };
}

export function parseGetMicrocredentialVideoNotesErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || 'Failed to load video notes',
        errorDescription: rawJson?.errorDescription || rawJson?.error || 'Network/Server Error',
        notes: [],
        totalNotes: 0,
        isSuccess: false,
        rawData: rawJson
    };
}
