export function parseGetMicrocredentialLiveMeetingsByCourseOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const rawList = Array.isArray(rawJson?.liveMeetings)
        ? rawJson.liveMeetings
        : (Array.isArray(rawJson?.LiveMeetings)
            ? rawJson.LiveMeetings
            : (Array.isArray(rawJson?.data)
                ? rawJson.data
                : (Array.isArray(rawJson) ? rawJson : [])));

    const normalizedMeetings = rawList.map((item, idx) => {
        return {
            meetingId: item.meetingId || item.MeetingId || `MEET_${idx + 1}`,
            microcredentialCourseId: Number(item.microcredentialCourseId || item.MicrocredentialCourseId) || 0,
            microcredentialCourseName: item.microcredentialCourseName || item.MicrocredentialCourseName || '',
            title: item.title || item.Title || 'Live Meeting',
            description: item.description || item.Description || '',
            startDateTime: item.startDateTime || item.StartDateTime || '',
            endDateTime: item.endDateTime || item.EndDateTime || '',
            sourceType: String(item.sourceType || item.SourceType || 'GOOGLE_MEET').toUpperCase(),
            joinLink: item.joinLink || item.JoinLink || item.joinUrl || item.JoinUrl || '',
            liveStatus: item.liveStatus || item.LiveStatus || 'Upcoming'
        };
    });

    const isSuccess = Boolean(rawJson?.isSuccess !== undefined ? rawJson.isSuccess : (isHttpOk && (normalizedMeetings.length > 0 || isHttpOk)));

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || 'Live meetings retrieved successfully.',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || null,
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,
        liveMeetings: normalizedMeetings
    };
}

export function parseGetMicrocredentialLiveMeetingsByCourseErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || 'Failed to retrieve live meetings for this course.',
        errorDescription: rawJson?.errorDescription || rawJson?.error || 'Network or Server Error',
        errorNo: rawJson?.errorNo || status,
        liveMeetings: [],
        rawData: rawJson
    };
}
