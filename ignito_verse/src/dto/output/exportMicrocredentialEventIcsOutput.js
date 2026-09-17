export function parseExportMicrocredentialEventIcsOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;

    const eventId = rawJson?.eventId || rawJson?.EventId || '';
    const fileName = rawJson?.fileName || rawJson?.FileName || (eventId ? `${eventId}_calendar.ics` : 'event_calendar.ics');
    const icsContent = rawJson?.icsContent || rawJson?.IcsContent || rawJson?.content || '';

    const isSuccess = Boolean(
        rawJson?.isSuccess !== undefined
            ? rawJson.isSuccess
            : (isHttpOk && Boolean(icsContent))
    );

    return {
        success: isSuccess,
        status,
        eventId,
        fileName,
        icsContent,
        message: rawJson?.message || rawJson?.Message || 'ICS calendar content generated successfully.',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || null,
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,
        rawData: rawJson
    };
}

export function parseExportMicrocredentialEventIcsErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        eventId: '',
        fileName: '',
        icsContent: '',
        message: rawJson?.message || 'Failed to generate ICS calendar content.',
        errorDescription: rawJson?.errorDescription || rawJson?.error || 'Network or Server Error',
        errorNo: rawJson?.errorNo || status,
        rawData: rawJson
    };
}
