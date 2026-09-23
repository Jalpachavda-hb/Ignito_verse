/**
 * INPUT PARAMETER FILE: Student Microcredentials Quiz Attempt List Input DTO Builder
 * Builds input payload for StudentMicrocredentialsQuizAttemptList POST request.
 * 
 * @param {number} [pageNo=1] - Page number
 * @param {number} [pageSize=10] - Page size
 * @param {string} [orderByColumn='QuizId'] - Column to order by
 * @param {string} [orderByDirection='DESC'] - Order direction ('ASC'|'DESC')
 * @param {number} [totalRecords=0] - Total records count
 * @param {string} [searchInput=''] - Search input text
 * @param {number} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @returns {object} Object containing headers and stringified JSON body
 */
export function buildStudentMicrocredentialsQuizAttemptListInput(
    pageNo = 1,
    pageSize = 10,
    orderByColumn = 'QuizId',
    orderByDirection = 'DESC',
    totalRecords = 0,
    searchInput = '',
    studentId = 0
) {
    const sId = Number(studentId) || 0;
    const pNo = Number(pageNo) || 1;
    const pSize = Number(pageSize) || 10;
    const oCol = orderByColumn || 'LastAttemptDate';
    const oDir = orderByDirection || 'DESC';
    const sInput = searchInput || '';

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            StudentId: sId,
            PageNo: pNo,
            PageSize: pSize,
            OrderByColumn: oCol,
            OrderByDirection: oDir,
            SearchInput: sInput,
            TotalRecords: Number(totalRecords) || 0,
            studentId: sId,
            pageNo: pNo,
            pageSize: pSize,
            orderByColumn: oCol,
            orderByDirection: oDir,
            searchInput: sInput,
            totalRecords: Number(totalRecords) || 0
        })
    };
}
