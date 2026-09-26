/**
 * CALENDAR SERVICE
 * Service functions and data layer for Student Calendar & Events.
 */

import { apiClient } from './apiClient';
import {
  getLoggedInStudentId,
  getMicrocredentialLiveMeetingsByCourse,
  getStudentMicrocredentialEvents,
  getStudentEnrolledMicrocredentialCourse
} from './microcredentialService';

export { getMicrocredentialLiveMeetingsByCourse, getStudentMicrocredentialEvents };

export const INITIAL_CALENDAR_EVENTS = [];

/**
 * Calculates metrics summary for stat cards dynamically based on real events
 */
export function calculateEventMetrics(events = []) {
  let googleEvents = 0;
  let zoomMeetings = 0;
  let googleMeets = 0;

  (events || []).forEach((ev) => {
    const type = (ev.sourceType || '').toLowerCase();
    const cat = (ev.category || '').toLowerCase();
    if (type.includes('zoom') || cat.includes('zoom')) {
      zoomMeetings++;
    } else if (type.includes('meet') || cat.includes('meet') || type.includes('google_meet')) {
      googleMeets++;
    } else if (type.includes('calendar') || type.includes('google_calendar')) {
      googleEvents++;
    } else {
      googleEvents++;
    }
  });

  return {
    googleEvents,
    zoomMeetings,
    googleMeets,
    totalEvents: (events || []).length
  };
}

/**
 * Fetches calendar events dynamically using GetStudentMicrocredentialEvents API.
 * API: POST /api/StudentMicrocredentialCalendarAPI/GetStudentMicrocredentialEvents
 */
export async function getStudentCalendarEvents(studentId = 0, options = {}) {
  try {
    let finalStudentId = Number(studentId) || 0;
    if (!finalStudentId) {
      finalStudentId = getLoggedInStudentId() || 0;
    }

    const pageNo = typeof options === 'object' && options?.pageNo ? Number(options.pageNo) : 1;
    const pageSize = typeof options === 'object' && options?.pageSize ? Number(options.pageSize) : 50;
    const searchInput = typeof options === 'object' && options?.searchInput ? String(options.searchInput) : '';

    const res = await getStudentMicrocredentialEvents(finalStudentId, pageNo, pageSize, searchInput);
    if (res?.success && Array.isArray(res.events)) {
      return res.events;
    }
    return [];
  } catch (err) {
    console.error('Error in getStudentCalendarEvents:', err);
    return [];
  }
}
