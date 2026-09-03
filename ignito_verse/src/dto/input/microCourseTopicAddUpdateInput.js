/**
 * INPUT PARAMETER FILE: Micro Course Topic Add/Update Input DTO Builder
 * Builds input parameter body for MicroCourseTopicAddUpdate POST request.
 * 
 * @param {object} [data={}] - Object containing topic add/update parameters
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildMicroCourseTopicAddUpdateInput(data = {}) {
    const microcredentialCourseTopicList = Array.isArray(data.microcredentialCourseTopicList || data.MicrocredentialCourseTopicList)
        ? (data.microcredentialCourseTopicList || data.MicrocredentialCourseTopicList).map(item => ({
            topicName: item?.topicName || item?.TopicName || '',
            videoTitle: item?.videoTitle || item?.VideoTitle || '',
            topicVideoUrl: item?.topicVideoUrl || item?.TopicVideoUrl || '',
            topicPdf: item?.topicPdf || item?.TopicPdf || ''
        }))
        : [];

    const microcredentialStudentDownloadDocumentList = Array.isArray(data.microcredentialStudentDownloadDocumentList || data.MicrocredentialStudentDownloadDocumentList)
        ? (data.microcredentialStudentDownloadDocumentList || data.MicrocredentialStudentDownloadDocumentList).map(item => ({
            microcredentialStudentDownloadDocument: item?.microcredentialStudentDownloadDocument || item?.MicrocredentialStudentDownloadDocument || '',
            originalFileName: item?.originalFileName || item?.OriginalFileName || '',
            givenFileName: item?.givenFileName || item?.GivenFileName || ''
        }))
        : [];

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            microcredentialCourseId: data?.microcredentialCourseId ?? data?.MicrocredentialCourseId ?? 0,
            streamId: data?.streamId ?? data?.StreamId ?? 0,
            adminId: data?.adminId ?? data?.AdminId ?? 0,
            uploadMicroDocument: data?.uploadMicroDocument || data?.UploadMicroDocument || '',
            microcredentialCourseTopicList: microcredentialCourseTopicList,
            microcredentialStudentDownloadDocumentList: microcredentialStudentDownloadDocumentList
        })
    };
}
