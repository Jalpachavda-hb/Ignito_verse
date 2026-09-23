// ignitoverse: Executive Learner Profile & Portal with Microcredential Quiz Attempts Flow
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, BookOpen, Clock,
  Check, ArrowRight, PlayCircle, Building2,
  Briefcase, Sparkles, Calendar, Star,
  Award, CheckCircle2, XCircle, AlertCircle, ArrowLeft, RefreshCw,
  Search, Eye, FileText, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Minus, HelpCircle,
  Lock, LogIn, Camera, GraduationCap, Pencil, BarChart2, Filter
} from 'lucide-react';
import profileBgImg from '../../assets/profilebg.png';
import staticAvatarImg from '../../assets/home/nori-post-2-720x720.webp';
import {
  getStudentEnrolledMicrocredentialCourse,
  studentMicrocredentialsQuizAttemptList,
  getStudentMicrocredentialQuizResultGetByQuizId
} from '../../services/profileService';
import { getStudentAttemptList } from '../../services/QuizServices';
import { getLoggedInStudentId } from '../../services/microcredentialService';
import { getStudentCalendarEvents } from '../../services/calendarService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';
import StudentCalendar from './Calendar/StudentCalendar';
import './ProfilePage.css';


// Helper to strip HTML tags from backend strings (e.g., <p>text</p>)
function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function ProfilePage({
  user = null,
  initialTab = 'dashboard',
  onExploreCatalog = () => { },
  onViewCourse = () => { },
  onNavigate = () => { },
  onLogin = () => { }
}) {
  // Navigation Tabs: 'courses' | 'quiz' | 'calendar'
  const [activeTab, setActiveTab] = useState(
    initialTab === 'calendar' || initialTab === 'events' ? 'calendar' :
    initialTab === 'quiz' || initialTab === 'quiz-results' || initialTab === 'quizzes' ? 'quiz' : 'courses'
  );

  // Enrolled courses state
  const [apiEnrolledCourses, setApiEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Quiz Master List state (Screenshot 1)
  const [quizList, setQuizList] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarEventsCount, setCalendarEventsCount] = useState(0);

  // Expanded Quiz Attempt Rows state (dynamic from user activity)
  const [expandedQuizId, setExpandedQuizId] = useState(null);
  const [attemptsByQuiz, setAttemptsByQuiz] = useState({});
  const [loadingAttemptsForQuiz, setLoadingAttemptsForQuiz] = useState(false);

  // Result Modal State (Screenshot 3)
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedResultQuizId, setSelectedResultQuizId] = useState(null);
  const [selectedResultAttemptId, setSelectedResultAttemptId] = useState(null);
  const [resultDetail, setResultDetail] = useState(null);
  const [loadingResultDetail, setLoadingResultDetail] = useState(false);
  const [resultDetailError, setResultDetailError] = useState('');

  // Helper to extract studentId from session storage / user context
  const getSessionStudentId = () => {
    // 1. Check standardized helper from microcredentialService (checks sessionStorage & localStorage)
    try {
      const loggedId = getLoggedInStudentId();
      if (loggedId && loggedId > 0) return loggedId;
    } catch (e) {
      console.warn('Error calling getLoggedInStudentId:', e);
    }

    // 2. Direct check in sessionStorage
    const sessionStudentId = sessionStorage.getItem('StudentId') || 
                             sessionStorage.getItem('studentId') || 
                             sessionStorage.getItem('ignito_student_id');
    if (sessionStudentId && !isNaN(Number(sessionStudentId)) && Number(sessionStudentId) > 0) {
      return Number(sessionStudentId);
    }

    // 3. Direct check in localStorage
    const localStudentId = localStorage.getItem('StudentId') || 
                           localStorage.getItem('studentId') || 
                           localStorage.getItem('ignito_student_id');
    if (localStudentId && !isNaN(Number(localStudentId)) && Number(localStudentId) > 0) {
      return Number(localStudentId);
    }

    // 4. Check user prop
    if (user && (user.studentId || user.id)) {
      const parsedId = Number(user.studentId || user.id);
      if (!isNaN(parsedId) && parsedId > 0) {
        return parsedId;
      }
    }

    // 5. Check parsed user from storage
    try {
      const rawUser = sessionStorage.getItem('ignito_auth_user') || localStorage.getItem('ignito_auth_user');
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser);
        const parsedId = Number(parsedUser.studentId || parsedUser.StudentId || parsedUser.id || 0);
        if (!isNaN(parsedId) && parsedId > 0) return parsedId;
      }
    } catch { }
    return 0;
  };

  const sessionStudentId = getSessionStudentId();
  const isAuthenticated = Boolean(
    (user && (user.id || user.studentId || user.email || user.name)) || 
    (sessionStudentId && sessionStudentId > 0)
  );

  // Sync initialTab prop if changed by parent
  useEffect(() => {
    if (initialTab === 'calendar' || initialTab === 'events') {
      setActiveTab('calendar');
    } else if (initialTab === 'quiz' || initialTab === 'quiz-results' || initialTab === 'quizzes') {
      setActiveTab('quiz');
    } else if (initialTab === 'courses' || initialTab === 'dashboard') {
      setActiveTab('courses');
    }
  }, [initialTab]);

  // Check URL query parameters or sessionStorage for newly submitted quiz
  useEffect(() => {
    if (!isAuthenticated) return;
    const urlParams = new URLSearchParams(window.location.search);
    const qId = urlParams.get('quizId') || sessionStorage.getItem('ignito_recent_quiz_id');
    const aId = urlParams.get('attemptId') || sessionStorage.getItem('ignito_recent_attempt_id');
    if (qId && aId) {
      setActiveTab('quiz');
      handleOpenResultModal(Number(qId), Number(aId));
      sessionStorage.removeItem('ignito_recent_quiz_id');
      sessionStorage.removeItem('ignito_recent_attempt_id');
    }
  }, [isAuthenticated]);

  // Fetch student enrolled microcredentials
  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingCourses(false);
      return;
    }
    let isMounted = true;
    async function fetchEnrolledCourses() {
      try {
        setLoadingCourses(true);
        const studentId = getSessionStudentId();
        const res = await getStudentEnrolledMicrocredentialCourse(studentId, 1);
        if (isMounted && res.success && Array.isArray(res.getStudentEnrolledMicrocredentialCourseList)) {
          setApiEnrolledCourses(res.getStudentEnrolledMicrocredentialCourseList);
        }
      } catch (err) {
        console.error('Error in fetchEnrolledCourses:', err);
      } finally {
        if (isMounted) setLoadingCourses(false);
      }
    }
    fetchEnrolledCourses();
    return () => { isMounted = false; };
  }, [user, isAuthenticated]);

  // Fetch quiz master list when quiz tab is active
  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingQuizzes(false);
      return;
    }
    if (activeTab === 'quiz') {
      fetchQuizMasterList();
    }
  }, [activeTab, isAuthenticated]);


  const fetchQuizMasterList = async () => {
    setLoadingQuizzes(true);
    try {
      const studentId = getSessionStudentId();
      const res = await studentMicrocredentialsQuizAttemptList(1, 50, 'LastAttemptDate', 'DESC', 0, searchQuery, studentId);
      if (res?.success) {
        setQuizList(res.microStudentQuizAttemptList || []);
      }
    } catch (err) {
      console.error('Error in fetchQuizMasterList:', err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  // Toggle View List for a quiz row (Screenshot 1 -> Screenshot 2)
  const handleToggleViewList = async (quizId, totalAttempt = 1) => {
    if (expandedQuizId === quizId) {
      setExpandedQuizId(null);
      return;
    }

    setExpandedQuizId(quizId);

    // If attempts already cached for this quiz, don't refetch
    if (attemptsByQuiz[quizId]) {
      return;
    }

    setLoadingAttemptsForQuiz(true);
    try {
      const studentId = getSessionStudentId();
      const res = await getStudentAttemptList(quizId, studentId);
      if (res?.success && Array.isArray(res.quizAttemptList) && res.quizAttemptList.length > 0) {
        setAttemptsByQuiz(prev => ({
          ...prev,
          [quizId]: res.quizAttemptList
        }));
      } else {
        // Fallback: generate synthesized attempt rows based on totalAttempt count
        const fallbackList = Array.from({ length: Math.max(1, totalAttempt) }, (_, i) => ({
          attemptId: i + 1,
          attemptNumber: i + 1,
          score: 0,
          totalMarks: 10,
          percentage: 0,
          totalQuestions: 10,
          correctCount: 0,
          wrongCount: 5,
          skippedCount: 5,
          grade: 'F'
        }));
        setAttemptsByQuiz(prev => ({
          ...prev,
          [quizId]: fallbackList
        }));
      }
    } catch (err) {
      console.error('Error in getStudentAttemptList:', err);
    } finally {
      setLoadingAttemptsForQuiz(false);
    }
  };

  // Open Quiz Result Modal (Screenshot 2 -> Screenshot 3)
  const handleOpenResultModal = async (quizId, attemptId) => {
    setSelectedResultQuizId(quizId);
    setSelectedResultAttemptId(attemptId);
    setIsResultModalOpen(true);
    setLoadingResultDetail(true);
    setResultDetailError('');
    setResultDetail(null);

    try {
      const studentId = getSessionStudentId();
      const res = await getStudentMicrocredentialQuizResultGetByQuizId(quizId, studentId, attemptId);
      if (res?.success) {
        setResultDetail(res);
      } else {
        setResultDetailError(res?.message || 'Failed to load quiz evaluation result.');
      }
    } catch (err) {
      setResultDetailError(err.message || 'Error occurred while loading quiz result.');
    } finally {
      setLoadingResultDetail(false);
    }
  };

  const handleCloseResultModal = () => {
    setIsResultModalOpen(false);
    setResultDetail(null);
    setResultDetailError('');
  };

  // Course search state for Tab 1
  const [courseSearchQuery, setCourseSearchQuery] = useState('');

  // Strictly dynamic enrolled / purchased courses (no static mock courses)
  const baseCourses = Array.isArray(apiEnrolledCourses) ? apiEnrolledCourses : [];

  const displayedCoursesList = baseCourses.filter(c => {
    if (!courseSearchQuery) return true;
    const term = courseSearchQuery.toLowerCase();
    const title = c.title || c.microcredentialCourseName || '';
    const desc = c.description || c.courseDescription || c.streamName || '';
    return title.toLowerCase().includes(term) || desc.toLowerCase().includes(term);
  });

  // Dynamic quizzes from API
  const baseQuizzes = Array.isArray(quizList) ? quizList : [];

  const filteredQuizList = baseQuizzes.filter(q => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      (q.quizName && q.quizName.toLowerCase().includes(term)) ||
      (q.streamName && q.streamName.toLowerCase().includes(term)) ||
      (q.microcredentialCourseName && q.microcredentialCourseName.toLowerCase().includes(term))
    );
  });

  const overallProgress = baseCourses.length > 0
    ? Math.round(baseCourses.reduce((acc, c) => acc + Number(c.progressPercentage || c.progress || 0), 0) / baseCourses.length)
    : 0;

  // ==========================================================================
  // UNAUTHENTICATED STATE VIEW
  // ==========================================================================
  if (!isAuthenticated) {
    return (
      <div className="profile-page-wrapper" style={{ background: '#f8fafd', minHeight: '85vh', padding: '2.5rem 1rem' }}>
        <div className="profile-page-container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          
          {/* Breadcrumbs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
            <button 
              type="button" 
              onClick={() => onNavigate ? onNavigate('home') : onExploreCatalog()} 
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, fontWeight: 500 }}
            >
              Home
            </button>
            <span>&gt;</span>
            <span style={{ color: '#00385E', fontWeight: 700 }}>Profile Dashboard</span>
          </nav>

          {/* Main Auth Required Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 36px rgba(0, 56, 94, 0.08)',
            padding: '48px 36px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top Accent Gradient Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #00385E 0%, #0284c7 50%, #38bdf8 100%)'
            }} />

            {/* Glowing Icon Container */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px auto',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0, 56, 94, 0.08) 0%, rgba(14, 165, 233, 0.15) 100%)',
              border: '2px solid rgba(0, 56, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00385E',
              boxShadow: '0 10px 25px rgba(0, 56, 94, 0.1)'
            }}>
              <Lock size={36} strokeWidth={2.2} />
            </div>

            {/* Pill Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: '#fee2e2',
              color: '#dc2626',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}>
              <AlertCircle size={14} />
              <span>Authentication Required</span>
            </div>

            {/* Headline */}
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#00385E',
              margin: '0 0 12px 0',
              lineHeight: 1.25,
              letterSpacing: '-0.02em'
            }}>
              Please Sign In to Access Your Dashboard
            </h2>

            {/* Description */}
            <p style={{
              fontSize: '0.98rem',
              color: '#64748b',
              lineHeight: 1.6,
              maxWidth: '540px',
              margin: '0 auto 28px auto'
            }}>
              You are trying to access a protected learner portal. Please sign in with your employee / student account to view your enrolled courses, assessment progress, and certificates.
            </p>

            {/* Features Benefit Box */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <h4 style={{
                margin: '0 0 14px 0',
                fontSize: '0.88rem',
                fontWeight: 800,
                color: '#0f172a',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                With your account, you can:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <BookOpen size={16} />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                    Track your active microcredential enrollments and watch progress
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: '#f0fdf4',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileText size={16} />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                    View quiz attempt histories, scores, and answer breakdowns
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Award size={16} />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                    Earn and download verified accredited course certificates
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap'
            }}>
              <button
                type="button"
                onClick={() => {
                  if (onLogin) onLogin();
                  else if (onNavigate) onNavigate('login');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00385E 0%, #005a96 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(0, 56, 94, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                <LogIn size={18} />
                <span>Sign In / Log In</span>
              </button>

              <button
                type="button"
                onClick={onExploreCatalog}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 26px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <BookOpen size={16} />
                <span>Browse Courses</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-page-container">

        {/* ========================================================
            HERO PROFILE CARD (MATCHING SCREENSHOT 1 & 2 HEADER)
            ======================================================== */}
        <div 
          className="profile-hero-card-ss"
          style={{
            backgroundImage: `url(${profileBgImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="profile-hero-content-ss">
            {/* Left: User Identity */}
            <div className="profile-hero-left-col">
              <div className="profile-avatar-ss-wrap">
                <img
                  src={user?.avatar || user?.profileImage || staticAvatarImg}
                  alt={user?.name || 'Leesa Mehra'}
                  className="profile-avatar-ss-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = staticAvatarImg;
                  }}
                />
                <button type="button" className="profile-avatar-camera-btn" title="Update Profile Photo">
                  <Camera size={13} />
                </button>
              </div>

              <div className="profile-user-info-ss">
                <div className="profile-user-name-row-ss">
                  <h1 className="profile-user-name-ss">{user?.name || 'Leesa Mehra'}</h1>
                  <span className="active-learner-badge-ss">ACTIVE LEARNER</span>
                </div>

                <div className="profile-meta-chips-row-ss">
                  <span className="user-pill-chip-ss">
                    <GraduationCap size={14} color="#0284c7" />
                    <span>{user?.role || 'Student Learner'}</span>
                  </span>
                  <span className="user-pill-chip-ss">
                    <Building2 size={13} color="#64748b" />
                    <span>{user?.company || 'IgnitoVerse Enterprise'}</span>
                  </span>
                </div>

                <div className="user-quote-line-ss">
                  <span>"Learning today, leading tomorrow."</span>
                  <button type="button" className="quote-edit-btn" title="Edit Motto">
                    <Pencil size={11} />
                  </button>
                </div>
              </div>
            </div>

            <div className="hero-vertical-divider" />

            {/* Right: 4 Stat KPI Cards */}
            <div className="profile-hero-stats-grid-ss">
              <div className="hero-stat-card-ss" onClick={() => setActiveTab('courses')}>
                <div className="stat-icon-square blue">
                  <BookOpen size={18} />
                </div>
                <div className="stat-text-col-ss">
                  <span className="stat-big-num-ss">{baseCourses.length}</span>
                  <span className="stat-sub-label-ss">Enrolled Courses</span>
                </div>
              </div>

              <div className="hero-stat-card-ss" onClick={() => setActiveTab('quiz')}>
                <div className="stat-icon-square amber">
                  <Award size={18} />
                </div>
                <div className="stat-text-col-ss">
                  <span className="stat-big-num-ss">{filteredQuizList.length}</span>
                  <span className="stat-sub-label-ss">Assessments</span>
                </div>
              </div>

              <div className="hero-stat-card-ss" onClick={() => setActiveTab('calendar')}>
                <div className="stat-icon-square green">
                  <Calendar size={18} />
                </div>
                <div className="stat-text-col-ss">
                  <span className="stat-big-num-ss">{calendarEventsCount}</span>
                  <span className="stat-sub-label-ss">Calendar Events</span>
                </div>
              </div>

              <div className="hero-stat-card-ss">
                <div className="stat-icon-square purple">
                  <BarChart2 size={18} />
                </div>
                <div className="stat-text-col-ss">
                  <span className="stat-big-num-ss">{overallProgress}%</span>
                  <span className="stat-sub-label-ss">Overall Progress</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            TOP TAB NAVIGATION BAR (MATCHING SCREENSHOT 1 & 2)
            ======================================================== */}
        <div className="profile-ss-tabs-bar">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`profile-ss-tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            <span>Courses in Progress</span>
            <span className="ss-tab-pill-badge">{baseCourses.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`profile-ss-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          >
            <Award size={16} />
            <span>Microcredential Quizzes</span>
            <span className="ss-tab-pill-badge">{filteredQuizList.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`profile-ss-tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          >
            <Calendar size={16} />
            <span>Calendar & Schedule</span>
            <span className="ss-tab-pill-badge">{calendarEventsCount}</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: COURSES IN PROGRESS (SCREENSHOT 2)
            ======================================================== */}
        {activeTab === 'courses' && (
          <div className="profile-ss-content-card">
            {/* Header Line */}
            <div className="profile-ss-header-row">
              <div className="profile-ss-title-group">
                <div className="header-icon-square blue">
                  <BookOpen size={22} />
                </div>
                <div className="header-text-block">
                  <h2 className="header-title-ss">Courses in Progress</h2>
                  <p className="header-sub-ss">Continue your learning journey and complete your enrolled courses</p>
                </div>
              </div>

              <div className="profile-ss-toolbar-right">
                <div className="ss-search-box-wrap">
                  <Search size={15} className="ss-search-icon-inside" />
                  <input
                    type="text"
                    className="ss-search-input-field"
                    placeholder="Search courses..."
                    value={courseSearchQuery}
                    onChange={(e) => setCourseSearchQuery(e.target.value)}
                  />
                </div>

                <button type="button" className="ss-filter-dropdown-btn">
                  <Filter size={14} />
                  <span>All Courses</span>
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {/* Courses Horizontal List Stack */}
            <div className="ss-courses-list-stack">
              {loadingCourses ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#00385E' }}>
                  <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px auto', display: 'block' }} />
                  <p style={{ fontWeight: 600, margin: 0, color: '#64748b', fontSize: '0.92rem' }}>Loading enrolled courses...</p>
                </div>
              ) : displayedCoursesList.length === 0 ? (
                <div className="ss-courses-empty-state" style={{
                  textAlign: 'center',
                  padding: '3.5rem 1.5rem',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px dashed #cbd5e1',
                  margin: '1rem 0'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#f0f9ff',
                    color: '#00385E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto'
                  }}>
                    <BookOpen size={30} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                    No course found
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                    {courseSearchQuery
                      ? `No enrolled courses match "${courseSearchQuery}".`
                      : 'You have not enrolled in or purchased any microcredential courses yet.'}
                  </p>
                  {courseSearchQuery ? (
                    <button
                      type="button"
                      onClick={() => setCourseSearchQuery('')}
                      style={{
                        padding: '9px 18px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0f172a',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Clear Search
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onExploreCatalog ? onExploreCatalog() : (onNavigate && onNavigate('microcredentials'))}
                      style={{
                        padding: '10px 22px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#00385E',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(0, 56, 94, 0.18)'
                      }}
                    >
                      <BookOpen size={16} />
                      <span>Explore Courses</span>
                    </button>
                  )}
                </div>
              ) : (
                displayedCoursesList.map((course) => {
                  const title = course.microcredentialCourseName || course.title || 'Microcredential Course';
                  const courseId = course.microcredentialCourseId || course.id;
                  const rawImg = course.microcredentialCourseIntroImage || course.introImage || course.thumbnail || '';
                  const thumb = rawImg ? formatImageUrl(rawImg) : '';
                  const progressPct = course.progressPercentage ?? course.progress ?? 0;
                  const duration = course.microcredentialCourseDuration || '';
                  const modules = course.totalModules ? `${course.totalModules} Modules` : duration;
                  const level = course.courseLevel || course.level || '';
                  const desc = course.description || course.courseDescription || course.streamName || '';

                  return (
                    <div key={courseId} className="ss-horizontal-course-card">
                      {/* Left Thumbnail & Info */}
                      <div className="ss-course-left-part">
                        <div className="ss-course-thumb-box">
                          {thumb ? (
                            <img src={thumb} alt={title} className="ss-course-thumb-img" />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#f1f5f9',
                              color: '#00385E'
                            }}>
                              <BookOpen size={28} />
                            </div>
                          )}
                        </div>

                        <div className="ss-course-info-col">
                          <span className="ss-course-status-pill">{course.courseStatus || 'IN PROGRESS'}</span>
                          <h3 className="ss-course-title">{title}</h3>
                          {desc && <p className="ss-course-description">{desc}</p>}
                          <div className="ss-course-meta-bottom">
                            {modules && (
                              <span className="ss-meta-item">
                                <Clock size={13} /> {modules}
                              </span>
                            )}
                            {level && (
                              <span className="ss-meta-item">
                                <BarChart2 size={13} /> {level}
                              </span>
                            )}
                            {course.streamName && (
                              <span className="ss-meta-item">
                                <Sparkles size={13} /> {course.streamName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right CTA */}
                      <div className="ss-course-action-part">
                        <button
                          type="button"
                          className="btn-ss-continue"
                          onClick={() => onViewCourse({
                            id: courseId,
                            microcredentialCourseId: courseId,
                            encryptedMicrocredentialCourseId: course.encryptedMicrocredentialCourseId || '',
                            title: title,
                            name: title,
                            thumbnail: thumb,
                            category: course.streamName || 'Microcredentials',
                            level: level,
                            duration: duration || 'Self-paced',
                            ...course
                          })}
                        >
                          <span>Continue Learning</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Pagination */}
            {displayedCoursesList.length > 0 && (
              <div className="ss-footer-pagination">
                <span className="ss-footer-count-text">
                  Showing 1 to {displayedCoursesList.length} of {displayedCoursesList.length} courses
                </span>

                <div className="ss-page-nav-controls">
                  <button type="button" className="btn-ss-page-nav" disabled aria-label="Previous Page">
                    <ChevronLeft size={15} />
                  </button>
                  <span className="ss-page-pill-current">1</span>
                  <button type="button" className="btn-ss-page-nav" disabled aria-label="Next Page">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: MICROCREDENTIAL QUIZ ASSESSMENTS (SCREENSHOT 1)
            ======================================================== */}
        {activeTab === 'quiz' && (
          <div className="profile-ss-content-card">
            {/* Header Line */}
            <div className="profile-ss-header-row">
              <div className="profile-ss-title-group">
                <div className="header-icon-square yellow">
                  <Award size={22} />
                </div>
                <div className="header-text-block">
                  <h2 className="header-title-ss">Microcredential Quiz Assessments</h2>
                  <p className="header-sub-ss">Review certification test attempts, evaluations, and scorecards</p>
                </div>
              </div>

              <div className="profile-ss-toolbar-right">
                <div className="ss-search-box-wrap">
                  <Search size={15} className="ss-search-icon-inside" />
                  <input
                    type="text"
                    className="ss-search-input-field"
                    placeholder="Search quizzes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Master Table Box */}
            <div className="ss-quiz-master-box">
              <div className="ss-quiz-master-header-row">
                <div>QUIZ TITLE</div>
                <div>QUIZ INFO</div>
                <div style={{ textAlign: 'right' }}>VIEW ATTEMPT LIST</div>
              </div>

              {loadingQuizzes ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#00385E' }}>
                  <RefreshCw size={22} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px auto', display: 'block' }} />
                  <p style={{ margin: 0, fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>Loading quiz assessments...</p>
                </div>
              ) : filteredQuizList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748b' }}>
                  <Award size={36} style={{ color: '#d97706', margin: '0 auto 12px auto', display: 'block' }} />
                  <h4 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '6px', fontSize: '1.05rem' }}>
                    No quiz assessments found
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                    {searchQuery
                      ? `No quiz assessments match "${searchQuery}".`
                      : 'You have not attempted any microcredential quiz assessments yet.'}
                  </p>
                </div>
              ) : (
                filteredQuizList.map((quiz, idx) => {
                const qId = quiz.quizId || quiz.id || idx;
                const isExpanded = expandedQuizId === qId;
                const attempts = attemptsByQuiz[qId] || quiz.attempts || [];

                return (
                  <React.Fragment key={qId}>
                    <div className="ss-quiz-item-row">
                      <div className="ss-quiz-title-col">
                        <span className="ss-dot-bullet" />
                        <div>
                          <div className="ss-quiz-heading">{quiz.quizName}</div>
                          {quiz.moduleName && (
                            <div style={{ fontSize: '0.78rem', color: '#00385E', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>📌</span> {quiz.moduleName}
                            </div>
                          )}
                          <div className="ss-quiz-last-attempt">
                            Last Attempt: {quiz.lastAttemptDate || '10 Sep 2026, 06:03 PM'}
                          </div>
                        </div>
                      </div>

                      <div className="ss-quiz-info-col">
                        <span className="ss-stream-chip">
                          {quiz.microcredentialCourseName || quiz.streamName || 'MICROCREDENTIAL'}
                        </span>
                        <span className="ss-attempts-count-sub">
                          {quiz.totalAttempt || attempts.length || 1} Attempts
                        </span>
                      </div>

                      <div className="ss-quiz-action-col">
                        <button
                          type="button"
                          className="btn-ss-view-attempts"
                          onClick={() => handleToggleViewList(qId, quiz.totalAttempt || 1)}
                        >
                          <Eye size={13} />
                          <span>{isExpanded ? 'Hide List' : 'View List'}</span>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="ss-attempts-expanded-table-wrap">
                        <table className="ss-attempts-table">
                          <thead>
                            <tr>
                              <th>ATTEMPT NO.</th>
                              <th>SCORE</th>
                              <th>TOTAL POINTS</th>
                              <th>PERCENTAGE</th>
                              <th>TOTAL QUESTION</th>
                              <th>CORRECT QUESTION</th>
                              <th>WRONG QUESTION</th>
                              <th>SKIPPED QUESTION</th>
                              <th>GRADE</th>
                              <th>VIEW</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attempts.map((att, attIdx) => (
                              <tr key={att.attemptId || attIdx}>
                                <td>{att.attemptNumber || att.attemptNo || attIdx + 1}</td>
                                <td className="color-purple">{att.score ?? 1}</td>
                                <td>{att.totalMarks ?? 20}</td>
                                <td>{att.percentage ?? 5}%</td>
                                <td>{att.totalQuestions ?? 20}</td>
                                <td className="color-green">{att.correctCount ?? 1}</td>
                                <td className="color-red">{att.wrongCount ?? 3}</td>
                                <td className="color-amber">{att.skippedCount ?? 16}</td>
                                <td><strong>{att.grade || 'F'}</strong></td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn-ss-doc-view"
                                    title="View detailed results"
                                    onClick={() => handleOpenResultModal(qId, att.attemptId || att.attemptNumber || 1)}
                                  >
                                    <FileText size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </React.Fragment>
                );
              }))}
            </div>

            {/* Footer Pagination */}
            {filteredQuizList.length > 0 && (
              <div className="ss-footer-pagination">
                <span className="ss-footer-count-text">
                  Page 1 of 1 ({filteredQuizList.length} quiz{filteredQuizList.length !== 1 ? 'zes' : ''})
                </span>

                <div className="ss-page-nav-controls">
                  <button type="button" className="btn-ss-page-nav" disabled aria-label="Previous Page">
                    <ChevronLeft size={15} />
                  </button>
                  <button type="button" className="btn-ss-page-nav" disabled aria-label="Next Page">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: STUDENT CALENDAR & SCHEDULE
            ======================================================== */}
        {activeTab === 'calendar' && (
          <div className="profile-ss-content-card">
            <div className="profile-ss-header-row">
              <div className="profile-ss-title-group">
                <div className="header-icon-square navy">
                  <Calendar size={22} />
                </div>
                <div className="header-text-block">
                  <h2 className="header-title-ss">Academic Calendar & Events Schedule</h2>
                  <p className="header-sub-ss">
                    View upcoming Google Meets, Zoom workshops, lectures, and executive sessions
                  </p>
                </div>
              </div>
            </div>

            <StudentCalendar
              user={user}
              enrolledCourses={apiEnrolledCourses}
              onEventsCountChange={(count) => setCalendarEventsCount(count)}
            />
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* RESULT MODAL DIALOG (SCREENSHOT 3)                                       */}
      {/* ========================================================================= */}
      {isResultModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            maxWidth: '850px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 24px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a'
                }}>
                  <FileText size={18} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Quiz Attempt Results
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCloseResultModal}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {loadingResultDetail ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    border: '3px solid #00385E',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    margin: '0 auto 12px auto',
                    animation: 'spin 0.8s linear infinite'
                  }}></div>
                  <p style={{ margin: 0, fontWeight: 600 }}>Loading attempt scorecard & review...</p>
                </div>
              ) : resultDetailError ? (
                <div style={{
                  padding: '16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  color: '#b91c1c',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  {resultDetailError}
                </div>
              ) : resultDetail ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Top Score & Stats Container (Screenshot 3) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    alignItems: 'start'
                  }}>
                    {/* Left Column: Big Scorecard & 3 KPI Boxes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {/* Score Card with Red Left Border Accent */}
                      <div style={{
                        padding: '20px',
                        borderRadius: '16px',
                        background: '#ffffff',
                        border: '1px solid #f1f5f9',
                        borderLeft: '4px solid #00385E',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                      }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          SCORE
                        </span>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                          {resultDetail.percentage ?? 0}%
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', marginBottom: '6px' }}>
                          Grade : {resultDetail.grade || 'F'}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                          You scored {resultDetail.correctQuestionsCount ?? 0} out of {resultDetail.totalQuestions ?? 10} questions correctly
                        </p>
                      </div>

                      {/* 3 KPI Boxes: Correct, Wrong, Skipped */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {/* Correct */}
                        <div style={{
                          padding: '12px 8px',
                          borderRadius: '12px',
                          border: '1px solid #bbf7d0',
                          background: '#ffffff',
                          textAlign: 'center'
                        }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                            {resultDetail.correctQuestionsCount ?? 0}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Correct</span>
                        </div>

                        {/* Wrong */}
                        <div style={{
                          padding: '12px 8px',
                          borderRadius: '12px',
                          border: '1px solid #fecaca',
                          background: '#ffffff',
                          textAlign: 'center'
                        }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                            <X size={12} strokeWidth={3} />
                          </div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                            {resultDetail.wrongAnswers ?? 0}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Wrong</span>
                        </div>

                        {/* Skipped */}
                        <div style={{
                          padding: '12px 8px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          background: '#ffffff',
                          textAlign: 'center'
                        }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                            <Minus size={12} strokeWidth={3} />
                          </div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                            {resultDetail.skippedQuestions ?? 0}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Skipped</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Horizontal Percentage Progress Bars */}
                    <div style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: '#ffffff',
                      border: '1px solid #f1f5f9',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      justifyContent: 'center'
                    }}>
                      {/* Correct Progress */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                          <span>Correct</span>
                          <span>{resultDetail.totalQuestions > 0 ? (((resultDetail.correctQuestionsCount || 0) / resultDetail.totalQuestions) * 100).toFixed(1) : '0.0'}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${resultDetail.totalQuestions > 0 ? ((resultDetail.correctQuestionsCount || 0) / resultDetail.totalQuestions) * 100 : 0}%`,
                            height: '100%',
                            background: '#16a34a',
                            borderRadius: '999px'
                          }}></div>
                        </div>
                      </div>

                      {/* Wrong Progress */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                          <span>Wrong</span>
                          <span>{resultDetail.totalQuestions > 0 ? (((resultDetail.wrongAnswers || 0) / resultDetail.totalQuestions) * 100).toFixed(1) : '40.0'}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${resultDetail.totalQuestions > 0 ? ((resultDetail.wrongAnswers || 0) / resultDetail.totalQuestions) * 100 : 40}%`,
                            height: '100%',
                            background: '#f87171',
                            borderRadius: '999px'
                          }}></div>
                        </div>
                      </div>

                      {/* Skipped Progress */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                          <span>Skipped</span>
                          <span>{resultDetail.totalQuestions > 0 ? (((resultDetail.skippedQuestions || 0) / resultDetail.totalQuestions) * 100).toFixed(1) : '60.0'}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${resultDetail.totalQuestions > 0 ? ((resultDetail.skippedQuestions || 0) / resultDetail.totalQuestions) * 100 : 60}%`,
                            height: '100%',
                            background: '#94a3b8',
                            borderRadius: '999px'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question Review Section (Screenshot 3) */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ width: '6px', height: '16px', background: '#00385E', borderRadius: '4px' }}></div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        Question Review
                      </h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {resultDetail.questions && resultDetail.questions.length > 0 ? (
                        resultDetail.questions.map((q, idx) => {
                          const isCorrect = q.isStudentCorrect;
                          const pointsAwarded = q.studentPointsAwarded ?? 0;
                          const maxPoints = q.points || 1;

                          // Find options associated with this question
                          const questionOpts = resultDetail.answerOptions?.filter(o => o.questionId === q.questionsId) || [];

                          return (
                            <div
                              key={q.questionsId || idx}
                              style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: '16px',
                                padding: '18px 20px',
                                background: '#ffffff'
                              }}
                            >
                              {/* Question Title & Points Pill */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#b91c1c' }}>
                                  Question {idx + 1}
                                </span>
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  padding: '2px 10px',
                                  borderRadius: '999px',
                                  background: '#fee2e2',
                                  color: '#b91c1c'
                                }}>
                                  {pointsAwarded}/{maxPoints}
                                </span>
                              </div>

                              {/* Question Prompt */}
                              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', margin: '0 0 14px 0', lineHeight: 1.5 }}
                                dangerouslySetInnerHTML={{ __html: q.questionText || q.title }}
                              />

                              {/* Answer Options Radio List (Screenshot 3) */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {questionOpts.length > 0 ? (
                                  questionOpts.map((opt, optIdx) => {
                                    const isCorrectOpt = opt.isCorrect;
                                    const isStudentSelected = opt.isStudentSelected || (q.studentSelectedOptions && String(q.studentSelectedOptions).split(',').includes(String(opt.answerId)));

                                    return (
                                      <div
                                        key={opt.answerId || optIdx}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '10px',
                                          padding: '10px 14px',
                                          borderRadius: '10px',
                                          border: isCorrectOpt ? '1px dashed #16a34a' : '1px solid #f1f5f9',
                                          background: isCorrectOpt ? '#f0fdf4' : isStudentSelected ? '#fef2f2' : '#ffffff',
                                          fontSize: '0.85rem',
                                          color: isCorrectOpt ? '#15803d' : '#334155'
                                        }}
                                      >
                                        {/* Dot Indicator */}
                                        <div style={{
                                          width: '14px',
                                          height: '14px',
                                          borderRadius: '50%',
                                          border: isStudentSelected ? '4px solid #b91c1c' : '1.5px solid #cbd5e1',
                                          background: isStudentSelected ? '#b91c1c' : '#ffffff',
                                          flexShrink: 0
                                        }}></div>

                                        {/* Option Text */}
                                        <span style={{ fontWeight: isCorrectOpt || isStudentSelected ? 700 : 500, flex: 1 }}>
                                          {optIdx + 1}. {stripHtml(opt.text) || opt.text}
                                        </span>

                                        {/* Correct Answer Badge */}
                                        {isCorrectOpt && (
                                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <Check size={12} strokeWidth={3} /> Correct Answer
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                    {q.correctAnswerData ? `Correct Answer: ${q.correctAnswerData}` : 'No detailed options recorded.'}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No question evaluations returned for this attempt.</p>
                      )}
                    </div>
                  </div>

                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
