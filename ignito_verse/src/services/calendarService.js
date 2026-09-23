/**
 * CALENDAR SERVICE
 * Service functions and data layer for Student Calendar & Events.
 */

import { apiClient } from './apiClient';
import {
  getLoggedInStudentId,
  getMicrocredentialLiveMeetingsByCourse,
  getStudentEnrolledMicrocredentialCourse
} from './microcredentialService';

export { getMicrocredentialLiveMeetingsByCourse };

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
 * Fetches calendar events dynamically by querying live meetings for student's enrolled courses.
 * API: POST /api/StudentMicrocredentialCalendarAPI/GetMicrocredentialLiveMeetingsByCourse
 */
export async function getStudentCalendarEvents(studentId = 0, passedCourses = null) {
  try {
    let finalStudentId = Number(studentId) || 0;
    if (!finalStudentId) {
      finalStudentId = getLoggedInStudentId() || 0;
    }

    let allMeetings = [];
    let courseList = Array.isArray(passedCourses) ? passedCourses : null;

    // 1. Fetch student's enrolled courses if not passed
    if (!courseList && finalStudentId > 0) {
      try {
        const enrolledRes = await getStudentEnrolledMicrocredentialCourse(finalStudentId, 1);
        courseList = (enrolledRes?.success && Array.isArray(enrolledRes?.getStudentEnrolledMicrocredentialCourseList))
          ? enrolledRes.getStudentEnrolledMicrocredentialCourseList
          : [];
      } catch (err) {
        console.warn('Could not load enrolled courses for calendar:', err);
        courseList = [];
      }
    }

    // 2. Query live meetings for enrolled courses, or fallback to courseId=0 if none
    if (courseList && courseList.length > 0) {
      const promises = courseList.map(c => {
        const courseId = Number(c.microcredentialCourseId || c.courseId || c.id) || 0;
        return getMicrocredentialLiveMeetingsByCourse(courseId, finalStudentId)
          .then(res => (res?.success && Array.isArray(res.liveMeetings) ? res.liveMeetings : []))
          .catch(() => []);
      });
      const meetingBatches = await Promise.all(promises);
      meetingBatches.forEach(batch => {
        allMeetings.push(...batch);
      });
    } else if (Array.isArray(passedCourses) && passedCourses.length === 0) {
      // Student has no purchased/enrolled courses - do not return any meetings
      allMeetings = [];
    } else {
      // Only fallback to 0 if student has no specific enrolled courses loaded
      try {
        const directRes = await getMicrocredentialLiveMeetingsByCourse(0, finalStudentId);
        if (directRes?.success && Array.isArray(directRes.liveMeetings)) {
          allMeetings = directRes.liveMeetings;
        }
      } catch (err) {
        console.warn('Direct live meetings query fallback:', err);
      }
    }

    // 3. Deduplicate meetings by meetingId
    const seenIds = new Set();
    const uniqueMeetings = [];
    allMeetings.forEach(m => {
      const key = m.meetingId || `${m.microcredentialCourseId}_${m.title}_${m.startDateTime}`;
      if (!seenIds.has(key)) {
        seenIds.add(key);
        uniqueMeetings.push(m);
      }
    });

    // 4. Map meetings to calendar event format
    const events = uniqueMeetings.map((item, idx) => {
      const srcUpper = (item.sourceType || '').toUpperCase();
      const isZoom = srcUpper === 'ZOOM';
      const isMeet = srcUpper === 'GOOGLE_MEET';
      const startIso = item.startDateTime ? item.startDateTime.replace(' ', 'T') : '';
      const endIso = item.endDateTime ? item.endDateTime.replace(' ', 'T') : '';

      return {
        id: item.meetingId || idx + 1,
        title: item.title || 'Live Meeting',
        sourceType: isZoom ? 'zoom' : (isMeet ? 'google_meet' : 'google_calendar'),
        sourceLabel: isZoom ? 'Zoom Meeting' : (isMeet ? 'Google Meet' : 'Google Calendar'),
        subType: isZoom ? 'meeting' : 'meeting',
        category: isZoom ? 'zoom_meeting' : (isMeet ? 'google_meeting' : 'default'),
        startDate: startIso,
        endDate: endIso,
        displayStart: item.startDateTime || '',
        displayEnd: item.endDateTime || '',
        programName: item.microcredentialCourseName || item.courseName || '',
        programSub: item.description || item.title || '',
        joinUrl: item.joinLink || '',
        createdDate: item.startDateTime || '',
        description: item.description || '',
        liveStatus: item.liveStatus || 'Upcoming',
        color: isZoom ? '#2563eb' : (isMeet ? '#f59e0b' : '#475569')
      };
    });

    return events;
  } catch (err) {
    console.error('Error in getStudentCalendarEvents:', err);
    return [];
  }
}
