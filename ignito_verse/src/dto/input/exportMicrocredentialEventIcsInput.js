export function buildExportMicrocredentialEventIcsInput(eventId = '') {
    const cleanEventId = String(eventId || '').trim();

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
            EventId: cleanEventId,
            eventId: cleanEventId
        })
    };
}
