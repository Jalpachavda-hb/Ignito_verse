export function parseGetMicrocredentialMeetingRecordingsOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const rawList = Array.isArray(rawJson?.recordings)
        ? rawJson.recordings
        : (Array.isArray(rawJson?.Recordings)
            ? rawJson.Recordings
            : (Array.isArray(rawJson?.data)
                ? rawJson.data
                : (Array.isArray(rawJson) ? rawJson : [])));

    const normalizedRecordings = rawList.map((item, idx) => {
        const rawUrls = Array.isArray(item?.recordingUrls)
            ? item.recordingUrls
            : (Array.isArray(item?.RecordingUrls)
                ? item.RecordingUrls
                : []);

        const normalizedUrls = rawUrls.map(u => ({
            title: u.title || u.Title || item.title || 'Recording Download',
            fileUrl: u.fileUrl || u.FileUrl || u.url || u.Url || '',
            fileId: u.fileId || u.FileId || '',
            mimeType: u.mimeType || u.MimeType || 'video/mp4'
        }));

        // If recordingUrls array is empty but mainUrl or fileUrl exists at root, fallback to that
        if (normalizedUrls.length === 0 && (item.mainUrl || item.MainUrl || item.fileUrl || item.FileUrl)) {
            normalizedUrls.push({
                title: item.title || 'Recording Video',
                fileUrl: item.mainUrl || item.MainUrl || item.fileUrl || item.FileUrl,
                fileId: item.eventId || '',
                mimeType: item.sourceType === 'ZOOM' ? 'application/x-zoom' : 'video/mp4'
            });
        }

        return {
            meetingId: item.meetingId || item.MeetingId || `REC_${idx + 1}`,
            eventId: item.eventId || item.EventId || '',
            microcredentialCourseId: Number(item.microcredentialCourseId || item.MicrocredentialCourseId) || 0,
            microcredentialCourseName: item.microcredentialCourseName || item.MicrocredentialCourseName || '',
            title: item.title || item.Title || 'Course Meeting Recording',
            description: item.description || item.Description || '',
            meetingDate: item.meetingDate || item.MeetingDate || item.startDateTime || item.StartDateTime || '',
            duration: item.duration || item.Duration || '',
            sourceType: String(item.sourceType || item.SourceType || 'GOOGLE_MEET').toUpperCase(),
            mainUrl: item.mainUrl || item.MainUrl || '',
            recordingUrls: normalizedUrls
        };
    });

    const isSuccess = Boolean(rawJson?.isSuccess !== undefined ? rawJson.isSuccess : (isHttpOk && (normalizedRecordings.length > 0 || isHttpOk)));

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || 'Meeting recordings retrieved successfully.',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || null,
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,
        recordings: normalizedRecordings
    };
}

export function parseGetMicrocredentialMeetingRecordingsErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || 'Failed to retrieve meeting recordings.',
        errorDescription: rawJson?.errorDescription || rawJson?.error || 'Network or Server Error',
        errorNo: rawJson?.errorNo || status,
        recordings: [],
        rawData: rawJson
    };
}
