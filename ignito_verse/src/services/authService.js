/**
 * AUTHENTICATION SERVICE
 * Connects Login UI with .NET Web API using Input and Output Parameter DTOs.
 */

import { apiClient } from './apiClient';
import { buildLoginInput, buildRegisterInput } from '../dto/input/authInputs';
import { parseLoginOutput, parseRegisterOutput, parseAuthErrorOutput } from '../dto/output/authOutputs';

const STORAGE_TOKEN_KEY = 'ignito_auth_token';
const STORAGE_USER_KEY = 'ignito_auth_user';

/**
 * Authenticates user against .NET Web API + MSSQL DB.
 * 
 * @param {string} email - User login email
 * @param {string} password - User login password
 * @returns {Promise<object>} Parsed Output Parameter Object `{ success, user, token, error }`
 */
export async function loginUser(email, password) {
  debugger;
  // 1. Prepare Input Parameter DTO
  const inputDto = buildLoginInput(email, password);

  // 2. Send Native `fetch` Request to .NET Endpoint `/Auth/login` (or `/Account/login`)
  const response = await apiClient('/AdminAuthenticationAPI/ValidateAdminCredential', {
    method: 'POST',
    headers: inputDto.headers,
    body: inputDto.body
  });


  const outputDto = parseLoginOutput(response.data, response.status);

  // 4. Save session token on success
  if (outputDto.success && outputDto.token) {
    localStorage.setItem(STORAGE_TOKEN_KEY, outputDto.token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(outputDto.user));
  }

  return outputDto;
}



/**
 * Logs out user and clears local session.
 */
export function logoutUser() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
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
