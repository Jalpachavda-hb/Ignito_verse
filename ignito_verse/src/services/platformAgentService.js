/**
 * PLATFORM AGENT SERVICE (`Captiq`)
 * Communicates with the official ignitoCaptiq AI Platform Guide API.
 * Endpoint: POST /api/IgnitoAI/platform-agent
 */

import { apiClient } from './apiClient';
import { buildPlatformAgentInput } from '../dto/input/platformAgentInput';
import { parsePlatformAgentOutput } from '../dto/output/platformAgentOutput';

const DIRECT_API_URL = 'https://1ejrtfddba.execute-api.ap-south-1.amazonaws.com/default/api/IgnitoAI/platform-agent';

/**
 * Sends a user query to Captiq AI Agent.
 * 
 * @param {string} userQuery - The user's query or message
 * @param {object} [options={}] - Optional parameters { currentPageUrl, userRole, studentId, conversationHistory }
 * @returns {Promise<{ isSuccess: boolean, responseText: string, errorMessage: string|null, suggestedActions: Array }>}
 */
export async function askCaptiqAI(userQuery, options = {}) {
  const payload = buildPlatformAgentInput(userQuery, options);

  try {
    // Attempt through centralized apiClient (supports Vite dev proxy and dynamic base URL)
    const response = await apiClient('api/IgnitoAI/platform-agent', {
      method: 'POST',
      body: JSON.stringify(payload),
      isPublic: true
    });

    if (response.ok && response.data) {
      return parsePlatformAgentOutput(response.data, response.status);
    }

    // Direct fallback if proxy or endpoint returns non-OK
    const directRes = await fetch(DIRECT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const directData = await directRes.json();
    return parsePlatformAgentOutput(directData, directRes.status);
  } catch (err) {
    console.warn('Captiq AI primary request failed, attempting direct endpoint fallback:', err);
    try {
      const directRes = await fetch(DIRECT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const directData = await directRes.json();
      return parsePlatformAgentOutput(directData, directRes.status);
    } catch (fallbackErr) {
      console.error('Captiq AI service error:', fallbackErr);
      return {
        isSuccess: false,
        responseText: 'I am temporarily having trouble reaching the ignitoCaptiq AI server. Please try again in a moment or explore our Microcredentials catalog.',
        errorMessage: fallbackErr?.message || 'Network error',
        suggestedActions: [
          {
            title: 'Explore Microcredentials',
            url: '/Home/Microcredentials',
            iconClass: 'fa-solid fa-graduation-cap'
          }
        ]
      };
    }
  }
}
