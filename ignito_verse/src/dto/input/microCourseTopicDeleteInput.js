/**
 * INPUT PARAMETER FILE: Micro Course Topic Delete Input DTO Builder
 * Builds input parameter body for MicroCourseTopicDelete POST request.
 * 
 * @param {number} microcredentialCourseId - Microcredential course ID to delete topics for
 * @param {number} [adminId=0] - Admin identifier
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildMicroCourseTopicDeleteInput(
    microcredentialCourseId = 0,
    adminId = 0
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            microcredentialCourseId: microcredentialCourseId,
            adminId: adminId
        })
    };
}
