/**
 * DTO Output parser for GetStudentMicrocredentialEvents API
 * POST /api/StudentMicrocredentialCalendarAPI/GetStudentMicrocredentialEvents
 */
export function parseGetStudentMicrocredentialEventsOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const rawList = Array.isArray(rawJson?.events)
        ? rawJson.events
        : (Array.isArray(rawJson?.Events)
            ? rawJson.Events
            : (Array.isArray(rawJson?.data)
                ? rawJson.data
                : (Array.isArray(rawJson) ? rawJson : [])));

    const normalizedEvents = rawList.map((item, idx) => {
        const srcRaw = String(item.sourceType || item.SourceType || 'GOOGLE_CALENDAR').toUpperCase();
        const isZoom = srcRaw.includes('ZOOM');
        const isMeet = srcRaw.includes('MEET');
        const isGoogleCal = srcRaw.includes('CALENDAR') || (!isZoom && !isMeet);

        const startRaw = item.startDateTime || item.StartDateTime || '';
        const endRaw = item.endDateTime || item.EndDateTime || '';
        const startIso = startRaw ? startRaw.replace(' ', 'T') : '';
        const endIso = endRaw ? endRaw.replace(' ', 'T') : '';

        return {
            id: item.eventId || item.EventId || `EVENT_${idx + 1}`,
            eventId: item.eventId || item.EventId || `EVENT_${idx + 1}`,
            microcredentialCourseId: Number(item.microcredentialCourseId || item.MicrocredentialCourseId) || 0,
            microcredentialCourseName: item.microcredentialCourseName || item.MicrocredentialCourseName || '',
            title: item.title || item.Title || 'Event',
            description: item.description || item.Description || '',
            startDateTime: startRaw,
            endDateTime: endRaw,
            startDate: startIso,
            endDate: endIso,
            displayStart: startRaw,
            displayEnd: endRaw,
            sourceType: isZoom ? 'zoom' : (isMeet ? 'google_meet' : 'google_calendar'),
            rawSourceType: srcRaw,
            sourceLabel: isZoom ? 'Zoom Meeting' : (isMeet ? 'Google Meet' : 'Google Calendar'),
            subType: isZoom ? 'meeting' : (isMeet ? 'meeting' : 'calendar_event'),
            category: isZoom ? 'zoom_meeting' : (isMeet ? 'google_meeting' : 'default'),
            joinLink: item.joinLink || item.JoinLink || item.joinUrl || item.JoinUrl || '',
            joinUrl: item.joinLink || item.JoinLink || item.joinUrl || item.JoinUrl || '',
            isAllDay: Boolean(item.isAllDay || item.IsAllDay),
            status: item.status || item.Status || 'Upcoming',
            liveStatus: item.status || item.Status || 'Upcoming',
            programName: item.microcredentialCourseName || item.MicrocredentialCourseName || '',
            programSub: item.description || item.Description || item.title || '',
            createdDate: startRaw,
            color: isZoom ? '#2563eb' : (isMeet ? '#f59e0b' : '#10b981')
        };
    });

    const isSuccess = Boolean(rawJson?.isSuccess !== undefined ? rawJson.isSuccess : (isHttpOk && (normalizedEvents.length > 0 || isHttpOk)));

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || 'Events retrieved successfully.',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || null,
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,
        events: normalizedEvents
    };
}

export function parseGetStudentMicrocredentialEventsErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || 'Failed to retrieve calendar events.',
        errorDescription: rawJson?.errorDescription || rawJson?.error || 'Network or Server Error',
        errorNo: rawJson?.errorNo || status,
        events: [],
        rawData: rawJson
    };
}
