// ignitoverse: Dedicated Microcredential Video Learning & Interactive Masterclass Watch Page
import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  RotateCw, 
  Settings, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Users, 
  GraduationCap, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  Lock, 
  Gift, 
  FileText, 
  HelpCircle, 
  Award, 
  Download, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import userCertificateImg from '../../assets/e47782ae-798b-479b-99e6-428b70bf4a7a.png';
import watchNowImg from '../../assets/watchnow.png';

export default function MicrocredentialWatchPage({ 
  course, 
  onBack = () => {}, 
  onNavigate = () => {} 
}) {
  // Course fallback data
  const currentCourse = course || {
    title: 'Stress Management',
    category: 'Management',
    instructor: 'Leesa Shashikant Mehra',
    rating: '4.5'
  };

  // Video Playlist Data
  const playlist = [
    {
      id: 1,
      title: 'INTRODUCTION TO STRESS',
      code: 'SM U1 V1-Understanding the Stress',
      org: 'BRAOU eLearning',
      duration: '12:48',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      progress: 33,
      isLocked: false
    },
    {
      id: 2,
      title: 'SOURCES OF STRESS',
      code: 'SM U1 V2-Somatic & Environmental Triggers',
      org: 'BRAOU eLearning',
      duration: '14:20',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      progress: 0,
      isLocked: false
    },
    {
      id: 3,
      title: 'IMPACT OF STRESS',
      code: 'SM U1 V3-Physiological & Cognitive Toll',
      org: 'BRAOU eLearning',
      duration: '16:05',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      progress: 0,
      isLocked: false
    },
    {
      id: 4,
      title: 'STRESS RESPONSE',
      code: 'SM U2 V1-Autonomic Regulation & Breathwork',
      org: 'BRAOU eLearning',
      duration: '18:15',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      progress: 33,
      isLocked: false
    },
    {
      id: 5,
      title: 'COPING MECHANISMS',
      code: 'SM U2 V2-Cognitive Reframing & Meditation',
      org: 'BRAOU eLearning',
      duration: '21:30',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      progress: 0,
      isLocked: false
    }
  ];

  const [activeLectureIdx, setActiveLectureIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeForumTab, setActiveForumTab] = useState('group'); // 'group' or 'professor'
  const [isTextContentOpen, setIsTextContentOpen] = useState(false);
  const [likedQuestions, setLikedQuestions] = useState({ q1: 2 });
  const [hasLikedQ, setHasLikedQ] = useState({ q1: false });
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  const videoRef = useRef(null);
  const activeLecture = playlist[activeLectureIdx] || playlist[0];

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handlePrevLesson = () => {
    if (activeLectureIdx > 0) {
      setActiveLectureIdx(activeLectureIdx - 1);
      setIsPlaying(false);
    }
  };

  const handleNextLesson = () => {
    if (activeLectureIdx < playlist.length - 1) {
      setActiveLectureIdx(activeLectureIdx + 1);
      setIsPlaying(false);
    }
  };

  const handleToggleLike = (id) => {
    setHasLikedQ(prev => ({ ...prev, [id]: !prev[id] }));
    setLikedQuestions(prev => ({
      ...prev,
      [id]: prev[id] + (hasLikedQ[id] ? -1 : 1)
    }));
  };

  return (
    <div className="mc-detail-page-wrapper">
      <div className="mc-fluid-container mc-main-two-col-grid">
        
        {/* ========================================================
            LEFT COLUMN: VIDEO PLAYER + NAV + DISCUSSION
            ======================================================== */}
        <div className="mc-main-left-column">
          
          {/* 1. Breadcrumbs */}
          <div className="mc-breadcrumb-section">
            <div className="mc-breadcrumb-trail">
              <span className="breadcrumb-item linkable" onClick={() => onNavigate('home')}>Home</span>
              <span className="breadcrumb-divider">›</span>
              <span className="breadcrumb-item linkable" onClick={onBack}>{currentCourse.title}</span>
              <span className="breadcrumb-divider">›</span>
              <span className="breadcrumb-item active">Microcredential Detail</span>
            </div>
          </div>

          {/* 2. Course Title & Back to Course Button */}
          <div className="mc-watch-title-row">
            <div className="watch-course-title-group">
              <h1 className="watch-course-title">{currentCourse.title}</h1>
              <div className="watch-verified-badge" title="Accredited & Verified">
                <ShieldCheck size={18} />
              </div>
            </div>

            <button type="button" className="btn-back-to-course" onClick={onBack}>
              <ChevronLeft size={16} />
              <span>{activeLecture.title}</span>
            </button>
          </div>

          {/* 3. Interactive Video Screen Card */}
          <div className="mc-theater-player-card">
              
              {/* Top Video Header Overlay */}
              <div className="theater-header-overlay">
                <div className="theater-channel-badge">
                  <div className="theater-avatar-box">B</div>
                  <div className="theater-lecture-text">
                    <h4>{activeLecture.code}</h4>
                    <span className="theater-org-name">{activeLecture.org}</span>
                  </div>
                </div>

                <div className="theater-header-actions">
                  <button 
                    type="button" 
                    className={`btn-theater-icon ${isBookmarked ? 'active' : ''}`}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    title={isBookmarked ? 'Bookmarked' : 'Save bookmark'}
                  >
                    {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>
                </div>
              </div>

              {/* Central Video Frame */}
              <div className="theater-video-frame" onClick={handleTogglePlay}>
                <video 
                  ref={videoRef}
                  src={activeLecture.videoUrl} 
                  className="theater-html5-video"
                  poster={currentCourse.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80'}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Big Center Glass Play Button (When Paused) */}
                {!isPlaying && (
                  <div className="theater-glass-center-play">
                    <Play size={28} className="play-triangle-fill" />
                  </div>
                )}
              </div>

              {/* Bottom Custom Playback Bar */}
              <div className="theater-bottom-controls-bar">
                <button type="button" className="btn-ctrl-play" onClick={handleTogglePlay}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button type="button" className="btn-ctrl-vol" onClick={handleToggleMute}>
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                {/* Progress Track Line */}
                <div className="theater-progress-track">
                  <div className="theater-progress-fill" style={{ width: '42%' }} />
                </div>

                <span className="theater-time-code">05:24 / {activeLecture.duration}</span>

                <button type="button" className="btn-ctrl-share" title="Share Lecture">
                  <Share2 size={16} />
                </button>

                <button type="button" className="btn-ctrl-settings" title="Settings">
                  <Settings size={16} />
                </button>

                <button type="button" className="btn-ctrl-expand" onClick={handleFullscreen} title="Fullscreen">
                  <Maximize size={16} />
                </button>
              </div>

            </div>

            {/* 2. Lesson Navigation & IgnitoAssist AI Bar */}
            <div className="mc-lesson-navigation-bar">
              <button 
                type="button" 
                className="btn-lesson-nav prev"
                onClick={handlePrevLesson}
                disabled={activeLectureIdx === 0}
              >
                <ChevronLeft size={16} />
                <span>Prev Lesson</span>
              </button>

              <button 
                type="button" 
                className="btn-ignito-assist-ai"
                onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
              >
                <Sparkles size={16} className="sparkle-ai-icon" />
                <span>Ask IgnitoAssist</span>
              </button>

              <button 
                type="button" 
                className="btn-lesson-nav next"
                onClick={handleNextLesson}
                disabled={activeLectureIdx === playlist.length - 1}
              >
                <span>Next Lesson</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* AI Assistant Quick Drawer */}
            {aiAssistantOpen && (
              <div className="mc-ai-helper-drawer">
                <div className="ai-drawer-header">
                  <div className="ai-bot-title">
                    <Sparkles size={18} className="ai-brand-svg" />
                    <strong>IgnitoAssist AI Learning Coach</strong>
                  </div>
                  <button type="button" className="btn-close-ai" onClick={() => setAiAssistantOpen(false)}>×</button>
                </div>
                <p className="ai-greeting-msg">
                  "Hello! I am your AI learning assistant for <strong>{currentCourse.title}</strong>. Ask me anything about this video or summarize key stress regulation techniques!"
                </p>
                <div className="ai-input-wrap">
                  <input type="text" placeholder="Ask a question about this lecture..." />
                  <button type="button" className="btn-ai-send"><Send size={15} /></button>
                </div>
              </div>
            )}

            {/* 3. Discussion & Community Forum */}
            <div className="mc-discussion-forum-card">
              
              {/* Forum Navigation Tabs */}
              <div className="mc-forum-nav-tabs">
                <button 
                  type="button" 
                  className={`forum-tab-btn ${activeForumTab === 'group' ? 'active' : ''}`}
                  onClick={() => setActiveForumTab('group')}
                >
                  <Users size={16} />
                  <span>Group Discussion</span>
                </button>

                <button 
                  type="button" 
                  className={`forum-tab-btn ${activeForumTab === 'professor' ? 'active' : ''}`}
                  onClick={() => setActiveForumTab('professor')}
                >
                  <GraduationCap size={16} />
                  <span>Ask Professor</span>
                </button>
              </div>

              {/* Discussion Header */}
              <div className="forum-main-header-row">
                <h3 className="forum-section-title">Discussion</h3>
                <button 
                  type="button" 
                  className="btn-ask-question-cta"
                  onClick={() => setShowAskModal(true)}
                >
                  <MessageSquare size={15} />
                  <span>Ask Question</span>
                </button>
              </div>

              {/* Student Question Card */}
              <div className="forum-question-item">
                <div className="question-author-meta">
                  <div className="author-avatar-circle">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                      alt="Anjali Sharma" 
                    />
                  </div>
                  <div className="author-name-stamp">
                    <h4>Anjali Sharma</h4>
                    <span className="post-timestamp">Posted on 06/27/2026 14:51:14</span>
                  </div>
                </div>

                <div className="question-body-heading">
                  <h3>How can I handle stress?</h3>
                </div>

                <div className="question-actions-row">
                  <button 
                    type="button" 
                    className={`btn-like-forum ${hasLikedQ.q1 ? 'liked' : ''}`}
                    onClick={() => handleToggleLike('q1')}
                  >
                    <ThumbsUp size={14} />
                    <span>Liked ({likedQuestions.q1})</span>
                  </button>

                  <button type="button" className="btn-reply-forum">
                    <MessageSquare size={14} />
                    <span>Reply</span>
                  </button>

                  <div className="forum-reply-count-badge">
                    <MessageSquare size={13} />
                    <span>1 reply</span>
                  </div>
                </div>

                {/* Nested Instructor / Professor Answer Box */}
                <div className="forum-nested-professor-reply">
                  <div className="prof-author-meta">
                    <div className="prof-avatar-circle">
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" 
                        alt="Leesa Shashikant Mehra" 
                      />
                    </div>
                    <div className="prof-name-stamp">
                      <h4>Leesa Shashikant Mehra</h4>
                      <span className="prof-timestamp">24 August, 2026 03:41:06 PM</span>
                    </div>
                  </div>

                  <p className="prof-reply-text">
                    Stress can be managed by identifying its causes, staying organized, taking regular breaks, practicing deep breathing or relaxation exercises, exercising regularly, getting enough sleep, eating healthy, and talking to someone you trust about your concerns. Making time for hobbies and enjoyable activities can also help you relax and maintain a positive mindset.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* ======================================================
              RIGHT COLUMN: LEARNING PROGRESS & VIDEO PLAYLIST SIDEBAR
              ====================================================== */}
          <div className="mc-main-right-sidebar mc-watch-right-sidebar">
            
            {/* 1. Learning Progress Card */}
            <div className="mc-watch-progress-box">
              <div className="progress-box-left">
                <h3 className="progress-box-title">Learning Progress</h3>
                <div className="progress-stats-visual-row">
                  
                  {/* Radial Progress Circle */}
                  <div className="circular-progress-wrap">
                    <svg viewBox="0 0 36 36" className="circular-chart blue">
                      <path 
                        className="circle-bg" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      />
                      <path 
                        className="circle-bar" 
                        strokeDasharray="33, 100" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      />
                      <text x="18" y="20.35" className="percentage-text">33%</text>
                    </svg>
                  </div>

                  <div className="progress-text-info">
                    <strong>Overall Progress</strong>
                    <span>1 of 3 Modules Completed</span>
                  </div>

                </div>
              </div>

              {/* 3D Learning Illustration Badge */}
              <div className="progress-avatar-illustration">
                <img 
                  src={watchNowImg} 
                  alt="Learning Progress Illustration" 
                  className="progress-watchnow-img"
                />
              </div>
            </div>

            {/* 2. Learning Videos (e-Tutorial) Playlist Card */}
            <div className="mc-watch-playlist-box">
              <div className="playlist-header-row">
                <h3 className="playlist-title">Learning Videos (e-Tutorial)</h3>
                <span className="playlist-count-label">{activeLectureIdx + 1}/{playlist.length} Videos</span>
              </div>
              <div className="playlist-progress-bar-line">
                <div className="playlist-progress-bar-fill" style={{ width: '20%' }} />
              </div>

              {/* 5 Video Lecture List Items */}
              <div className="playlist-items-stack">
                {playlist.map((item, idx) => {
                  const isActive = idx === activeLectureIdx;
                  return (
                    <div 
                      key={item.id} 
                      className={`playlist-item-row ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setActiveLectureIdx(idx);
                        setIsPlaying(true);
                      }}
                    >
                      <div className="playlist-item-left">
                        <div className={`playlist-play-icon-circle ${isActive ? 'active' : ''}`}>
                          <Play size={12} className="play-svg-arrow" />
                        </div>
                        <span className="playlist-item-name">{item.title}</span>
                      </div>

                      <div className="playlist-item-right">
                        <span className="playlist-item-pct">{item.progress}%</span>
                        <div className="playlist-lock-icon" title="Lecture Protected">
                          <Gift size={13} className="gift-red-icon" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Learning Text e-Content Expandable Card */}
            <div className="mc-watch-expandable-card">
              <div 
                className="expandable-header"
                onClick={() => setIsTextContentOpen(!isTextContentOpen)}
              >
                <div className="expandable-left">
                  <BookOpen size={16} className="exp-icon" />
                  <span>Learning Text e-Content</span>
                </div>
                <ChevronDown size={16} className={`chevron-exp ${isTextContentOpen ? 'open' : ''}`} />
              </div>

              {isTextContentOpen && (
                <div className="expandable-content-body">
                  <p>Read full downloadable transcript notes, summary checklists, and self-guided relaxation scripts for {activeLecture.title}.</p>
                </div>
              )}
            </div>

            {/* 4. Quiz Card */}
            <div className="mc-watch-action-card quiz-card">
              <div className="action-card-top">
                <div className="action-icon-circle purple">
                  <HelpCircle size={16} />
                </div>
                <div className="action-title-block">
                  <h4>Quiz</h4>
                  <p className="quiz-eligibility-warning">
                    Please watch at least 95% of the video to unlock the quiz. Eligible on 27-09-2026
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Claim your Certificate Card */}
            <div className="mc-watch-action-card cert-card">
              <div className="action-card-top">
                <div className="action-icon-circle blue">
                  <Award size={16} />
                </div>
                <div className="action-title-block">
                  <h4>Claim your Certificate</h4>
                  <span className="action-sub-text">1 Assessment</span>
                </div>
              </div>
            </div>

            {/* 6. Download Notes Card */}
            <div className="mc-watch-action-card download-card">
              <div className="action-card-top">
                <div className="action-icon-circle purple">
                  <Download size={16} />
                </div>
                <div className="action-title-block">
                  <h4>Download Notes</h4>
                  <span className="action-sub-text">PDF</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Ask Question Popup Modal */}
      {showAskModal && (
        <div className="mc-modal-overlay" onClick={() => setShowAskModal(false)}>
          <div className="mc-modal-card" onClick={e => e.stopPropagation()}>
            <h3>Ask a Question in Discussion Forum</h3>
            <p>Post your query to course instructors and fellow verified learners.</p>
            <textarea 
              rows={4} 
              placeholder="Type your question or clarification here..."
              value={newQuestionText}
              onChange={e => setNewQuestionText(e.target.value)}
            />
            <div className="modal-actions-row">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowAskModal(false)}>Cancel</button>
              <button 
                type="button" 
                className="btn-modal-submit"
                onClick={() => {
                  alert('Your question has been posted to the discussion forum!');
                  setNewQuestionText('');
                  setShowAskModal(false);
                }}
              >
                Submit Question
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
