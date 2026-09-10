// ignitoverse: Quiz Attempt Details & History Modal (Exact Match to Design Mockup)
import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  RotateCcw, 
  Info, 
  Play, 
  BarChart2, 
  AlertCircle 
} from 'lucide-react';
import './quizAttemptModal.css';

export default function QuizAttemptDetailsModal({
  isOpen,
  onClose,
  onStartQuiz = () => {},
  loading = false,
  error = '',
  courseTitle = 'Testing',
  attemptData = null
}) {
  if (!isOpen) return null;

  const detail = attemptData?.studentAttemptDetail || {
    isAllAttemptDone: false,
    quizTitle: courseTitle || 'Testing',
    quizAvailability: 'to',
    quizTimeLimit: '02:00:00',
    quizTotalAttempts: 10,
    usedAttempts: 0,
    remainingAttempts: 10
  };

  const historyList = attemptData?.microcredentialQuizStudentAttemptDetail || [];
  const totalAttempts = Number(detail.quizTotalAttempts ?? 10);
  const usedAttempts = Number(detail.usedAttempts ?? 0);
  const remaining = Number(detail.remainingAttempts ?? Math.max(0, totalAttempts - usedAttempts));
  const isAttemptsExhausted = Boolean(detail.isAllAttemptDone || remaining <= 0);

  const availabilityText = detail.quizAvailability || 'to';
  const timeLimitText = detail.quizTimeLimit || '02:00:00';
  const titleText = detail.quizTitle || courseTitle || 'Testing';

  return (
    <div 
      className="quiz-modal-overlay" 
      role="dialog" 
      aria-modal="true"
    >
      <div 
        className="quiz-modal-backdrop" 
        onClick={onClose} 
      />

      <div 
        className="quiz-modal-container"
        onClick={e => e.stopPropagation()}
      >
        {/* 1. Modal Top Header Bar */}
        <div className="quiz-modal-header">
          <div className="quiz-modal-header-left">
            <div className="quiz-modal-header-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="15" y2="17" />
                <polyline points="9 9 10 9" />
              </svg>
            </div>
            <div className="quiz-modal-title-wrap">
              <h3 className="quiz-modal-title">
                Quiz Attempt Details
              </h3>
              <p className="quiz-modal-subtitle">
                Review attempt limits, remaining attempts and score history
              </p>
            </div>
          </div>

          <button
            type="button"
            className="quiz-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Modal Scrollable Content Body */}
        <div className="quiz-modal-body">
          
          {loading ? (
            <div className="quiz-modal-loading-state">
              <div className="quiz-spinner" />
              <p className="quiz-loading-label">Loading quiz attempt data...</p>
            </div>
          ) : error ? (
            <div className="quiz-modal-error-box">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          ) : (
            <>
              {/* Top Card: Assessment Overview */}
              <div className="quiz-overview-box">
                <div className="overview-top-section">
                  <div className="overview-header-info">
                    <div className="overview-badge-tag">
                      <BarChart2 size={13} />
                      <span>ASSESSMENT OVERVIEW</span>
                    </div>
                    <h4 className="overview-headline">
                      {titleText}
                    </h4>
                    <p className="overview-description">
                      Check your knowledge and complete the quiz within the given time.
                    </p>
                  </div>

                  {/* Top Right Graduation Illustration */}
                  <div className="overview-avatar-illustration">
                    <svg className="overview-svg-art" viewBox="0 0 54 54" fill="none">
                      {/* Document Sheet */}
                      <rect x="10" y="8" width="28" height="36" rx="4" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
                      
                      {/* Check items */}
                      <rect x="14" y="14" width="6" height="6" rx="1.5" fill="#3B82F6" />
                      <path d="M15.5 17L17 18.5L19 15.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="23" y1="17" x2="33" y2="17" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
                      
                      <rect x="14" y="23" width="6" height="6" rx="1.5" fill="#3B82F6" />
                      <path d="M15.5 26L17 27.5L19 24.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="23" y1="26" x2="33" y2="26" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
                      
                      <rect x="14" y="32" width="6" height="6" rx="1.5" fill="#3B82F6" />
                      <line x1="23" y1="35" x2="33" y2="35" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />

                      {/* Mortarboard Graduation Cap */}
                      <path d="M37 18L24 24L37 30L50 24L37 18Z" fill="#00385E" />
                      <path d="M30 27.5V33C30 35.5 33 37.5 37 37.5C41 37.5 44 35.5 44 33V27.5" stroke="#00385E" strokeWidth="1.5" fill="#002844" />
                      {/* Golden Tassel */}
                      <path d="M48 25V34" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="48" cy="35" r="1.5" fill="#EAB308" />
                    </svg>
                  </div>
                </div>

                {/* 2-Column Metrics Specification matching Screenshot */}
                <div className="overview-specs-row">
                  
                  {/* Left Col 1: Availability */}
                  <div className="spec-entry">
                    <div className="spec-icon-circle blue">
                      <Calendar size={18} />
                    </div>
                    <div className="spec-text-block">
                      <span className="spec-label-text">Availability</span>
                      <span className="spec-value-text">{availabilityText}</span>
                    </div>
                  </div>

                  {/* Right Col 1: Total Attempts */}
                  <div className="spec-entry">
                    <div className="spec-icon-circle green">
                      <FileText size={18} />
                    </div>
                    <div className="spec-text-block">
                      <span className="spec-label-text">Total Attempts</span>
                      <span className="spec-value-text">{totalAttempts}</span>
                    </div>
                  </div>

                  {/* Left Col 2: Time Limit */}
                  <div className="spec-entry">
                    <div className="spec-icon-circle blue">
                      <Clock size={18} />
                    </div>
                    <div className="spec-text-block">
                      <span className="spec-label-text">Time Limit</span>
                      <span className="spec-value-text">{timeLimitText}</span>
                    </div>
                  </div>

                  {/* Right Col 2: Used Attempts */}
                  <div className="spec-entry">
                    <div className="spec-icon-circle orange">
                      <RotateCcw size={18} />
                    </div>
                    <div className="spec-text-block">
                      <span className="spec-label-text">Used Attempts</span>
                      <span className="spec-value-text">{usedAttempts}</span>
                    </div>
                  </div>

                  {/* Blank space for left col */}
                  <div className="spec-entry" />

                  {/* Right Col 3: Remaining Attempts */}
                  <div className="spec-entry space-between">
                    <div className="spec-entry-inner">
                      <div className="spec-icon-circle green">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div className="spec-text-block">
                        <span className="spec-label-text">Remaining Attempts</span>
                      </div>
                    </div>
                    <span className="remaining-count-pill">{remaining}</span>
                  </div>

                </div>
              </div>

              {/* Middle Card: Attempt History */}
              <div className="quiz-history-box">
                <div className="history-box-top-bar">
                  <div className="history-title-group">
                    <RotateCcw size={17} className="history-header-icon" />
                    <h5 className="history-box-title">
                      Attempt History
                    </h5>
                  </div>
                  <span className="history-records-text">
                    {historyList.length} {historyList.length === 1 ? 'Record' : 'Records'}
                  </span>
                </div>

                <div className="history-box-content">
                  {historyList && historyList.length > 0 ? (
                    <table className="history-records-table">
                      <thead>
                        <tr>
                          <th>Attempt No</th>
                          <th>Completion Time</th>
                          <th style={{ textAlign: 'right' }}>Score / Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyList.map((item, idx) => {
                          const attemptNum = item.microcredentialQuizAttemptNumber || item.attemptNumber || (idx + 1);
                          const compTime = item.quizCompletionTime || item.completionTime || 'Recorded';
                          const scoreMsg = item.scoreMessage || item.score || 'Completed';
                          const isPass = scoreMsg.toLowerCase().includes('pass');

                          return (
                            <tr key={idx}>
                              <td>
                                <span className="attempt-pill-num">{attemptNum}</span>
                              </td>
                              <td style={{ color: '#475569', fontWeight: 600 }}>{compTime}</td>
                              <td style={{ textAlign: 'right' }}>
                                <span className={`score-badge-pill ${isPass ? 'pass' : 'pending'}`}>
                                  {scoreMsg}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="history-empty-wrapper">
                      <svg className="history-empty-art-icon" viewBox="0 0 48 48" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 6H28L36 14V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8C12 6.9 12.9 6 14 6Z" />
                        <polyline points="28 6 28 14 36 14" />
                        <polyline points="18 26 23 31 31 22" />
                        <line x1="39" y1="18" x2="43" y2="17" />
                        <line x1="39" y1="24" x2="44" y2="24" />
                        <line x1="38" y1="30" x2="42" y2="32" />
                      </svg>
                      <p className="history-empty-main-text">
                        No attempts recorded yet.
                      </p>
                      <p className="history-empty-sub-text">
                        You have {remaining} remaining {remaining === 1 ? 'attempt' : 'attempts'} available.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Info Banner */}
              <div className="quiz-info-callout">
                <Info size={20} className="info-callout-icon" />
                <span>Ready to start? Once you begin, the timer of {timeLimitText} will start.</span>
              </div>
            </>
          )}

        </div>

        {/* 3. Modal Footer Actions */}
        <div className="quiz-modal-footer">
          <button
            type="button"
            className="btn-action-close"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="btn-action-start-quiz"
            disabled={loading || isAttemptsExhausted}
            onClick={() => {
              if (onStartQuiz) onStartQuiz(detail);
            }}
          >
            <Play size={15} fill="#ffffff" />
            <span>Start Quiz</span>
          </button>
        </div>

      </div>
    </div>
  );
}
