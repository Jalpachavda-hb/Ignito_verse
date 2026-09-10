/**
 * MICROCREDENTIAL QUIZ SERVICE
 * Service functions connecting Microcredential Quiz UI with backend .NET Web API endpoints.
 */

import { apiClient } from './apiClient';
import { buildMicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdInput } from '../dto/input/microcredentialQuizPasswordGetUsingMicrocredentialCourseIdInput';
import { 
    parseMicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdOutput, 
    parseMicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdErrorOutput 
} from '../dto/output/microcredentialQuizPasswordGetUsingMicrocredentialCourseIdOutput';

/**
 * Gets microcredential quiz password and allowed IP range details using course ID, email, and student name.
 * API: POST /api/IgnitoMicroCredencialAPI/MicrocredentialQuizPasswordGetUsingMicrocredentialCourseId
 * (Fallback: /api/StudentMicrocredentialQuizAPI/MicrocredentialQuizPasswordGetUsingMicrocredentialCourseId)
 * 
 * C# Method Signature:
 * [HttpPost]
 * [Route("MicrocredentialQuizPasswordGetUsingMicrocredentialCourseId")]
 * public MicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdOutPutParameter MicrocredentialQuizPasswordGetUsingMicrocredentialCourseId(MicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdInputParameter input)
 * 
 * @param {object|string|number} emailOrPayload - Input object { email, studentName, microcredentialCourseId } or Email string or MicrocredentialCourseId number
 * @param {string} [studentName=''] - Student name
 * @param {number} [microcredentialCourseId=0] - Microcredential course ID
 * @returns {Promise<object>} Parsed response containing `{ success, isSuccess, password, studentName, email, microQuizIpRangeDetails, status, message, rawData }`
 */
export async function microcredentialQuizPasswordGetUsingMicrocredentialCourseId(
    emailOrPayload = '',
    studentName = '',
    microcredentialCourseId = 0
) {
    try {
        const inputDto = buildMicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdInput(
            emailOrPayload,
            studentName,
            microcredentialCourseId
        );

        // Attempt call using IgnitoMicroCredencialAPI controller path (consistent with microcredentialService)
        let response = await apiClient('api/IgnitoMicroCredencialAPI/MicrocredentialQuizPasswordGetUsingMicrocredentialCourseId', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        // Fallback to StudentMicrocredentialQuizAPI if 404
        if (response.status === 404) {
            response = await apiClient('api/StudentMicrocredentialQuizAPI/MicrocredentialQuizPasswordGetUsingMicrocredentialCourseId', {
                method: 'POST',
                headers: inputDto.headers,
                body: inputDto.body
            });
        }

        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdErrorOutput(response.data, response.status);
        }

        const outputDto = parseMicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in microcredentialQuizPasswordGetUsingMicrocredentialCourseId:', error);
        return parseMicrocredentialQuizPasswordGetUsingMicrocredentialCourseIdErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Alias helper function for MicrocredentialQuizPasswordGetUsingMicrocredentialCourseId
 */
export const getMicrocredentialQuizPasswordUsingCourseId = microcredentialQuizPasswordGetUsingMicrocredentialCourseId;

export default {
    microcredentialQuizPasswordGetUsingMicrocredentialCourseId,
    getMicrocredentialQuizPasswordUsingCourseId
};
