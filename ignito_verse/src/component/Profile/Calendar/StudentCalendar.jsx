// ignitoverse: Student Profile Calendar & Events Component
import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon, Video, Headphones, Search,
  ChevronLeft, ChevronRight, Filter, RotateCcw,
  ExternalLink, X, Clock, BookOpen, CheckCircle, Info
} from 'lucide-react';
import {
  INITIAL_CALENDAR_EVENTS,
  calculateEventMetrics
} from '../../../services/calendarService';
import './StudentCalendar.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function StudentCalendar({ user = null }) {
  // Main Tab: 'calendar' (Calendar View) | 'list' (Calendar Events List)
  const [mainTab, setMainTab] = useState('calendar');

  // Active view date state (Default to September 2026 as in the user mockup)
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

  // Events list state
  const [events] = useState(INITIAL_CALENDAR_EVENTS);

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
          <span>Calendar View</span>
        </button>

        <button
          type="button"
          className={`calendar-tab-pill-btn ${mainTab === 'list' ? 'active' : ''}`}
          onClick={() => setMainTab('list')}
        >
          <span>Calendar Events List</span>
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
          <div className="calendar-grid-wrapper">
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
                {paginatedEvents.length === 0 ? (
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
