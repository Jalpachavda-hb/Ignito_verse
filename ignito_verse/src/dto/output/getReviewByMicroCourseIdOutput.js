/**
 * OUTPUT PARAMETER FILE: Get Review By Micro Course Id Output DTO Parser
 * Parses response data for GetReviewByMicroCourseId POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO
 */
export function parseGetReviewByMicroCourseIdOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    const rawList = rawJson?.getReviewByMicroCourseList || rawJson?.GetReviewByMicroCourseList || [];

    const getReviewByMicroCourseList = Array.isArray(rawList)
        ? rawList.map(item => {
            const reviewId = Number(
                item?.microcredentialCourseReviewId ?? 
                item?.MicrocredentialCourseReviewId ?? 
                item?.microcredentialReviewId ?? 
                item?.MicrocredentialReviewId ?? 
                item?.reviewId ?? 
                item?.ReviewId ?? 
                item?.id ?? 
                item?.Id ?? 
                item?.microcredentialStudentReviewId ?? 
                item?.MicrocredentialStudentReviewId ?? 
                0
            );

            const rawLike = (
                item?.isLike ?? 
                item?.IsLike ?? 
                item?.isLiked ?? 
                item?.IsLiked ?? 
                item?.isReviewLikedByStudent ?? 
                item?.IsReviewLikedByStudent ?? 
                item?.isLikedByStudent ?? 
                item?.IsLikedByStudent ?? 
                item?.liked ?? 
                item?.Liked
            );
            const isLikeBool = rawLike === true || rawLike === 1 || rawLike === '1' || String(rawLike).toLowerCase() === 'true';

            const rawCount = (
                item?.reviewLikeCount ?? 
                item?.ReviewLikeCount ?? 
                item?.likeCount ?? 
                item?.LikeCount ?? 
                item?.totalLikes ?? 
                item?.TotalLikes ?? 
                item?.totalLikeCount ?? 
                item?.TotalLikeCount ?? 
                item?.likes ?? 
                item?.Likes ?? 
                0
            );
            const reviewLikeCount = Math.max(0, Number(rawCount) || 0);

            return {
                microcredentialCourseReviewId: reviewId,
                microcredentialReviewId: reviewId,
                reviewId: reviewId,
                id: reviewId,
                studentId: Number(item?.studentId ?? item?.StudentId ?? item?.applicantId ?? item?.ApplicantId ?? 0),
                microcredentialCourseId: Number(item?.microcredentialCourseId ?? item?.MicrocredentialCourseId ?? item?.courseId ?? item?.CourseId ?? item?.microCourseId ?? item?.MicroCourseId ?? 0),
                reviewInStar: Number(item?.reviewInStar ?? item?.ReviewInStar ?? item?.rating ?? item?.Rating ?? 5),
                reviewDescription: item?.reviewDescription || item?.ReviewDescription || item?.description || item?.Description || '',
                studentName: item?.studentName || item?.StudentName || item?.applicantFullName || item?.ApplicantFullName || item?.fullName || item?.FullName || '',
                studentProfileImage: item?.studentProfileImage || item?.StudentProfileImage || item?.profileImage || item?.ProfileImage || '',
                createdOnText: item?.createdOnText || item?.CreatedOnText || '',
                createdOn: item?.createdOn || item?.CreatedOn || '',
                isLike: isLikeBool,
                isLiked: isLikeBool,
                isReviewLikedByStudent: isLikeBool,
                reviewLikeCount: reviewLikeCount,
                likeCount: reviewLikeCount,
                rawData: item
            };
        })
        : [];

    return {
        success: isSuccess,
        status,
        message: rawJson?.message || rawJson?.Message || '',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || '',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,

        getReviewByMicroCourseList,
        rawData: rawJson
    };
}

export function parseGetReviewByMicroCourseIdErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        status,
        message: rawJson?.message || rawJson?.Message || 'Failed to get reviews for microcredential course',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || status,

        getReviewByMicroCourseList: [],
        rawData: rawJson
    };
}
