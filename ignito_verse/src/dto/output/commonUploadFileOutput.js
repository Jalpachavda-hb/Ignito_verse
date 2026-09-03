/**
 * OUTPUT PARAMETER FILE: Common Upload File Output DTO Parser
 * Parses response data for CommonUploadFile POST request.
 * 
 * @param {Array|object} rawJson - Raw JSON response array or object from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with document list
 */
export function parseCommonUploadFileOutput(rawJson = [], status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const rawList = Array.isArray(rawJson)
        ? rawJson
        : (rawJson?.documents || rawJson?.Documents || rawJson?.data || []);

    const documentList = Array.isArray(rawList)
        ? rawList.map(doc => ({
            documentId: doc?.documentId ?? doc?.DocumentId ?? 0,
            originalName: doc?.originalName || doc?.OriginalName || '',
            givenName: doc?.givenName || doc?.GivenName || '',
            fileExtension: doc?.fileExtension || doc?.FileExtension || '',
            filePath: doc?.filePath || doc?.FilePath || '',
            documentType: doc?.documentType || doc?.DocumentType || ''
        }))
        : [];

    return {
        success: isHttpOk,
        status,
        documentList,
        rawData: rawJson
    };
}

export function parseCommonUploadFileErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to upload file',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || rawJson?.error || 'Network/Server Error',
        documentList: [],
        rawData: rawJson
    };
}
