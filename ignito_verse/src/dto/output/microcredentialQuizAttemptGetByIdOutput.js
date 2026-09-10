/**
 * OUTPUT PARAMETER FILE: Microcredential Quiz Attempt Get By ID Output DTO Parser
 * Parses response data for MicrocredentialQuizAttemptGetById POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with saved attempt state, timer, and answer arrays
 */
export function parseMicrocredentialQuizAttemptGetByIdOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    return {
        success: isSuccess,
        isSuccess,
        lastActivityTime: rawJson?.lastActivityTime ?? rawJson?.LastActivityTime ?? 0,
        totalTimeAllowed: rawJson?.totalTimeAllowed ?? rawJson?.TotalTimeAllowed ?? 0,
        degreeQuizAnswers: rawJson?.degreeQuizAnswers || rawJson?.DegreeQuizAnswers || [],
        degreeQuizBlankAnswersGetById: rawJson?.degreeQuizBlankAnswersGetById || rawJson?.DegreeQuizBlankAnswersGetById || [],
        degreeQuizMatchingAnswersGetById: rawJson?.degreeQuizMatchingAnswersGetById || rawJson?.DegreeQuizMatchingAnswersGetById || [],
        degreeQuizOrderingAnswersGetById: rawJson?.degreeQuizOrderingAnswersGetById || rawJson?.DegreeQuizOrderingAnswersGetById || [],
        shortAnswerAnswersGetById: rawJson?.shortAnswerAnswersGetById || rawJson?.ShortAnswerAnswersGetById || [],
        degreeQuizNumericAnswersGetById: rawJson?.degreeQuizNumericAnswersGetById || rawJson?.DegreeQuizNumericAnswersGetById || [],
        multiShortAnswerAnswersGetById: rawJson?.multiShortAnswerAnswersGetById || rawJson?.MultiShortAnswerAnswersGetById || [],
        degreeQuizLikertAnswersGetById: rawJson?.degreeQuizLikertAnswersGetById || rawJson?.DegreeQuizLikertAnswersGetById || [],
        status,
        message: rawJson?.message || rawJson?.Message || '',
        rawData: rawJson
    };
}

export function parseMicrocredentialQuizAttemptGetByIdErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        isSuccess: false,
        lastActivityTime: 0,
        totalTimeAllowed: 0,
        degreeQuizAnswers: [],
        degreeQuizBlankAnswersGetById: [],
        degreeQuizMatchingAnswersGetById: [],
        degreeQuizOrderingAnswersGetById: [],
        shortAnswerAnswersGetById: [],
        degreeQuizNumericAnswersGetById: [],
        multiShortAnswerAnswersGetById: [],
        degreeQuizLikertAnswersGetById: [],
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to retrieve quiz attempt',
        rawData: rawJson
    };
}
