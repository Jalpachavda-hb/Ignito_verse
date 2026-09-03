// ignitoverse: Dedicated Microcredential Video Learning & Interactive Masterclass Watch Page
import React, { useState, useEffect, useRef } from 'react';
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
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import userCertificateImg from '../../assets/e47782ae-798b-479b-99e6-428b70bf4a7a.png';
import watchNowImg from '../../assets/watchnow.png';
import { getMicroCourseTopicDetail } from '../../services/microcredentialService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';

// Helpers for Video duration & YouTube Embed formatting
function formatDuration(sec) {
  if (!sec) return '10:00';
  if (typeof sec === 'string' && sec.includes(':')) return sec;
  const totalSec = Number(sec) || 0;
  const mins = Math.floor(totalSec / 60);
  const secs = Math.floor(totalSec % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function isYouTubeUrl(url) {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function getEmbedVideoUrl(url) {
  if (!url) return '';
  try {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
    }
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
  } catch (e) {
    console.error('Error parsing video URL:', e);
  }
  return url;
}

export default function MicrocredentialWatchPage({ 
  course, 
  onBack = () => {}, 
  onNavigate = () => {} 
}) {
  const currentCourse = course || {
    title: 'Stress Management',
    category: 'Management',
    instructor: 'Leesa Shashikant Mehra',
    rating: '4.5'
  };

  const [playlist, setPlaylist] = useState([]);
  const [downloadDocuments, setDownloadDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch dynamic video topic details and downloadable documents
  useEffect(() => {
    let isMounted = true;
    const courseId = Number(course?.microcredentialCourseId || course?.courseId || course?.id) || 0;
    const encryptedId = course?.encryptedMicrocredentialCourseId || course?.encryptedId || '';
    const studentId = 0; // Guest or logged in student

    if (courseId > 0 || encryptedId) {
      getMicroCourseTopicDetail(courseId, studentId, encryptedId)
        .then((res) => {
          if (!isMounted) return;
          if (res && res.success) {
            if (Array.isArray(res.getMicroCourseTopicDetailList) && res.getMicroCourseTopicDetailList.length > 0) {
              const mapped = res.getMicroCourseTopicDetailList.map((item, idx) => {
                const vidUrl = item.topicVideoUrl || '';
                return {
                  id: idx + 1,
                  title: item.videoTitle || `Topic ${idx + 1}`,
                  code: item.videoTitle || `Unit ${idx + 1}`,
                  org: course?.streamName || 'IgnitoLearn Microcredentials',
                  duration: formatDuration(item.videoDuration),
                  videoDuration: item.videoDuration,
                  videoEndTime: item.videoEndTime,
                  videoUrl: vidUrl,
                  embedUrl: getEmbedVideoUrl(vidUrl),
                  isYouTube: isYouTubeUrl(vidUrl),
                  topicPdf: item.topicPdf ? formatImageUrl(item.topicPdf) : '',
                  progress: idx === 0 ? 33 : 0,
                  isLocked: false
                };
              });
              setPlaylist(mapped);
            }

            if (Array.isArray(res.microcredentialStudentDownloadDocumentList)) {
              const mappedDocs = res.microcredentialStudentDownloadDocumentList.map((doc, dIdx) => ({
                id: dIdx + 1,
                fileName: doc.originalFileName || `Resource-${dIdx + 1}.pdf`,
                url: doc.microcredentialStudentDownloadDocument ? formatImageUrl(doc.microcredentialStudentDownloadDocument) : ''
              }));
              setDownloadDocuments(mappedDocs);
            }
          }
        })
        .catch((err) => {
          console.error('Error fetching course topic details:', err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [course]);

  // Fallback playlist if empty
  const defaultPlaylist = [
    {
      id: 1,
      title: currentCourse.title || 'INTRODUCTION TO COURSE',
      code: 'Module 1 - Key Concepts',
      org: currentCourse.category || 'IgnitoLearn eLearning',
      duration: '12:48',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      embedUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isYouTube: false,
      progress: 33,
      isLocked: false
    }
  ];

  const currentPlaylist = playlist.length > 0 ? playlist : defaultPlaylist;
  const activeLecture = currentPlaylist[activeLectureIdx] || currentPlaylist[0];

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
    if (activeLectureIdx < currentPlaylist.length - 1) {
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
              <span className="breadcrumb-item active">Microcredential Video Watch</span>
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
              <span>Back to Overview</span>
            </button>
          </div>

          {/* 3. Interactive Video Screen Card */}
          <div className="mc-theater-player-card">
              
              {/* Top Video Header Overlay */}
              <div className="theater-header-overlay">
                <div className="theater-channel-badge">
                  <div className="theater-avatar-box">
                    {(currentCourse.streamName || currentCourse.category || 'M').charAt(0).toUpperCase()}
                  </div>
                  <div className="theater-lecture-text">
                    <h4>{activeLecture.title}</h4>
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

              {/* Central Video Frame: YouTube iframe or HTML5 Video */}
              <div className="theater-video-frame">
                {activeLecture?.isYouTube ? (
                  <iframe 
                    src={activeLecture.embedUrl} 
                    title={activeLecture.title}
                    className="theater-youtube-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    ref={videoRef}
                    src={activeLecture?.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'} 
                    className="theater-html5-video"
                    poster={currentCourse.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80'}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    controls
                  />
                )}

                {/* Big Center Glass Play Button (When Paused on HTML5 Video) */}
                {!activeLecture?.isYouTube && !isPlaying && (
                  <div className="theater-glass-center-play" onClick={handleTogglePlay}>
                    <Play size={28} className="play-triangle-fill" />
                  </div>
                )}
              </div>

              {/* Bottom Playback Bar for non-iframe videos */}
              {!activeLecture?.isYouTube && (
                <div className="theater-bottom-controls-bar">
                  <button type="button" className="btn-ctrl-play" onClick={handleTogglePlay}>
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  <button type="button" className="btn-ctrl-vol" onClick={handleToggleMute}>
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>

                  <div className="theater-playback-timeline">
                    <span className="ctrl-time-stamp">00:00 / {activeLecture.duration}</span>
                  </div>

                  <button type="button" className="btn-ctrl-fullscreen" onClick={handleFullscreen}>
                    <Maximize size={16} />
                  </button>
                </div>
              )}

          </div>

          {/* 4. Lesson Navigation Toolbar */}
          <div className="mc-lesson-navigation-bar">
            <button 
              type="button" 
              className="btn-lesson-nav prev"
              onClick={handlePrevLesson}
              disabled={activeLectureIdx === 0}
            >
              <ChevronLeft size={16} />
              <span>Previous Lesson</span>
            </button>

            <button 
              type="button" 
              className="btn-ai-tutor-summon"
              onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
            >
              <Sparkles size={16} />
              <span>Ask AI Tutor</span>
            </button>

            <button 
              type="button" 
              className="btn-lesson-nav next"
              onClick={handleNextLesson}
              disabled={activeLectureIdx === currentPlaylist.length - 1}
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
                "Hello! I am your AI learning assistant for <strong>{currentCourse.title}</strong>. Ask me anything about this video or summarize key topics!"
              </p>
              <div className="ai-input-wrap">
                <input type="text" placeholder="Ask a question about this lecture..." />
                <button type="button" className="btn-ai-send"><Send size={15} /></button>
              </div>
            </div>
          )}

          {/* 5. Discussion & Community Forum */}
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
                  <span className="post-timestamp">Posted recently</span>
                </div>
              </div>

              <div className="question-body-heading">
                <h3>How can I best apply these concepts in my organization?</h3>
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
                      alt="Instructor" 
                    />
                  </div>
                  <div className="prof-name-stamp">
                    <h4>{currentCourse.instructor || 'Lead Professor'}</h4>
                    <span className="prof-timestamp">Verified Faculty</span>
                  </div>
                </div>

                <p className="prof-reply-text">
                  Make sure to practice regular application through case studies and downloadable resources. Consistent review and participation in the MCQ assessments solidify practical competence.
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
                  <span>{activeLectureIdx + 1} of {currentPlaylist.length} Topics</span>
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

          {/* 2. Learning Videos (e-Tutorial) Dynamic Playlist Card */}
          <div className="mc-watch-playlist-box">
            <div className="playlist-header-row">
              <h3 className="playlist-title">Learning Videos ({currentPlaylist.length} Topics)</h3>
              <span className="playlist-count-label">{activeLectureIdx + 1}/{currentPlaylist.length} Topics</span>
            </div>
            <div className="playlist-progress-bar-line">
              <div 
                className="playlist-progress-bar-fill" 
                style={{ width: `${Math.round(((activeLectureIdx + 1) / currentPlaylist.length) * 100)}%` }} 
              />
            </div>

            {/* Video Lecture List Items */}
            <div className="playlist-items-stack">
              {currentPlaylist.map((item, idx) => {
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
                      <span className="playlist-item-pct">{item.duration}</span>
                      <div className="playlist-lock-icon" title="Verified Topic">
                        <CheckCircle2 size={13} className="check-green-icon" />
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
                <p>Read full downloadable transcript notes, summary checklists, and topic guide for <strong>{activeLecture.title}</strong>.</p>
                {activeLecture?.topicPdf && (
                  <a 
                    href={activeLecture.topicPdf} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="download-topic-pdf-btn"
                  >
                    <FileText size={15} />
                    <span>Open Topic PDF Notes</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 4. Download Notes & Documents Card */}
          <div className="mc-watch-action-card download-card">
            <div className="action-card-top">
              <div className="action-icon-circle purple">
                <Download size={16} />
              </div>
              <div className="action-title-block">
                <h4>Download Resources</h4>
                <span className="action-sub-text">
                  {downloadDocuments.length > 0 ? `${downloadDocuments.length} Documents Available` : 'Course Resource Documents'}
                </span>
              </div>
            </div>

            {/* Dynamic Document Links */}
            {downloadDocuments.length > 0 && (
              <div className="download-docs-list-tray">
                {downloadDocuments.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-doc-item-link"
                    download
                  >
                    <FileText size={14} className="doc-icon-blue" />
                    <span className="doc-item-filename">{doc.fileName}</span>
                    <Download size={13} className="doc-dl-icon" />
                  </a>
                ))}
              </div>
            )}

            {activeLecture?.topicPdf && (
              <div className="download-docs-list-tray">
                <a
                  href={activeLecture.topicPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-doc-item-link active-topic-pdf"
                  download
                >
                  <BookOpen size={14} className="doc-icon-purple" />
                  <span className="doc-item-filename">{activeLecture.title} (Topic PDF)</span>
                  <Download size={13} className="doc-dl-icon" />
                </a>
              </div>
            )}
          </div>

          {/* 5. Quiz Card */}
          <div className="mc-watch-action-card quiz-card">
            <div className="action-card-top">
              <div className="action-icon-circle purple">
                <HelpCircle size={16} />
              </div>
              <div className="action-title-block">
                <h4>Quiz</h4>
                <p className="quiz-eligibility-warning">
                  Complete video topics to unlock the quiz and assessment benchmarking.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Claim your Certificate Card */}
          <div className="mc-watch-action-card cert-card">
            <div className="action-card-top">
              <div className="action-icon-circle blue">
                <Award size={16} />
              </div>
              <div className="action-title-block">
                <h4>Claim your Certificate</h4>
                <span className="action-sub-text">1 Final Assessment</span>
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
