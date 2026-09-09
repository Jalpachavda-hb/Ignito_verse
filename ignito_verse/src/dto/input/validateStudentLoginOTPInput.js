/**
 * INPUT PARAMETER FILE: Validate Student Login OTP Input DTO Builder
 * Builds input parameter payload for ValidateStudentLoginOTP POST request.
 * 
 * Backend Model: ValidateStudentLoginOTPInputParameter
 * - StudentId: long (Int64)
 * - OtpId: long (Int64)
 * - OTP: string
 * - fcmToken: string
 * - ClientInfo: { IP, OS, Browser, Device, UserAgent }
 * 
 * @param {object} params - Input parameters
 * @param {number} params.studentId - Student ID received from SendStudentLoginOTP
 * @param {number} params.otpId - OTP ID received from SendStudentLoginOTP
 * @param {string} params.otp - OTP entered by user
 * @param {string} [params.fcmToken=''] - Optional FCM device token
 * @param {object} [params.clientInfo=null] - Optional client info override
 * @returns {object} Formatted request headers and JSON stringified body payload
 */
export function buildValidateStudentLoginOTPInput({
  studentId = 0,
  otpId = 0,
  otp = '',
  fcmToken = '',
  clientInfo = null
} = {}) {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  const platform = typeof navigator !== 'undefined' ? (navigator.platform || 'Web') : 'Web';
  
  let browserName = 'Browser';
  if (userAgent.includes('Chrome')) browserName = 'Chrome';
  else if (userAgent.includes('Firefox')) browserName = 'Firefox';
  else if (userAgent.includes('Safari')) browserName = 'Safari';
  else if (userAgent.includes('Edg')) browserName = 'Edge';

  const defaultClientInfo = {
    IP: '',
    OS: platform,
    Browser: browserName,
    Device: /Mobile|Android|iPhone|iPad/i.test(userAgent) ? 'Mobile' : 'Desktop',
    UserAgent: userAgent
  };

  const finalClientInfo = clientInfo ? {
    IP: clientInfo.IP || clientInfo.ip || '',
    OS: clientInfo.OS || clientInfo.os || platform,
    Browser: clientInfo.Browser || clientInfo.browser || browserName,
    Device: clientInfo.Device || clientInfo.device || 'Desktop',
    UserAgent: clientInfo.UserAgent || clientInfo.userAgent || userAgent
  } : defaultClientInfo;

  return {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      StudentId: Number(studentId) || 0,
      OtpId: Number(otpId) || 0,
      OTP: String(otp || '').trim(),
      fcmToken: fcmToken || '',
      ClientInfo: finalClientInfo,

      // camelCase fallbacks for System.Text.Json compatibility
      studentId: Number(studentId) || 0,
      otpId: Number(otpId) || 0,
      otp: String(otp || '').trim(),
      clientInfo: {
        ip: finalClientInfo.IP,
        os: finalClientInfo.OS,
        browser: finalClientInfo.Browser,
        device: finalClientInfo.Device,
        userAgent: finalClientInfo.UserAgent
      }
    })
  };
}
