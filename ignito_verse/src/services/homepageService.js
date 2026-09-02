/**
 * HOMEPAGE SERVICE
 * Connects Homepage UI with .NET Web API endpoint POST /api/HomePageAPI/HomePage
 * using Input & Output Parameter DTOs.
 */

import { apiClient } from './apiClient';
import { buildHomePageInput } from '../dto/input/homepageInputs';
import { parseHomePageOutput, parseHomePageErrorOutput } from '../dto/output/homepageOutputs';

/**
 * Fetches homepage hero section and section data list from .NET Web API.
 * API: POST /api/HomePageAPI/HomePage
 * 
 * @returns {Promise<object>} Parsed output object containing `{ success, homePageDataBindList, homePageSectionDataList, message, status, rawData }`
 */
export async function getHomePageData() {
  try {
    // 1. Prepare Input Parameter DTO
    const inputDto = buildHomePageInput();

    // 2. Execute API Call via Centralized API Client
    const response = await apiClient('/HomePageAPI/HomePage', {
      method: 'POST',
      headers: inputDto.headers,
      body: inputDto.body
    });

    // 3. Parse Output Parameter DTO
    if (!response.ok && response.status !== 200) {
      return parseHomePageErrorOutput(response.data, response.status);
    }

    return parseHomePageOutput(response.data, response.status);
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return parseHomePageErrorOutput({ message: error.message }, 500);
  }
}

/**
 * Alias for getHomePageData for backward compatibility or alternative naming preferences.
 */
export const fetchHomePageData = getHomePageData;
