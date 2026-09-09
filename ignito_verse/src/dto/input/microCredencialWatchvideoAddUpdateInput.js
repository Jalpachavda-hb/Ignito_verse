/**
 * INPUT PARAMETER FILE: Microcredential Watch Video Add/Update Input DTO Builder
 * Builds input parameter body for Microcredential watch video add/update POST request.
 * 
 * @param {number} studentId - Student identifier
 * @param {number} microcredentialCourseId - Microcredential course identifier
 * @param {number} overallPercentage - Overall percentage completed
 * @param {Array<{videoId: string, percentageWatched: number, totalDuration: number, watchedSeconds: number}>} studentwatchvideodetails - Array of student watch video details
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildMicroCredencialWatchvideoAddUpdateInput(
    studentId = 0,
    microcredentialCourseId = 0,
    overallPercentage = 0,
    studentwatchvideodetails = []
) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            StudentId: studentId,
            MicrocredentialCourseId: microcredentialCourseId,
            OverallPercentage: Math.round(Number(overallPercentage) || 0),
            Studentwatchvideodetails: Array.isArray(studentwatchvideodetails)
                ? studentwatchvideodetails.map(item => ({
                    VideoId: String(item.videoId || item.VideoId || ''),
                    WatchedSeconds: Math.round(Number(item.watchedSeconds ?? item.WatchedSeconds ?? 0)),
                    TotalDuration: Math.round(Number(item.totalDuration ?? item.TotalDuration ?? 0)),
                    PercentageWatched: Math.round(Number(item.percentageWatched ?? item.PercentageWatched ?? 0))
                }))
                : []
        })
    };
}
