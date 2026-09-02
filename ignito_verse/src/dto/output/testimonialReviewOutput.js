export function parsetestimonialReviewOutput(rawJson = {}, status = 200) {
  const isHttpOk = status >= 200 && status < 300;
  const isSuccess = Boolean(rawJson?.isSuccess ?? isHttpOk);

  return {
    success: isSuccess,
    status,
    message: rawJson?.message || '',
    errorDescription: rawJson?.errorDescription || '',
    errorNo: rawJson?.errorNo || 0,
    testimonialReview: rawJson?.testimonialReviewLists || [],
    rawData: rawJson
  };
}

export function parsetestimonialReviewErrorOutput(rawJson = {}, status = 500) {
  return {
    success: false,
    status, 
    message: rawJson?.message || 'Failed to load testimonial review',
    errorDescription: rawJson?.errorDescription || rawJson?.error || 'Network/Server Error',
    errorNo: rawJson?.errorNo || status,
    testimonialReview: [],
    rawData: rawJson
  };
}
