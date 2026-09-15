export function parseGetMicroCourseTopicDetailOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const hasData = Array.isArray(rawJson?.getMicroCourseTopicDetailList) || Array.isArray(rawJson?.microcredentialStudentDownloadDocumentList);
    const isSuccess = Boolean(rawJson?.isSuccess || (isHttpOk && hasData) || isHttpOk);

  return{
    success: isSuccess,
    status,
    message: rawJson?.message || '',
    errorDescription: rawJson?.errorDescription || '',
    errorNo: rawJson?.errorNo || 0,
    getMicroCourseTopicDetailList: rawJson.getMicroCourseTopicDetailList || rawJson.GetMicroCourseTopicDetailList || [],
    microcredentialStudentDownloadDocumentList : rawJson.microcredentialStudentDownloadDocumentList || rawJson.MicrocredentialStudentDownloadDocumentList || []
  }
}

export function parseGetMicroCourseTopicDetailErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || 'Failed to get microcredential course topic detail',
        errorDescription: rawJson?.errorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || status,
        getMicroCourseTopicDetailList : [],
        microcredentialStudentDownloadDocumentList : [],
        rawData: rawJson
    };
}