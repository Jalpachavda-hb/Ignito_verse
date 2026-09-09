/**
 * ERROR LOG SERVICE
 * Client service connecting frontend error handling with backend .NET Web API [HttpPost("LogJsError")].
 */

import { apiClient } from './apiClient';
import { buildLogJsErrorInput } from '../dto/input/logJsErrorInput';
import { parseLogJsErrorOutput, parseLogJsErrorErrorOutput } from '../dto/output/logJsErrorOutput';

/**
 * Logs a JavaScript runtime error to backend .NET Web API endpoint [HttpPost("LogJsError")].
 * 
 * @param {string|object} errorOrMessage - Error object or error message string
 * @param {string} [errorStack=''] - Error stack trace
 * @param {string} [errorSource=''] - Source file/URL or component context where error occurred
 * @param {number} [adminId=0] - Admin ID (0 fallback to backend session)
 * @param {number} [studentId=0] - Student ID (0 fallback to backend session)
 * @returns {Promise<object>} Parsed output DTO { success, status, message, rawData }
 */
export async function logJsError(
    errorOrMessage,
    errorStack = '',
    errorSource = '',
    adminId = 0,
    studentId = 0
) {
    try {
        let message = '';
        let stack = errorStack;
        let source = errorSource || window.location?.href || '';

        if (typeof errorOrMessage === 'object' && errorOrMessage !== null) {
            message = errorOrMessage.message || errorOrMessage.ErrorMessage || JSON.stringify(errorOrMessage);
            stack = stack || errorOrMessage.stack || errorOrMessage.ErrorStack || '';
            source = source || errorOrMessage.source || errorOrMessage.ErrorSource || '';
        } else {
            message = String(errorOrMessage || 'Unknown JS Error');
        }

        // 1. Prepare Input Parameter DTO
        const inputDto = buildLogJsErrorInput(message, stack, source, adminId, studentId);

        // 2. Call backend endpoint: [HttpPost("LogJsError")]
        // Clean endpoint resolution in apiClient handles '/ErrorLogAPI/LogJsError', '/ErrorLog/LogJsError', or '/LogJsError'
        const response = await apiClient('ErrorLogAPI/LogJsError', {
            method: 'POST',
            isPublic: true,
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseLogJsErrorErrorOutput(response.data, response.status);
        }

        return parseLogJsErrorOutput(response.data, response.status);
    } catch (err) {
        console.error('Failed to log JS error to backend API:', err);
        return parseLogJsErrorErrorOutput({ message: err.message }, 500);
    }
}

/**
 * Global Error Handler Initializer
 * Listens for window.onerror and unhandled promise rejections to log JS errors automatically.
 */
let isGlobalErrorLoggingInitialized = false;

export function initGlobalErrorLogging() {
    if (isGlobalErrorLoggingInitialized || typeof window === 'undefined') return;

    isGlobalErrorLoggingInitialized = true;

    // Capture uncaught JavaScript runtime exceptions
    window.addEventListener('error', (event) => {
        try {
            const errorMsg = event.message || 'Uncaught JavaScript Error';
            const stack = event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`;
            const source = event.filename || window.location.href;
            logJsError(errorMsg, stack, source);
        } catch (e) {
            console.error('Error within global error listener:', e);
        }
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        try {
            const error = event.reason;
            const errorMsg = error?.message || (typeof error === 'string' ? error : 'Unhandled Promise Rejection');
            const stack = error?.stack || '';
            const source = window.location.href;
            logJsError(errorMsg, stack, source);
        } catch (e) {
            console.error('Error within global unhandledrejection listener:', e);
        }
    });

    console.log('[ErrorLogService] Global JS error logging initialized.');
}
