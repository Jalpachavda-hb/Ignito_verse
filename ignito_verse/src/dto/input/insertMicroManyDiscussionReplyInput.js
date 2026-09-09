/**
 * INPUT PARAMETER FILE: Insert Micro Many Discussion Reply Input DTO Builder
 * Builds input parameter body for InsertManyMicroCourseDiscussionReply POST request.
 * 
 * @param {number} [microCourseDiscussionQuestionId=0] - Microcourse discussion question identifier
 * @param {number} [studentId=0] - Student identifier (0 defaults to session StudentId on backend)
 * @param {number} [professorId=0] - Professor identifier
 * @param {number} [microCorseId=0] - Microcredential course identifier
 * @param {string} [reply=''] - Discussion reply text
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildInsertMicroManyDiscussionReplyInput(
    microCourseDiscussionQuestionId = 0,
    studentId = 0,
    professorId = 0,
    microCorseId = 0,
    reply = ''
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            MicroCorseId: Number(microCorseId) || 0,
            MicroCourseDiscussionQuestionId: Number(microCourseDiscussionQuestionId) || 0,
            StudentId: Number(studentId) || 0,
            ProfessorId: Number(professorId) || 0,
            Reply: reply || ''
        })
    };
}
