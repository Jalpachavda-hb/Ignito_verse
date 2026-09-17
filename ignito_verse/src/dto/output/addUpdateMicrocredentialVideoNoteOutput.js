/**
 * OUTPUT DTO FILE: Add/Update Microcredential Video Note Output Parser
 * Parses response for AddUpdateMicrocredentialVideoNote API.
 */

export function parseAddUpdateMicrocredentialVideoNoteOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? isHttpOk);

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || 'Video note saved successfully',
        errorDescription: rawJson?.errorDescription || '',
        errorNo: rawJson?.errorNo || 0,
        isSuccess,
        data: rawJson?.data || rawJson,
        rawData: rawJson
    };
}

export function parseAddUpdateMicrocredentialVideoNoteErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || 'Failed to save video note',
        errorDescription: rawJson?.errorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || status,
        isSuccess: false,
        rawData: rawJson
    };
}
