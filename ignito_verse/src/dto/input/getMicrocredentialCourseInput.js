/**
 * INPUT PARAMETER FILE: Get Microcredential Course Input DTO Builder
 * Builds input parameter body for GetMicrocredentialCourse POST request.
 * 
 * @param {string|number|null} [streamId=''] - Stream ID filter
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildGetMicrocredentialCourseInput(streamId = '') {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            streamId: streamId !== null && streamId !== undefined && streamId !== '' ? String(streamId) : null
        })
    };
}
