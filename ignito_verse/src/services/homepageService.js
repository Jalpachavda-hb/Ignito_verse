/**
 * HOMEPAGE SERVICE
 * Connects Homepage UI with .NET Web API endpoint POST /api/HomePageAPI/HomePage
 * using Input & Output Parameter DTOs.
 */

import { apiClient } from './apiClient';
import { buildHomePageInput } from '../dto/input/homepageInputs';
import { buildHomeTrustedLogoListInput } from '../dto/input/homeTrustedLogoListInput';
import { parseHomePageOutput, parseHomePageErrorOutput } from '../dto/output/homepageOutputs';
import { parseHomeTrustedLogoListOutput, parsehomeTrustedLogoListErrorOutput } from '../dto/output/homeTrustedLogoListOutput';
import { bindTestimonialReviewInput } from '../dto/input/testimonialReviewInput'
import { parseTestimonialReviewOutput, parseTestimonialReviewErrorOutput } from '../dto/output/testimonialReviewOutput'

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


export async function getHomeTrustedLogoList() {
    try{
         const inputDto = buildHomeTrustedLogoListInput();
         const response = await apiClient('/HomePageAPI/HomeTrustedLogoList', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
         });
         if (!response.ok && response.status !== 200) {
            return parsehomeTrustedLogoListErrorOutput(response.data, response.status);
         }
         return parseHomeTrustedLogoListOutput(response.data, response.status);
    } catch (error) {
        console.error('Error fetching home trusted logo list:', error);
        return parsehomeTrustedLogoListErrorOutput({ message: error.message }, 500);
    }     
}


export async function getTestimonialReviewLists() {
    try{
        const inputDto = bindTestimonialReviewInput();
        const response = await apiClient('/HomePageAPI/GetTestimonialReviewList', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });
        if (!response.ok && response.status !== 200) {
            return parseTestimonialReviewErrorOutput(response.data, response.status);
        }
        return parseTestimonialReviewOutput(response.data, response.status);
    } catch (error) {
        console.error('Error fetching testimonial review list:', error);
        return parseTestimonialReviewErrorOutput({ message: error.message }, 500);
    }
}



export const fetchHomePageData = getHomePageData;
export const fetchHomeTrustedLogoList = getHomeTrustedLogoList;
export const fetchTestimonialReviewLists = getTestimonialReviewLists;

