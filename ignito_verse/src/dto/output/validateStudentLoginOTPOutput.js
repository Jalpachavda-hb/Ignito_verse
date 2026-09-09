import { formatImageUrl } from './homepageOutputs';

/**
 * OUTPUT PARAMETER FILE: Validate Student Login OTP Output DTO Parser
 * Parses API response payload from ValidateStudentLoginOTP endpoint.
 * 
 * Backend Model: MicrocredentialLoginOutputParameter : ResponseBase
 * - IsSuccess: bool
 * - Message: string
 * - ErrorDescription: string
 * - ErrorNo: Int64
 * - StudentId: Int64
 * - StudentName: string
 * - Email: string
 * - MobileNumber: string
 * - Gender: string
 * - CreatedOn: string
 * - UpdatedOn: string
 * - AccessToken: string
 * - ProfileImage: string
 * 
 * @param {object} rawJson - Raw JSON response object from backend API
 * @param {number} [status=200] - HTTP status code
 * @returns {object} Clean parsed authentication result object for UI consumption
 */
export function parseValidateStudentLoginOTPOutput(rawJson = {}, status = 200) {
  const isOk = status >= 200 && status < 300;

  const isSuccess = Boolean(
    rawJson?.isSuccess ??
    rawJson?.IsSuccess ??
    rawJson?.success ??
    (isOk && !rawJson?.error)
  );

  const message = rawJson?.message || rawJson?.Message || (isSuccess ? 'Login successful.' : 'Invalid OTP or verification failed.');
  const errorDescription = rawJson?.errorDescription || rawJson?.ErrorDescription || '';
  const errorNo = Number(rawJson?.errorNo || rawJson?.ErrorNo || 0);

  const studentId = Number(rawJson?.studentId || rawJson?.StudentId || 0);
  const studentName = rawJson?.studentName || rawJson?.StudentName || rawJson?.name || rawJson?.Name || '';
  const email = rawJson?.email || rawJson?.Email || '';
  const mobileNumber = rawJson?.mobileNumber || rawJson?.MobileNumber || '';
  const gender = rawJson?.gender || rawJson?.Gender || '';
  const createdOn = rawJson?.createdOn || rawJson?.CreatedOn || '';
  const updatedOn = rawJson?.updatedOn || rawJson?.UpdatedOn || '';
  const accessToken = rawJson?.accessToken || rawJson?.AccessToken || rawJson?.token || rawJson?.Token || '';

  const rawProfileImage = rawJson?.profileImage || rawJson?.ProfileImage || '';
  const profileImage = formatImageUrl(rawProfileImage);

  const displayName = studentName || (email ? email.split('@')[0] : (mobileNumber || 'Student User'));

  return {
    success: isSuccess,
    isSuccess,
    status,
    message,
    errorDescription,
    errorNo,
    studentId,
    studentName: displayName,
    email,
    mobileNumber,
    gender,
    createdOn,
    updatedOn,
    accessToken,
    profileImage,
    token: accessToken,
    user: isSuccess ? {
      id: studentId,
      empId: studentId,
      studentId: studentId,
      name: displayName,
      fullName: displayName,
      email: email,
      mobileNumber: mobileNumber,
      role: 'Student Learner',
      avatar: profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    } : null,
    error: isSuccess ? null : (message || errorDescription || 'OTP Validation Failed')
  };
}
