/**
 * INPUT PARAMETER FILE: Insert Micro Many Discussion Question Input DTO Builder
 * Builds input parameter body for InsertMicroManyDiscussionQuestion POST request.
 * 
 * @param {number} [studentId=0] - Student identifier (0 defaults to session StudentId on backend)
 * @param {number} [professorId=0] - Professor identifier
 * @param {number} [microCorseId=0] - Microcredential course identifier
 * @param {string} [question=''] - Discussion question text
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildInsertMicroManyDiscussionQuestionInput(
    studentId = 0,
    professorId = 0,
    microCorseId = 0,
    question = ''
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            StudentId: Number(studentId) || 0,
            ProfessorId: Number(professorId) || 0,
            MicroCorseId: Number(microCorseId) || 0,
            Question: question || ''
        })
    };
}
