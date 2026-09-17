/**
 * OUTPUT DTO FILE: Delete Microcredential Video Note Output Parser
 * Parses response for DeleteMicrocredentialVideoNote API.
 */

export function parseDeleteMicrocredentialVideoNoteOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? isHttpOk);

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || 'Video note deleted successfully',
        errorDescription: rawJson?.errorDescription || '',
        errorNo: rawJson?.errorNo || 0,
        isSuccess,
        rawData: rawJson
    };
}

export function parseDeleteMicrocredentialVideoNoteErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || 'Failed to delete video note',
        errorDescription: rawJson?.errorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || status,
        isSuccess: false,
        rawData: rawJson
    };
}
