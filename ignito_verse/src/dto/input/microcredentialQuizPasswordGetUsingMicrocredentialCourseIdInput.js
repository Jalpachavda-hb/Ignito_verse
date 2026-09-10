/**
 * INPUT PARAMETER FILE: Microcredential Quiz Password Get Using Microcredential Course ID Input DTO Builder
 * Builds input parameter body for MicrocredentialQuizPasswordGetUsingMicrocredentialCourseId POST request.
 * 
 * @param {object|string|number} emailOrPayload - Input payload object { email, studentName, microcredentialCourseId } or Email string or MicrocredentialCourseId number
 * @param {string} [studentName=''] - Student name
 * @param {number} [microcredentialCourseId=0] - Microcredential course identifier
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildMicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdInput(
    emailOrPayload = '',
    studentName = '',
    microcredentialCourseId = 0
) {
    let email = '';
    let name = '';
    let courseId = 0;

    if (typeof emailOrPayload === 'object' && emailOrPayload !== null) {
        email = emailOrPayload.email ?? emailOrPayload.Email ?? '';
        name = emailOrPayload.studentName ?? emailOrPayload.StudentName ?? '';
        courseId = emailOrPayload.microcredentialCourseId ?? emailOrPayload.MicrocredentialCourseId ?? 0;
    } else if (typeof emailOrPayload === 'number') {
        courseId = emailOrPayload;
        name = studentName;
        email = microcredentialCourseId;
    } else {
        email = emailOrPayload || '';
        name = studentName || '';
        courseId = microcredentialCourseId || 0;
    }

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            Email: email,
            StudentName: name,
