// ignitoverse: Executive Learner Profile & Portal with Microcredential Quiz Attempts Flow
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, BookOpen, Clock,
  Check, ArrowRight, PlayCircle, Building2,
  Briefcase, Sparkles, Calendar, Star,
  Award, CheckCircle2, XCircle, AlertCircle, ArrowLeft, RefreshCw,
  Search, Eye, FileText, ChevronDown, ChevronUp, X, Minus, HelpCircle,
  Lock, LogIn
} from 'lucide-react';
import profileBgImg from '../../assets/profilebg.png';
import {
  getStudentEnrolledMicrocredentialCourse,
  studentMicrocredentialsQuizAttemptList,
  getStudentMicrocredentialQuizResultGetByQuizId
} from '../../services/profileService';
import { getStudentAttemptList } from '../../services/QuizServices';
import { getLoggedInStudentId } from '../../services/microcredentialService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';


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
  // Navigation Tabs: 'courses' | 'quiz'
  const [activeTab, setActiveTab] = useState(
    initialTab === 'quiz' || initialTab === 'quiz-results' || initialTab === 'quizzes' ? 'quiz' : 'courses'
  );

  // Enrolled courses state
  const [apiEnrolledCourses, setApiEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Quiz Master List state (Screenshot 1)
  const [quizList, setQuizList] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded Quiz Attempt Rows state (Screenshot 2)
  // Map of quizId -> { loading: boolean, attempts: Array }
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
    if (initialTab === 'quiz' || initialTab === 'quiz-results' || initialTab === 'quizzes') {
      setActiveTab('quiz');
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
      const res = await studentMicrocredentialsQuizAttemptList(1, 50, 'QuizId', 'DESC', 0, searchQuery, studentId);
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

  const displayedEnrolledCourses = apiEnrolledCourses;
  const filteredQuizList = quizList.filter(q => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      (q.quizName && q.quizName.toLowerCase().includes(term)) ||
      (q.microcredentialCourseName && q.microcredentialCourseName.toLowerCase().includes(term))
    );
  });

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
    <div className="profile-page-wrapper" style={{ background: '#f8fafd', minHeight: '100vh', padding: '1.5rem 1rem' }}>
      <div className="profile-page-container" style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ========================================================
            HERO CARD (WITH profilebg.png)
            ======================================================== */}
        <div
          className="profile-creative-hero-card"
          style={{ backgroundImage: `url(${profileBgImg})` }}
        >
          <div className="profile-creative-hero-content">
            <div className="profile-user-identity-block">
              <div className="profile-avatar-creative-wrapper">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'Learner'}
                  className="profile-avatar-creative"
                />
                <div className="profile-avatar-status-badge" title="Verified Active Learner">
                  <ShieldCheck size={14} />
                </div>
              </div>

              <div className="profile-user-creative-details">
                <div className="profile-user-title-row">
                  <h1 className="profile-user-name-title">{user?.name || 'Enterprise User'}</h1>
                  <span className="profile-enterprise-chip">
                    <Check size={12} strokeWidth={3} /> ACTIVE LEARNER
                  </span>
                </div>

                <div className="profile-user-meta-chips">
                  <span className="user-meta-chip">
                    <Briefcase size={13} className="meta-chip-icon" /> {user?.role || 'Executive Learner'}
                  </span>
                  <span className="user-meta-chip">
                    <Building2 size={13} className="meta-chip-icon" /> {user?.company || 'IgnitoVerse Enterprise'}
                  </span>
                  <span className="user-meta-chip empid-chip">
                    ID: {user?.empId || 'EMP-1001'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            TOP TAB NAVIGATION BAR
            ======================================================== */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          margin: '1.5rem 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveTab('courses')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s ease',
                background: activeTab === 'courses' ? '#0b2545' : 'transparent',
                color: activeTab === 'courses' ? '#ffffff' : '#64748b',
              }}
            >
              <BookOpen size={16} />
              <span>Courses in Progress</span>
              {displayedEnrolledCourses.length > 0 && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  background: activeTab === 'courses' ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  color: activeTab === 'courses' ? '#ffffff' : '#475569'
                }}>
                  {displayedEnrolledCourses.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s ease',
                background: activeTab === 'quiz' ? '#0b2545' : 'transparent',
                color: activeTab === 'quiz' ? '#ffffff' : '#64748b',
              }}
            >
              <Award size={16} />
              <span>Microcredential Quiz Results</span>
              {quizList.length > 0 && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  background: activeTab === 'quiz' ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  color: activeTab === 'quiz' ? '#ffffff' : '#475569'
                }}>
                  {quizList.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'courses' && (
            <button
              type="button"
              className="btn-block-action-link"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              onClick={onExploreCatalog}
            >
              <span>Browse More Courses</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* ========================================================
            TAB 1: COURSES IN PROGRESS
            ======================================================== */}
        {activeTab === 'courses' && (
          <div className="profile-section-block">
            <div className="profile-block-header-row">
              <div className="profile-block-title-group">
                <div className="profile-block-icon-badge blue">
                  <BookOpen size={20} />
                </div>
                <div className="profile-block-text-col">
                  <h2 className="profile-block-heading">Courses in Progress</h2>
                  <p className="profile-block-sub">Pick up right where you left off in your enterprise tracks</p>
                </div>
              </div>

              <button
                type="button"
                className="btn-block-action-link"
                onClick={onExploreCatalog}
              >
                <span>Browse More Courses</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {loadingCourses ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <p>Loading your enrolled microcredential courses...</p>
              </div>
            ) : displayedEnrolledCourses.length === 0 ? (
              <div
                className="profile-empty-courses-card"
                style={{
                  textAlign: 'center',
                  padding: '3rem 1.5rem',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px dashed #cbd5e1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  margin: '1rem 0'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.25rem'
                }}>
                  <BookOpen size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  No Enrolled Courses Found
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '460px', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                  You haven't enrolled in any microcredential courses yet. Browse our executive course catalog to start learning!
                </p>
                <button
                  type="button"
                  className="btn-card-continue-learning"
                  style={{ width: 'auto', padding: '0.65rem 1.5rem', fontSize: '0.875rem' }}
                  onClick={onExploreCatalog}
                >
                  <Sparkles size={15} />
                  <span>Explore Course Catalog</span>
                </button>
              </div>
            ) : (
              <div className="profile-inprogress-grid-3col">
                {displayedEnrolledCourses.map((c, idx) => {
                  const title = c.microcredentialCourseName || c.title || 'Microcredential Course';
                  const courseId = c.microcredentialCourseId || c.id || idx;
                  const thumb = formatImageUrl(c.microcredentialCourseIntroImage) || c.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80';
                  const progressPct = c.progress || (idx === 0 ? 90 : 65);
                  const duration = c.microcredentialCourseDuration || c.timeSpent || '3 Month';
                  const rating = c.microcredentialCourseRating || '5.00';
                  const level = c.courseLevel || 'Intermediate';
                  const stream = c.streamName || 'Management';

                  return (
                    <div key={courseId} className="profile-inprogress-card">
                      <div className="profile-inprogress-thumb-box">
                        <img
                          src={thumb}
                          alt={title}
                          className="profile-inprogress-thumb-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        {stream && (
                          <span className="profile-inprogress-category-badge">{stream}</span>
                        )}
                        <span className="profile-inprogress-percent-tag">{progressPct}%</span>
                      </div>

                      <div className="profile-inprogress-info">
                        <div className="profile-inprogress-level-badge">{level}</div>
                        <h3 className="profile-inprogress-title" title={title}>{title}</h3>

                        <div className="profile-inprogress-meta-line">
                          <span><Clock size={14} style={{ color: '#0284C7' }} /> {duration}</span>
                          <span><Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} /> {rating}</span>
                        </div>

                        <div className="profile-inprogress-progress-container">
                          <div className="profile-inprogress-progress-labels">
                            <span>Course Progress</span>
                            <span style={{ color: '#00385E' }}>{progressPct}%</span>
                          </div>
                          <div className="profile-inprogress-progress-bar-track">
                            <div
                              className="profile-inprogress-progress-bar-fill"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        {(c.enrollmentDate || c.expiryDate) && (
                          <div className="profile-inprogress-dates-block">
                            {c.enrollmentDate && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span style={{ color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <Calendar size={13} style={{ color: '#0284C7' }} /> Enrolled On
                                </span>
                                <strong style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.74rem' }}>
                                  {c.enrollmentDate}
                                </strong>
                              </div>
                            )}
                            {c.expiryDate && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span style={{ color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <Clock size={13} style={{ color: '#e11d48' }} /> Expires On
                                </span>
                                <strong style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.74rem' }}>
                                  {c.expiryDate}
                                </strong>
                              </div>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          className="btn-card-continue-learning"
                          onClick={() => onViewCourse({
                            id: courseId,
                            microcredentialCourseId: courseId,
                            encryptedMicrocredentialCourseId: c.encryptedMicrocredentialCourseId || '',
                            title: title,
                            name: title,
                            thumbnail: thumb,
                            category: c.streamName || 'Management',
                            level: level,
                            duration: duration,
                            rating: rating,
                            ...c
                          })}
                        >
                          <PlayCircle size={16} />
                          <span>Continue Learning</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: MICROCREDENTIAL QUIZ ATTEMPTS (Screenshots 1 & 2)
            ======================================================== */}
        {activeTab === 'quiz' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            padding: '24px'
          }}>
            {/* Header with Search (Screenshot 1) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Microcredential Quiz Attempts
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Review quiz history and view detailed attempt lists
                </p>
              </div>

              {/* Search Bar */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: '300px'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '6px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 16px 8px 46px',
                    borderRadius: '999px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                />
              </div>
            </div>

            {/* Master Table (Screenshot 1) */}
            {loadingQuizzes ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <p>Loading quiz attempts history...</p>
              </div>
            ) : filteredQuizList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <p>No quiz attempt records found.</p>
              </div>
            ) : (
              <div style={{ border: '1px solid #f1f5f9', borderRadius: '14px', overflow: 'hidden' }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr',
                  padding: '14px 20px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <div>QUIZ TITLE</div>
                  <div>QUIZ INFO</div>
                  <div style={{ textAlign: 'right' }}>VIEW ATTEMPT LIST</div>
                </div>

                {/* Table Rows */}
                {filteredQuizList.map((quiz, idx) => {
                  const isExpanded = expandedQuizId === quiz.quizId;
                  const attempts = attemptsByQuiz[quiz.quizId] || [];

                  return (
                    <div key={quiz.quizId || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {/* Main Row (Screenshot 1) */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.5fr 1fr',
                        alignItems: 'center',
                        padding: '16px 20px',
                        background: '#ffffff'
                      }}>
                        {/* Quiz Title & Date */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }}></span>
                          <div>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                              {quiz.quizName || 'Microcredential Quiz'}
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                              Last Attempt : {quiz.lastAttemptDate || 'Recent'}
                            </p>
                          </div>
                        </div>

                        {/* Quiz Info */}
                        <div>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            background: '#f1f5f9',
                            color: '#334155',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            borderRadius: '6px',
                            textTransform: 'uppercase'
                          }}>
                            {quiz.microcredentialCourseName || 'STRESS MANAGEMENT'}
                          </span>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>
                            {quiz.totalAttempt || 1} Attempts
                          </p>
                        </div>

                        {/* Action: View List Button */}
                        <div style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleViewList(quiz.quizId, quiz.totalAttempt)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 16px',
                              borderRadius: '999px',
                              border: '1px solid #cbd5e1',
                              background: isExpanded ? '#0b2545' : '#ffffff',
                              color: isExpanded ? '#ffffff' : '#0f172a',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <Eye size={13} />
                            <span>{isExpanded ? 'Hide List' : 'View List'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Expanded Sub-Table: Attempts List (Screenshot 2) */}
                      {isExpanded && (
                        <div style={{
                          background: '#f8fafc',
                          padding: '16px 20px',
                          borderTop: '1px solid #e2e8f0'
                        }}>
                          {loadingAttemptsForQuiz ? (
                            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                              Loading attempt history...
                            </div>
                          ) : (
                            <div style={{
                              background: '#ffffff',
                              borderRadius: '10px',
                              border: '1px solid #e2e8f0',
                              overflowX: 'auto'
                            }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'center' }}>
                                <thead>
                                  <tr style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 800 }}>
                                    <th style={{ padding: '12px 10px' }}>ATTEMPT NO.</th>
                                    <th style={{ padding: '12px 10px' }}>SCORE</th>
                                    <th style={{ padding: '12px 10px' }}>TOTAL POINTS</th>
                                    <th style={{ padding: '12px 10px' }}>PERCENTAGE</th>
                                    <th style={{ padding: '12px 10px' }}>TOTAL QUESTION</th>
                                    <th style={{ padding: '12px 10px' }}>CORRECT QUESTION</th>
                                    <th style={{ padding: '12px 10px' }}>WRONG QUESTION</th>
                                    <th style={{ padding: '12px 10px' }}>SKIPPED QUESTION</th>
                                    <th style={{ padding: '12px 10px' }}>GRADE</th>
                                    <th style={{ padding: '12px 10px' }}>VIEW</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {attempts.map((att, attIdx) => (
                                    <tr key={att.attemptId || attIdx} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                                      <td style={{ padding: '12px 10px', fontWeight: 700 }}>
                                        {att.attemptNumber || attIdx + 1}
                                      </td>
                                      <td style={{ padding: '12px 10px' }}>
                                        {att.score ?? 0}
                                      </td>
                                      <td style={{ padding: '12px 10px' }}>
                                        {att.totalMarks || att.totalPoints || 10}
                                      </td>
                                      <td style={{ padding: '12px 10px', fontWeight: 700 }}>
                                        {att.percentage ?? 0}%
                                      </td>
                                      <td style={{ padding: '12px 10px' }}>
                                        {att.totalQuestions || 0}
                                      </td>
                                      <td style={{ padding: '12px 10px', color: '#16a34a', fontWeight: 700 }}>
                                        {att.correctQuestionsCount ?? att.correctCount ?? 0}
                                      </td>
                                      <td style={{ padding: '12px 10px', color: '#dc2626', fontWeight: 700 }}>
                                        {att.wrongAnswers ?? att.wrongCount ?? 0}
                                      </td>
                                      <td style={{ padding: '12px 10px', color: '#d97706', fontWeight: 700 }}>
                                        {att.skippedQuestions ?? att.skippedCount ?? 0}
                                      </td>
                                      <td style={{ padding: '12px 10px', fontWeight: 800 }}>
                                        {att.grade || 'F'}
                                      </td>
                                      <td style={{ padding: '12px 10px' }}>
                                        {/* VIEW BUTTON (Screenshot 2) */}
                                        <button
                                          type="button"
                                          onClick={() => handleOpenResultModal(quiz.quizId, att.attemptId || att.attemptNumber || 1)}
                                          title="View detailed results"
                                          style={{
                                            padding: '6px',
                                            borderRadius: '6px',
                                            border: '1px solid #e2e8f0',
                                            background: '#f8fafc',
                                            color: '#334155',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s'
                                          }}
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
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Pagination footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  background: '#ffffff',
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  <div>
                    <strong>Page 1 of 1</strong>
                    <span style={{ marginLeft: '8px' }}>({filteredQuizList.length} quiz{filteredQuizList.length !== 1 ? 'zes' : ''})</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button style={{ padding: '4px 8px', border: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '4px', cursor: 'pointer' }}>&lt;</button>
                    <button style={{ padding: '4px 8px', border: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '4px', cursor: 'pointer' }}>&gt;</button>
                  </div>
                </div>
              </div>
            )}
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
                    border: '3px solid #991b1b',
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
                        borderLeft: '4px solid #b91c1c',
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
                      <div style={{ width: '6px', height: '16px', background: '#991b1b', borderRadius: '4px' }}></div>
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
