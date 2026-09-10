/**
 * INPUT PARAMETER FILE: Send  OTP Input DTO Builder
 * Builds input parameter payload for SendStudentLoginOTP POST request.
 * 
 * Backend Model: SendStudentLoginOTPInputParameter
 * - Email: string
 * - MobileNumber: string
 * 
 * @param {object|string} input - Email/Mobile string or object containing email/mobileNumber
 * @param {string} [mobile=''] - Optional mobile number if input is email string
 * @returns {object} Formatted request headers and stringified JSON body payload
 */
export function buildSendStudentLoginOTPInput(input = '', mobile = '') {
  let emailStr = '';
  let mobileStr = '';

  if (typeof input === 'object' && input !== null) {
    emailStr = input.email || input.Email || '';
    mobileStr = input.mobileNumber || input.MobileNumber || input.mobile || '';
  } else if (typeof input === 'string') {
    if (input.includes('@')) {
      emailStr = input;
      mobileStr = mobile;
    } else {
      mobileStr = input;
      emailStr = mobile;
    }
  }

  const sanitizedEmail = (emailStr || '').trim();
  const sanitizedMobile = (mobileStr || '').trim();

  return {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      Email: sanitizedEmail,
      MobileNumber: sanitizedMobile,

      // camelCase fallback for default JSON deserializers
      email: sanitizedEmail,
      mobileNumber: sanitizedMobile
    })
  };
}
