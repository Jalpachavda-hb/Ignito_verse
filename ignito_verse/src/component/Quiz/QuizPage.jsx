// ignitoverse: Dedicated Assessment Quiz Taking Page
import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Bookmark,
  Lightbulb, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  Trophy,
  Award,
  Check
} from 'lucide-react';
import './quiz.css';

// Default questions bank for demonstration and interactive testing matching the screenshot
const DEFAULT_QUESTIONS = [
  {
    id: 1,
    questionText: 'What is the primary definition of Stress in psychological and physiological contexts?',
    points: 1,
    options: [
      { id: 'A', text: 'A completely negative emotional response that must always be eliminated' },
      { id: 'B', text: 'A body\'s non-specific physiological and psychological response to any demand or stressor' },
      { id: 'C', text: 'An external physical force acting exclusively on biological tissues' },
      { id: 'D', text: 'A chronic state of neurological fatigue without external triggers' }
    ],
    correctOption: 'B',
    explanation: 'Stress is defined as the non-specific biological and cognitive response of the organism to environmental demands.'
  },
  {
    id: 2,
    questionText: 'Which of the following is considered a healthy and positive form of stress that enhances motivation and focus?',
    points: 1,
    options: [
      { id: 'A', text: 'Distress' },
      { id: 'B', text: 'Hypostress' },
      { id: 'C', text: 'Eustress' },
      { id: 'D', text: 'Hyperstress' }
    ],
    correctOption: 'C',
    explanation: 'Eustress is positive stress that challenges and motivates individuals to achieve optimal performance.'
  },
  {
    id: 3,
    questionText: 'Which physiological mechanism does Progressive Muscle Relaxation (PMR) primarily stimulate?',
    points: 1,
    options: [
      { id: 'A', text: 'Sympathetic hyperactivity' },
      { id: 'B', text: 'Parasympathetic calming response' },
      { id: 'C', text: 'Anaerobic lactic fermentation' },
      { id: 'D', text: 'Vasoconstriction in peripheral capillaries' }
    ],
    correctOption: 'B',
    explanation: 'PMR intentionally engages the parasympathetic division to lower heart rate and induce systemic muscle relaxation.'
  },
  {
    id: 4,
    questionText: 'During the "Fight-or-Flight" autonomic nervous system response, which hormone is rapidly secreted by the adrenal glands?',
    points: 1,
    options: [
      { id: 'A', text: 'Insulin' },
      { id: 'B', text: 'Adrenaline (Epinephrine)' },
      { id: 'C', text: 'Melatonin' },
      { id: 'D', text: 'Thyroxine' }
    ],
    correctOption: 'B',
    explanation: 'Adrenaline and norepinephrine are released during acute sympathetic nervous system activation.'
  },
  {
    id: 5,
    questionText: 'What is the recommended ratio for Box Breathing technique used by high-performance professionals?',
    points: 1,
    options: [
      { id: 'A', text: '4 seconds Inhale - 4 seconds Hold - 4 seconds Exhale - 4 seconds Hold' },
      { id: 'B', text: '10 seconds Inhale - 1 second Hold - 2 seconds Exhale - 0 seconds Hold' },
      { id: 'C', text: '2 seconds Inhale - 8 seconds Hold - 4 seconds Exhale - 8 seconds Hold' },
      { id: 'D', text: '6 seconds Inhale - 0 seconds Hold - 6 seconds Exhale - 0 seconds Hold' }
    ],
    correctOption: 'A',
    explanation: 'Equal four-part rhythmic breathing (4-4-4-4) stabilizes the autonomic nervous system and regulates pulse rate.'
  },
  {
    id: 6,
    questionText: 'Which time-management matrix quadrant should individuals prioritize to proactively minimize workplace stress?',
    points: 1,
    options: [
      { id: 'A', text: 'Quadrant I: Urgent and Important' },
      { id: 'B', text: 'Quadrant II: Not Urgent, but Important (Planning & Prevention)' },
      { id: 'C', text: 'Quadrant III: Urgent, but Not Important' },
      { id: 'D', text: 'Quadrant IV: Neither Urgent nor Important' }
    ],
    correctOption: 'B',
    explanation: 'Focusing on Quadrant II (strategic planning, preparation, and self-care) prevents crises and chronic deadlines.'
  },
  {
    id: 7,
    questionText: 'In Cognitive Behavioral Therapy (CBT) models, what is "Cognitive Restructuring"?',
    points: 1,
    options: [
      { id: 'A', text: 'Suppression of all negative feelings without evaluation' },
      { id: 'B', text: 'Identifying and reframing distorted, catastrophic thought patterns' },
      { id: 'C', text: 'Hypnotherapy induction for subconscious memory clearing' },
      { id: 'D', text: 'Physical neural tissue reprogramming through electromagnetic stimulation' }
    ],
    correctOption: 'B',
    explanation: 'Cognitive Restructuring helps individuals recognize irrational cognitive distortions and replace them with constructive viewpoints.'
  },
  {
    id: 8,
    questionText: 'Which chronic condition is clinically associated with long-term, unmanaged workplace distress (burnout)?',
    points: 1,
    options: [
      { id: 'A', text: 'Elevated sustained cortisol and cardiovascular hypertension' },
      { id: 'B', text: 'Decreased resting heart rate below normal athlete levels' },
      { id: 'C', text: 'Enhanced immune antibody production' },
      { id: 'D', text: 'Rapid regenerative cell turnover' }
    ],
    correctOption: 'A',
    explanation: 'Chronic cortisol elevation impairs endothelial function and contributes to chronic cardiovascular fatigue.'
  },
  {
    id: 9,
    questionText: 'What is the primary role of mindfulness meditation in emotional self-regulation?',
    points: 1,
    options: [
      { id: 'A', text: 'Cultivating non-judgmental present-moment awareness' },
      { id: 'B', text: 'Complete sensory detachment from surroundings' },
      { id: 'C', text: 'Elimination of all spontaneous brain electrical activity' },
      { id: 'D', text: 'Inducing rapid deep unconscious sleep states' }
    ],
    correctOption: 'A',
    explanation: 'Mindfulness cultivates intentional non-judgmental presence, reducing amygdala reactivity.'
  },
  {
    id: 10,
    questionText: 'What is the essential foundation for building sustainable personal resilience against organizational pressure?',
    points: 1,
    options: [
      { id: 'A', text: 'Elimination of all professional responsibilities' },
      { id: 'B', text: 'Balanced lifestyle habits, sleep hygiene, boundary setting, and social support networks' },
      { id: 'C', text: 'Working continuous overtime without breaks' },
      { id: 'D', text: 'Avoiding constructive feedback from mentors' }
    ],
    correctOption: 'B',
    explanation: 'Resilience is cultivated through balanced recovery, consistent restorative sleep, emotional regulation, and clear boundaries.'
  }
];

export default function QuizPage({
  course = null,
  onBack = () => {},
  onNavigate = () => {}
}) {
  const currentCourse = course || {
    id: 101,
    title: 'Relaxation Techniques and Meditation',
    category: 'Healthcare & Wellness',
    streamName: 'Mindfulness & Health'
  };

  const courseTitle = currentCourse.title || currentCourse.microcredentialCourseName || 'Relaxation Techniques and Meditation';
  const quizTitle = `Quiz 1: Basics of ${courseTitle}`;

  // Total timer duration: 10 minutes (600 seconds)
  const TOTAL_DURATION_SECONDS = 10 * 60;

  // Quiz state
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionIndex]: optionId }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [scoreSummary, setScoreSummary] = useState(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isSubmitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isSubmitted]);

  // Format time MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  // Circular timer calculation
  const circleRadius = 20;
  const circleCircumference = 2 * Math.PI * circleRadius; // ~125.66
  const timerProgress = timeLeft / TOTAL_DURATION_SECONDS;
  const strokeDashoffset = circleCircumference - (timerProgress * circleCircumference);

  // Handle option selection
  const handleSelectOption = (optionId) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionId
    }));
  };

  // Navigate between questions
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowConfirmSubmit(true);
    }
  };

  // Submit quiz evaluation
  const handleAutoSubmit = () => {
    finalizeSubmission();
  };

  const finalizeSubmission = () => {
    clearInterval(timerRef.current);
    let correctCount = 0;
    let earnedPoints = 0;
    const totalPoints = questions.reduce((acc, q) => acc + (q.points || 1), 0);

    questions.forEach((q, idx) => {
      const studentAns = selectedAnswers[idx];
      if (studentAns === q.correctOption) {
        correctCount += 1;
        earnedPoints += (q.points || 1);
      }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = percentage >= 70;

    setScoreSummary({
      totalQuestions,
      answeredCount,
      correctCount,
      incorrectCount: answeredCount - correctCount,
      unansweredCount: totalQuestions - answeredCount,
      earnedPoints,
      totalPoints,
      percentage,
      passed,
      timeTaken: TOTAL_DURATION_SECONDS - timeLeft
    });

    setIsSubmitted(true);
    setShowConfirmSubmit(false);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(TOTAL_DURATION_SECONDS);
    setIsSubmitted(false);
    setScoreSummary(null);
  };

  return (
    <div className="quiz-page-wrapper">
      <div className="quiz-page-container">
        
        {/* 1. Breadcrumbs */}
        <nav className="quiz-breadcrumbs-bar" aria-label="Breadcrumb">
          <button type="button" className="breadcrumb-link" onClick={() => onNavigate('microcredentials')}>
            My Learning
          </button>
          <span className="breadcrumb-separator">&gt;</span>
          <button type="button" className="breadcrumb-link" onClick={onBack}>
            {courseTitle}
          </button>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-current">Quiz 1</span>
        </nav>

        {/* 2. Main Two-Column Quiz Section */}
        {!isSubmitted ? (
          <div className="quiz-layout-grid">
            
            {/* LEFT COLUMN: HEADER & ACTIVE QUESTION CARD */}
            <div className="quiz-main-column">

              {/* Top Header Section */}
              <div className="quiz-header-section">
                <div className="quiz-header-left">
                  <h1 className="quiz-hero-title">{quizTitle}</h1>
                  <p className="quiz-hero-subtitle">
                    Test your understanding of the key concepts covered in this module.
                  </p>
                </div>

                {/* Bookmark 1 Mark Badge matching Screenshot */}
                <div className="quiz-mark-pill-badge">
                  <Bookmark size={16} className="mark-badge-icon" />
                  <span className="mark-badge-text">{currentQ.points || 1} Mark</span>
                </div>
              </div>

              {/* Active Question Card */}
              <div className="quiz-question-main-card">
                
                {/* Question Counter Header */}
                <div className="question-card-top-meta">
                  <span className="question-counter-label">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                </div>

                {/* Question Heading */}
                <h2 className="question-headline-text">
                  {currentQ.questionText}
                </h2>

                {/* Options List */}
                <div className="question-options-stack">
                  {currentQ.options.map((option) => {
                    const isSelected = selectedAnswers[currentIndex] === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`quiz-option-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(option.id)}
                      >
                        {/* Option Letter Pill */}
                        <div className={`quiz-option-letter-badge ${isSelected ? 'selected' : ''}`}>
                          {option.id}
                        </div>

                        {/* Option Text */}
                        <span className="quiz-option-text-content">{option.text}</span>

                        {/* Radio Circle on the Far Right */}
                        <div className={`quiz-radio-circle ${isSelected ? 'checked' : ''}`}>
                          {isSelected && <div className="quiz-radio-inner-dot" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="quiz-navigation-action-bar">
                  <button
                    type="button"
                    className="btn-quiz-prev"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                  >
                    <ArrowLeft size={16} />
                    <span>Previous</span>
                  </button>

                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      type="button"
                      className="btn-quiz-next"
                      onClick={handleNext}
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
            </div>

            {/* RIGHT COLUMN: SIDEBAR WITH COMBINED TIMER + PROGRESS, NAV GRID & TIP */}
            <aside className="quiz-sidebar-column">
              
              {/* 1. Combined Timer & Progress Card */}
              <div className="quiz-side-card quiz-combined-timer-card">
                {/* Top Highlight Timer Box */}
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
                  {/* Decorative corner accent */}
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

              {/* 2. Question Navigation Grid Card */}
              <div className="quiz-side-card quiz-nav-grid-card">
                <h3 className="side-card-title nav-title">Question Navigation</h3>

                <div className="question-grid-matrix">
                  {questions.map((q, qIdx) => {
                    const isCurrent = qIdx === currentIndex;
                    const isAnswered = selectedAnswers[qIdx] !== undefined;

                    let statusClass = 'unanswered';
                    if (isAnswered) statusClass = 'answered';
                    if (isCurrent) statusClass = 'current';

                    return (
                      <button
                        key={q.id || qIdx}
                        type="button"
                        className={`q-grid-btn ${statusClass}`}
                        onClick={() => setCurrentIndex(qIdx)}
                        title={`Question ${qIdx + 1} (${isAnswered ? 'Answered' : 'Not Answered'})`}
                      >
                        {qIdx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Grid Legend */}
                <div className="nav-grid-legend-list">
                  <div className="legend-row">
                    <span className="legend-box legend-current" />
                    <span className="legend-text">Current Question</span>
                  </div>
                  <div className="legend-row">
                    <span className="legend-box legend-answered" />
                    <span className="legend-text">Answered</span>
                  </div>
                  <div className="legend-row">
                    <span className="legend-box legend-unanswered" />
                    <span className="legend-text">Not Answered</span>
                  </div>
                </div>
              </div>

              {/* 3. Tip Card */}
              <div className="quiz-side-card quiz-tip-card">
                <div className="tip-icon-wrap">
                  <Lightbulb size={22} className="tip-bulb-icon" />
                </div>
                <div className="tip-content">
                  <h4 className="tip-title">Tip</h4>
                  <p className="tip-text">
                    Read each question carefully before selecting your answer.
                  </p>
                </div>
              </div>

            </aside>

          </div>
        ) : (
          /* RESULT SCORE CARD VIEW */
          <div className="quiz-result-summary-card">
            <div className="result-header-banner">
              <div className="result-trophy-icon-wrap">
                {scoreSummary?.passed ? (
                  <Trophy size={48} className="trophy-gold" />
                ) : (
                  <Award size={48} className="award-blue" />
                )}
              </div>
              <h2 className="result-title">
                {scoreSummary?.passed ? 'Congratulations! Quiz Passed' : 'Assessment Completed'}
              </h2>
              <p className="result-subtitle">
                {scoreSummary?.passed 
                  ? 'You have successfully qualified for module certification.' 
                  : 'You have completed this assessment attempt. Review your score breakdown below.'}
              </p>
            </div>

            {/* Score Numbers Overview */}
            <div className="result-score-badges-row">
              <div className="result-stat-box highlight">
                <span className="stat-label">Final Score</span>
                <span className="stat-value">{scoreSummary?.percentage}%</span>
                <span className="stat-sub">{scoreSummary?.earnedPoints} / {scoreSummary?.totalPoints} Points</span>
              </div>
              <div className="result-stat-box success">
                <span className="stat-label">Correct</span>
                <span className="stat-value">{scoreSummary?.correctCount}</span>
                <span className="stat-sub">Questions</span>
              </div>
              <div className="result-stat-box danger">
                <span className="stat-label">Incorrect</span>
                <span className="stat-value">{scoreSummary?.incorrectCount}</span>
                <span className="stat-sub">Questions</span>
              </div>
              <div className="result-stat-box muted">
                <span className="stat-label">Time Taken</span>
                <span className="stat-value">{formatTimer(scoreSummary?.timeTaken || 0)}</span>
                <span className="stat-sub">Minutes</span>
              </div>
            </div>

            {/* Actions */}
            <div className="result-actions-tray">
              <button
                type="button"
                className="btn-result-retake"
                onClick={handleRetake}
              >
                <RotateCcw size={16} />
                <span>Retake Quiz</span>
              </button>

              <button
                type="button"
                className="btn-result-return"
                onClick={onBack}
              >
                <span>Back to Course</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Confirmation Submit Modal */}
      {showConfirmSubmit && (
        <div className="quiz-confirm-modal-overlay" onClick={() => setShowConfirmSubmit(false)}>
          <div className="quiz-confirm-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-icon-alert">
              <HelpCircle size={32} />
            </div>
            <h3 className="modal-confirm-title">Submit Assessment Quiz?</h3>
            <p className="modal-confirm-desc">
              You have answered <strong>{answeredCount} of {totalQuestions}</strong> questions.
              {totalQuestions - answeredCount > 0 && (
                <span className="unanswered-warning">
                  <br />Note: You still have {totalQuestions - answeredCount} unanswered {totalQuestions - answeredCount === 1 ? 'question' : 'questions'}.
                </span>
              )}
            </p>

            <div className="modal-confirm-actions">
              <button
                type="button"
                className="btn-modal-back"
                onClick={() => setShowConfirmSubmit(false)}
              >
                Review Answers
              </button>
              <button
                type="button"
                className="btn-modal-confirm-submit"
                onClick={finalizeSubmission}
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
