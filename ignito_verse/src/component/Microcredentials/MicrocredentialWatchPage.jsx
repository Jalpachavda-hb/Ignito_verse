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
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import userCertificateImg from '../../assets/e47782ae-798b-479b-99e6-428b70bf4a7a.png';
import watchNowImg from '../../assets/watchnow.png';
import { getMicroCourseTopicDetail, microCredencialWatchvideoAddUpdate } from '../../services/microcredentialService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';

// Helpers for Video duration & YouTube formatting
function formatDuration(sec) {
  if (!sec) return '00:00';
  if (typeof sec === 'string' && sec.includes(':')) return sec;
  const totalSec = Math.floor(Number(sec) || 0);
  const mins = Math.floor(totalSec / 60);
  const secs = Math.floor(totalSec % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getYouTubeVideoId(url) {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
}

function isYouTubeUrl(url) {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
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

  // Custom Player & Anti-Skip States
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [showSkipWarning, setShowSkipWarning] = useState(false);

  const videoRef = useRef(null);
  const theaterCardRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const ytContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const maxWatchedRef = useRef(0);

  // Load YouTube IFrame API Script globally once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Fetch dynamic video topic details and downloadable documents
  useEffect(() => {
    let isMounted = true;
    const rawId = course?.microcredentialCourseId || course?.courseId || course?.id || course?.rawData?.microcredentialCourseId;
    const courseId = Number(rawId) || 2;
    const encryptedId = course?.encryptedMicrocredentialCourseId || course?.encryptedId || course?.rawData?.encryptedMicrocredentialCourseId || '';
    
    let studentId = 0;
    try {
      const storedUser = localStorage.getItem('ignito_user') || localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        studentId = Number(parsed?.studentId || parsed?.id || parsed?.userId || 0);
      }
    } catch (e) {}

    getMicroCourseTopicDetail(courseId, studentId, encryptedId)
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success) {
          if (Array.isArray(res.getMicroCourseTopicDetailList) && res.getMicroCourseTopicDetailList.length > 0) {
            const mapped = res.getMicroCourseTopicDetailList.map((item, idx) => {
              const vidUrl = item.topicVideoUrl || '';
              const ytId = getYouTubeVideoId(vidUrl);
              const rawDuration = Number(item.videoEndTime) || Number(item.videoDuration) || 0;
              return {
                id: item.microCourseTopicId || (idx + 1),
                title: item.topicName || item.videoTitle || `Topic ${idx + 1}`,
                videoTitle: item.videoTitle || item.topicName || `Topic ${idx + 1}`,
                code: `Unit ${idx + 1}`,
                org: course?.streamName || course?.category || 'Management',
                duration: formatDuration(rawDuration),
                videoDuration: Math.round(rawDuration),
                videoStartTime: Number(item.videoStartTime || 0),
                videoEndTime: Number(item.videoEndTime || 0),
                videoUrl: vidUrl,
                ytId: ytId,
                isYouTube: Boolean(ytId || isYouTubeUrl(vidUrl)),
                topicPdf: item.topicPdf ? formatImageUrl(item.topicPdf) : '',
                progress: 0,
                isLocked: false,
                rawData: item
              };
            });
            setPlaylist(mapped);
          }

          if (Array.isArray(res.microcredentialStudentDownloadDocumentList)) {
            const mappedDocs = res.microcredentialStudentDownloadDocumentList.map((doc, dIdx) => ({
              id: doc.microcredentialStudentDownloadDocumentId || (dIdx + 1),
              fileName: doc.originalFileName || doc.givenFileName || `Resource-${dIdx + 1}.pdf`,
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

    return () => {
      isMounted = false;
    };
  }, [course]);

  // Fallback playlist if empty
  const defaultPlaylist = [
    {
      id: 1,
      title: 'Topic-1 Understanding Stress and Mental Relaxation',
      videoTitle: 'Understanding Stress and Mental Relaxation',
      code: 'Unit 1',
      org: currentCourse.category || 'Management',
      duration: '08:51',
      videoDuration: 531,
      videoUrl: 'https://www.youtube.com/watch?v=8ihY2TZXuz0',
      ytId: '8ihY2TZXuz0',
      isYouTube: true,
      progress: 0,
      isLocked: false
    }
  ];

  const currentPlaylist = playlist.length > 0 ? playlist : defaultPlaylist;
  const activeLecture = currentPlaylist[activeLectureIdx] || currentPlaylist[0];

  // Initialize or update custom YouTube Player instance
  useEffect(() => {
    let isCancelled = false;
    let timer = null;
    setCurrentTime(0);
    setMaxWatchedTime(0);
    maxWatchedRef.current = 0;
    setIsPlaying(false);

    if (!activeLecture.isYouTube || !activeLecture.ytId) {
      return;
    }

    const checkAndInit = () => {
      if (isCancelled) return;
      if (window.YT && window.YT.Player) {
        const container = document.getElementById('yt-custom-player-container');
        if (!container) {
          timer = setTimeout(checkAndInit, 100);
          return;
        }

        try {
          if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
            ytPlayerRef.current.destroy();
          }
        } catch (e) {}

        try {
          ytPlayerRef.current = new window.YT.Player('yt-custom-player-container', {
            videoId: activeLecture.ytId,
            playerVars: {
              autoplay: 0,
              controls: 0, // Hides default YouTube player controls completely
              disablekb: 1, // Disables keyboard skipping
              modestbranding: 1,
              rel: 0, // Prevents external suggested videos
              showinfo: 0,
              iv_load_policy: 3,
              fs: 0, // Hides native fullscreen button
              playsinline: 1,
              enablejsapi: 1,
              origin: window.location.origin
            },
            events: {
              onReady: (event) => {
                if (isCancelled) return;
                const dur = event.target.getDuration();
                if (dur && dur > 0) setVideoDuration(dur);
                else if (activeLecture.videoDuration) setVideoDuration(activeLecture.videoDuration);
              },
              onStateChange: (event) => {
                if (isCancelled) return;
                if (event.data === window.YT.PlayerState.PLAYING) {
                  setIsPlaying(true);
                  startProgressTracking();
                } else {
                  setIsPlaying(false);
                  stopProgressTracking();
                }
              }
            }
          });
        } catch (err) {
          console.error('Error creating YouTube Player instance:', err);
        }
      } else {
        timer = setTimeout(checkAndInit, 150);
      }
    };

    checkAndInit();

    return () => {
      isCancelled = true;
      if (timer) clearTimeout(timer);
      stopProgressTracking();
    };
  }, [activeLectureIdx, activeLecture.ytId, activeLecture.videoUrl]);

  // Anti-skip enforcement & Progress tracking interval
  const startProgressTracking = () => {
    stopProgressTracking();
    intervalRef.current = setInterval(() => {
      if (activeLecture.isYouTube && ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        const curr = ytPlayerRef.current.getCurrentTime() || 0;
        const dur = ytPlayerRef.current.getDuration() || activeLecture.videoDuration || 0;
        if (dur > 0) setVideoDuration(dur);
        setCurrentTime(curr);

        // Anti-Skip: User attempted to skip ahead past watched progress
        if (curr > maxWatchedRef.current + 2.5) {
          ytPlayerRef.current.seekTo(maxWatchedRef.current, true);
          setCurrentTime(maxWatchedRef.current);
          triggerSkipWarning();
        } else if (curr > maxWatchedRef.current) {
          maxWatchedRef.current = curr;
          setMaxWatchedTime(curr);
        }
      }
    }, 300);
  };

  const stopProgressTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const triggerSkipWarning = () => {
    setShowSkipWarning(true);
    setTimeout(() => {
      setShowSkipWarning(false);
    }, 3000);
  };

  // Custom Controls Handlers
  const handleTogglePlay = () => {
    if (activeLecture.isYouTube && ytPlayerRef.current) {
      if (isPlaying) {
        if (typeof ytPlayerRef.current.pauseVideo === 'function') ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        if (typeof ytPlayerRef.current.playVideo === 'function') ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleToggleMute = () => {
    if (activeLecture.isYouTube && ytPlayerRef.current) {
      if (isMuted) {
        if (typeof ytPlayerRef.current.unMute === 'function') ytPlayerRef.current.unMute();
        setIsMuted(false);
      } else {
        if (typeof ytPlayerRef.current.mute === 'function') ytPlayerRef.current.mute();
        setIsMuted(true);
      }
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Anti-skip protected seek bar click handler
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const targetPct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = targetPct * (videoDuration || activeLecture.videoDuration || 1);

    // Only allow seeking up to the maximum watched point
    if (targetSeconds > maxWatchedRef.current + 1) {
      triggerSkipWarning();
      // Snap to maximum allowed watched point
      if (activeLecture.isYouTube && ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        ytPlayerRef.current.seekTo(maxWatchedRef.current, true);
        setCurrentTime(maxWatchedRef.current);
      } else if (videoRef.current) {
        videoRef.current.currentTime = maxWatchedRef.current;
        setCurrentTime(maxWatchedRef.current);
      }
    } else {
      // Seeking backward to already watched portions is permitted
      if (activeLecture.isYouTube && ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        ytPlayerRef.current.seekTo(targetSeconds, true);
        setCurrentTime(targetSeconds);
      } else if (videoRef.current) {
        videoRef.current.currentTime = targetSeconds;
        setCurrentTime(targetSeconds);
      }
    }
  };

  // HTML5 Video anti-skip handling
  const handleHtml5TimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || activeLecture.videoDuration || 0;
    if (dur > 0) setVideoDuration(dur);
    setCurrentTime(curr);

    if (curr > maxWatchedRef.current + 2.5) {
      videoRef.current.currentTime = maxWatchedRef.current;
      setCurrentTime(maxWatchedRef.current);
      triggerSkipWarning();
    } else if (curr > maxWatchedRef.current) {
      maxWatchedRef.current = curr;
      setMaxWatchedTime(curr);
    }
  };

  const handleFullscreen = () => {
    if (theaterCardRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (theaterCardRef.current.requestFullscreen) {
        theaterCardRef.current.requestFullscreen();
      }
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

  const activeDuration = videoDuration || activeLecture.videoDuration || 600;
  const currentPct = Math.min(100, Math.max(0, (currentTime / (activeDuration || 1)) * 100));
  const maxWatchedPct = Math.min(100, Math.max(0, (maxWatchedTime / (activeDuration || 1)) * 100));

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

          {/* 3. Interactive Theater Player Card */}
          <div className="mc-theater-player-card" ref={theaterCardRef}>
              
              {/* Central Video Frame with Custom Shield Layer */}
              <div className="theater-video-frame custom-player-frame">
                
                {/* Anti-Skip Warning Notification Toast */}
                {showSkipWarning && (
                  <div className="anti-skip-warning-toast">
                    <AlertCircle size={16} />
                    <span>Fast-forwarding is locked. Please watch through to earn credential hours.</span>
                  </div>
                )}

                {/* YouTube API Container */}
                {activeLecture?.isYouTube ? (
                  <div className="theater-yt-api-wrapper" key={activeLecture?.ytId || activeLecture?.id}>
                    <div id="yt-custom-player-container" />
                    {/* Transparent Interaction Shield: intercepts clicks so YouTube UI never opens */}
                    <div 
                      className="theater-interaction-shield" 
                      onClick={handleTogglePlay}
                    />
                  </div>
                ) : (
                  <video 
                    ref={videoRef}
                    src={activeLecture?.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'} 
                    className="theater-html5-video"
                    poster={currentCourse.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80'}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={handleHtml5TimeUpdate}
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onClick={handleTogglePlay}
                  />
                )}

                {/* Big Center Glass Play/Pause Button */}
                {!isPlaying && (
                  <div className="theater-glass-center-play" onClick={handleTogglePlay}>
                    <Play size={28} className="play-triangle-fill" />
                  </div>
                )}
              </div>

              {/* Bottom Custom Playback Bar (Full Custom UI with Anti-Skip Progress Bar) */}
              <div className="theater-bottom-controls-bar">
                <button 
                  type="button" 
                  className="btn-ctrl-play" 
                  onClick={handleTogglePlay}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button 
                  type="button" 
                  className="btn-ctrl-vol" 
                  onClick={handleToggleMute}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                {/* Custom Protected Timeline Progress Bar */}
                <div 
                  className="theater-custom-progress-track"
                  onClick={handleSeek}
                  title="Seeking forward is locked to watched time"
                >
                  {/* Progress unlocked so far */}
                  <div 
                    className="theater-progress-unlocked" 
                    style={{ width: `${maxWatchedPct}%` }} 
                  />
                  {/* Current playback head */}
                  <div 
                    className="theater-progress-current" 
                    style={{ width: `${currentPct}%` }} 
                  >
                    <div className="theater-progress-scrubber-dot" />
                  </div>
                </div>

                <div className="theater-playback-timeline">
                  <span className="ctrl-time-stamp">
                    {formatDuration(currentTime)} / {formatDuration(activeDuration)}
                  </span>
                </div>

                <button 
                  type="button" 
                  className="btn-ctrl-fullscreen" 
                  onClick={handleFullscreen}
                  title="Toggle Fullscreen"
                >
                  <Maximize size={16} />
                </button>
              </div>

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
