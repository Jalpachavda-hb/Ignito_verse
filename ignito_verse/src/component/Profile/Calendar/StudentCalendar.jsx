// ignitoverse: Student Profile Calendar & Events Component
import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon, Video, Headphones, Search,
  ChevronLeft, ChevronRight, Filter, RotateCcw,
  ExternalLink, X, Clock, BookOpen, CheckCircle, Info, RefreshCw,
  Download, PlayCircle, FileVideo, Film
} from 'lucide-react';
import {
  getStudentCalendarEvents,
  calculateEventMetrics
} from '../../../services/calendarService';
import {
  getMicrocredentialMeetingRecordings,
  downloadEventIcs
} from '../../../services/microcredentialService';
import './StudentCalendar.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function StudentCalendar({
  user = null,
  enrolledCourses = null,
  onEventsCountChange = () => { }
}) {
  // Main Tab: 'calendar' (Calendar View) | 'list' (Calendar Events List)
  const [mainTab, setMainTab] = useState('calendar');

  // Active view date state (Default to September 2026 or current date)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 = September (0-indexed)
  const [filterYear, setFilterYear] = useState(2026);
  const [filterMonth, setFilterMonth] = useState(8);

  // Calendar Sub-view: 'month' | 'week' | 'day' | 'list'
  const [calViewMode, setCalViewMode] = useState('month');

  // Search query for List view
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination for List view
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modal State for Event Description
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Dynamic Events list & loading states
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Dynamic Recordings list & loading states
  const [recordingsList, setRecordingsList] = useState([]);
  const [loadingRecordings, setLoadingRecordings] = useState(false);
  const [recordingSearchQuery, setRecordingSearchQuery] = useState('');
  const [recordingSourceFilter, setRecordingSourceFilter] = useState('ALL');

  // State for .ics calendar export download
  const [downloadingIcsId, setDownloadingIcsId] = useState(null);

  const handleDownloadEventIcs = async (ev) => {
    if (!ev) return;
    const eventId = ev.eventId || ev.id || ev.meetingId;
    if (!eventId) return;

    try {
      setDownloadingIcsId(eventId);
      await downloadEventIcs(eventId, ev);
    } catch (err) {
      console.error('Failed to download calendar event ICS:', err);
    } finally {
      setDownloadingIcsId(null);
    }
  };

  // Fetch dynamic calendar events and recordings from API
  useEffect(() => {
    let isMounted = true;
    async function fetchCalendarData() {
      setLoadingEvents(true);
      setLoadingRecordings(true);
      try {
        const studentId = user?.studentId || user?.id || 0;
        
        // Fetch events & recordings concurrently
        const [eventsData, recordingsData] = await Promise.all([
          getStudentCalendarEvents(studentId, enrolledCourses).catch(() => []),
          getMicrocredentialMeetingRecordings(0, studentId).catch(() => ({ recordings: [] }))
        ]);

        if (isMounted) {
          setEvents(eventsData || []);
          if (typeof onEventsCountChange === 'function') {
            onEventsCountChange(eventsData?.length || 0);
          }

          if (recordingsData?.success && Array.isArray(recordingsData.recordings)) {
            setRecordingsList(recordingsData.recordings);
          } else {
            setRecordingsList([]);
          }

          if (eventsData && eventsData.length > 0) {
            const firstWithDate = eventsData.find(e => e.startDate);
            if (firstWithDate) {
              const d = new Date(firstWithDate.startDate);
              if (!isNaN(d.getTime())) {
                setCurrentMonth(d.getMonth());
                setCurrentYear(d.getFullYear());
                setFilterMonth(d.getMonth());
                setFilterYear(d.getFullYear());
              }
            }
          }
        }
      } catch (err) {
        console.error('Error loading calendar events and recordings:', err);
      } finally {
        if (isMounted) {
          setLoadingEvents(false);
          setLoadingRecordings(false);
        }
      }
    }
    fetchCalendarData();
  }, [user, enrolledCourses]);

  // Filtered Recordings List
  const filteredRecordings = useMemo(() => {
    return recordingsList.filter(rec => {
      const matchSource = recordingSourceFilter === 'ALL' || rec.sourceType === recordingSourceFilter;
      const q = recordingSearchQuery.toLowerCase();
      const matchQuery = !q ||
        rec.title.toLowerCase().includes(q) ||
        (rec.microcredentialCourseName && rec.microcredentialCourseName.toLowerCase().includes(q)) ||
        (rec.description && rec.description.toLowerCase().includes(q));
      return matchSource && matchQuery;
    });
  }, [recordingsList, recordingSearchQuery, recordingSourceFilter]);

  // Metric stats
  const metrics = useMemo(() => calculateEventMetrics(events), [events]);

  // Handle Month / Year Filter submit
  const handleApplyFilter = () => {
    setCurrentMonth(Number(filterMonth));
    setCurrentYear(Number(filterYear));
  };

  const handleClearFilter = () => {
    setFilterMonth(8);
    setFilterYear(2026);
    setCurrentMonth(8);
    setCurrentYear(2026);
  };

  // Navigations (< Today >)
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
      setFilterMonth(11);
      setFilterYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
      setFilterMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
      setFilterMonth(0);
      setFilterYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
      setFilterMonth(prev => prev + 1);
    }
  };

  const handleGoToday = () => {
    // Navigate to default September 2026
    setCurrentMonth(8);
    setCurrentYear(2026);
    setFilterMonth(8);
    setFilterYear(2026);
  };

  // Filtered Events for Table List
  const filteredEventsForList = useMemo(() => {
    return events.filter(ev => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.sourceLabel.toLowerCase().includes(q) ||
        (ev.programName && ev.programName.toLowerCase().includes(q)) ||
        (ev.programSub && ev.programSub.toLowerCase().includes(q))
      );
    });
  }, [events, searchQuery]);

  // Paginated Events
  const totalPages = Math.max(1, Math.ceil(filteredEventsForList.length / pageSize));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEventsForList.slice(start, start + pageSize);
  }, [filteredEventsForList, currentPage, pageSize]);

  // Calendar Grid Days Calculation
  const calendarGridCells = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      cells.push({
        dayNumber: dayNum,
        isOtherMonth: true,
        monthOffset: -1,
        dateStr: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
      });
    }

    // Days in current month
    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(dayNum).padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

      // Events for this day
      const dayEvents = events.filter(ev => ev.startDate.startsWith(dateStr));

      cells.push({
        dayNumber: dayNum,
        isOtherMonth: false,
        isToday: dayNum === 15 && currentMonth === 8 && currentYear === 2026, // Highlight 15th matching screenshot
        monthOffset: 0,
        dateStr,
        events: dayEvents
      });
    }

    // Trailing days to fill 35 or 42 grid
    const totalFilled = cells.length;
    const remaining = totalFilled <= 35 ? 35 - totalFilled : 42 - totalFilled;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      cells.push({
        dayNumber: dayNum,
        isOtherMonth: true,
        monthOffset: 1,
        dateStr: `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
      });
    }

    return cells;
  }, [currentYear, currentMonth, events]);

  // Helper for source icon
  const renderSourceIcon = (sourceType) => {
    if (sourceType === 'google_calendar') {
      return (
        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>
          G
        </span>
      );
    }
    if (sourceType === 'google_meet') {
      return <Video size={14} color="#1e293b" />;
    }
    return <Video size={14} color="#1e293b" />;
  };

  return (
    <div className="student-calendar-container">
      {/* ------------------------------------------------------------------
          1. TOP TAB SWITCHER (Calendar View vs Calendar Events List)
          ------------------------------------------------------------------ */}
      <div className="calendar-top-tabs-bar">
        <button
          type="button"
          className={`calendar-tab-pill-btn ${mainTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setMainTab('calendar')}
        >
          <CalendarIcon size={15} />
          <span>Calendar View</span>
        </button>

        <button
          type="button"
          className={`calendar-tab-pill-btn ${mainTab === 'list' ? 'active' : ''}`}
          onClick={() => setMainTab('list')}
        >
          <BookOpen size={15} />
          <span>Calendar Events List</span>
        </button>

        <button
          type="button"
          className={`calendar-tab-pill-btn ${mainTab === 'recordings' ? 'active' : ''}`}
          onClick={() => setMainTab('recordings')}
        >
          <Download size={15} />
          <span>Session Recordings & Downloads</span>
          {recordingsList.length > 0 && (
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px',
              background: mainTab === 'recordings' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
              color: mainTab === 'recordings' ? '#ffffff' : '#00385E'
            }}>
              {recordingsList.length}
            </span>
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------------
          2. METRIC STAT CARDS (4-Column Row)
          ------------------------------------------------------------------ */}
      <div className="calendar-stats-grid">
        {/* Card 1: Google Events */}
        <div className="calendar-stat-card">
          <div className="stat-icon-box google-icon">
            <span>G</span>
          </div>
          <div className="stat-content">
            <span className="stat-number">{metrics.googleEvents}</span>
            <span className="stat-label">Google Events</span>
          </div>
        </div>

        {/* Card 2: Zoom Meetings */}
        <div className="calendar-stat-card">
          <div className="stat-icon-box">
            <Video size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{metrics.zoomMeetings}</span>
            <span className="stat-label">Zoom Meetings</span>
          </div>
        </div>

        {/* Card 3: Google Meets */}
        <div className="calendar-stat-card">
          <div className="stat-icon-box">
            <Headphones size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{metrics.googleMeets}</span>
            <span className="stat-label">Google Meets</span>
          </div>
        </div>

        {/* Card 4: Total Events */}
        <div className="calendar-stat-card">
          <div className="stat-icon-box">
            <CalendarIcon size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{metrics.totalEvents}</span>
            <span className="stat-label">Total Events</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          3A. TAB CONTENT: CALENDAR VIEW
          ------------------------------------------------------------------ */}
      {mainTab === 'calendar' && (
        <div className="calendar-view-card">
          {/* Filters Row */}
          <div className="calendar-filters-row">
            <div className="filter-field-group">
              <label className="filter-field-label">MONTH</label>
              <select
                className="filter-select"
                value={filterMonth}
                onChange={(e) => setFilterMonth(Number(e.target.value))}
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-field-group">
              <label className="filter-field-label">YEAR</label>
              <input
                type="number"
                className="filter-input"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              />
            </div>

            <div className="filter-btn-group">
              <button
                type="button"
                className="btn-calendar-filter"
                onClick={handleApplyFilter}
              >
                <Filter size={15} />
                <span>Filter</span>
              </button>

              <button
                type="button"
                className="btn-calendar-clear"
                onClick={handleClearFilter}
              >
                <RotateCcw size={15} />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Color Legend Bar */}
          <div className="calendar-legend-bar">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#f59e0b' }} />
              <span>Google Meeting</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#6366f1' }} />
              <span>Zoom Meeting</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#475569' }} />
              <span>Default</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#a855f7' }} />
              <span>Birthday</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#06b6d4' }} />
              <span>Focus Time</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#10b981' }} />
              <span>Out Of Office</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#059669' }} />
              <span>Working Location</span>
            </div>
          </div>

          {/* Navigation & Period Control */}
          <div className="calendar-nav-toolbar">
            <div className="cal-nav-left">
              <button
                type="button"
                className="btn-cal-arrow"
                onClick={handlePrevMonth}
                aria-label="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="btn-cal-today"
                onClick={handleGoToday}
              >
                Today
              </button>
              <button
                type="button"
                className="btn-cal-arrow"
                onClick={handleNextMonth}
                aria-label="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="cal-title-center">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </div>

            <div className="cal-view-modes-right">
              <button
                type="button"
                className={`btn-view-mode ${calViewMode === 'month' ? 'active' : ''}`}
                onClick={() => setCalViewMode('month')}
              >
                Month
              </button>
              <button
                type="button"
                className={`btn-view-mode ${calViewMode === 'week' ? 'active' : ''}`}
                onClick={() => setCalViewMode('week')}
              >
                Week
              </button>
              <button
                type="button"
                className={`btn-view-mode ${calViewMode === 'day' ? 'active' : ''}`}
                onClick={() => setCalViewMode('day')}
              >
                Day
              </button>
              <button
                type="button"
                className={`btn-view-mode ${calViewMode === 'list' ? 'active' : ''}`}
                onClick={() => setMainTab('list')}
              >
                List
              </button>
            </div>
          </div>

          {/* Month Calendar Grid */}
          <div className="calendar-grid-wrapper" style={{ position: 'relative' }}>
            {loadingEvents && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.75)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#00385E',
                fontWeight: 700,
                fontSize: '0.9rem',
                borderRadius: '8px',
                backdropFilter: 'blur(2px)'
              }}>
                <RefreshCw size={20} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Loading live meetings...</span>
              </div>
            )}
            <div className="calendar-weekdays-row">
              {WEEK_DAYS.map((day) => (
                <div key={day} className="calendar-weekday-cell">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-days-grid">
              {calendarGridCells.map((cell, idx) => (
                <div
                  key={idx}
                  className={`calendar-day-cell ${cell.isOtherMonth ? 'other-month' : ''} ${cell.isToday ? 'is-today' : ''}`}
                >
                  <div className="day-header-line">
                    <span className="day-num">{cell.dayNumber}</span>
                  </div>

                  {cell.events && cell.events.length > 0 && (
                    <div className="day-events-list">
                      {cell.events.map((ev) => (
                        <div
                          key={ev.id}
                          className="calendar-event-pill"
                          style={{
                            background: ev.category === 'focus_time' ? '#0f766e' : '#334155'
                          }}
                          onClick={() => setSelectedEvent(ev)}
                          title={`${ev.title} (${ev.displayStart})`}
                        >
                          <span className="pill-time">
                            {ev.startDate.split('T')[1]?.slice(0, 5)}
                          </span>
                          <span className="pill-title">{ev.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          3B. TAB CONTENT: CALENDAR EVENTS LIST
          ------------------------------------------------------------------ */}
      {mainTab === 'list' && (
        <div className="events-list-card">
          {/* Search bar */}
          <div className="events-list-toolbar">
            <div className="event-search-wrapper">
              <input
                type="text"
                className="event-search-input"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button
                type="button"
                className="event-search-btn"
                aria-label="Search"
              >
                <Search size={15} />
              </button>
            </div>
          </div>

          {/* Events Table */}
          <div className="events-table-wrapper">
            <table className="events-table">
              <thead>
                <tr>
                  <th>EVENT SOURCE TYPE</th>
                  <th>EVENT TITLE</th>
                  <th>DATE & TIME</th>
                  <th>PROGRAMME INFO</th>
                  <th>ACTIONS</th>
                  <th>CREATED DATE</th>
                </tr>
              </thead>
              <tbody>
                {loadingEvents ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#00385E', fontWeight: 600 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <RefreshCw size={18} className="spinner" style={{ animation: 'spin 1s linear infinite', color: '#00385E' }} />
                        <span>Loading live meetings & calendar events...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      No events found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedEvents.map((ev) => (
                    <tr key={ev.id}>
                      {/* Event Source Type */}
                      <td>
                        <div className="source-type-cell">
                          <div className="source-badge">
                            {renderSourceIcon(ev.sourceType)}
                            <span>{ev.sourceLabel}</span>
                          </div>
                          {ev.subType && (
                            <span className="source-subtag">{ev.subType}</span>
                          )}
                        </div>
                      </td>

                      {/* Event Title */}
                      <td className="event-title-cell">
                        {ev.title}
                      </td>

                      {/* Date & Time */}
                      <td className="event-datetime-cell">
                        <div>Start: {ev.displayStart}</div>
                        <div>End: {ev.displayEnd}</div>
                      </td>

                      {/* Programme Info */}
                      <td className="event-programme-cell">
                        <div className="programme-title">{ev.programName}</div>
                        <div className="programme-sub">{ev.programSub}</div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="event-actions-cell">
                          <a
                            href={ev.joinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-event-join"
                          >
                            <Video size={14} />
                            <span>Join</span>
                          </a>

                          <button
                            type="button"
                            className="btn-event-cal-sync"
                            onClick={() => handleDownloadEventIcs(ev)}
                            title="Export & Add to Calendar (.ics)"
                            disabled={downloadingIcsId === (ev.eventId || ev.id || ev.meetingId)}
                          >
                            {downloadingIcsId === (ev.eventId || ev.id || ev.meetingId) ? (
                              <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                              <CalendarIcon size={13} />
                            )}
                            <span>Sync .ics</span>
                          </button>

                          <button
                            type="button"
                            className="btn-view-desc-link"
                            onClick={() => setSelectedEvent(ev)}
                          >
                            View Description
                          </button>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="event-created-cell">
                        {ev.createdDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="events-pagination-bar">
            <span className="page-indicator-text">
              Page {currentPage} of {totalPages}
            </span>

            <div className="pagination-controls">
              <button
                type="button"
                className="btn-page-nav"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                className="btn-page-nav"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                aria-label="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          3C. TAB CONTENT: SESSION RECORDINGS & DOWNLOADS
          ------------------------------------------------------------------ */}
      {mainTab === 'recordings' && (
        <div className="events-list-card">
          {/* Search & Platform Filter Bar */}
          <div className="events-list-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="event-search-wrapper" style={{ flex: 1, minWidth: '260px', maxWidth: '420px' }}>
              <input
                type="text"
                className="event-search-input"
                placeholder="Search recordings by title, course, or topic..."
                value={recordingSearchQuery}
                onChange={(e) => setRecordingSearchQuery(e.target.value)}
              />
              <button type="button" className="event-search-btn" aria-label="Search">
                <Search size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className={`btn-view-mode ${recordingSourceFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setRecordingSourceFilter('ALL')}
                style={{ padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                All ({recordingsList.length})
              </button>
              <button
                type="button"
                className={`btn-view-mode ${recordingSourceFilter === 'GOOGLE_MEET' ? 'active' : ''}`}
                onClick={() => setRecordingSourceFilter('GOOGLE_MEET')}
                style={{ padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                Google Meet
              </button>
              <button
                type="button"
                className={`btn-view-mode ${recordingSourceFilter === 'ZOOM' ? 'active' : ''}`}
                onClick={() => setRecordingSourceFilter('ZOOM')}
                style={{ padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                Zoom
              </button>
            </div>
          </div>

          {/* Recordings Grid / List */}
          {loadingRecordings ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#00385E', fontWeight: 700 }}>
              <RefreshCw size={24} className="spinner" style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
              <div>Loading meeting recordings & cloud downloads...</div>
            </div>
          ) : filteredRecordings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
              <Film size={36} style={{ color: '#cbd5e1', marginBottom: '10px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#334155' }}>No Session Recordings Available</div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem' }}>
                Recorded lectures from your live masterclasses and meetings will appear here once ready.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem', padding: '1.25rem 0' }}>
              {filteredRecordings.map((rec) => {
                const isGoogle = rec.sourceType === 'GOOGLE_MEET';
                const isZoom = rec.sourceType === 'ZOOM';

                return (
                  <div
                    key={rec.meetingId}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      {/* Platform & Duration Tags */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: isGoogle ? '#fef3c7' : '#eff6ff',
                          color: isGoogle ? '#b45309' : '#1d4ed8',
                          border: isGoogle ? '1px solid #fde68a' : '1px solid #bfdbfe'
                        }}>
                          <Video size={12} />
                          {isGoogle ? 'Google Meet' : (isZoom ? 'Zoom Cloud' : rec.sourceType)}
                        </span>

                        {rec.duration && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#475569',
                            background: '#f1f5f9',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            {rec.duration}
                          </span>
                        )}
                      </div>

                      {/* Course Title Badge */}
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#005a96', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '4px' }}>
                        {rec.microcredentialCourseName || 'Microcredential Course'}
                      </div>

                      {/* Recording Title */}
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '0.98rem', fontWeight: 800, color: '#00385E', lineHeight: 1.35 }}>
                        {rec.title}
                      </h4>

                      {/* Description */}
                      {rec.description && (
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                          {rec.description}
                        </p>
                      )}

                      {/* Date & Time */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                        <Clock size={13} style={{ color: '#0284C7', flexShrink: 0 }} />
                        <span>{rec.meetingDate || 'Recorded Session'}</span>
                      </div>
                    </div>

                    {/* Download & Watch Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      {rec.recordingUrls && rec.recordingUrls.length > 0 ? (
                        rec.recordingUrls.map((rUrl, uIdx) => (
                          <div key={uIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <a
                              href={rUrl.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              style={{
                                flex: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                color: '#ffffff',
                                background: 'linear-gradient(135deg, #00385E 0%, #005a96 100%)',
                                borderRadius: '7px',
                                textDecoration: 'none',
                                boxShadow: '0 2px 6px rgba(0, 56, 94, 0.18)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Download size={14} />
                              <span>Download Recording</span>
                            </a>

                            <a
                              href={rUrl.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px',
                                padding: '8px 12px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: '#00385E',
                                background: '#f0f7fc',
                                border: '1px solid #c9dfef',
                                borderRadius: '7px',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease'
                              }}
                              title="Watch Stream in Browser"
                            >
                              <PlayCircle size={14} />
                              <span>Watch</span>
                            </a>
                          </div>
                        ))
                      ) : rec.mainUrl ? (
                        <a
                          href={rec.mainUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '8px 12px',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            color: '#ffffff',
                            background: 'linear-gradient(135deg, #00385E 0%, #005a96 100%)',
                            borderRadius: '7px',
                            textDecoration: 'none',
                            boxShadow: '0 2px 6px rgba(0, 56, 94, 0.18)'
                          }}
                        >
                          <Download size={14} />
                          <span>Access Session Recording</span>
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
                          Recording processing in progress
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------
          4. EVENT DESCRIPTION MODAL
          ------------------------------------------------------------------ */}
      {selectedEvent && (
        <div
          className="calendar-modal-backdrop"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="calendar-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cal-modal-header">
              <div className="cal-modal-title-wrap">
                <div className="source-badge">
                  {renderSourceIcon(selectedEvent.sourceType)}
                  <span>{selectedEvent.sourceLabel}</span>
                </div>
                <h3 className="cal-modal-heading">Event Details</h3>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="cal-modal-body">
              <div className="modal-info-item">
                <span className="modal-info-label">Title</span>
                <span className="modal-info-value" style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                  {selectedEvent.title}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="modal-info-item">
                  <span className="modal-info-label">Start Time</span>
                  <span className="modal-info-value">{selectedEvent.displayStart}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">End Time</span>
                  <span className="modal-info-value">{selectedEvent.displayEnd}</span>
                </div>
              </div>

              <div className="modal-info-item">
                <span className="modal-info-label">Programme & Module</span>
                <span className="modal-info-value">{selectedEvent.programName}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedEvent.programSub}</span>
              </div>

              <div className="modal-info-item">
                <span className="modal-info-label">Session Description</span>
                <div className="modal-desc-box">
                  {selectedEvent.description || 'No additional details provided for this event.'}
                </div>
              </div>
            </div>

            <div className="cal-modal-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="btn-modal-sync-cal"
                onClick={() => handleDownloadEventIcs(selectedEvent)}
                disabled={downloadingIcsId === (selectedEvent.eventId || selectedEvent.id || selectedEvent.meetingId)}
                title="Download .ics file to add this meeting to Apple Calendar, Outlook, or Google Calendar"
              >
                {downloadingIcsId === (selectedEvent.eventId || selectedEvent.id || selectedEvent.meetingId) ? (
                  <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <CalendarIcon size={15} />
                )}
                <span>Add to Calendar (.ics)</span>
              </button>

              <a
                href={selectedEvent.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-join-direct"
              >
                <Video size={16} />
                <span>Join Session</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
