/**
 * OUTPUT PARAMETER FILE: Ask Microcredential Topic AI Output DTO Parser
 * Parses response data for AI assistant topic queries.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO
 */
export function parseAskMicrocredentialTopicAIOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || '',
        answer: rawJson?.answer || rawJson?.Answer || rawJson?.reply || rawJson?.Reply || rawJson?.data?.answer || '',
        confidence: rawJson?.confidence || rawJson?.Confidence || 0.95,
        sourceTopic: rawJson?.sourceTopic || rawJson?.SourceTopic || '',
        citations: Array.isArray(rawJson?.citations) ? rawJson.citations : [],
        rawData: rawJson
    };
}

export function parseAskMicrocredentialTopicAIErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to get answer from AI Tutor',
        answer: '',
        confidence: 0,
        sourceTopic: '',
        citations: [],
        rawData: rawJson
    };
}
