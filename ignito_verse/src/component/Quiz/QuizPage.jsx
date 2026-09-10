// ignitoverse: Dedicated Assessment Quiz Flow Implementation
import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Bookmark,
  Lightbulb, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2, 
  RotateCcw, 
  Trophy,
  Award,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
  Play,
  X,
  FileCheck2,
  CheckSquare
} from 'lucide-react';
import { 
  checkStudentQuizAttemptStatus,
  getStudentAttemptList,
  getQuizPreviewData,
  getQuizAttemptById,
  saveQuestionAnswer,
  autoSaveQuizTimer,
  submitQuizFinal,
  markAllAttemptsAsDone,
  getQuizResultByQuizId,
  resolveStudentId,
  QUESTION_TYPES
} from '../../services/QuizServices';
import './quiz.css';

export default function QuizPage({
  course = null,
  onBack = () => {},
  onNavigate = () => {}
}) {
  // Course Information
  const currentCourse = course || {
    id: 1,
    microcredentialCourseId: 1,
    title: 'Microcredential Course Assessment',
    category: 'Assessment',
    streamName: 'Microcredentials'
  };

  const courseId = Number(
    currentCourse.microcredentialCourseId || 
    currentCourse.courseId || 
    currentCourse.id || 
    sessionStorage.getItem('MicrocredentialCourseId') || 
    localStorage.getItem('MicrocredentialCourseId') || 
    1
  );

  const courseTitle = currentCourse.title || currentCourse.microcredentialCourseName || 'Microcredential Course';
  
  // Page View Modes: 'loading' | 'attemptList' | 'quiz' | 'scoreSummary'
  const [viewMode, setViewMode] = useState('loading');
  const [error, setError] = useState(null);

  // Attempt History State (Step 2A)
  const [attemptList, setAttemptList] = useState([]);
  const [activeQuizId, setActiveQuizId] = useState(0);

  // Backend Quiz Metadata (Step 2B & 3)
  const [quizMetadata, setQuizMetadata] = useState({
    quizId: 0,
    attemptId: 0,
    quizName: 'Course Assessment',
    quizDescription: '',
    timeLimit: 120,
    attemptsAllowed: 10,
    remainingAttempts: 10,
    attemptsDone: 0,
    currentAttemptNumber: 1,
    allowHints: false,
    headerDescription: '',
    footerDescription: ''
  });

  // Questions and Active Quiz State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionIndex]: optionId / answerValue }
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmFinalAttempt, setShowConfirmFinalAttempt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scoreSummary, setScoreSummary] = useState(null);

  // Step 8: View Detailed Result Modal State
  const [viewResultModalOpen, setViewResultModalOpen] = useState(false);
  const [resultDetailLoading, setResultDetailLoading] = useState(false);
  const [resultDetailData, setResultDetailData] = useState(null);

  // Timer State
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(120 * 60);
  const [timeLeft, setTimeLeft] = useState(120 * 60);
  const timerRef = useRef(null);
  const periodicAutoSaveRef = useRef(null);

  // Option Letter Helper (A, B, C, D...)
  const getOptionLetter = (index) => String.fromCharCode(65 + (index % 26));

  // ==========================================================================
  // STEP 1 — PAGE LOAD: CHECK ATTEMPT STATUS
  // ==========================================================================
  const initializeQuizFlow = async () => {
    setViewMode('loading');
    setError(null);

    try {
      const studentId = resolveStudentId();
      
      // Step 1: Check Attempt Status
      const statusRes = await checkStudentQuizAttemptStatus(courseId, studentId, 2);

      if (statusRes && statusRes.isSuccess) {
        const quizId = statusRes.quizId || 0;
        setActiveQuizId(quizId);

        // Branching Condition:
        if (statusRes.isAttemptedFlag === 1) {
          // STEP 2A: Already Attempted -> Fetch Attempt List
          await loadAttemptList(quizId, studentId);
        } else {
          // STEP 2B: Not Attempted -> Load Quiz Preview Data & Resume/Start
          await startQuizExecution(courseId, studentId);
        }
      } else {
        // Fallback directly to loading quiz preview
        await startQuizExecution(courseId, studentId);
      }
    } catch (err) {
      console.error('Error in initializeQuizFlow:', err);
      setError('Failed to initialize quiz assessment. Please try again.');
      setViewMode('attemptList');
    }
  };

  useEffect(() => {
    initializeQuizFlow();
  }, [courseId]);

  // ==========================================================================
  // STEP 2A — FETCH ATTEMPT LIST
  // ==========================================================================
  const loadAttemptList = async (quizId, studentId) => {
    try {
      const listRes = await getStudentAttemptList(quizId, studentId);
      if (listRes && listRes.isSuccess) {
        setAttemptList(listRes.quizAttemptList || []);
        setViewMode('attemptList');
      } else {
        setAttemptList([]);
        setViewMode('attemptList');
      }
    } catch (err) {
      console.error('Error in loadAttemptList:', err);
      setViewMode('attemptList');
    }
  };

  // ==========================================================================
  // STEP 2B & STEP 3 — START QUIZ & PREFILL EXISTING ATTEMPT
  // ==========================================================================
  const startQuizExecution = async (cId = courseId, sId = resolveStudentId()) => {
    setViewMode('loading');
    setError(null);

    try {
      // Step 2B: Get Quiz Preview Data
      const previewRes = await getQuizPreviewData(cId, sId, 2);

      if (previewRes && (previewRes.success || previewRes.isSuccess || (previewRes.questions && previewRes.questions.length > 0))) {
        const qId = previewRes.quizId || 0;
        const attId = previewRes.attemptId || 0;
        setActiveQuizId(qId);

        setQuizMetadata({
          quizId: qId,
          attemptId: attId,
          quizName: previewRes.quizName || `Quiz: ${courseTitle}`,
          quizDescription: previewRes.quizDescription || '',
          timeLimit: previewRes.timeLimit || 120,
          attemptsAllowed: previewRes.attemptsAllowed || 10,
          remainingAttempts: previewRes.remainingAttempts || 10,
          attemptsDone: previewRes.attemptsDone || 0,
          currentAttemptNumber: previewRes.currentAttemptNumber || 1,
          allowHints: Boolean(previewRes.allowHints),
          headerDescription: previewRes.headerDescription || '',
          footerDescription: previewRes.footerDescription || ''
        });

        // Compute total duration
        let durationSec = 120 * 60;
        if (previewRes.timeLimit && previewRes.timeLimit > 0) {
          durationSec = previewRes.timeLimit > 300 ? previewRes.timeLimit : previewRes.timeLimit * 60;
        }
        setTotalDurationSeconds(durationSec);
        setTimeLeft(durationSec);

        // Normalize Questions & Answer Options
        const rawQuestions = Array.isArray(previewRes.questions) ? previewRes.questions : [];
        const rawOptions = Array.isArray(previewRes.answerOptions) ? previewRes.answerOptions : [];

        const structuredQuestions = rawQuestions.map((q, qIdx) => {
          const questionId = q.questionId || q.questionsId || (qIdx + 1);
          
          const matchingOptions = rawOptions
            .filter(opt => (opt.questionId || opt.questionsId) === questionId)
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map((opt, optIdx) => ({
              id: opt.answerId || (optIdx + 1),
              answerId: opt.answerId || (optIdx + 1),
              text: opt.text || '',
              displayOrder: opt.displayOrder || (optIdx + 1),
              letter: getOptionLetter(optIdx),
              isCorrect: Boolean(opt.isCorrect)
            }));

          return {
            id: questionId,
            questionId,
            questionsId: questionId,
            quizId: q.quizId || qId,
            degreeQuestionType: q.degreeQuestionType || 1,
            title: q.title || '',
            questionText: q.questionText || `Question ${qIdx + 1}`,
            points: Number(q.points || 1),
            hint: q.hint || '',
            explanation: q.questionFeedback || '',
            options: matchingOptions
          };
        });

        setQuestions(structuredQuestions);
        setCurrentIndex(0);

        // STEP 3: Check and Resume Existing Attempt by ID if attemptId > 0
        let prefilledAnswers = {};
        if (attId > 0) {
          try {
            const attemptRes = await getQuizAttemptById(attId, sId);
            if (attemptRes && attemptRes.isSuccess) {
              // Resume timer if lastActivityTime is present
              if (attemptRes.lastActivityTime > 0 && attemptRes.lastActivityTime < durationSec) {
                setTimeLeft(attemptRes.lastActivityTime);
              }

              // Prefill saved answers
              const savedAnswers = Array.isArray(attemptRes.degreeQuizAnswers) ? attemptRes.degreeQuizAnswers : [];
              savedAnswers.forEach(ans => {
                const qIdx = structuredQuestions.findIndex(sq => sq.questionId === ans.questionId);
                if (qIdx >= 0) {
                  prefilledAnswers[qIdx] = Number(ans.selectedOptionIds) || ans.selectedOptionIds || ans.answerText;
                }
              });
            }
          } catch (e) {
            console.warn('Could not resume existing attempt, starting fresh:', e);
          }
        }

        setSelectedAnswers(prefilledAnswers);
        setViewMode('quiz');
      } else {
        setError(previewRes?.message || previewRes?.errorDescription || 'No questions found for this quiz.');
        setViewMode('attemptList');
      }
    } catch (err) {
      console.error('Error in startQuizExecution:', err);
      setError('Unable to load quiz. Please try again.');
      setViewMode('attemptList');
    }
  };

  // ==========================================================================
  // STEP 4 & STEP 5 — REAL-TIME SAVE ON OPTION CHANGE & 30s PERIODIC TIMER SAVE
  // ==========================================================================
  useEffect(() => {
    if (viewMode !== 'quiz' || questions.length === 0) return;

    // 1-second countdown interval
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmitOnExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // STEP 5: Periodic 30-Second Timer Auto-Save
    periodicAutoSaveRef.current = setInterval(() => {
      if (quizMetadata.quizId > 0) {
        autoSaveQuizTimer(
          quizMetadata.quizId,
          timeLeft,
          totalDurationSeconds,
          quizMetadata.currentAttemptNumber,
          resolveStudentId()
        ).catch(e => console.warn('Periodic timer save skipped:', e));
      }
    }, 30000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(periodicAutoSaveRef.current);
    };
  }, [viewMode, questions.length, quizMetadata.quizId, timeLeft, totalDurationSeconds]);

  // Handle Option Select (STEP 4)
  const handleSelectOption = (optionId) => {
    if (viewMode !== 'quiz' || !currentQ) return;

    // Update local state
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionId
    }));

    // STEP 4: Real-time Auto-Save Single Question Answer to Server
    saveQuestionAnswer({
      quizId: quizMetadata.quizId,
      questionId: currentQ.questionId,
      degreeQuestionType: currentQ.degreeQuestionType,
      answerData: {
        selectedOptionId: optionId,
        timeSpentInSeconds: totalDurationSeconds - timeLeft
      },
      lastActivityTime: timeLeft,
      totalTimeAllowed: totalDurationSeconds,
      attemptNumber: quizMetadata.currentAttemptNumber,
      studentId: resolveStudentId()
    }).catch(err => {
      console.warn('Real-time answer save error:', err);
    });
  };

  // ==========================================================================
  // STEP 6A & 6B — SUBMISSION (Timer Expiry & Manual Submit)
  // ==========================================================================
  const handleAutoSubmitOnExpiry = () => {
    finalizeSubmission(true);
  };

  const finalizeSubmission = async (isAutoExpiry = false) => {
    clearInterval(timerRef.current);
    clearInterval(periodicAutoSaveRef.current);
    setSubmitting(true);

    try {
      const studentId = resolveStudentId();
      const attemptId = quizMetadata.attemptId || 0;

      // STEP 6A/6B: Final submit API call
      const submitRes = await submitQuizFinal(attemptId, studentId);

      // Calculate score summary
      let correctCount = 0;
      let earnedPoints = 0;
      const totalPoints = questions.reduce((acc, q) => acc + (q.points || 1), 0);

      questions.forEach((q, idx) => {
        const studentAnsId = selectedAnswers[idx];
        const correctOpt = q.options.find(o => o.isCorrect);
        if (correctOpt && studentAnsId === correctOpt.id) {
          correctCount += 1;
          earnedPoints += (q.points || 1);
        }
      });

      const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      const passed = percentage >= 70;

      setScoreSummary({
        totalQuestions: questions.length,
        answeredCount: Object.keys(selectedAnswers).length,
        correctCount,
        incorrectCount: Object.keys(selectedAnswers).length - correctCount,
        unansweredCount: questions.length - Object.keys(selectedAnswers).length,
        earnedPoints,
        totalPoints,
        percentage,
        passed,
        scoreMessage: submitRes?.scoreMessage || submitRes?.message || '',
        timeTaken: totalDurationSeconds - timeLeft,
        isAutoExpiry
      });

      setShowConfirmSubmit(false);
      setViewMode('scoreSummary');
    } catch (err) {
      console.error('Error during quiz final submit:', err);
      setShowConfirmSubmit(false);
      setViewMode('scoreSummary');
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================================
  // STEP 7 — CONFIRM FINAL ATTEMPT (Mark All Attempts As Done)
  // ==========================================================================
  const handleConfirmFinalAttempt = async () => {
    try {
      const studentId = resolveStudentId();
      const qId = quizMetadata.quizId || activeQuizId;
      
      await markAllAttemptsAsDone(qId, studentId);
      setShowConfirmFinalAttempt(false);
      
      // Reload Attempt List to reflect final completed status
      await loadAttemptList(qId, studentId);
    } catch (err) {
      console.error('Error marking all attempts done:', err);
      onBack();
    }
  };

  // ==========================================================================
  // STEP 8 — VIEW SPECIFIC RESULT BY ATTEMPT ID (Modal)
  // ==========================================================================
  const handleViewAttemptResult = async (attempt) => {
    setViewResultModalOpen(true);
    setResultDetailLoading(true);
    setResultDetailData(null);

    try {
      const studentId = resolveStudentId();
      const qId = attempt.quizId || activeQuizId;
      const attId = attempt.attemptId;

      const resultRes = await getQuizResultByQuizId(qId, attId, studentId);
      if (resultRes && resultRes.isSuccess) {
        setResultDetailData(resultRes);
      } else {
        setResultDetailData(resultRes || null);
      }
    } catch (err) {
      console.error('Error fetching quiz result detail:', err);
    } finally {
      setResultDetailLoading(false);
    }
  };

  // Time formatter
  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestionHtml = (content) => {
    if (!content) return '';
    return { __html: content };
  };

  const currentQ = questions[currentIndex] || null;
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // ==========================================================================
  // RENDER: LOADING STATE
  // ==========================================================================
  if (viewMode === 'loading') {
    return (
      <div className="quiz-page-wrapper">
        <div className="quiz-page-container">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 20px',
            background: '#ffffff',
            borderRadius: '18px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            textAlign: 'center'
          }}>
            <Loader2 size={44} style={{ animation: 'spin 1s linear infinite', color: '#1d68f0', marginBottom: 16 }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
              Setting Up Quiz...
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
              Checking attempt status and preparing your assessment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER: STEP 2A — ATTEMPT HISTORY LIST TABLE
  // ==========================================================================
  if (viewMode === 'attemptList') {
    return (
      <div className="quiz-page-wrapper">
        <div className="quiz-page-container">
          
          {/* Breadcrumbs */}
          <nav className="quiz-breadcrumbs-bar" aria-label="Breadcrumb">
            <button type="button" className="breadcrumb-link" onClick={() => onNavigate('microcredentials')}>
              My Learning
            </button>
            <span className="breadcrumb-separator">&gt;</span>
            <button type="button" className="breadcrumb-link" onClick={onBack}>
              {courseTitle}
            </button>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Assessment Attempts</span>
          </nav>

          {/* Attempt History Card */}
          <div className="attempt-history-main-card">
            
            <div className="attempt-history-header">
              <div className="attempt-history-title-wrap">
                <h2>{courseTitle} - Quiz History</h2>
                <p>Review your previous attempts or start a new attempt.</p>
              </div>

              <button
                type="button"
                className="btn-start-new-attempt"
                onClick={() => startQuizExecution()}
              >
                <Play size={16} fill="#ffffff" />
                <span>Start New Attempt</span>
              </button>
            </div>

            {attemptList && attemptList.length > 0 ? (
              <div className="attempt-table-container">
                <table className="attempt-history-table">
                  <thead>
                    <tr>
                      <th>Attempt</th>
                      <th>Date & Time</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Status / Grade</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attemptList.map((item, idx) => (
                      <tr key={item.attemptId || idx}>
                        <td>
                          <span className="attempt-num-badge">
                            Attempt #{item.attemptNumber || idx + 1}
                          </span>
                        </td>
                        <td>{item.attemptDate || 'Completed'}</td>
                        <td>
                          <strong>{item.score}</strong> / {item.totalMarks || 100}
                        </td>
                        <td>{item.percentage}%</td>
                        <td>
                          <span className={`grade-badge ${item.isPassed || item.percentage >= 70 ? 'passed' : 'failed'}`}>
                            {item.grade || (item.isPassed || item.percentage >= 70 ? 'Passed' : 'Needs Review')}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-view-attempt-result"
                            onClick={() => handleViewAttemptResult(item)}
                          >
                            <Eye size={15} />
                            <span>View Result</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                <FileCheck2 size={48} color="#94a3b8" style={{ marginBottom: 12 }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                  No Attempts Recorded Yet
                </h3>
                <p style={{ margin: '0 0 20px 0' }}>You can begin your first attempt whenever you're ready.</p>
                <button
                  type="button"
                  className="btn-start-new-attempt"
                  onClick={() => startQuizExecution()}
                >
                  <Play size={16} fill="#ffffff" />
                  <span>Start Quiz Now</span>
                </button>
              </div>
            )}

          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button
              type="button"
              className="btn-quiz-prev"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
              <span>Back to Course</span>
            </button>
          </div>

          {/* STEP 8: VIEW ATTEMPT RESULT BREAKDOWN MODAL */}
          {viewResultModalOpen && (
            <div className="quiz-result-modal-overlay">
              <div className="quiz-result-modal-card">
                
                <div className="quiz-result-modal-header">
                  <h3>Assessment Attempt Result Breakdown</h3>
                  <button 
                    type="button" 
                    className="btn-modal-close-icon"
                    onClick={() => setViewResultModalOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="quiz-result-modal-body">
                  {resultDetailLoading ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#1d68f0', marginBottom: 12 }} />
                      <p style={{ color: '#64748b', margin: 0 }}>Loading detailed result breakdown...</p>
                    </div>
                  ) : resultDetailData ? (
                    <>
                      {/* Top Stats */}
                      <div className="result-breakdown-stats">
                        <div className="breakdown-stat-box">
                          <span className="num" style={{ color: '#1d68f0' }}>{resultDetailData.studentPercentage}%</span>
                          <span className="lbl">Percentage</span>
                        </div>
                        <div className="breakdown-stat-box">
                          <span className="num" style={{ color: '#16a34a' }}>
                            {resultDetailData.questions?.filter(q => q.isStudentCorrect).length || 0}
                          </span>
                          <span className="lbl">Correct</span>
                        </div>
                        <div className="breakdown-stat-box">
                          <span className="num" style={{ color: '#dc2626' }}>{resultDetailData.wrongAnswers || 0}</span>
                          <span className="lbl">Wrong</span>
                        </div>
                        <div className="breakdown-stat-box">
                          <span className="num" style={{ color: '#64748b' }}>{resultDetailData.skippedQuestions || 0}</span>
                          <span className="lbl">Skipped</span>
                        </div>
                      </div>

                      {/* Question Breakdown List */}
                      <div className="breakdown-questions-list">
                        <h4 style={{ margin: '8px 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                          Questions Summary ({resultDetailData.questions?.length || 0})
                        </h4>

                        {resultDetailData.questions && resultDetailData.questions.map((q, qIdx) => (
                          <div key={q.questionId || qIdx} className={`result-question-item ${q.isStudentCorrect ? 'correct' : 'wrong'}`}>
                            <div className="result-q-header">
                              <span className="result-q-title">Question {qIdx + 1}</span>
                              <span className={`result-q-badge ${q.isStudentCorrect ? 'correct' : 'wrong'}`}>
                                {q.isStudentCorrect ? `Correct (+${q.studentPointsAwarded || q.points || 1} pts)` : 'Incorrect (0 pts)'}
                              </span>
                            </div>

                            <div 
                              style={{ color: '#334155', fontSize: '0.92rem', marginBottom: 8 }}
                              dangerouslySetInnerHTML={renderQuestionHtml(q.questionText)}
                            />

                            {q.correctAnswerData && (
                              <div style={{ fontSize: '0.84rem', color: '#16a34a', background: '#f0fdf4', padding: '6px 10px', borderRadius: 6 }}>
                                <strong>Correct Answer:</strong> {q.correctAnswerData}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>
                      Result breakdown details are not available.
                    </p>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER: STEP 2B, 3, 4, 5 — ACTIVE QUIZ VIEW
  // ==========================================================================
  if (viewMode === 'quiz') {
    return (
      <div className="quiz-page-wrapper">
        <div className="quiz-page-container">
          
          {/* 1. Breadcrumbs */}
          <nav className="quiz-breadcrumbs-bar" aria-label="Breadcrumb">
            <button type="button" className="breadcrumb-link" onClick={() => onNavigate('microcredentials')}>
              My Learning
            </button>
            <span className="breadcrumb-separator">&gt;</span>
            <button type="button" className="breadcrumb-link" onClick={() => setViewMode('attemptList')}>
              {courseTitle}
            </button>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">{quizMetadata.quizName || 'Assessment'}</span>
          </nav>

          {/* 2. Main Two-Column Quiz Section */}
          <div className="quiz-layout-grid">
            
            {/* LEFT COLUMN: HEADER & ACTIVE QUESTION CARD */}
            <div className="quiz-main-column">

              {/* Top Header Section */}
              <div className="quiz-header-section">
                <div className="quiz-header-left">
                  <h1 className="quiz-hero-title">{quizMetadata.quizName || `Quiz: ${courseTitle}`}</h1>
                  <p className="quiz-hero-subtitle">
                    {quizMetadata.quizDescription || 'Test your understanding of the key concepts covered in this module.'}
                  </p>
                </div>

                {/* Bookmark Mark Badge */}
                <div className="quiz-mark-pill-badge">
                  <Bookmark size={16} className="mark-badge-icon" />
                  <span className="mark-badge-text">{currentQ?.points || 1} Mark</span>
                </div>
              </div>

              {/* Active Question Card */}
              {currentQ && (
                <div className="quiz-question-main-card">
                  
                  {/* Question Counter Header */}
                  <div className="question-card-top-meta">
                    <span className="question-counter-label">
                      Question {currentIndex + 1} of {totalQuestions}
                    </span>
                  </div>

                  {/* Question Heading (Rich Text Support) */}
                  <div 
                    className="question-headline-text"
                    dangerouslySetInnerHTML={renderQuestionHtml(currentQ.questionText)}
                  />

                  {/* Options List */}
                  <div className="question-options-stack">
                    {currentQ.options && currentQ.options.length > 0 ? (
                      currentQ.options.map((option, optIdx) => {
                        const isSelected = selectedAnswers[currentIndex] === option.id;

                        return (
                          <button
                            key={option.id || optIdx}
                            type="button"
                            className={`quiz-option-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelectOption(option.id)}
                          >
                            {/* Option Letter Pill */}
                            <div className={`quiz-option-letter-badge ${isSelected ? 'selected' : ''}`}>
                              {option.letter || getOptionLetter(optIdx)}
                            </div>

                            {/* Option Text */}
                            <span 
                              className="quiz-option-text-content"
                              dangerouslySetInnerHTML={renderQuestionHtml(option.text)}
                            />

                            {/* Radio Circle on Far Right */}
                            <div className={`quiz-radio-circle ${isSelected ? 'checked' : ''}`}>
                              {isSelected && <div className="quiz-radio-inner-dot" />}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No options configured for this question.</p>
                    )}
                  </div>

                  {/* Bottom Navigation Buttons */}
                  <div className="quiz-navigation-action-bar">
                    <button
                      type="button"
                      className="btn-quiz-prev"
                      onClick={() => currentIndex > 0 && setCurrentIndex(prev => prev - 1)}
                      disabled={currentIndex === 0}
                    >
                      <ArrowLeft size={16} />
                      <span>Previous</span>
                    </button>

                    {currentIndex < totalQuestions - 1 ? (
                      <button
                        type="button"
                        className="btn-quiz-next"
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                      >
                        <span>Next</span>
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-quiz-next btn-quiz-submit"
                        onClick={() => setShowConfirmSubmit(true)}
                      >
                        <span>Submit Quiz</span>
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* RIGHT COLUMN: SIDEBAR WITH COMBINED TIMER + PROGRESS, NAV GRID & TIP */}
            <aside className="quiz-sidebar-column">
              
              {/* 1. Combined Timer & Progress Card */}
              <div className="quiz-side-card quiz-combined-timer-card">
                <div className="timer-inner-card">
                  <div className="timer-inner-left">
                    <div className="timer-svg-wrap">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1d68f0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="13" r="8" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="5" x2="12" y2="2" />
                        <line x1="9" y1="2" x2="15" y2="2" />
                      </svg>
                    </div>
                    <div className="timer-labels">
                      <span className="timer-caption-title">Time Left</span>
                      <span className={`timer-digits-text ${timeLeft < 120 ? 'warning' : ''}`}>
                        {formatTimer(timeLeft)}
                      </span>
                    </div>
                  </div>
                  <div className="timer-corner-glow" />
                </div>

                {/* Progress Section */}
                <div className="progress-sub-section">
                  <div className="progress-title-row">
                    <span className="progress-section-heading">Progress</span>
                    <span className="progress-fraction-info">{answeredCount} of {totalQuestions} answered</span>
                  </div>
                  <div className="progress-line-container">
                    <div className="quiz-progress-track">
                      <div 
                        className="quiz-progress-fill" 
                        style={{ width: `${progressPct}%` }} 
                      />
                    </div>
                    <span className="progress-pct-stat">{progressPct}%</span>
                  </div>
                </div>
              </div>

              {/* 2. Questions Palette Grid */}
              <div className="quiz-side-card question-palette-card">
                <div className="nav-title-row">
                  <h3 className="nav-title">Questions Palette</h3>
                  <span className="nav-answered-stat">{answeredCount}/{totalQuestions}</span>
                </div>

                <div className="question-grid-matrix">
                  {questions.map((q, idx) => {
                    const isCurrent = currentIndex === idx;
                    const isAnswered = selectedAnswers[idx] !== undefined;

                    let btnClass = 'q-grid-btn';
                    if (isAnswered) {
                      btnClass += ' answered';
                    } else {
                      btnClass += ' unanswered';
                    }
                    if (isCurrent) {
                      btnClass += ' current';
                    }

                    return (
                      <button
                        key={q.id || idx}
                        type="button"
                        className={btnClass}
                        onClick={() => setCurrentIndex(idx)}
                        title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Not answered'}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Palette Legend */}
                <div className="nav-grid-legend-list">
                  <div className="legend-row">
                    <span className="legend-box legend-current" />
                    <span className="legend-text">Current</span>
                  </div>
                  <div className="legend-row">
                    <span className="legend-box legend-answered" />
                    <span className="legend-text">Answered</span>
                  </div>
                  <div className="legend-row">
                    <span className="legend-box legend-unanswered" />
                    <span className="legend-text">Unanswered</span>
                  </div>
                </div>
              </div>

              {/* 3. Pro-Tip Card */}
              <div className="quiz-tip-card">
                <div className="tip-icon-wrap">
                  <Lightbulb size={20} className="tip-bulb-icon" />
                </div>
                <div className="tip-content">
                  <h4 className="tip-title">Assessment Tip</h4>
                  <p className="tip-text">
                    Answers are auto-saved automatically. Review all questions before final submission.
                  </p>
                </div>
              </div>

            </aside>

          </div>

          {/* STEP 6B: CONFIRMATION MODAL BEFORE MANUAL SUBMISSION */}
          {showConfirmSubmit && (
            <div className="quiz-confirm-modal-overlay">
              <div className="quiz-confirm-modal-card">
                <div className="modal-icon-alert">
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="modal-confirm-title">
                  Submit Assessment?
                </h3>
                <p className="modal-confirm-desc">
                  You have answered <strong>{answeredCount}</strong> out of <strong>{totalQuestions}</strong> questions. 
                  {totalQuestions - answeredCount > 0 && (
                    <span className="unanswered-warning" style={{ display: 'block', marginTop: 6 }}>
                      ⚠️ You still have {totalQuestions - answeredCount} unanswered question{totalQuestions - answeredCount > 1 ? 's' : ''}!
                    </span>
                  )}
                </p>
                
                <div className="modal-confirm-actions">
                  <button
                    type="button"
                    className="btn-modal-back"
                    disabled={submitting}
                    onClick={() => setShowConfirmSubmit(false)}
                  >
                    Continue Review
                  </button>
                  <button
                    type="button"
                    className="btn-modal-confirm-submit"
                    disabled={submitting}
                    onClick={() => finalizeSubmission(false)}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Confirm & Submit</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER: STEP 6 & 7 — SCORE / SUMMARY SCREEN
  // ==========================================================================
  return (
    <div className="quiz-page-wrapper">
      <div className="quiz-page-container">
        
        {/* Breadcrumbs */}
        <nav className="quiz-breadcrumbs-bar" aria-label="Breadcrumb">
          <button type="button" className="breadcrumb-link" onClick={() => onNavigate('microcredentials')}>
            My Learning
          </button>
          <span className="breadcrumb-separator">&gt;</span>
          <button type="button" className="breadcrumb-link" onClick={() => setViewMode('attemptList')}>
            {courseTitle}
          </button>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-current">Result Summary</span>
        </nav>

        {/* Score Summary Card */}
        <div className="quiz-result-summary-card">
          
          <div className="result-header-banner">
            <div className="result-trophy-icon-wrap">
              {scoreSummary?.passed ? (
                <Trophy size={44} className="trophy-gold" />
              ) : (
                <Award size={44} className="award-blue" />
              )}
            </div>
            <h2 className="result-title">
              {scoreSummary?.passed ? 'Assessment Completed!' : 'Attempt Finished'}
            </h2>
            <p className="result-subtitle">
              {scoreSummary?.scoreMessage || (scoreSummary?.passed 
                ? 'Congratulations! You demonstrated strong mastery of the module concepts.' 
                : 'You have completed this attempt. You can review your results or start another attempt.')}
            </p>
          </div>

          {/* Key Performance Stats */}
          <div className="result-score-badges-row">
            <div className="result-stat-box highlight">
              <span className="stat-label">Your Score</span>
              <span className="stat-value">{scoreSummary?.percentage}%</span>
              <span className="stat-sub">{scoreSummary?.earnedPoints} / {scoreSummary?.totalPoints} marks</span>
            </div>

            <div className="result-stat-box success">
              <span className="stat-label">Correct Answers</span>
              <span className="stat-value">{scoreSummary?.correctCount}</span>
              <span className="stat-sub">Out of {scoreSummary?.totalQuestions} questions</span>
            </div>

            <div className="result-stat-box danger">
              <span className="stat-label">Incorrect Answers</span>
              <span className="stat-value">{scoreSummary?.incorrectCount}</span>
              <span className="stat-sub">{scoreSummary?.unansweredCount} unanswered</span>
            </div>

            <div className="result-stat-box">
              <span className="stat-label">Time Taken</span>
              <span className="stat-value">{formatTimer(scoreSummary?.timeTaken || 0)}</span>
              <span className="stat-sub">Total: {formatTimer(totalDurationSeconds)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="result-actions-tray">
            <button
              type="button"
              className="btn-result-retake"
              onClick={() => startQuizExecution()}
            >
              <RotateCcw size={16} />
              <span>Start Next Attempt</span>
            </button>

            <button
              type="button"
              className="btn-result-mark-final"
              onClick={() => setShowConfirmFinalAttempt(true)}
            >
              <CheckSquare size={16} />
              <span>Mark as Final Attempt</span>
            </button>

            <button
              type="button"
              className="btn-result-return"
              onClick={() => loadAttemptList(quizMetadata.quizId || activeQuizId, resolveStudentId())}
            >
              <Eye size={16} />
              <span>View All Attempts</span>
            </button>
          </div>

        </div>

        {/* STEP 7: CONFIRM FINAL ATTEMPT MODAL */}
        {showConfirmFinalAttempt && (
          <div className="quiz-confirm-modal-overlay">
            <div className="quiz-confirm-modal-card">
              <div className="modal-icon-alert" style={{ background: '#fef3c7', color: '#d97706' }}>
                <CheckSquare size={30} />
              </div>
              <h3 className="modal-confirm-title">
                Confirm Final Attempt?
              </h3>
              <p className="modal-confirm-desc">
                Marking this attempt as final will lock any further attempts for this quiz assessment.
              </p>
              
              <div className="modal-confirm-actions">
                <button
                  type="button"
                  className="btn-modal-back"
                  onClick={() => setShowConfirmFinalAttempt(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-modal-confirm-submit"
                  style={{ background: '#16a34a' }}
                  onClick={handleConfirmFinalAttempt}
                >
                  Yes, Mark as Final
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
