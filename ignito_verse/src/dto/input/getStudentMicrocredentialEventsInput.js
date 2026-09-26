/**
 * DTO Input builder for GetStudentMicrocredentialEvents API
 * POST /api/StudentMicrocredentialCalendarAPI/GetStudentMicrocredentialEvents
 */
export function buildGetStudentMicrocredentialEventsInput(
    studentId = 0,
    pageNo = 1,
    pageSize = 50,
    searchInput = ''
) {
    const numStudentId = Number(studentId) || 0;
    const numPageNo = Number(pageNo) || 1;
    const numPageSize = Number(pageSize) || 50;
    const search = String(searchInput || '').trim();

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
            studentId: numStudentId,
            StudentId: numStudentId,
            pageNo: numPageNo,
            PageNo: numPageNo,
            pageSize: numPageSize,
            PageSize: numPageSize,
            searchInput: search,
            SearchInput: search
        })
    };
}
