/**
 * AUTHENTICATION SERVICE
 * Connects Login UI with .NET Web API using Input and Output Parameter DTOs.
 * Uses OTP-based login via SendStudentLoginOTP and ValidateStudentLoginOTP endpoints.
 */

import { apiClient } from './apiClient';
import { 
  buildSendStudentLoginOTPInput, 
  buildValidateStudentLoginOTPInput 
} from '../dto/input/authInputs';
import { 
  parseSendStudentLoginOTPOutput, 
  parseValidateStudentLoginOTPOutput 
} from '../dto/output/authOutputs';

const STORAGE_TOKEN_KEY = 'ignito_auth_token';
const STORAGE_USER_KEY = 'ignito_auth_user';

/**
 * Sends OTP to student's registered Email or Mobile Number.
 * Endpoint: SendStudentLoginOTP
 * 
 * @param {object|string} emailOrPayload - Email/Mobile string or payload object { email, mobileNumber }
 * @param {string} [mobileNumber=''] - Mobile number string if first param is email
 * @returns {Promise<object>} Parsed response object `{ success, isSuccess, message, studentId, otpId, email, mobileNumber, error }`
 */
export async function sendStudentLoginOTP(emailOrPayload, mobileNumber = '') {
  // 1. Prepare Input Parameter DTO
  const inputDto = buildSendStudentLoginOTPInput(emailOrPayload, mobileNumber);

  // 2. Send request to .NET Web API endpoint [Route("SendStudentLoginOTP")]
  const response = await apiClient('api/StudentAPI/SendStudentLoginOTP', {
    method: 'POST',
    headers: inputDto.headers,
    body: inputDto.body,
    isPublic: true
  });

  // 3. Parse Output Parameter DTO
  return parseSendStudentLoginOTPOutput(response.data, response.status);
}

/**
 * Validates student login OTP.
 * Endpoint: ValidateStudentLoginOTP
 * 
 * @param {object|number} studentIdOrPayload - Student ID or payload object { studentId, otpId, otp, clientInfo, fcmToken }
 * @param {number} [otpId=0] - OTP ID string/number
 * @param {string} [otp=''] - OTP code string
 * @param {object} [clientInfo=null] - Optional ClientInfo object
 * @param {string} [fcmToken=''] - Optional FCM Token string
 * @returns {Promise<object>} Parsed response object `{ success, isSuccess, message, accessToken, user, error }`
 */
export async function validateStudentLoginOTP(
  studentIdOrPayload, 
  otpId = 0, 
  otp = '', 
  clientInfo = null, 
  fcmToken = ''
) {
  let params = {};
  if (typeof studentIdOrPayload === 'object' && studentIdOrPayload !== null) {
    params = studentIdOrPayload;
  } else {
    params = { studentId: studentIdOrPayload, otpId, otp, clientInfo, fcmToken };
  }

  // 1. Prepare Input Parameter DTO
  const inputDto = buildValidateStudentLoginOTPInput(params);

  // 2. Send request to .NET Web API endpoint [Route("ValidateStudentLoginOTP")]
  const response = await apiClient('api/StudentAPI/ValidateStudentLoginOTP', {
    method: 'POST',
    headers: inputDto.headers,
    body: inputDto.body,
    isPublic: true
  });

  // 3. Parse Output Parameter DTO
  const outputDto = parseValidateStudentLoginOTPOutput(response.data, response.status);

  // 4. Save session storage on success
  if (outputDto.isSuccess || outputDto.success) {
    if (outputDto.accessToken) {
      localStorage.setItem(STORAGE_TOKEN_KEY, outputDto.accessToken);
      localStorage.setItem('AccessToken', outputDto.accessToken);
    }
    if (outputDto.user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(outputDto.user));
    }
    if (outputDto.studentId) {
      localStorage.setItem('StudentId', outputDto.studentId.toString());
    }
    if (outputDto.studentName) {
      localStorage.setItem('StudentName', outputDto.studentName);
    }
    if (outputDto.email) {
      localStorage.setItem('Email', outputDto.email);
    }
    if (outputDto.mobileNumber) {
      localStorage.setItem('MobileNumber', outputDto.mobileNumber);
    }
    if (outputDto.profileImage) {
      localStorage.setItem('ProfileImage', outputDto.profileImage);
    }
  }

  return outputDto;
}

/**
 * Legacy wrapper function for loginUser using OTP initiation.
 * 
 * @param {string} email - Student email or mobile number
 * @returns {Promise<object>}
 */
export async function loginUser(email) {
  return await sendStudentLoginOTP(email);
}

/**
 * Logs out user and clears local session.
 */
export function logoutUser() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem('AccessToken');
  localStorage.removeItem('StudentId');
  localStorage.removeItem('StudentName');
  localStorage.removeItem('Email');
  localStorage.removeItem('MobileNumber');
  localStorage.removeItem('ProfileImage');
}

/**
 * Gets currently logged in user session from localStorage if available.
 */
export function getSavedUserSession() {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
