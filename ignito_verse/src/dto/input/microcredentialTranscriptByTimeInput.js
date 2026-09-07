/**
 * INPUT PARAMETER FILE: Microcredential Transcript By Time Input DTO Builder
 * Builds input parameter body for MicrocredentialTranscriptByTime POST request.
 * 
 * @param {number} [studentId=0] - Student identifier
 * @param {number} [studentDegreeAdmissionId=0] - Student degree admission identifier
 * @param {string} [videoId=''] - Video identifier
 * @param {string} [question=''] - Student raise-hand question/query
 * @param {number} [microcredentialCourseId=0] - Microcredential course identifier
 * @param {number} [handRaiseTime=0] - Hand raise time in seconds/timestamp
 * @param {string} [econtent=''] - E-content text
 * @param {boolean} [isEcontent=false] - Whether content is E-content
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildMicrocredentialTranscriptByTimeInput(
    studentId = 0,
    studentDegreeAdmissionId = 0,
    videoId = '',
    question = '',
    microcredentialCourseId = 0,
    handRaiseTime = 0,
    econtent = '',
    isEcontent = false
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            studentId: studentId,
            studentDegreeAdmissionId: studentDegreeAdmissionId,
            videoId: videoId,
            question: question,
            microcredentialCourseId: microcredentialCourseId,
            handRaiseTime: handRaiseTime,
            econtent: econtent,
            isEcontent: isEcontent
        })
    };
}
