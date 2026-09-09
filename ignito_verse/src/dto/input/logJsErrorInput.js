/**
 * INPUT PARAMETER FILE: Log JS Error Input DTO Builder
 * Builds input parameter body for LogJsError POST request.
 * 
 * Backend Model: JsErrorModel
 * - ErrorMessage: string
 * - ErrorStack: string
 * - ErrorSource: string
 * - AdminId: Int64
 * - StudentId: Int64
 * 
 * @param {string} [errorMessage=''] - Description or message of the JS error
 * @param {string} [errorStack=''] - Stack trace of the error
 * @param {string} [errorSource=''] - Source URL, component, or context where error occurred
 * @param {number} [adminId=0] - Admin ID (0 allows backend session fallback)
 * @param {number} [studentId=0] - Student ID (0 allows backend session fallback)
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildLogJsErrorInput(
    errorMessage = '',
    errorStack = '',
    errorSource = '',
    adminId = 0,
    studentId = 0
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            ErrorMessage: errorMessage || '',
            ErrorStack: errorStack || '',
            ErrorSource: errorSource || window.location?.href || '',
            AdminId: Number(adminId) || 0,
            StudentId: Number(studentId) || 0,

            // camelCase properties for System.Text.Json default options compatibility
            errorMessage: errorMessage || '',
            errorStack: errorStack || '',
            errorSource: errorSource || window.location?.href || '',
            adminId: Number(adminId) || 0,
            studentId: Number(studentId) || 0
        })
    };
}
