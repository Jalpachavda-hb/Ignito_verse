/**
 * INPUT PARAMETER FILE: Get Microcredential Course Detail Input DTO Builder
 * Builds input parameter body for GetMicrocredentialCourseDetail POST request.
 * 
 * @param {number|string} microcredentialCourseId - Microcredential course identifier
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildGetMicrocredentialCourseDetailInput(microcredentialCourseId) {
    const numId = Number(microcredentialCourseId);
    const resolvedId = (!isNaN(numId) && numId > 0) ? numId : microcredentialCourseId;
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            MicrocredentialCourseId: resolvedId,
            microcredentialCourseId: resolvedId
        })
    };
}
