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
  AlertCircle,
  History,
  RefreshCw
} from 'lucide-react';
import userCertificateImg from '../../assets/e47782ae-798b-479b-99e6-428b70bf4a7a.png';
import watchNowImg from '../../assets/watchnow.png';
import { 
  getMicroCourseTopicDetail, 
  microCredencialWatchvideoAddUpdate, 
  getMicrocredentialStudentWatchVideoData,
  microcredentialTranscriptByTime, 
  getStudentMicrocredentialRaiseHandAnswerList,
  getMicroManyDiscussionQuestion,
  insertMicroManyDiscussionQuestion,
  microCourseDiscussionQuestionLike,
  insertManyMicroCourseDiscussionReply,
  getManyMicroCourseDiscussionQuestionReply
} from '../../services/microcredentialService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';
import { findTopicPdfContent } from '../../data/microcredentialTopicPdfData';

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
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [showAskQuestionInput, setShowAskQuestionInput] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [discussionQuestions, setDiscussionQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Discussion Replies state
  const [openReplyBoxForQuestionId, setOpenReplyBoxForQuestionId] = useState(null);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [questionRepliesMap, setQuestionRepliesMap] = useState({});
  const [loadingRepliesMap, setLoadingRepliesMap] = useState({});
  const [submittingReplyMap, setSubmittingReplyMap] = useState({});

  const [aiAssistantOpen, setAiAssistantOpen] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null); // { url, title } for in-page embedded PDF viewing

  // AI Assistant Chat & History state
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [showAiHistory, setShowAiHistory] = useState(false);
  const [aiHistoryList, setAiHistoryList] = useState([]);
  const [aiHistoryLoading, setAiHistoryLoading] = useState(false);

  const [isTextContentOpen, setIsTextContentOpen] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Student Watch Video Progress states (POST /api/MicroCredencialStudentWatchVideoAPI/GetMicrocredentialStudentWatchVideoData)
  const [overallWatchPct, setOverallWatchPct] = useState(33);
  const [videoProgressMap, setVideoProgressMap] = useState({});
  const [isQuizEligible, setIsQuizEligible] = useState(false);
  const [quizStatusMessage, setQuizStatusMessage] = useState('');

  // Custom Player & Anti-Skip States
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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
                topicPdf: item.topicPdf ? formatImageUrl(item.topicPdf) : 'https://pdfobject.com/pdf/sample.pdf',
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

  // Dynamic 5-unit fallback playlist matching syllabus
  const defaultPlaylist = [
    {
      id: 1,
      title: 'INTRODUCTION TO STRESS',
      videoTitle: 'Introduction to Stress & Homeostasis',
      code: 'Unit 1',
      org: currentCourse.category || 'Management',
      duration: '08:51',
      videoDuration: 531,
      videoUrl: 'https://www.youtube.com/watch?v=8ihY2TZXuz0',
      ytId: '8ihY2TZXuz0',
      isYouTube: true,
      topicPdf: 'https://pdfobject.com/pdf/sample.pdf',
      progress: 0,
      isLocked: false
    },
    {
      id: 2,
      title: 'SOURCES OF STRESS',
      videoTitle: 'Internal & External Triggers of Stress',
      code: 'Unit 2',
      org: currentCourse.category || 'Management',
      duration: '09:20',
      videoDuration: 560,
      videoUrl: 'https://www.youtube.com/watch?v=8ihY2TZXuz0',
      ytId: '8ihY2TZXuz0',
      isYouTube: true,
      topicPdf: 'https://pdfobject.com/pdf/sample.pdf',
      progress: 0,
      isLocked: false
    },
    {
      id: 3,
      title: 'IMPACT OF STRESS',
      videoTitle: 'Physiological and Cognitive Impact',
      code: 'Unit 3',
      org: currentCourse.category || 'Management',
      duration: '11:15',
      videoDuration: 675,
      videoUrl: 'https://www.youtube.com/watch?v=8ihY2TZXuz0',
      ytId: '8ihY2TZXuz0',
      isYouTube: true,
      topicPdf: 'https://pdfobject.com/pdf/sample.pdf',
      progress: 0,
      isLocked: false
    },
    {
      id: 4,
      title: 'STRESS RESPONSE',
      videoTitle: 'Neurological & Endocrine Response',
      code: 'Unit 4',
      org: currentCourse.category || 'Management',
      duration: '07:45',
      videoDuration: 465,
      videoUrl: 'https://www.youtube.com/watch?v=8ihY2TZXuz0',
      ytId: '8ihY2TZXuz0',
      isYouTube: true,
      topicPdf: 'https://pdfobject.com/pdf/sample.pdf',
      progress: 0,
      isLocked: false
    },
    {
      id: 5,
      title: 'COPING MECHANISMS',
      videoTitle: 'Mindfulness, Resilience and Coping',
      code: 'Unit 5',
      org: currentCourse.category || 'Management',
      duration: '12:10',
      videoDuration: 730,
      videoUrl: 'https://www.youtube.com/watch?v=8ihY2TZXuz0',
      ytId: '8ihY2TZXuz0',
      isYouTube: true,
      topicPdf: 'https://pdfobject.com/pdf/sample.pdf',
      progress: 0,
      isLocked: false
    }
  ];

  const currentPlaylist = playlist.length > 0 ? playlist : defaultPlaylist;
  const activeLecture = currentPlaylist[activeLectureIdx] || currentPlaylist[0];

  // Helper to safely format HTML in AI answers (e.g. <p>...</p>)
  const formatAiAnswer = (text) => {
    if (!text) return null;
    if (typeof text === 'string' && /<[a-z][\s\S]*>/i.test(text)) {
      return <div className="ai-rich-html-content" dangerouslySetInnerHTML={{ __html: text }} />;
    }
    return <span>{text}</span>;
  };

  // Fetch paginated history of AI questions asked by student (POST /api/IgnitoMicroCredencialAPI/GetStudentMicrocredentialRaiseHandAnswerList)
  const fetchAiHistory = async (page = 1) => {
    try {
      setAiHistoryLoading(true);
      const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 1;
      const courseId = Number(rawId) || 1;

      // Resolve valid VideoId for the current topic / lecture to satisfy backend requirement
      const vId = activeLecture?.ytId || 
                  getYouTubeVideoId(activeLecture?.videoUrl) || 
                  activeLecture?.videoId || 
                  activeLecture?.rawData?.videoId || 
                  activeLecture?.rawData?.microcreditYoutubeDataMasterId || 
                  '8ihY2TZXuz0';

      const res = await getStudentMicrocredentialRaiseHandAnswerList(
        3, // StudentId: 3 static
        0, // StudentDegreeAdmissionId: 0
        courseId, // MicrocredentialCourseId
        vId, // VideoId (always passed)
        page, // PageNumber: 1
        10 // PageSize: 10
      );

      if (res && res.success && Array.isArray(res.getStudentMicrocredentialRaiseHandAnswer)) {
        setAiHistoryList(res.getStudentMicrocredentialRaiseHandAnswer);
      }
    } catch (err) {
      console.error('Error fetching student AI raise hand history:', err);
    } finally {
      setAiHistoryLoading(false);
    }
  };

  // AI Assistant question handler (POST /api/IgnitoMicroCredencialAPI/MicrocredentialTranscriptByTime)
  const handleSendAiQuestion = async () => {
    if (!aiQuery.trim() || aiLoading) return;
    const questionText = aiQuery.trim();
    const isPdf = Boolean(selectedPdf);
    const currentTopicName = selectedPdf ? selectedPdf.title : (activeLecture?.title || 'General');

    // Extract PDF text content if viewing PDF; empty string if viewing video
    let econtentText = '';
    if (isPdf) {
      const topicData = findTopicPdfContent(currentTopicName, questionText);
      econtentText = topicData.pageContent || `E-Content notes for topic ${currentTopicName}`;
    }

    const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 1;
    const courseId = Number(rawId) || 1;
    // Always pass valid VideoId as required by the backend API
    const vId = activeLecture?.ytId || 
                getYouTubeVideoId(activeLecture?.videoUrl) || 
                activeLecture?.videoId || 
                activeLecture?.rawData?.videoId || 
                activeLecture?.rawData?.microcreditYoutubeDataMasterId || 
                '8ihY2TZXuz0';
    const timestamp = isPdf ? 0 : Number(currentTime || 0);

    const userMsg = { 
      sender: 'user', 
      text: questionText, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setAiChatMessages(prev => [...prev, userMsg]);
    setAiQuery('');
    setAiLoading(true);

    try {
      const res = await microcredentialTranscriptByTime(
        3, // StudentId: 3 static
        0, // StudentDegreeAdmissionId: 0
        vId, // VideoId (always passed)
        questionText, // Question
        courseId, // MicrocredentialCourseId
        timestamp, // HandRaiseTime (0 if PDF; video timestamp if video)
        econtentText, // Econtent (extracted PDF content if viewing PDF; empty if video)
        isPdf // IsEcontent (true if PDF; false if video)
      );

      let answerText = res.answer || res.message;
      if (!answerText) {
        const topicData = findTopicPdfContent(currentTopicName, questionText);
        answerText = `Key insight from ${currentTopicName}: ${topicData.pageContent.slice(0, 240)}...`;
      }

      const aiMsg = {
        sender: 'ai',
        text: answerText,
        citations: [currentTopicName],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChatMessages(prev => [...prev, aiMsg]);

      // Automatically refresh history list in background
      fetchAiHistory(1);
    } catch (err) {
      console.error('Error asking AI Coach:', err);
      setAiChatMessages(prev => [...prev, {
        sender: 'ai',
        text: `Based on accredited course syllabus for ${currentTopicName}, review key concepts and summary notes.`,
        citations: [currentTopicName]
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Fetch group discussion questions from API (POST /api/MicroDiscussionForumAPI/GetMicroManyDiscussionQuestion)
  const fetchDiscussionQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 1;
      const courseId = Number(rawId) || 1;
      const res = await getMicroManyDiscussionQuestion(courseId, 3);
      if (res && res.success && Array.isArray(res.microDiscussionQuestions)) {
        setDiscussionQuestions(res.microDiscussionQuestions);
        // Automatically fetch replies for all questions so they are shown immediately outside
        res.microDiscussionQuestions.forEach(q => {
          if (q.microCourseDiscussionQuestionId) {
            fetchQuestionReplies(q.microCourseDiscussionQuestionId);
          }
        });
      }
    } catch (err) {
      console.error('Error fetching discussion questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchDiscussionQuestions();
  }, [course]);

  // Create discussion question (POST /api/MicroDiscussionForumAPI/InsertMicroManyDiscussionQuestion)
  const handleCreateQuestion = async () => {
    if (!newQuestionText.trim() || submittingQuestion) return;
    try {
      setSubmittingQuestion(true);
      const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 1;
      const courseId = Number(rawId) || 1;
      const res = await insertMicroManyDiscussionQuestion(3, 0, courseId, newQuestionText.trim());
      if (res && res.success) {
        setNewQuestionText('');
        setShowAskQuestionInput(false);
        setShowAskModal(false);
        await fetchDiscussionQuestions();
      } else {
        alert(res?.message || 'Failed to post question');
      }
    } catch (err) {
      console.error('Error creating discussion question:', err);
    } finally {
      setSubmittingQuestion(false);
    }
  };

  // Like / unlike discussion question (POST /api/MicroDiscussionForumAPI/MicroCourseDiscussionQuestionLike)
  const handleToggleLikeQuestion = async (questionId, currentIsLiked, currentLikeCount) => {
    const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 1;
    const courseId = Number(rawId) || 1;

    // Optimistic UI update
    setDiscussionQuestions(prev => prev.map(q => {
      if (q.microCourseDiscussionQuestionId === questionId) {
        const nextLiked = !currentIsLiked;
        const nextCount = nextLiked ? (Number(currentLikeCount || 0) + 1) : Math.max(0, Number(currentLikeCount || 0) - 1);
        return { ...q, isLiked: nextLiked, likeCount: nextCount };
      }
      return q;
    }));

    try {
      await microCourseDiscussionQuestionLike(questionId, 3, courseId);
    } catch (err) {
      console.error('Error liking question:', err);
    }
  };

  // Fetch replies for a discussion question (POST /api/MicroDiscussionForumAPI/GetManyMicroCourseDiscussionQuestionReply)
  const fetchQuestionReplies = async (questionId) => {
    try {
      setLoadingRepliesMap(prev => ({ ...prev, [questionId]: true }));
      const res = await getManyMicroCourseDiscussionQuestionReply(questionId);
      if (res && res.success && Array.isArray(res.getMicroManyDiscussionQuestionReplay)) {
        setQuestionRepliesMap(prev => ({ ...prev, [questionId]: res.getMicroManyDiscussionQuestionReplay }));
      }
    } catch (err) {
      console.error(`Error fetching replies for question ${questionId}:`, err);
    } finally {
      setLoadingRepliesMap(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Toggle reply box and load replies
  const handleToggleReplyBox = (questionId) => {
    if (openReplyBoxForQuestionId === questionId) {
      setOpenReplyBoxForQuestionId(null);
    } else {
      setOpenReplyBoxForQuestionId(questionId);
      fetchQuestionReplies(questionId);
    }
  };

  // Submit reply to discussion question (POST /api/MicroDiscussionForumAPI/InsertManyMicroCourseDiscussionReply)
  const handleSubmitReply = async (questionId) => {
    const replyText = replyTextMap[questionId] || '';
    if (!replyText.trim() || submittingReplyMap[questionId]) return;

    try {
      setSubmittingReplyMap(prev => ({ ...prev, [questionId]: true }));
      const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 1;
      const courseId = Number(rawId) || 1;

      const res = await insertManyMicroCourseDiscussionReply(
        questionId,
        3, // StudentId: 3
        0, // ProfessorId: 0
        courseId, // MicroCorseId
        replyText.trim()
      );

      if (res && res.success) {
        setReplyTextMap(prev => ({ ...prev, [questionId]: '' }));
        await fetchQuestionReplies(questionId);
        setDiscussionQuestions(prev => prev.map(q => {
          if (q.microCourseDiscussionQuestionId === questionId) {
            return { ...q, replyCount: (Number(q.replyCount || 0) + 1) };
          }
          return q;
        }));
      } else {
        alert(res?.message || 'Failed to post reply');
      }
    } catch (err) {
      console.error('Error posting discussion reply:', err);
    } finally {
      setSubmittingReplyMap(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Fetch student watch progress & quiz status (POST /api/MicroCredencialStudentWatchVideoAPI/GetMicrocredentialStudentWatchVideoData)
  const fetchStudentWatchData = async () => {
    try {
      const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 1;
      const courseId = Number(rawId) || 1;
      const res = await getMicrocredentialStudentWatchVideoData(3, courseId);
      if (res && res.success) {
        if (typeof res.overallPercentage === 'number' && res.overallPercentage >= 0) {
          setOverallWatchPct(Math.round(res.overallPercentage));
        }
        setIsQuizEligible(Boolean(res.isQuizOpen));
        if (res.statusMessage) {
          setQuizStatusMessage(res.statusMessage);
        }
        if (Array.isArray(res.studentwatchvideodetails) && res.studentwatchvideodetails.length > 0) {
          const map = {};
          res.studentwatchvideodetails.forEach(item => {
            const vId = item.videoId || item.VideoId;
            if (vId) {
              map[vId] = {
                percentageWatched: Math.round(Number(item.percentageWatched ?? item.PercentageWatched ?? 0)),
                watchedSeconds: Math.round(Number(item.watchedSeconds ?? item.WatchedSeconds ?? 0)),
                totalDuration: Math.round(Number(item.totalDuration ?? item.TotalDuration ?? 0))
              };
            }
          });
          setVideoProgressMap(map);
        }
      }
    } catch (err) {
      console.error('Error fetching student watch video data:', err);
    }
  };

  useEffect(() => {
    fetchStudentWatchData();
  }, [course]);

  // Save / update video watch progress (POST /api/MicroCredencialStudentWatchVideoAPI/MicroCredencialWatchvideoAddUpdate)
  const saveCurrentWatchProgress = async (watchedSec, totalDur) => {
    try {
      const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 1;
      const courseId = Number(rawId) || 1;
      const vId = activeLecture?.ytId || 
                  getYouTubeVideoId(activeLecture?.videoUrl) || 
                  activeLecture?.videoId || 
                  activeLecture?.rawData?.videoId || 
                  '8ihY2TZXuz0';

      const sec = Math.round(Number(watchedSec || currentTime || 0));
      const dur = Math.round(Number(totalDur || videoDuration || activeLecture?.videoDuration || 1));
      const pct = Math.min(100, Math.max(0, Math.round((sec / dur) * 100)));

      // Update local progress map optimistically
      const updatedMap = {
        ...videoProgressMap,
        [vId]: {
          percentageWatched: Math.max(pct, videoProgressMap[vId]?.percentageWatched || 0),
          watchedSeconds: Math.max(sec, videoProgressMap[vId]?.watchedSeconds || 0),
          totalDuration: dur
        }
      };
      setVideoProgressMap(updatedMap);

      const totalUnits = currentPlaylist.length || 1;
      let sumPct = 0;
      currentPlaylist.forEach(pItem => {
        const itemVid = pItem.ytId || getYouTubeVideoId(pItem.videoUrl) || pItem.id;
        sumPct += (updatedMap[itemVid]?.percentageWatched || 0);
      });
      const calcOverall = Math.min(100, Math.round(sumPct / totalUnits));
      setOverallWatchPct(calcOverall);

      const payloadDetails = [
        {
          VideoId: vId,
          WatchedSeconds: sec,
          TotalDuration: dur,
          PercentageWatched: pct
        }
      ];

      await microCredencialWatchvideoAddUpdate(3, courseId, calcOverall, payloadDetails);
    } catch (err) {
      console.error('Error saving video watch progress:', err);
    }
  };

  // Periodic watch progress auto-saver (every 2 minutes) and on page unload
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (isPlaying && !selectedPdf && currentTime > 0) {
        saveCurrentWatchProgress(currentTime, videoDuration);
      }
    }, 120000); // 2 minutes

    const handleBeforeUnload = () => {
      if (currentTime > 0) {
        saveCurrentWatchProgress(currentTime, videoDuration);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(autoSaveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPlaying, currentTime, videoDuration, activeLectureIdx, selectedPdf]);

  // Fallback default questions if no backend questions exist yet
  const defaultQuestions = [
    {
      microCourseDiscussionQuestionId: 1,
      studentName: 'Anjali Sharma',
      studentProfileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      createdOn: '06/27/2026 14:51:14',
      question: 'How can I handle stress?',
      description: '',
      replyCount: 1,
      isLiked: true,
      likeCount: 2
    }
  ];

  // Fallback default replies if none returned yet
  const defaultReplies = [
    {
      microCourseDiscussionQuestionReplyId: 1,
      microCourseDiscussionQuestionId: 1,
      professorName: currentCourse.instructor || 'Leesa Shashikant Mehra',
      professorProfileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      createdOn: '24 August, 2026 03:41:06 PM',
      reply: 'Stress can be managed by identifying its causes, staying organized, taking regular breaks, practicing deep breathing or relaxation exercises, exercising regularly, getting enough sleep, eating healthy, and talking to someone you trust about your concerns. Making time for hobbies and enjoyable activities can also help you relax and maintain a positive mindset.'
    }
  ];

  const activeQuestions = discussionQuestions.length > 0 ? discussionQuestions : defaultQuestions;

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
      saveCurrentWatchProgress(currentTime, videoDuration);
      setActiveLectureIdx(activeLectureIdx - 1);
      setIsPlaying(false);
    }
  };

  const handleNextLesson = () => {
    if (activeLectureIdx < currentPlaylist.length - 1) {
      saveCurrentWatchProgress(currentTime, videoDuration);
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
              
              {/* Central Video Frame with Custom Shield Layer & Embedded PDF Viewer */}
              <div className="theater-video-frame custom-player-frame" style={selectedPdf ? { aspectRatio: 'auto', minHeight: '520px', display: 'flex', flexDirection: 'column' } : {}}>
                
                {selectedPdf ? (
                  <div className="theater-embedded-pdf-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0b1320', flex: 1 }}>
                    <div className="theater-embedded-pdf-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', background: 'linear-gradient(90deg, #00385E 0%, #00223b 100%)', color: '#ffffff', borderBottom: '1.5px solid #0284C7' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 800 }}>
                        <FileText size={18} style={{ color: '#38bdf8' }} />
                        <span>Interactive e-Content: <strong style={{ color: '#bae6fd', textTransform: 'uppercase' }}>{selectedPdf.title}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setAiAssistantOpen(true);
                            setShowAiHistory(false);
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0284C7', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 6px rgba(2,132,199,0.3)' }}
                        >
                          <Sparkles size={14} />
                          <span>Ask AI Tutor</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPdf(null);
                            setIsPlaying(true);
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ffffff', color: '#00385E', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                        >
                          <Play size={13} fill="#00385E" />
                          <span>Back to Video</span>
                        </button>
                      </div>
                    </div>
                    <iframe
                      src={`${selectedPdf.url}#toolbar=1&navpanes=0`}
                      title={selectedPdf.title}
                      className="theater-embedded-pdf-iframe"
                      style={{ width: '100%', flex: 1, minHeight: '480px', border: 'none' }}
                    />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* Bottom Custom Playback Bar (Full Custom UI with Anti-Skip Progress Bar) */}
              {!selectedPdf && (
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
            <div className="mc-ai-helper-drawer" style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 4px 20px rgba(0, 56, 94, 0.05)' }}>
              <div className="ai-drawer-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div className="ai-bot-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00385E', fontSize: '1rem', fontWeight: 800 }}>
                  <Sparkles size={18} style={{ color: '#00385E' }} />
                  <span>IgnitoAssist AI Learning Coach</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* History Toggle Button */}
                  <button 
                    type="button" 
                    className="btn-ai-history-toggle"
                    onClick={() => {
                      const nextState = !showAiHistory;
                      setShowAiHistory(nextState);
                      if (nextState) {
                        fetchAiHistory(1);
                      }
                    }}
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      background: showAiHistory ? '#00385E' : '#ffffff', 
                      color: showAiHistory ? '#ffffff' : '#00385E', 
                      border: '1.5px solid #00385E', 
                      padding: '6px 14px', 
                      borderRadius: '8px', 
                      fontSize: '0.82rem', 
                      fontWeight: 700, 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    title="View past questions & AI answers"
                  >
                    <History size={14} />
                    <span>{showAiHistory ? 'Back to Live AI' : 'History'}</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-close-ai" 
                    onClick={() => setAiAssistantOpen(false)} 
                    style={{ background: 'none', border: 'none', fontSize: '1.3rem', color: '#64748b', cursor: 'pointer', lineHeight: 1 }}
                    aria-label="Close AI Assistant"
                  >×</button>
                </div>
              </div>

              {/* VIEW 1: Q&A HISTORY LIST */}
              {showAiHistory ? (
                <div className="ai-history-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 800, color: '#00385E' }}>
                      <History size={16} style={{ color: '#00385E' }} />
                      <span>Past Questions & Answers ({aiHistoryList.length})</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => fetchAiHistory(1)}
                      disabled={aiHistoryLoading}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#00385E', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      <RefreshCw size={13} className={aiHistoryLoading ? 'animate-spin' : ''} />
                      <span>{aiHistoryLoading ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                  </div>

                  {aiHistoryLoading ? (
                    <div style={{ padding: '24px 0', textAlign: 'center', color: '#00385E', fontSize: '0.86rem', fontWeight: 600 }}>
                      Loading your questions & answers...
                    </div>
                  ) : aiHistoryList.length === 0 ? (
                    <div style={{ padding: '24px 10px', textAlign: 'center', color: '#64748b', fontSize: '0.86rem' }}>
                      <p style={{ margin: '0 0 6px 0', fontWeight: 700, color: '#00385E' }}>No questions recorded yet for this topic.</p>
                      <span>Ask a question below to get started!</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                      {aiHistoryList.map((item, idx) => (
                        <div 
                          key={item.studentMicrocredentialRaiseHandAnswerId || idx} 
                          style={{ background: '#ffffff', borderRadius: '10px', padding: '14px 16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
                              <span style={{ width: '24px', height: '24px', minWidth: '24px', background: '#00385E', color: '#ffffff', fontSize: '0.74rem', fontWeight: 800, borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {idx + 1}
                              </span>
                              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#00385E', lineHeight: '24px' }}>
                                {item.question}
                              </div>
                            </div>
                            {item.createdOn && <span style={{ fontSize: '0.72rem', color: '#94a3b8', flexShrink: 0, lineHeight: '24px' }}>{item.createdOn}</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <span style={{ width: '24px', height: '24px', minWidth: '24px', background: '#00385E', color: '#ffffff', fontSize: '0.64rem', fontWeight: 800, borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              AI
                            </span>
                            <div style={{ fontSize: '0.85rem', color: '#334155', flex: 1, lineHeight: 1.5, borderLeft: '2px solid #00385E', paddingLeft: '10px' }}>
                              {formatAiAnswer(item.answer)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* VIEW 2: LIVE CHAT MESSAGES */
                aiChatMessages.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', padding: '12px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    {aiChatMessages.map((msg, mIdx) => (
                      <div key={mIdx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', background: msg.sender === 'user' ? '#00385E' : '#ffffff', color: msg.sender === 'user' ? '#ffffff' : '#1e293b', border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0', borderLeft: msg.sender === 'user' ? 'none' : '3px solid #00385E', padding: '10px 14px', borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', fontSize: '0.84rem', lineHeight: 1.5 }}>
                        <div>{formatAiAnswer(msg.text)}</div>
                        {msg.citations && msg.citations.length > 0 && (
                          <div style={{ fontSize: '0.72rem', color: msg.sender === 'user' ? '#e2e8f0' : '#00385E', marginTop: '6px', fontWeight: 700 }}>
                            Reference: {msg.citations.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                    {aiLoading && (
                      <div style={{ alignSelf: 'flex-start', fontSize: '0.8rem', color: '#00385E', fontWeight: 700, fontStyle: 'italic' }}>
                        IgnitoAssist is analyzing {selectedPdf ? 'the PDF text content' : 'the video transcript'}...
                      </div>
                    )}
                  </div>
                )
              )}

              {/* Interactive Question Input Wrap */}
              <div className="ai-input-wrap" style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder={`Ask a question about ${selectedPdf ? selectedPdf.title : activeLecture.title}...`}
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendAiQuestion(); }}
                  style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem', outline: 'none', background: '#ffffff', color: '#00385E' }}
                />
                <button 
                  type="button" 
                  className="btn-ai-send"
                  onClick={handleSendAiQuestion}
                  disabled={aiLoading || !aiQuery.trim()}
                  style={{ background: '#00385E', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Send question to AI"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          )}

          {/* 5. Discussion & Community Forum */}
          <div className="mc-discussion-forum-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '24px 26px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)' }}>
            
            {/* Forum Navigation Tabs */}
            <div className="mc-forum-nav-tabs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '22px' }}>
              <button 
                type="button" 
                className="forum-tab-btn active"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#00385E', borderColor: '#00385E', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                <Users size={16} />
                <span>Group Discussion</span>
              </button>

              <button 
                type="button" 
                className="btn-ask-question-cta"
                onClick={() => setShowAskQuestionInput(prev => !prev)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#00385E', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                <MessageSquare size={15} />
                <span>{showAskQuestionInput ? 'Cancel Question' : 'Ask Question'}</span>
              </button>
            </div>

            {/* Inline Question Composer Box */}
            {showAskQuestionInput && (
              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', marginBottom: '22px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.96rem', fontWeight: '800', color: '#00385E' }}>
                  Post a Question or Topic to the Forum
                </h4>
                <textarea 
                  rows={3}
                  placeholder="What is your question about this course or topic?..."
                  value={newQuestionText}
                  onChange={e => setNewQuestionText(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => { setShowAskQuestionInput(false); setNewQuestionText(''); }}
                    style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCreateQuestion}
                    disabled={submittingQuestion || !newQuestionText.trim()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#00385E', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}
                  >
                    <Send size={14} />
                    <span>{submittingQuestion ? 'Posting...' : 'Post Question'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Loading indicator for questions */}
            {loadingQuestions && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                <RefreshCw size={20} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>Loading discussions...</p>
              </div>
            )}

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {activeQuestions.map((q, idx) => {
                const qId = q.microCourseDiscussionQuestionId || (idx + 1);
                const isReplyOpen = openReplyBoxForQuestionId === qId;
                const replies = questionRepliesMap[qId] || (qId === 1 && activeQuestions === defaultQuestions ? defaultReplies : []);
                const isLoadingReplies = loadingRepliesMap[qId];
                const isSubmittingReply = submittingReplyMap[qId];
                const currentReplyInput = replyTextMap[qId] || '';
                const isLiked = Boolean(q.isLiked);
                const likeCount = Number(q.likeCount || 0);

                return (
                  <div 
                    key={qId} 
                    className="forum-question-item"
                    style={{ border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', background: '#ffffff' }}
                  >
                    {/* Author Meta */}
                    <div className="question-author-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div className="author-avatar-circle" style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid #c7d2fe', flexShrink: 0 }}>
                        <img 
                          src={q.studentProfileImage ? formatImageUrl(q.studentProfileImage) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
                          alt={q.studentName || 'Student'} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="author-name-stamp">
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>
                          {q.studentName || 'Student'}
                        </h4>
                        <span className="post-timestamp" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#94a3b8' }}>
                          <Clock size={12} />
                          <span>Posted {q.createdOn || 'recently'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="question-body-heading" style={{ margin: '12px 0 16px 0' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#00385E', margin: 0, lineHeight: 1.4 }}>
                        {q.question}
                      </h3>
                      {q.description && (
                        <p style={{ margin: '8px 0 0 0', fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                          {q.description}
                        </p>
                      )}
                    </div>

                    {/* Action Bar (Like, Reply, Reply count) */}
                    <div className="question-actions-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Like button */}
                      <button 
                        type="button" 
                        className={`btn-like-forum ${isLiked ? 'liked' : ''}`}
                        onClick={() => handleToggleLikeQuestion(qId, isLiked, likeCount)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: isLiked ? '#00385E' : '#ffffff',
                          border: `1.5px solid ${isLiked ? '#00385E' : '#cbd5e1'}`,
                          color: isLiked ? '#ffffff' : '#00385E',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ThumbsUp size={13} fill={isLiked ? '#ffffff' : 'none'} />
                        <span>{isLiked ? `Liked ${likeCount}` : `Like ${likeCount}`}</span>
                      </button>

                      {/* Reply button */}
                      <button 
                        type="button" 
                        className="btn-reply-forum"
                        onClick={() => handleToggleReplyBox(qId)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: isReplyOpen ? '#e0f2fe' : '#ffffff',
                          border: '1.5px solid #00385E',
                          color: '#00385E',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          padding: '6px 16px',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <MessageSquare size={13} />
                        <span>Reply</span>
                      </button>

                      {/* Reply count on right */}
                      <div 
                        className="forum-reply-count-badge"
                        style={{ 
                          marginLeft: 'auto', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '5px', 
                          fontSize: '0.82rem', 
                          color: '#00385E', 
                          fontWeight: '700',
                          background: '#f0f7fc',
                          border: '1px solid #c9dfef',
                          padding: '4px 12px',
                          borderRadius: '12px'
                        }}
                      >
                        <MessageSquare size={13} />
                        <span>{q.replyCount || (replies ? replies.length : 0) || 0} {Number(q.replyCount || (replies ? replies.length : 0) || 0) === 1 ? 'reply' : 'replies'}</span>
                      </div>
                    </div>

                    {/* List of Existing Replies (Always rendered outside) */}
                    {replies && replies.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                        {replies.map((r, rIdx) => (
                          <div 
                            key={r.microCourseDiscussionQuestionReplyId || rIdx}
                            className="forum-nested-professor-reply"
                            style={{ background: '#f8fafc', borderLeft: '3px solid #00385E', borderRadius: '0 12px 12px 0', padding: '14px 18px' }}
                          >
                            <div className="prof-author-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="prof-avatar-circle" style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid #cbd5e1' }}>
                                  <img 
                                    src={r.professorProfileImage || r.studentProfileImage ? formatImageUrl(r.professorProfileImage || r.studentProfileImage) : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'} 
                                    alt={r.professorName || r.studentName || 'Respondent'} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                                <div className="prof-name-stamp">
                                  <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#00385E', margin: 0 }}>
                                    {r.professorName || r.studentName || 'Faculty / Peer'}
                                  </h4>
                                </div>
                              </div>
                              <span className="prof-timestamp" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#94a3b8' }}>
                                <Clock size={11} />
                                <span>{r.createdOn || 'recently'}</span>
                              </span>
                            </div>
                            <p className="prof-reply-text" style={{ fontSize: '0.86rem', lineHeight: '1.55', color: '#334155', margin: 0 }}>
                              {r.reply || r.replyText}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Reply Input Field (ONLY opened on clicking Reply button) */}
                    {isReplyOpen && (
                      <div 
                        style={{
                          background: '#f8fafc',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '14px 16px',
                          marginTop: '14px'
                        }}
                      >
                        <textarea 
                          rows={3}
                          placeholder="Write your reply here..."
                          value={currentReplyInput}
                          onChange={e => setReplyTextMap(prev => ({ ...prev, [qId]: e.target.value }))}
                          autoFocus
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #e2e8f0',
                            fontSize: '0.88rem',
                            outline: 'none',
                            background: '#ffffff',
                            color: '#1e293b',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                          <button 
                            type="button" 
                            onClick={() => handleToggleReplyBox(qId)}
                            style={{
                              padding: '6px 18px',
                              borderRadius: '20px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              color: '#64748b',
                              fontSize: '0.82rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleSubmitReply(qId)}
                            disabled={isSubmittingReply || !currentReplyInput.trim()}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 20px',
                              borderRadius: '20px',
                              border: 'none',
                              background: '#00385E',
                              color: '#ffffff',
                              fontSize: '0.82rem',
                              fontWeight: '700',
                              cursor: isSubmittingReply || !currentReplyInput.trim() ? 'not-allowed' : 'pointer',
                              opacity: isSubmittingReply || !currentReplyInput.trim() ? 0.6 : 1
                            }}
                          >
                            <Send size={13} />
                            <span>{isSubmittingReply ? 'Posting...' : 'Post Reply'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
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
                      strokeDasharray={`${overallWatchPct || 33}, 100`} 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    />
                    <text x="18" y="20.35" className="percentage-text">{overallWatchPct || 33}%</text>
                  </svg>
                </div>

                <div className="progress-text-info">
                  <strong>Overall Progress</strong>
                  <span>
                    {currentPlaylist.filter(pItem => {
                      const itemVid = pItem.ytId || getYouTubeVideoId(pItem.videoUrl) || pItem.id;
                      return (videoProgressMap[itemVid]?.percentageWatched || 0) >= 90;
                    }).length || (overallWatchPct > 0 ? Math.max(1, Math.round((overallWatchPct / 100) * currentPlaylist.length)) : 1)} of {currentPlaylist.length} Topics
                  </span>
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
                const isActive = idx === activeLectureIdx && !selectedPdf;
                const itemVid = item.ytId || getYouTubeVideoId(item.videoUrl) || item.id;
                const itemProgress = videoProgressMap[itemVid]?.percentageWatched ?? (idx === 0 ? (overallWatchPct > 0 ? overallWatchPct : 39) : 0);

                return (
                  <div 
                    key={item.id} 
                    className={`playlist-item-row ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (currentTime > 0) saveCurrentWatchProgress(currentTime, videoDuration);
                      setSelectedPdf(null);
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

                    <div className="playlist-item-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="playlist-item-pct">{item.duration}</span>
                      
                      {/* Mini Circular Progress Ring matching Screenshot 2 */}
                      <div 
                        style={{ 
                          position: 'relative', 
                          width: '32px', 
                          height: '32px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          flexShrink: 0 
                        }}
                        title={`${itemProgress}% completed`}
                      >
                        <svg width="32" height="32" style={{ transform: 'rotate(-90deg)' }}>
                          <circle
                            cx="16"
                            cy="16"
                            r="11"
                            stroke="#cbd5e1"
                            strokeWidth="2.8"
                            fill="transparent"
                          />
                          {itemProgress > 0 && (
                            <circle
                              cx="16"
                              cy="16"
                              r="11"
                              stroke="#005a96"
                              strokeWidth="2.8"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 11}
                              strokeDashoffset={2 * Math.PI * 11 - (itemProgress / 100) * (2 * Math.PI * 11)}
                              strokeLinecap="round"
                            />
                          )}
                        </svg>
                        <span style={{ 
                          position: 'absolute', 
                          fontSize: '0.62rem', 
                          fontWeight: 800, 
                          color: itemProgress > 0 ? '#00385E' : '#005a96',
                          letterSpacing: '-0.02em'
                        }}>
                          {itemProgress}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Dynamic Learning Text e-Content Accordion */}
          <div className="mc-watch-expandable-card">
            <div 
              className="expandable-header"
              onClick={() => setIsTextContentOpen(!isTextContentOpen)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', background: '#ffffff' }}
            >
              <div className="expandable-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00385E', fontWeight: 800 }}>
                <BookOpen size={16} style={{ color: '#00385E' }} />
                <span>^ Learning Text e-Content</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00385E', background: '#f0f7fc', padding: '2px 8px', borderRadius: '999px', border: '1px solid #c9dfef' }}>
                  {currentPlaylist.length} Units
                </span>
                <ChevronDown size={16} className={`chevron-exp ${isTextContentOpen ? 'open' : ''}`} style={{ color: '#00385E' }} />
              </div>
            </div>

            {isTextContentOpen && (
              <div className="expandable-content-body" style={{ padding: '12px 14px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentPlaylist.map((topicItem, idx) => {
                    const isSelected = selectedPdf?.title === topicItem.title;
                    const pdfUrl = topicItem.topicPdf || 'https://pdfobject.com/pdf/sample.pdf';
                    return (
                      <div 
                        key={topicItem.id || idx}
                        onClick={() => {
                          setSelectedPdf({ url: pdfUrl, title: topicItem.title });
                          setIsPlaying(false);
                          if (videoRef.current) videoRef.current.pause();
                          if (ytPlayerRef.current?.pauseVideo) ytPlayerRef.current.pauseVideo();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          background: isSelected ? '#e0f2fe' : '#ffffff',
                          border: isSelected ? '1.5px solid #0284C7' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        className="mc-topic-pdf-item-row"
                      >
                        {/* Theme Color PDF Badge (#00385E with #0284C7 fold accent) */}
                        <div 
                          style={{
                            width: '32px',
                            height: '38px',
                            background: 'linear-gradient(135deg, #00385E 0%, #002b48 100%)',
                            borderRadius: '4px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 2px 5px rgba(0,56,94,0.25)',
                            border: '1px solid #0284C7'
                          }}
                        >
                          <div 
                            style={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              width: '9px',
                              height: '9px',
                              background: '#0284C7',
                              borderBottomLeftRadius: '3px'
                            }} 
                          />
                          <span style={{ fontSize: '0.62rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em' }}>PDF</span>
                        </div>

                        {/* Themed Topic Link */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span 
                            style={{ 
                              fontSize: '0.82rem', 
                              fontWeight: 800, 
                              color: isSelected ? '#0284C7' : '#00385E', 
                              textDecoration: 'underline',
                              textTransform: 'uppercase',
                              letterSpacing: '0.02em',
                              lineHeight: 1.3,
                              display: 'block'
                            }}
                            className="mc-topic-pdf-link"
                          >
                            {topicItem.title}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Unit {idx + 1} • Interactive Study Notes
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. Quiz Accordion Section */}
          <div className="mc-watch-expandable-card">
            <div 
              className="expandable-header"
              onClick={() => setIsQuizOpen(!isQuizOpen)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', background: '#ffffff' }}
            >
              <div className="expandable-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00385E', fontWeight: 800 }}>
                <HelpCircle size={16} style={{ color: '#00385E' }} />
                <span>Quiz Assessment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00385E', background: '#f0f7fc', padding: '2px 8px', borderRadius: '999px', border: '1px solid #c9dfef' }}>
                  10 MCQs
                </span>
                <ChevronDown size={16} className={`chevron-exp ${isQuizOpen ? 'open' : ''}`} style={{ color: '#00385E' }} />
              </div>
            </div>

            {isQuizOpen && (
              <div className="expandable-content-body" style={{ padding: '14px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <p style={{ fontSize: '0.84rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                  Benchmark your understanding of <strong>{currentCourse.title}</strong> across all units. Complete to qualify for final certification.
                </p>
                {quizStatusMessage && (
                  <div style={{ fontSize: '0.8rem', color: isQuizEligible ? '#059669' : '#00385E', background: isQuizEligible ? '#ecfdf5' : '#f0f7fc', border: `1px solid ${isQuizEligible ? '#a7f3d0' : '#c9dfef'}`, borderRadius: '6px', padding: '6px 10px', marginBottom: '10px', fontWeight: 600 }}>
                    {quizStatusMessage}
                  </div>
                )}
                <button 
                  type="button" 
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#00385E',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,56,94,0.2)'
                  }}
                  onClick={() => alert(`Starting Quiz Assessment for ${currentCourse.title}`)}
                >
                  <HelpCircle size={15} />
                  <span>Start Assessment Quiz</span>
                </button>
              </div>
            )}
          </div>

          {/* 5. Download Notes & Documents Card */}
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
