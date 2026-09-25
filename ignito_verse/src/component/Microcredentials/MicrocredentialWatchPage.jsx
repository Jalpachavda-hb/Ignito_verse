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
  RefreshCw,
  Video,
  X,
  Plus,
  Pencil,
  Trash2,
  StickyNote,
  Radio
} from 'lucide-react';
import userCertificateImg from '../../assets/e47782ae-798b-479b-99e6-428b70bf4a7a.png';
import watchNowImg from '../../assets/watchnow.png';
import notesImg from '../../assets/notes.png';
import {
  getMicroCourseTopicDetail,
  microCredencialWatchvideoAddUpdate,
  getMicrocredentialStudentWatchVideoData,
  getLoggedInStudentId,
  microcredentialTranscriptByTime,
  getStudentMicrocredentialRaiseHandAnswerList,
  getMicroManyDiscussionQuestion,
  insertMicroManyDiscussionQuestion,
  microCourseDiscussionQuestionLike,
  insertManyMicroCourseDiscussionReply,
  getManyMicroCourseDiscussionQuestionReply,
  microcredentialQuizStudentAttemptDetail,
  getMicrocredentialCourseDetail,
  getMicrocredentialModuleByCourseId,
  addUpdateMicrocredentialVideoNote,
  getMicrocredentialVideoNotes,
  deleteMicrocredentialVideoNote
} from '../../services/microcredentialService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';
import QuizAttemptDetailsModal from '../modals/QuizAttemptDetailsModal';

// Helpers for Video duration & YouTube formatting
function formatDuration(sec) {
  if (!sec) return '00:00';
  if (typeof sec === 'string' && sec.includes(':')) return sec;
  const totalSec = Math.floor(Number(sec) || 0);
  const mins = Math.floor(totalSec / 60);
  const secs = Math.floor(totalSec % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatNoteTime(sec) {
  const totalSec = Math.floor(Number(sec) || 0);
  const mins = Math.floor(totalSec / 60);
  const secs = Math.floor(totalSec % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
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
  onBack = () => { },
  onNavigate = () => { }
}) {
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    const rawId = course?.microcredentialCourseId || course?.courseId || course?.id;
    const courseId = Number(rawId) || 0;
    if (courseId > 0 && !course?.microcredentialCourseName && !course?.title) {
      getMicrocredentialCourseDetail(courseId)
        .then(res => {
          if (res && res.microcredentialCourseName) {
            setCourseDetails(res);
            try {
              const prev = JSON.parse(sessionStorage.getItem('ignito_selected_course') || '{}');
              sessionStorage.setItem('ignito_selected_course', JSON.stringify({ ...prev, ...res }));
            } catch (e) {}
          }
        })
        .catch(() => { });
    }
  }, [course]);

  const currentCourse = {
    ...(course || {}),
    ...(courseDetails || {}),
    title: course?.title || courseDetails?.microcredentialCourseName || course?.microcredentialCourseName || course?.moduleName || ''
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

  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null); // { url, title } for in-page embedded PDF viewing

  // AI Assistant Chat & History state
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [showAiHistory, setShowAiHistory] = useState(false);
  const [aiHistoryList, setAiHistoryList] = useState([]);
  const [aiHistoryLoading, setAiHistoryLoading] = useState(false);

  const [isLearningOpen, setIsLearningOpen] = useState(false);
  const [isTextContentOpen, setIsTextContentOpen] = useState(true);
  const [isQuizAccordionOpen, setIsQuizAccordionOpen] = useState(false);

  // Student Watch Video Progress states (POST /api/MicroCredencialStudentWatchVideoAPI/GetMicrocredentialStudentWatchVideoData)
  const [overallWatchPct, setOverallWatchPct] = useState(0);
  const [videoProgressMap, setVideoProgressMap] = useState({});
  const [isQuizEligible, setIsQuizEligible] = useState(false);
  const [quizStatusMessage, setQuizStatusMessage] = useState('');

  // Quiz Attempt Details Modal state (POST /api/StudentMicrocredentialQuizAPI/MicrocredentialQuizStudentAttemptDetail)
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizAttemptLoading, setQuizAttemptLoading] = useState(false);
  const [quizAttemptError, setQuizAttemptError] = useState('');
  const [quizAttemptData, setQuizAttemptData] = useState(null);

  // Custom Player & Anti-Skip States
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Video Notes states
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [videoNotesList, setVideoNotesList] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [showAddNoteComposer, setShowAddNoteComposer] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [capturedNoteTime, setCapturedNoteTime] = useState(0);
  const [editingNoteId, setEditingNoteId] = useState(0);
  const [submittingNote, setSubmittingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  const videoRef = useRef(null);
  const theaterCardRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const ytContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const maxWatchedRef = useRef(0);
  const userInitiatedPlayRef = useRef(false);

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
    let courseId = Number(rawId) || 0;
    let encryptedId = course?.encryptedMicrocredentialCourseId || course?.encryptedId || course?.rawData?.encryptedMicrocredentialCourseId || '';

    // Sanitize encryptedId: if it's numeric (e.g. "1" or "1/"), it is invalid and should never be used as encryptedId
    if (typeof encryptedId === 'string' && (/^\d+\/?$/.test(encryptedId.trim()) || encryptedId.trim().length <= 4)) {
      if (!courseId) {
        courseId = Number(encryptedId.trim().replace(/\/+/g, '')) || 0;
      }
      encryptedId = '';
    }

    let rawModuleMasterId = course?.microcredentialModuleMasterId || course?.selectedModuleMasterId || course?.selectedModuleId || course?.microcredentialModuleId || course?.moduleId || course?.rawData?.microcredentialModuleMasterId || 0;
    let moduleMasterId = Number(rawModuleMasterId) || 0;

    // Try recovering encrypted ID or moduleMasterId from sessionStorage if missing
    if (!encryptedId || moduleMasterId === 0) {
      try {
        const stored = JSON.parse(sessionStorage.getItem('ignito_selected_course') || '{}');
        const storedCourseId = Number(stored.microcredentialCourseId || stored.courseId || stored.id || 0);
        if ((courseId > 0 && storedCourseId === courseId) || (!courseId && storedCourseId > 0)) {
          if (!courseId && storedCourseId > 0) courseId = storedCourseId;
          const storedEnc = stored.encryptedMicrocredentialCourseId || stored.encryptedId || '';
          if (storedEnc && !/^\d+\/?$/.test(String(storedEnc).trim()) && String(storedEnc).trim().length > 4) {
            encryptedId = storedEnc;
          }
          if (moduleMasterId === 0 && stored.microcredentialModuleMasterId) {
            moduleMasterId = Number(stored.microcredentialModuleMasterId) || 0;
          }
        }
      } catch (e) {}
    }

    if (moduleMasterId > 0) {
      try {
        sessionStorage.setItem('MicrocredentialModuleMasterId', String(moduleMasterId));
      } catch (e) {}
    }

    const studentId = getLoggedInStudentId();

    if (courseId <= 0 && !encryptedId) {
      setLoading(false);
      setPlaylist([]);
      return;
    }

    setLoading(true);

    const processTopicsAndDocs = (rawTopics = [], rawDocs = []) => {
      if (Array.isArray(rawTopics) && rawTopics.length > 0) {
        const mapped = rawTopics.map((item, idx) => {
          const vidUrl = item.topicVideoUrl || '';
          const ytId = getYouTubeVideoId(vidUrl);
          const rawDuration = Number(item.videoEndTime) || Number(item.videoDuration) || 0;
          return {
            id: item.microCourseTopicId || (idx + 1),
            microcredentialModuleMasterId: item.microcredentialModuleMasterId || item.MicrocredentialModuleMasterId || moduleMasterId,
            title: item.topicName || item.videoTitle || `Topic ${idx + 1}`,
            videoTitle: item.videoTitle || item.topicName || `Topic ${idx + 1}`,
            code: `Unit ${idx + 1}`,
            org: currentCourse?.streamName || course?.streamName || course?.category || '',
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
      } else {
        setPlaylist([]);
      }

      if (Array.isArray(rawDocs) && rawDocs.length > 0) {
        const mappedDocs = rawDocs.map((doc, dIdx) => ({
          id: doc.microcredentialStudentDownloadDocumentId || (dIdx + 1),
          fileName: doc.originalFileName || doc.givenFileName || `Resource-${dIdx + 1}.pdf`,
          url: doc.microcredentialStudentDownloadDocument ? formatImageUrl(doc.microcredentialStudentDownloadDocument) : ''
        }));
        setDownloadDocuments(mappedDocs);
      } else {
        setDownloadDocuments([]);
      }
    };

    const loadTopics = async () => {
      let finalEncryptedId = encryptedId;
      let finalModuleMasterId = moduleMasterId;

      // If we have courseId but missing a valid encrypted ID, pre-fetch course details
      if (!finalEncryptedId && courseId > 0) {
        try {
          const detailRes = await getMicrocredentialCourseDetail(courseId);
          if (detailRes && detailRes.encryptedMicrocredentialCourseId) {
            finalEncryptedId = detailRes.encryptedMicrocredentialCourseId;
            setCourseDetails(detailRes);
            try {
              const prev = JSON.parse(sessionStorage.getItem('ignito_selected_course') || '{}');
              sessionStorage.setItem('ignito_selected_course', JSON.stringify({ ...prev, ...detailRes }));
            } catch (e) {}
          }
        } catch (err) {
          console.warn('Could not pre-fetch course detail for encrypted ID:', err);
        }
      }

      try {
        const res = await getMicroCourseTopicDetail(courseId, studentId, finalEncryptedId, finalModuleMasterId);
        if (!isMounted) return;
        const topicList = res?.getMicroCourseTopicDetailList || res?.rawData?.getMicroCourseTopicDetailList || [];
        const docList = res?.microcredentialStudentDownloadDocumentList || res?.rawData?.microcredentialStudentDownloadDocumentList || [];

        if (Array.isArray(topicList) && topicList.length > 0) {
          processTopicsAndDocs(topicList, docList);
        } else if (finalModuleMasterId > 0) {
          // If filtering by module returned 0 topics, fallback to all topics for the course (moduleMasterId = 0)
          const fallbackRes = await getMicroCourseTopicDetail(courseId, studentId, finalEncryptedId, 0);
          if (!isMounted) return;
          const fallbackTopics = fallbackRes?.getMicroCourseTopicDetailList || fallbackRes?.rawData?.getMicroCourseTopicDetailList || [];
          const fallbackDocs = fallbackRes?.microcredentialStudentDownloadDocumentList || fallbackRes?.rawData?.microcredentialStudentDownloadDocumentList || [];
          processTopicsAndDocs(fallbackTopics, fallbackDocs.length > 0 ? fallbackDocs : docList);
        } else {
          processTopicsAndDocs([], docList);
        }
      } catch (err) {
        console.error('Error fetching course topic details:', err);
        if (isMounted) {
          setPlaylist([]);
          setDownloadDocuments([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTopics();

    return () => {
      isMounted = false;
    };
  }, [course]);

  const currentPlaylist = playlist;
  const activeLecture = currentPlaylist[activeLectureIdx] || currentPlaylist[0] || null;

  // Active Video ID for current lecture
  const currentVideoId = activeLecture?.ytId ||
    getYouTubeVideoId(activeLecture?.videoUrl) ||
    activeLecture?.videoId ||
    activeLecture?.rawData?.videoId ||
    activeLecture?.rawData?.microcreditYoutubeDataMasterId ||
    String(activeLecture?.id || '');

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
      const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 0;
      const courseId = Number(rawId) || 0;

      // Resolve valid VideoId for the current topic / lecture to satisfy backend requirement
      const vId = activeLecture?.ytId ||
        getYouTubeVideoId(activeLecture?.videoUrl) ||
        activeLecture?.videoId ||
        activeLecture?.rawData?.videoId ||
        activeLecture?.rawData?.microcreditYoutubeDataMasterId ||
        '';

      const studentId = getLoggedInStudentId();

      const res = await getStudentMicrocredentialRaiseHandAnswerList(
        studentId, // StudentId: dynamic logged-in student
        0, // StudentDegreeAdmissionId: 0
        courseId, // MicrocredentialCourseId
        vId, // VideoId (always passed)
        page, // PageNumber: 1
        10 // PageSize: 10
      );

      if (res && res.success && Array.isArray(res.getStudentMicrocredentialRaiseHandAnswer)) {
        setAiHistoryList(res.getStudentMicrocredentialRaiseHandAnswer);
      } else {
        setAiHistoryList([]);
      }
    } catch (err) {
      console.error('Error fetching student AI raise hand history:', err);
      setAiHistoryList([]);
    } finally {
      setAiHistoryLoading(false);
    }
  };

  // AI Assistant question handler (POST /api/IgnitoMicroCredencialAPI/MicrocredentialTranscriptByTime)
  const handleSendAiQuestion = async () => {
    if (!aiQuery.trim() || aiLoading) return;
    const questionText = aiQuery.trim();
    const isPdf = Boolean(selectedPdf);
    const currentTopicName = selectedPdf ? selectedPdf.title : (activeLecture?.title || '');

    // Extract PDF text content if viewing PDF; empty string if viewing video
    let econtentText = '';
    if (isPdf) {
      econtentText = `Interactive e-Content notes for topic: ${currentTopicName}`;
    }

    const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 0;
    const courseId = Number(rawId) || 0;
    const rawModuleMasterId = activeLecture?.microcredentialModuleMasterId ||
      activeLecture?.rawData?.microcredentialModuleMasterId ||
      currentCourse?.microcredentialModuleMasterId ||
      currentCourse?.selectedModuleMasterId ||
      currentCourse?.selectedModuleId ||
      currentCourse?.microcredentialModuleId ||
      currentCourse?.moduleId ||
      currentCourse?.rawData?.microcredentialModuleMasterId ||
      course?.microcredentialModuleMasterId ||
      course?.selectedModuleMasterId ||
      0;
    const moduleMasterId = Number(rawModuleMasterId) || 0;
    // Always pass valid VideoId as required by the backend API
    const vId = activeLecture?.ytId ||
      getYouTubeVideoId(activeLecture?.videoUrl) ||
      activeLecture?.videoId ||
      activeLecture?.rawData?.videoId ||
      activeLecture?.rawData?.microcreditYoutubeDataMasterId ||
      '';
    const timestamp = isPdf ? 0 : Number(currentTime || 0);

    const userMsg = {
      sender: 'user',
      text: questionText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAiChatMessages(prev => [...prev, userMsg]);
    setAiQuery('');
    setAiLoading(true);

    const studentId = getLoggedInStudentId();

    try {
      const res = await microcredentialTranscriptByTime(
        studentId, // StudentId: dynamic logged-in student
        0, // StudentDegreeAdmissionId: 0
        vId, // VideoId (always passed)
        questionText, // Question
        courseId, // MicrocredentialCourseId
        timestamp, // HandRaiseTime (0 if PDF; video timestamp if video)
        econtentText, // Econtent (extracted PDF content if viewing PDF; empty if video)
        isPdf, // IsEcontent (true if PDF; false if video)
        moduleMasterId // MicrocredentialModuleMasterId
      );

      let answerText = res.answer || res.message;
      if (!answerText) {
        answerText = 'No response available from the AI Tutor for this question.';
      }

      const aiMsg = {
        sender: 'ai',
        text: answerText,
        citations: currentTopicName ? [currentTopicName] : [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChatMessages(prev => [...prev, aiMsg]);

      // Automatically refresh history list in background
      fetchAiHistory(1);
    } catch (err) {
      console.error('Error asking AI Coach:', err);
      setAiChatMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Unable to get an answer from the AI Tutor at this time. Please try again later.',
        citations: currentTopicName ? [currentTopicName] : []
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Fetch group discussion questions from API (POST /api/MicroDiscussionForumAPI/GetMicroManyDiscussionQuestion)
  const fetchDiscussionQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 0;
      const courseId = Number(rawId) || 0;
      const studentId = getLoggedInStudentId();

      if (courseId <= 0) {
        setDiscussionQuestions([]);
        return;
      }

      const res = await getMicroManyDiscussionQuestion(courseId, studentId);
      const qList = res?.microDiscussionQuestions || res?.rawData?.microDiscussionQuestions || [];
      if (Array.isArray(qList) && qList.length > 0) {
        setDiscussionQuestions(qList);
        // Automatically fetch replies for all questions so they are shown immediately outside
        qList.forEach(q => {
          if (q.microCourseDiscussionQuestionId) {
            fetchQuestionReplies(q.microCourseDiscussionQuestionId);
          }
        });
      } else {
        setDiscussionQuestions([]);
      }
    } catch (err) {
      console.error('Error fetching discussion questions:', err);
      setDiscussionQuestions([]);
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
      const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 0;
      const courseId = Number(rawId) || 0;
      const studentId = getLoggedInStudentId();
      const res = await insertMicroManyDiscussionQuestion(studentId, 0, courseId, newQuestionText.trim());
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
    const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 0;
    const courseId = Number(rawId) || 0;
    const studentId = getLoggedInStudentId();

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
      await microCourseDiscussionQuestionLike(questionId, studentId, courseId);
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
      } else {
        setQuestionRepliesMap(prev => ({ ...prev, [questionId]: [] }));
      }
    } catch (err) {
      console.error(`Error fetching replies for question ${questionId}:`, err);
      setQuestionRepliesMap(prev => ({ ...prev, [questionId]: [] }));
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
      const rawId = currentCourse.microcredentialCourseId || currentCourse.id || 0;
      const courseId = Number(rawId) || 0;
      const studentId = getLoggedInStudentId();

      const res = await insertManyMicroCourseDiscussionReply(
        questionId,
        studentId, // StudentId: dynamic logged-in student
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
      const studentId = getLoggedInStudentId();

      const rawId = currentCourse.microcredentialCourseId || currentCourse.courseId || currentCourse.id || 0;
      const courseId = Number(rawId) || 0;
      if (courseId <= 0) return;
      let rawModuleMasterId = currentCourse?.microcredentialModuleMasterId ||
        currentCourse?.MicrocredentialModuleMasterId ||
        currentCourse?.selectedModuleMasterId ||
        currentCourse?.selectedModuleId ||
        currentCourse?.microcredentialModuleId ||
        currentCourse?.moduleId ||
        currentCourse?.rawData?.microcredentialModuleMasterId ||
        course?.microcredentialModuleMasterId ||
        course?.MicrocredentialModuleMasterId ||
        course?.selectedModuleMasterId ||
        sessionStorage.getItem('MicrocredentialModuleMasterId') ||
        0;
      let moduleMasterId = Number(rawModuleMasterId) || 0;
      if (moduleMasterId <= 0 && courseId > 0) {
        try {
          const modRes = await getMicrocredentialModuleByCourseId(courseId);
          if (modRes && Array.isArray(modRes.microcredentialModuleList) && modRes.microcredentialModuleList.length > 0) {
            moduleMasterId = Number(modRes.microcredentialModuleList[0].microcredentialModuleMasterId) || 0;
            if (moduleMasterId > 0) {
              sessionStorage.setItem('MicrocredentialModuleMasterId', String(moduleMasterId));
            }
          }
        } catch (e) {}
      }
      const res = await getMicrocredentialStudentWatchVideoData(studentId, courseId, moduleMasterId);
      if (res && res.success) {
        setIsQuizEligible(Boolean(res.isQuizOpen));
        if (res.statusMessage) {
          setQuizStatusMessage(res.statusMessage);
        }
        if (Array.isArray(res.studentwatchvideodetails) && res.studentwatchvideodetails.length > 0) {
          const map = {};
          let topicSumPct = 0;
          let calculatedCount = 0;
          res.studentwatchvideodetails.forEach(item => {
            const vId = item.videoId || item.VideoId;
            if (vId) {
              const watchedSec = Math.round(Number(item.watchedSeconds ?? item.WatchedSeconds ?? 0));
              const totalDur = Math.round(Number(item.totalDuration ?? item.TotalDuration ?? 0));
              let pct = Math.round(Number(item.percentageWatched ?? item.PercentageWatched ?? 0));

              // If totalDuration is valid, recompute the true percentage from watchedSeconds to self-heal any stale/corrupt 99% values
              if (totalDur > 0) {
                const isCompleted = watchedSec >= totalDur;
                pct = isCompleted ? 100 : Math.min(99, Math.max(0, Math.floor((watchedSec / totalDur) * 100)));
                topicSumPct += pct;
                calculatedCount++;
              } else {
                topicSumPct += pct;
              }

              map[vId] = {
                percentageWatched: pct,
                watchedSeconds: watchedSec,
                totalDuration: totalDur
              };
            }
          });
          setVideoProgressMap(map);
          videoProgressMapRef.current = map;

          if (calculatedCount > 0) {
            const recomputedOverall = Math.min(100, Math.round(topicSumPct / res.studentwatchvideodetails.length));
            setOverallWatchPct(recomputedOverall);
            if (recomputedOverall >= 90) {
              setIsQuizEligible(true);
            }
          } else if (typeof res.overallPercentage === 'number' && res.overallPercentage >= 0) {
            setOverallWatchPct(Math.round(res.overallPercentage));
          }

          // Resume active lecture position if video is at 0
          const curLecture = activeLectureRef.current || activeLecture;
          const curVid = curLecture?.ytId || getYouTubeVideoId(curLecture?.videoUrl) || curLecture?.videoId || curLecture?.rawData?.videoId || String(curLecture?.id || '');
          const savedSec = Number(map[curVid]?.watchedSeconds || 0);
          if (savedSec > 0 && currentTimeRef.current === 0) {
            setCurrentTime(savedSec);
            setMaxWatchedTime(savedSec);
            maxWatchedRef.current = savedSec;
            if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
              try {
                ytPlayerRef.current.seekTo(savedSec, false);
                if (!userInitiatedPlayRef.current) {
                  ytPlayerRef.current.pauseVideo();
                }
              } catch (e) { }
            } else if (videoRef.current) {
              try {
                videoRef.current.currentTime = savedSec;
                if (!userInitiatedPlayRef.current) {
                  videoRef.current.pause();
                }
              } catch (e) { }
            }
          }
        } else if (typeof res.overallPercentage === 'number' && res.overallPercentage >= 0) {
          setOverallWatchPct(Math.round(res.overallPercentage));
        }
      }
    } catch (err) {
      console.error('Error fetching student watch video data:', err);
    }
  };

  // Fetch Quiz Attempt History & Summary Details (POST /api/StudentMicrocredentialQuizAPI/MicrocredentialQuizStudentAttemptDetail)
  const handleOpenQuizModal = async () => {
    if (!isQuizEligible) {
      alert(quizStatusMessage || 'Please watch at least 90% of the video to unlock the quiz.');
      return;
    }

    const rawId = currentCourse.microcredentialCourseId || currentCourse.courseId || currentCourse.id || 0;
    const courseId = Number(rawId) || 0;
    if (courseId <= 0) return;
    const studentId = getLoggedInStudentId();

    const curLecture = activeLectureRef.current || activeLecture;
    let storedModuleId = 0;
    try {
      const stored = JSON.parse(sessionStorage.getItem('ignito_selected_course') || '{}');
      storedModuleId = Number(
        stored.microcredentialModuleMasterId ||
        stored.MicrocredentialModuleMasterId ||
        stored.selectedModuleMasterId ||
        stored.selectedModuleId ||
        stored.moduleId ||
        0
      );
    } catch (e) {}

    let rawModuleMasterId = 
      curLecture?.microcredentialModuleMasterId ||
      curLecture?.rawData?.microcredentialModuleMasterId ||
      currentCourse?.microcredentialModuleMasterId ||
      currentCourse?.MicrocredentialModuleMasterId ||
      currentCourse?.selectedModuleMasterId ||
      currentCourse?.selectedModuleId ||
      currentCourse?.microcredentialModuleId ||
      currentCourse?.moduleId ||
      currentCourse?.rawData?.microcredentialModuleMasterId ||
      course?.microcredentialModuleMasterId ||
      course?.MicrocredentialModuleMasterId ||
      course?.selectedModuleMasterId ||
      course?.selectedModuleId ||
      course?.microcredentialModuleId ||
      course?.moduleId ||
      course?.rawData?.microcredentialModuleMasterId ||
      playlist.find(p => Number(p.microcredentialModuleMasterId) > 0)?.microcredentialModuleMasterId ||
      playlist.find(p => Number(p.rawData?.microcredentialModuleMasterId) > 0)?.rawData?.microcredentialModuleMasterId ||
      storedModuleId ||
      Number(sessionStorage.getItem('MicrocredentialModuleMasterId')) ||
      Number(localStorage.getItem('MicrocredentialModuleMasterId')) ||
      0;

    let moduleMasterId = Number(rawModuleMasterId) || 0;

    if (moduleMasterId <= 0 && courseId > 0) {
      try {
        const modRes = await getMicrocredentialModuleByCourseId(courseId);
        if (modRes && Array.isArray(modRes.microcredentialModuleList) && modRes.microcredentialModuleList.length > 0) {
          moduleMasterId = Number(modRes.microcredentialModuleList[0].microcredentialModuleMasterId) || 0;
        }
      } catch (e) {
        console.warn('Could not auto-fetch course module master ID:', e);
      }
    }

    if (moduleMasterId > 0) {
      try {
        sessionStorage.setItem('MicrocredentialModuleMasterId', String(moduleMasterId));
      } catch (e) {}
    }

    setShowQuizModal(true);
    setQuizAttemptLoading(true);
    setQuizAttemptError('');

    try {
      const res = await microcredentialQuizStudentAttemptDetail(courseId, studentId, moduleMasterId);
      if (res && res.success) {
        setQuizAttemptData(res);
      } else {
        setQuizAttemptError(res?.message || 'Failed to fetch quiz attempt history');
      }
    } catch (err) {
      console.error('Error fetching quiz attempt detail:', err);
      setQuizAttemptError('Failed to fetch quiz attempt history. Please try again.');
    } finally {
      setQuizAttemptLoading(false);
    }
  };

  const handleStartQuiz = (detail) => {
    setShowQuizModal(false);
    if (onNavigate) {
      const curLecture = activeLectureRef.current || activeLecture;
      const targetModuleId = Number(
        sessionStorage.getItem('MicrocredentialModuleMasterId') ||
        curLecture?.microcredentialModuleMasterId ||
        currentCourse?.microcredentialModuleMasterId ||
        currentCourse?.selectedModuleMasterId ||
        0
      );
      const targetQuizId = Number(
        detail?.quizId ||
        detail?.QuizId ||
        detail?.microcredentialQuizId ||
        detail?.MicrocredentialQuizId ||
        detail?.studentAttemptDetail?.quizId ||
        detail?.studentAttemptDetail?.QuizId ||
        quizAttemptData?.quizId ||
        quizAttemptData?.QuizId ||
        quizAttemptData?.studentAttemptDetail?.quizId ||
        quizAttemptData?.studentAttemptDetail?.QuizId ||
        quizAttemptData?.rawData?.quizId ||
        quizAttemptData?.rawData?.QuizId ||
        sessionStorage.getItem('MicrocredentialQuizId') ||
        sessionStorage.getItem('QuizId') ||
        currentCourse?.quizId ||
        currentCourse?.QuizId ||
        0
      );
      if (targetQuizId > 0) {
        try {
          sessionStorage.setItem('MicrocredentialQuizId', String(targetQuizId));
        } catch (_) {}
      }
      onNavigate('quiz', {
        ...currentCourse,
        quizId: targetQuizId || currentCourse?.quizId,
        QuizId: targetQuizId || currentCourse?.QuizId,
        microcredentialQuizId: targetQuizId || currentCourse?.microcredentialQuizId,
        microcredentialModuleMasterId: targetModuleId || currentCourse?.microcredentialModuleMasterId,
        selectedModuleMasterId: targetModuleId || currentCourse?.selectedModuleMasterId,
        moduleMasterId: targetModuleId || currentCourse?.moduleMasterId
      });
    }
  };

  useEffect(() => {
    fetchStudentWatchData();
  }, [course]);

  // Refs to maintain real-time playback state without stale closures
  const currentTimeRef = useRef(0);
  const videoDurationRef = useRef(0);
  const isPlayingRef = useRef(false);
  const activeLectureRef = useRef(null);
  const currentPlaylistRef = useRef([]);
  const videoProgressMapRef = useRef({});
  const courseRef = useRef(course);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    videoDurationRef.current = videoDuration;
  }, [videoDuration]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    activeLectureRef.current = activeLecture;
  }, [activeLecture]);

  useEffect(() => {
    currentPlaylistRef.current = currentPlaylist;
  }, [currentPlaylist]);

  useEffect(() => {
    videoProgressMapRef.current = videoProgressMap;
  }, [videoProgressMap]);

  useEffect(() => {
    courseRef.current = course;
  }, [course]);

  // Save / update video watch progress (POST /api/MicroCredencialStudentWatchVideoAPI/MicroCredencialWatchvideoAddUpdate)
  const saveCurrentWatchProgress = async (watchedSec, totalDur) => {
    try {
      const curCourse = courseRef.current || currentCourse;
      const rawId = curCourse.microcredentialCourseId || curCourse.courseId || curCourse.id || 0;
      const courseId = Number(rawId) || 0;
      if (courseId <= 0) return;

      const studentId = getLoggedInStudentId();
      if (!studentId || studentId <= 0) return;

      const curLecture = activeLectureRef.current || activeLecture;
      if (!curLecture) return;

      const rawModuleMasterId = curLecture?.microcredentialModuleMasterId ||
        curLecture?.rawData?.microcredentialModuleMasterId ||
        curCourse?.microcredentialModuleMasterId ||
        curCourse?.selectedModuleMasterId ||
        curCourse?.selectedModuleId ||
        curCourse?.microcredentialModuleId ||
        curCourse?.moduleId ||
        curCourse?.rawData?.microcredentialModuleMasterId ||
        course?.microcredentialModuleMasterId ||
        course?.selectedModuleMasterId ||
        0;
      const moduleMasterId = Number(rawModuleMasterId) || 0;

      const vId = curLecture?.ytId ||
        getYouTubeVideoId(curLecture?.videoUrl) ||
        curLecture?.videoId ||
        curLecture?.rawData?.videoId ||
        String(curLecture?.id || '');
      if (!vId) return;

      const sec = Math.round(Number(watchedSec ?? currentTimeRef.current ?? 0));
      let effectiveDur = Math.round(Number(totalDur || 0));
      if (effectiveDur <= 0 && videoDurationRef.current > 0) {
        effectiveDur = Math.round(videoDurationRef.current);
      }
      if (effectiveDur <= 0 && ytPlayerRef.current && typeof ytPlayerRef.current.getDuration === 'function') {
        effectiveDur = Math.round(ytPlayerRef.current.getDuration() || 0);
      }
      if (effectiveDur <= 0 && curLecture?.videoDuration > 0) {
        effectiveDur = Math.round(curLecture.videoDuration);
      }
      if (effectiveDur <= 0 && videoRef.current && videoRef.current.duration > 0) {
        effectiveDur = Math.round(videoRef.current.duration);
      }

      // If duration is unknown, do not save invalid percentage or fallback to 1
      if (effectiveDur <= 0) return;

      // Detect completion: strictly 100% only when the video actually reaches full duration
      const isCompleted = effectiveDur > 0 && sec >= effectiveDur;
      const finalSec = isCompleted ? effectiveDur : sec;
      const pct = effectiveDur > 0
        ? (isCompleted ? 100 : Math.min(99, Math.max(0, Math.floor((finalSec / effectiveDur) * 100))))
        : 0;

      // Update local progress map optimistically with proper calculated percentage
      const prevMap = videoProgressMapRef.current || {};
      const updatedMap = {
        ...prevMap,
        [vId]: {
          percentageWatched: pct,
          watchedSeconds: Math.max(finalSec, prevMap[vId]?.watchedSeconds || 0),
          totalDuration: effectiveDur
        }
      };
      setVideoProgressMap(updatedMap);
      videoProgressMapRef.current = updatedMap;

      const playlistItems = currentPlaylistRef.current?.length > 0 ? currentPlaylistRef.current : currentPlaylist;
      const totalUnits = playlistItems.length || 1;
      let sumPct = 0;
      playlistItems.forEach(pItem => {
        const itemVid = pItem.ytId || getYouTubeVideoId(pItem.videoUrl) || pItem.id;
        const itemData = updatedMap[itemVid];
        let itemPct = itemData?.percentageWatched || 0;
        if (itemData?.totalDuration > 0 && itemData?.watchedSeconds >= 0) {
          const itemDone = itemData.watchedSeconds >= itemData.totalDuration;
          itemPct = itemDone ? 100 : Math.min(99, Math.floor((itemData.watchedSeconds / itemData.totalDuration) * 100));
        }
        sumPct += itemPct;
      });
      const calcOverall = Math.min(100, Math.round(sumPct / totalUnits));
      setOverallWatchPct(calcOverall);
      if (calcOverall >= 90) {
        setIsQuizEligible(true);
      }

      const payloadDetails = [
        {
          MicrocredentialModuleMasterId: moduleMasterId,
          microcredentialModuleMasterId: moduleMasterId,
          VideoId: vId,
          WatchedSeconds: finalSec,
          TotalDuration: dur,
          PercentageWatched: pct
        }
      ];

      await microCredencialWatchvideoAddUpdate(studentId, courseId, calcOverall, payloadDetails, moduleMasterId);
    } catch (err) {
      console.error('Error saving video watch progress:', err);
    }
  };

  // Periodic watch progress auto-saver (every 2 minutes) and on page unload
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (isPlayingRef.current && currentTimeRef.current > 0) {
        saveCurrentWatchProgress(currentTimeRef.current, videoDurationRef.current);
      }
    }, 120000); // exactly every 2 minutes (120,000 ms)

    const handleBeforeUnload = () => {
      if (currentTimeRef.current > 0) {
        saveCurrentWatchProgress(currentTimeRef.current, videoDurationRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(autoSaveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (currentTimeRef.current > 0) {
        saveCurrentWatchProgress(currentTimeRef.current, videoDurationRef.current);
      }
    };
  }, []);

  const activeQuestions = discussionQuestions;

  // Initialize or update custom YouTube Player instance
  useEffect(() => {
    let isCancelled = false;
    let timer = null;

    if (!activeLecture || !activeLecture.isYouTube || !activeLecture.ytId) {
      if (ytPlayerRef.current) {
        try { ytPlayerRef.current.destroy(); } catch (e) { }
        ytPlayerRef.current = null;
      }
      return;
    }

    const curVid = activeLecture?.ytId ||
      getYouTubeVideoId(activeLecture?.videoUrl) ||
      activeLecture?.videoId ||
      activeLecture?.rawData?.videoId ||
      String(activeLecture?.id || '');
    const savedProgress = videoProgressMap[curVid] || videoProgressMapRef.current[curVid];
    const initialResumeSec = Number(savedProgress?.watchedSeconds || 0);

    userInitiatedPlayRef.current = false;
    setCurrentTime(initialResumeSec);
    setMaxWatchedTime(initialResumeSec);
    maxWatchedRef.current = initialResumeSec;
    setIsPlaying(false);

    if (!activeLecture.isYouTube || !activeLecture.ytId) {
      return;
    }

    const checkAndInit = () => {
      if (isCancelled) return;
      if (window.YT && window.YT.Player) {
        let container = document.getElementById('yt-custom-player-container');
        if (!container && ytContainerRef.current) {
          container = document.createElement('div');
          container.id = 'yt-custom-player-container';
          ytContainerRef.current.prepend(container);
        }
        if (!container) {
          timer = setTimeout(checkAndInit, 100);
          return;
        }

        try {
          if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
            ytPlayerRef.current.destroy();
          }
        } catch (e) { }

        // Re-ensure container exists after destroy()
        let postDestroyContainer = document.getElementById('yt-custom-player-container');
        if (!postDestroyContainer && ytContainerRef.current) {
          postDestroyContainer = document.createElement('div');
          postDestroyContainer.id = 'yt-custom-player-container';
          ytContainerRef.current.prepend(postDestroyContainer);
        }

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
              start: initialResumeSec > 0 ? Math.floor(initialResumeSec) : undefined
            },
            events: {
              onReady: (event) => {
                if (isCancelled) return;
                const dur = event.target.getDuration();
                if (dur && dur > 0) {
                  setVideoDuration(dur);
                  setPlaylist(prev => prev.map((p, i) => i === activeLectureIdx ? { ...p, videoDuration: Math.round(dur), duration: formatDuration(dur) } : p));
                } else if (activeLecture.videoDuration) {
                  setVideoDuration(activeLecture.videoDuration);
                }

                // Position scrubber at saved watch seconds
                if (initialResumeSec > 0) {
                  try {
                    event.target.seekTo(initialResumeSec, true);
                  } catch (e) { }
                }

                // If user already initiated play while player was initializing
                if (userInitiatedPlayRef.current) {
                  try {
                    event.target.playVideo();
                    setIsPlaying(true);
                  } catch (e) { }
                }
              },
              onStateChange: (event) => {
                if (isCancelled) return;
                if (event.data === window.YT.PlayerState.PLAYING) {
                  userInitiatedPlayRef.current = true;
                  setIsPlaying(true);
                  const dur = event.target.getDuration();
                  if (dur && dur > 0) {
                    setVideoDuration(dur);
                    setPlaylist(prev => prev.map((p, i) => i === activeLectureIdx ? { ...p, videoDuration: Math.round(dur), duration: formatDuration(dur) } : p));
                  }
                  startProgressTracking();
                } else if (event.data === window.YT.PlayerState.PAUSED) {
                  setIsPlaying(false);
                  stopProgressTracking();
                  const curr = ytPlayerRef.current?.getCurrentTime() || currentTimeRef.current;
                  const dur = ytPlayerRef.current?.getDuration() || videoDurationRef.current || activeLecture.videoDuration;
                  saveCurrentWatchProgress(curr, dur);
                } else if (event.data === window.YT.PlayerState.ENDED) {
                  setIsPlaying(false);
                  stopProgressTracking();
                  const finalDur = ytPlayerRef.current?.getDuration() || activeLecture.videoDuration || videoDurationRef.current || 1;
                  setCurrentTime(finalDur);
                  setMaxWatchedTime(finalDur);
                  maxWatchedRef.current = finalDur;
                  saveCurrentWatchProgress(finalDur, finalDur);
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
  }, [activeLectureIdx, activeLecture?.ytId, activeLecture?.videoUrl]);

  // Anti-skip enforcement & Progress tracking interval
  const startProgressTracking = () => {
    stopProgressTracking();
    intervalRef.current = setInterval(() => {
      if (activeLecture?.isYouTube && ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        const curr = ytPlayerRef.current.getCurrentTime() || 0;
        const dur = ytPlayerRef.current.getDuration() || activeLecture?.videoDuration || 0;
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

        // Live progress synchronization into videoProgressMap
        if (dur > 0) {
          const isCompleted = curr >= dur;
          const livePct = isCompleted ? 100 : Math.min(99, Math.floor((Math.max(curr, maxWatchedRef.current) / dur) * 100));
          const curLecture = activeLectureRef.current || activeLecture;
          const vId = curLecture?.ytId ||
            getYouTubeVideoId(curLecture?.videoUrl) ||
            curLecture?.videoId ||
            curLecture?.rawData?.videoId ||
            String(curLecture?.id || '');
          if (vId) {
            setVideoProgressMap(prev => {
              const currentSaved = prev[vId]?.percentageWatched;
              const currentWatchedSec = prev[vId]?.watchedSeconds || 0;
              const newWatchedSec = Math.round(Math.max(curr, maxWatchedRef.current));
              // Update if progress changed or if currentSaved is stale/inaccurate
              if (currentSaved === undefined || livePct !== currentSaved || newWatchedSec > currentWatchedSec) {
                const next = {
                  ...prev,
                  [vId]: {
                    percentageWatched: livePct,
                    watchedSeconds: newWatchedSec,
                    totalDuration: Math.round(dur)
                  }
                };
                videoProgressMapRef.current = next;
                return next;
              }
              return prev;
            });
          }
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
  const handlePlayVideo = () => {
    if (!activeLecture) return;
    userInitiatedPlayRef.current = true;
    setIsPlaying(true);

    if (activeLecture.isYouTube && ytPlayerRef.current) {
      if (typeof ytPlayerRef.current.playVideo === 'function') {
        try {
          ytPlayerRef.current.playVideo();
        } catch (e) {
          console.error('Error playing YouTube video:', e);
        }
      }
    } else if (videoRef.current) {
      try {
        videoRef.current.play().catch(e => console.error('Error playing HTML5 video:', e));
      } catch (e) { }
    }
  };

  const handleTogglePlay = () => {
    if (!activeLecture) return;
    if (isPlaying) {
      handlePauseVideo();
    } else {
      handlePlayVideo();
    }
  };

  const handlePauseVideo = () => {
    userInitiatedPlayRef.current = false;
    setIsPlaying(false);
    if (currentTime > 0) {
      saveCurrentWatchProgress(currentTime, videoDuration);
    }
    if (activeLecture?.isYouTube && ytPlayerRef.current) {
      if (typeof ytPlayerRef.current.pauseVideo === 'function') {
        try { ytPlayerRef.current.pauseVideo(); } catch (e) { }
      }
    } else if (videoRef.current) {
      try { videoRef.current.pause(); } catch (e) { }
    }
  };

  const handleToggleMute = () => {
    if (!activeLecture) return;
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
    if (!activeLecture) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const targetPct = Math.max(0, Math.min(1, clickX / rect.width));
    // Only allow seeking up to the maximum watched point
    const activeDurSeek = videoDuration || activeLecture?.videoDuration || 0;
    const targetSeconds = activeDurSeek > 0 ? targetPct * activeDurSeek : 0;
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
    const dur = videoRef.current.duration || activeLecture?.videoDuration || 0;
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

    if (dur > 0) {
      const isCompleted = curr >= dur;
      const livePct = isCompleted ? 100 : Math.min(99, Math.floor((Math.max(curr, maxWatchedRef.current) / dur) * 100));
      const curLecture = activeLectureRef.current || activeLecture;
      const vId = curLecture?.ytId ||
        getYouTubeVideoId(curLecture?.videoUrl) ||
        curLecture?.videoId ||
        curLecture?.rawData?.videoId ||
        String(curLecture?.id || '');
      if (vId) {
        setVideoProgressMap(prev => {
          const currentSaved = prev[vId]?.percentageWatched;
          const currentWatchedSec = prev[vId]?.watchedSeconds || 0;
          const newWatchedSec = Math.round(Math.max(curr, maxWatchedRef.current));
          if (currentSaved === undefined || livePct !== currentSaved || newWatchedSec > currentWatchedSec) {
            const next = {
              ...prev,
              [vId]: {
                percentageWatched: livePct,
                watchedSeconds: newWatchedSec,
                totalDuration: Math.round(dur)
              }
            };
            videoProgressMapRef.current = next;
            return next;
          }
          return prev;
        });
      }
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
      userInitiatedPlayRef.current = false;
      setActiveLectureIdx(activeLectureIdx - 1);
      setIsPlaying(false);
    }
  };

  const handleNextLesson = () => {
    if (activeLectureIdx < currentPlaylist.length - 1) {
      saveCurrentWatchProgress(currentTime, videoDuration);
      userInitiatedPlayRef.current = false;
      setActiveLectureIdx(activeLectureIdx + 1);
      setIsPlaying(false);
    }
  };

  // ========================================================
  // VIDEO NOTES FUNCTIONALITY
  // ========================================================
  const fetchVideoNotes = async (vId = currentVideoId) => {
    const rawId = currentCourse?.microcredentialCourseId || currentCourse?.id || course?.microcredentialCourseId || course?.id || 0;
    const courseId = Number(rawId) || 0;
    const studentId = getLoggedInStudentId() || 0;
    if (!vId && !courseId) return;

    setNotesLoading(true);
    try {
      const res = await getMicrocredentialVideoNotes({
        studentId,
        courseId,
        videoId: vId || ''
      });
      if (res && Array.isArray(res.notes)) {
        setVideoNotesList(res.notes);
      } else {
        setVideoNotesList([]);
      }
    } catch (e) {
      console.error('Error fetching video notes:', e);
      setVideoNotesList([]);
    } finally {
      setNotesLoading(false);
    }
  };

  useEffect(() => {
    if (currentVideoId) {
      fetchVideoNotes(currentVideoId);
    }
  }, [currentVideoId]);

  const handleOpenNotesTab = () => {
    setIsNotesOpen(true);
    if (currentVideoId) {
      fetchVideoNotes(currentVideoId);
    }
  };

  const handleOpenAddNote = () => {
    // 1. Pause video playback immediately
    handlePauseVideo();

    // 2. Capture paused timestamp
    let pausedTime = currentTime;
    if (activeLecture?.isYouTube && ytPlayerRef.current?.getCurrentTime) {
      try {
        const ytTime = ytPlayerRef.current.getCurrentTime();
        if (typeof ytTime === 'number' && ytTime > 0) pausedTime = ytTime;
      } catch (e) { }
    } else if (videoRef.current?.currentTime) {
      pausedTime = videoRef.current.currentTime;
    }
    const roundedTime = Math.max(0, Math.floor(pausedTime || 0));

    setCapturedNoteTime(roundedTime);
    setEditingNoteId(0);
    setNoteText('');
    setShowAddNoteComposer(true);
    setIsNotesOpen(true);
  };

  const handleCancelNote = () => {
    setShowAddNoteComposer(false);
    setNoteText('');
    setEditingNoteId(0);
    setCapturedNoteTime(0);
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;

    setSubmittingNote(true);
    const rawId = currentCourse?.microcredentialCourseId || currentCourse?.id || course?.microcredentialCourseId || course?.id || 0;
    const courseId = Number(rawId) || 0;
    const studentId = getLoggedInStudentId() || 0;
    const vId = currentVideoId || (ytPlayerRef.current?.getVideoData ? ytPlayerRef.current.getVideoData()?.video_id : '') || '';

    try {
      const res = await addUpdateMicrocredentialVideoNote({
        noteId: editingNoteId || 0,
        studentId,
        courseId,
        videoId: vId,
        noteText: noteText.trim(),
        roundedpausedTime: capturedNoteTime || 0
      });

      if (res && res.success !== false) {
        await fetchVideoNotes(vId);
        handleCancelNote();
      } else {
        // Optimistic local update
        const newNote = {
          microcredentialVideoNotesId: editingNoteId || Date.now(),
          studentId,
          microcredentialCourseId: courseId,
          videoId: vId,
          noteDescription: noteText.trim(),
          noteTimeInSec: capturedNoteTime || 0,
          createdOn: 'Just now'
        };
        setVideoNotesList(prev => {
          if (editingNoteId) {
            return prev.map(n => n.microcredentialVideoNotesId === editingNoteId ? newNote : n);
          }
          return [...prev, newNote].sort((a, b) => a.noteTimeInSec - b.noteTimeInSec);
        });
        handleCancelNote();
      }
    } catch (err) {
      console.error('Error saving note:', err);
      const newNote = {
        microcredentialVideoNotesId: editingNoteId || Date.now(),
        studentId,
        microcredentialCourseId: courseId,
        videoId: vId,
        noteDescription: noteText.trim(),
        noteTimeInSec: capturedNoteTime || 0,
        createdOn: 'Just now'
      };
      setVideoNotesList(prev => {
        if (editingNoteId) {
          return prev.map(n => n.microcredentialVideoNotesId === editingNoteId ? newNote : n);
        }
        return [...prev, newNote].sort((a, b) => a.noteTimeInSec - b.noteTimeInSec);
      });
      handleCancelNote();
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleEditNote = (note) => {
    handlePauseVideo();
    setEditingNoteId(note.microcredentialVideoNotesId);
    setNoteText(note.noteDescription);
    setCapturedNoteTime(note.noteTimeInSec || 0);
    setShowAddNoteComposer(true);
    setIsNotesOpen(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (!noteId) return;
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    setDeletingNoteId(noteId);
    const studentId = getLoggedInStudentId() || 0;
    try {
      await deleteMicrocredentialVideoNote({ noteId, studentId });
      setVideoNotesList(prev => prev.filter(n => n.microcredentialVideoNotesId !== noteId));
    } catch (e) {
      console.error('Error deleting note:', e);
      setVideoNotesList(prev => prev.filter(n => n.microcredentialVideoNotesId !== noteId));
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleSeekToNoteTime = (seconds) => {
    const sec = Number(seconds) || 0;
    if (activeLecture?.isYouTube && ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      ytPlayerRef.current.seekTo(sec, true);
      setCurrentTime(sec);
    } else if (videoRef.current) {
      videoRef.current.currentTime = sec;
      setCurrentTime(sec);
    }
  };

  const activeDuration = videoDuration || activeLecture?.videoDuration || 0;
  const currentPct = activeDuration > 0 ? Math.min(100, Math.max(0, (currentTime / activeDuration) * 100)) : 0;
  const maxWatchedPct = activeDuration > 0 ? Math.min(100, Math.max(0, (maxWatchedTime / activeDuration) * 100)) : 0;

  return (
    <div className="mc-watch-page-container">
      <div className="mc-watch-fluid-layout">

        {/* Watch Top Header & Breadcrumbs (Spans across page) */}
        <div className="mc-watch-top-header">
          <div className="mc-watch-breadcrumb-row">
            <span className="watch-crumb linkable" onClick={() => onNavigate('home')}>Home</span>
            <span className="crumb-sep">›</span>
            <span className="watch-crumb linkable" onClick={onBack}>{currentCourse.title || currentCourse.microcredentialCourseName || 'Microcredential Course'}</span>
            <span className="crumb-sep">›</span>
            <span className="watch-crumb active">Microcredential Video Watch</span>
          </div>

          <div className="mc-watch-title-row">
            <div className="watch-course-title-group">
              <h1 className="watch-course-title">{currentCourse.title || currentCourse.microcredentialCourseName || 'Microcredential Course'}</h1>
              <div className="watch-verified-badge" title="Accredited & Verified">
                <ShieldCheck size={18} />
              </div>
            </div>

            <button type="button" className="btn-back-to-course" onClick={onBack}>
              <ChevronLeft size={16} />
              <span>Back to Overview</span>
            </button>
          </div>
        </div>

        {/* Master 2-Column Watch Grid */}
        <div className="mc-watch-main-grid">

          {/* ========================================================
              LEFT COLUMN: VIDEO PLAYER + NAV + DISCUSSION
              ======================================================== */}
          <div className="mc-watch-left-column">

            {/* 3. Interactive Theater Player Card */}
            <div className="mc-theater-player-card" ref={theaterCardRef}>

              {/* Theater Player Top Header Overlay (Hidden when PDF is open to avoid 2 headers) */}
              {!selectedPdf && (
                <div className="theater-header-overlay">
                  <div className="theater-channel-badge">
                    <div className="theater-avatar-box">
                      <GraduationCap size={18} />
                    </div>
                    <div className="theater-lecture-text">
                      <h4>{activeLecture ? activeLecture.title : 'Course Lecture'}</h4>
                      <span className="theater-org-name">{currentCourse.streamName || currentCourse.category || 'Accredited Microcredential'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="anti-skip-badge">
                      <ShieldCheck size={13} />
                      <span>Anti-Skip Protected</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Central Video Frame with Custom Shield Layer & Embedded PDF Viewer */}
              <div className="theater-video-frame custom-player-frame" style={selectedPdf ? { aspectRatio: 'auto', minHeight: '520px', display: 'flex', flexDirection: 'column' } : {}}>

                {selectedPdf ? (
                  <div
                    className="theater-embedded-pdf-wrapper"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0b1320', flex: 1 }}
                  >
                    <div className="theater-embedded-pdf-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', background: 'linear-gradient(90deg, #00385E 0%, #00223b 100%)', color: '#ffffff', borderBottom: '1.5px solid #0284C7' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 800 }}>
                        <FileText size={18} style={{ color: '#38bdf8' }} />
                        <span>Interactive e-Content: <strong style={{ color: '#bae6fd', textTransform: 'uppercase' }}>{selectedPdf.title}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPdf(null);
                          setIsPlaying(true);
                        }}
                        title="Close Document"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          border: 'none',
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <iframe
                      src={`${selectedPdf.url}#toolbar=0&navpanes=0`}
                      title={selectedPdf.title}
                      className="theater-embedded-pdf-iframe"
                      style={{ width: '100%', flex: 1, minHeight: '480px', border: 'none' }}
                    />
                  </div>
                ) : loading ? (
                  <div style={{ width: '100%', minHeight: '460px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', background: '#0b1320', color: '#ffffff' }}>
                    <RefreshCw size={28} className="spinner" style={{ animation: 'spin 1s linear infinite', color: '#38bdf8' }} />
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Loading video topics...</span>
                  </div>
                ) : !activeLecture || currentPlaylist.length === 0 ? (
                  <div style={{ width: '100%', minHeight: '460px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#0b1320', color: '#ffffff', padding: '36px', textAlign: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      <Video size={28} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>No Learning Videos Found</h3>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: '#94a3b8', maxWidth: '420px', lineHeight: 1.5 }}>
                      No topics or videos were found for this course or module.
                    </p>
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
                    {activeLecture?.isYouTube && activeLecture?.ytId ? (
                      <div ref={ytContainerRef} className="theater-yt-api-wrapper" key={activeLecture?.ytId || activeLecture?.id}>
                        <div id="yt-custom-player-container" />
                        {/* Transparent Interaction Shield: intercepts clicks so YouTube UI never opens */}
                        <div
                          className="theater-interaction-shield"
                          onClick={handleTogglePlay}
                        />
                      </div>
                    ) : activeLecture?.videoUrl ? (
                      <video
                        ref={videoRef}
                        src={activeLecture.videoUrl}
                        className="theater-html5-video"
                        autoPlay={false}
                        poster={currentCourse.thumbnail || ''}
                        onLoadedMetadata={(e) => {
                          e.target.pause();
                          const curVid = activeLecture?.ytId || getYouTubeVideoId(activeLecture?.videoUrl) || activeLecture?.videoId || String(activeLecture?.id || '');
                          const savedProgress = videoProgressMap[curVid] || videoProgressMapRef.current[curVid];
                          const initialResumeSec = Number(savedProgress?.watchedSeconds || 0);
                          if (initialResumeSec > 0) {
                            e.target.currentTime = initialResumeSec;
                            setCurrentTime(initialResumeSec);
                            setMaxWatchedTime(initialResumeSec);
                            maxWatchedRef.current = initialResumeSec;
                            if (!userInitiatedPlayRef.current) {
                              e.target.pause();
                            }
                          }
                        }}
                        onPlay={() => {
                          if (!userInitiatedPlayRef.current) {
                            if (videoRef.current) videoRef.current.pause();
                            setIsPlaying(false);
                          } else {
                            setIsPlaying(true);
                          }
                        }}
                        onPause={() => {
                          setIsPlaying(false);
                          if (videoRef.current) {
                            saveCurrentWatchProgress(videoRef.current.currentTime, videoRef.current.duration);
                          }
                        }}
                        onEnded={() => {
                          setIsPlaying(false);
                          const dur = videoRef.current?.duration || videoDurationRef.current || 1;
                          setCurrentTime(dur);
                          setMaxWatchedTime(dur);
                          maxWatchedRef.current = dur;
                          saveCurrentWatchProgress(dur, dur);
                        }}
                        onTimeUpdate={handleHtml5TimeUpdate}
                        controlsList="nodownload nofullscreen noremoteplayback"
                        disablePictureInPicture
                        onClick={handleTogglePlay}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px', color: '#94a3b8', gap: '8px' }}>
                        <Video size={32} />
                        <span style={{ fontSize: '0.88rem' }}>No video stream available for this topic</span>
                      </div>
                    )}

                    {/* Big Center Glass Play/Pause Button */}
                    {!isPlaying && activeLecture?.videoUrl && (
                      <div
                        className="theater-glass-center-play"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayVideo();
                        }}
                      >
                        <Play size={28} className="play-triangle-fill" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Bottom Custom Playback Bar (Full Custom UI with Anti-Skip Progress Bar) */}
              {!selectedPdf && activeLecture && currentPlaylist.length > 0 && (
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
                disabled={!activeLecture || activeLectureIdx === 0}
              >
                <ChevronLeft size={16} />
                <span>Previous Lesson</span>
              </button>

              <button
                type="button"
                className="btn-ai-tutor-summon"
                onClick={() => {
                  handlePauseVideo();
                  setAiAssistantOpen(!aiAssistantOpen);
                }}
              >
                <Sparkles size={16} />
                <span>Ask AI Tutor</span>
              </button>

              <button
                type="button"
                className="btn-lesson-nav next"
                onClick={handleNextLesson}
                disabled={!activeLecture || activeLectureIdx >= currentPlaylist.length - 1}
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
                    placeholder={`Ask a question about ${selectedPdf ? selectedPdf.title : (activeLecture?.title || 'this topic')}...`}
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

              {/* Empty questions state */}
              {!loadingQuestions && activeQuestions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '36px 20px', background: '#f8fafc', borderRadius: '14px', border: '1.5px dashed #cbd5e1', color: '#64748b' }}>
                  <MessageSquare size={32} style={{ margin: '0 auto 10px', color: '#94a3b8' }} />
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.98rem', fontWeight: 700, color: '#00385E' }}>No questions found</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>No discussions have been started yet. Ask a question above to get started!</p>
                </div>
              )}

              {/* Questions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {activeQuestions.map((q, idx) => {
                  const qId = q.microCourseDiscussionQuestionId || (idx + 1);
                  const isReplyOpen = openReplyBoxForQuestionId === qId;
                  const replies = questionRepliesMap[qId] || [];
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
                        <div className="author-avatar-circle" style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid #c7d2fe', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0f2fe', color: '#00385E', fontWeight: '800', fontSize: '0.92rem' }}>
                          {q.studentProfileImage ? (
                            <img
                              src={formatImageUrl(q.studentProfileImage)}
                              alt={q.studentName || 'Learner'}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <span>{(q.studentName || 'U').charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="author-name-stamp">
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>
                            {q.studentName || 'Learner'}
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
                      {replies && replies.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                          {replies.map((r, rIdx) => (
                            <div
                              key={r.microCourseDiscussionQuestionReplyId || rIdx}
                              className="forum-nested-professor-reply"
                              style={{ background: '#f8fafc', borderLeft: '3px solid #00385E', borderRadius: '0 12px 12px 0', padding: '14px 18px' }}
                            >
                              <div className="prof-author-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div className="prof-avatar-circle" style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#00385E', fontWeight: '800', fontSize: '0.8rem', flexShrink: 0 }}>
                                    {(r.professorProfileImage || r.studentProfileImage) ? (
                                      <img
                                        src={formatImageUrl(r.professorProfileImage || r.studentProfileImage)}
                                        alt={r.professorName || r.studentName || 'Respondent'}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                      />
                                    ) : (
                                      <span>{(r.professorName || r.studentName || 'U').charAt(0).toUpperCase()}</span>
                                    )}
                                  </div>
                                  <div className="prof-name-stamp">
                                    <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#00385E', margin: 0 }}>
                                      {r.professorName || r.studentName || 'Respondent'}
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
                      ) : isReplyOpen && !isLoadingReplies && (
                        <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '0.82rem', textAlign: 'center' }}>
                          No replies yet. Be the first to reply!
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
          <div className="mc-watch-right-sidebar">

            {/* 1. Learning Progress Card */}
            {(() => {
              const playlistItems = currentPlaylist.length > 0 ? currentPlaylist : [];
              const curLecture = activeLecture;
              const activeVid = curLecture?.ytId || getYouTubeVideoId(curLecture?.videoUrl) || curLecture?.videoId || String(curLecture?.id || '');
              const activeDur = videoDuration > 0
                ? videoDuration
                : (curLecture?.videoDuration > 0 ? curLecture.videoDuration : (videoProgressMap[activeVid]?.totalDuration > 0 ? videoProgressMap[activeVid]?.totalDuration : 0));
              const liveSec = Math.max(currentTime, maxWatchedTime);
              const liveActivePct = activeDur > 0
                ? (liveSec >= activeDur ? 100 : Math.min(99, Math.floor((liveSec / activeDur) * 100)))
                : (videoProgressMap[activeVid]?.percentageWatched || 0);

              let sum = 0;
              let completedCount = 0;
              playlistItems.forEach(pItem => {
                const pVid = pItem.ytId || getYouTubeVideoId(pItem.videoUrl) || pItem.id;
                const rawData = videoProgressMap[pVid];
                let finalPct = 0;

                if (pVid === activeVid) {
                  finalPct = activeDur > 0 ? liveActivePct : (rawData?.percentageWatched || 0);
                } else if (rawData) {
                  if (rawData.totalDuration > 0 && rawData.watchedSeconds >= 0) {
                    const isDone = rawData.watchedSeconds >= rawData.totalDuration;
                    finalPct = isDone ? 100 : Math.min(99, Math.floor((rawData.watchedSeconds / rawData.totalDuration) * 100));
                  } else {
                    finalPct = rawData.percentageWatched || 0;
                  }
                }

                sum += finalPct;
                if (finalPct >= 100) completedCount++;
              });
              const liveOverallPct = playlistItems.length > 0
                ? Math.min(100, Math.round(sum / playlistItems.length))
                : (overallWatchPct || 0);

              return (
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
                            strokeDasharray={`${liveOverallPct}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text x="18" y="20.35" className="percentage-text">{liveOverallPct}%</text>
                        </svg>
                      </div>

                      <div className="progress-text-info">
                        <strong>Overall Progress</strong>
                        <span>
                          {playlistItems.length > 0
                            ? `${completedCount} of ${playlistItems.length} Topics`
                            : 'No topics available'}
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
              );
            })()}
 <div className="mc-watch-expandable-card mc-notes-section-card">
              <div
                className="expandable-header mc-notes-header"
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', background: '#ffffff' }}
              >
                <div className="expandable-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00385E', fontWeight: 800 }}>
                  <StickyNote size={16} style={{ color: '#00385E' }} />
                  <span>Video Notes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-add-note-inline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsNotesOpen(true);
                      handleOpenAddNote();
                    }}
                    title="Take note at current video time"
                  >
                    <Plus size={13} />
                    <span>Add Note</span>
                  </button>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00385E', background: '#f0f7fc', padding: '2px 8px', borderRadius: '999px', border: '1px solid #c9dfef' }}>
                    {videoNotesList.length} Notes
                  </span>
                  <ChevronDown size={16} className={`chevron-exp ${isNotesOpen ? 'open' : ''}`} style={{ color: '#00385E' }} />
                </div>
              </div>

              {isNotesOpen && (
                <div className="mc-notes-card-body" style={{ padding: '14px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  {/* Note Composer Form */}
                  {showAddNoteComposer && (
                    <div className="mc-note-composer-card">
                      <textarea
                        rows={3}
                        className="mc-note-textarea"
                        placeholder="Write your note for this video..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        autoFocus
                      />
                      <div className="mc-note-composer-footer">
                        <div className="mc-note-composer-time">
                          <Clock size={13} />
                          <span>{formatNoteTime(capturedNoteTime)}</span>
                        </div>
                        <div className="mc-note-composer-btn-group">
                          <button
                            type="button"
                            className="btn-note-cancel"
                            onClick={handleCancelNote}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn-note-take"
                            onClick={handleSaveNote}
                            disabled={submittingNote || !noteText.trim()}
                          >
                            {submittingNote ? 'Saving...' : (editingNoteId ? 'Update Note' : 'Take Note')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes Listing */}
                  {notesLoading ? (
                    <div className="notes-loading-state">
                      <RefreshCw size={20} className="spinner" style={{ animation: 'spin 1s linear infinite', color: '#00385E' }} />
                      <span>Loading notes...</span>
                    </div>
                  ) : videoNotesList.length === 0 ? (
                    <div className="notes-empty-state">
                      <img
                        src={notesImg}
                        alt="No Notes Available"
                        className="notes-empty-img"
                      />
                      <p className="notes-empty-title">No notes added yet for this video</p>
                      {!showAddNoteComposer && (
                        <button
                          type="button"
                          className="btn-create-first-note"
                          onClick={handleOpenAddNote}
                        >
                          <Plus size={14} />
                          <span>Take note at {formatNoteTime(currentTime)}</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="notes-list-items">
                      {videoNotesList.map((note) => {
                        const noteId = note.microcredentialVideoNotesId;
                        return (
                          <div key={noteId} className="note-item-bubble">
                            <div className="note-item-header">
                              <button
                                type="button"
                                className="note-time-badge"
                                onClick={() => handleSeekToNoteTime(note.noteTimeInSec)}
                                title={`Click to jump to ${formatNoteTime(note.noteTimeInSec)}`}
                              >
                                <Clock size={13} />
                                <span>{formatNoteTime(note.noteTimeInSec)}</span>
                              </button>

                              <div className="note-actions">
                                <button
                                  type="button"
                                  className="btn-note-icon edit"
                                  onClick={() => handleEditNote(note)}
                                  title="Edit Note"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  type="button"
                                  className="btn-note-icon delete"
                                  onClick={() => handleDeleteNote(noteId)}
                                  disabled={deletingNoteId === noteId}
                                  title="Delete Note"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                            <div className="note-item-text">
                              {note.noteDescription}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* 2. Learning Videos (e-Tutorial) Playlist Card */}
            <div className="mc-watch-expandable-card">
              <div
                className="expandable-header"
                onClick={() => setIsLearningOpen(!isLearningOpen)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', background: '#ffffff' }}
              >
                <div className="expandable-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00385E', fontWeight: 800 }}>
                  <Video size={16} style={{ color: '#00385E' }} />
                  <span>Learning</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00385E', background: '#f0f7fc', padding: '2px 8px', borderRadius: '999px', border: '1px solid #c9dfef' }}>
                    {currentPlaylist.length} Topics
                  </span>
                  <ChevronDown size={16} className={`chevron-exp ${isLearningOpen ? 'open' : ''}`} style={{ color: '#00385E' }} />
                </div>
              </div>

              {isLearningOpen && (
                <div className="expandable-content-body" style={{ padding: '12px 14px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  {/* Video Lecture List Items */}
                  <div className="playlist-items-stack">
                    {currentPlaylist.length === 0 ? (
                      <div style={{ padding: '16px 12px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
                        No learning videos found.
                      </div>
                    ) : (
                      currentPlaylist.map((item, idx) => {
                        const isActive = idx === activeLectureIdx && !selectedPdf;
                        const itemVid = item.ytId || getYouTubeVideoId(item.videoUrl) || item.id;
                        const rawData = videoProgressMap[itemVid];
                        let itemProgress = 0;

                        if (isActive) {
                          const activeDur = videoDuration > 0
                            ? videoDuration
                            : (item.videoDuration > 0 ? item.videoDuration : (rawData?.totalDuration > 0 ? rawData.totalDuration : 0));
                          const liveSec = Math.max(currentTime, maxWatchedTime);
                          itemProgress = activeDur > 0
                            ? (liveSec >= activeDur ? 100 : Math.min(99, Math.floor((liveSec / activeDur) * 100)))
                            : (rawData?.percentageWatched || 0);
                        } else if (rawData) {
                          if (rawData.totalDuration > 0 && rawData.watchedSeconds >= 0) {
                            const isDone = rawData.watchedSeconds >= rawData.totalDuration;
                            itemProgress = isDone ? 100 : Math.min(99, Math.floor((rawData.watchedSeconds / rawData.totalDuration) * 100));
                          } else {
                            itemProgress = rawData.percentageWatched || 0;
                          }
                        }

                        return (
                          <div
                            key={item.id}
                            className={`playlist-item-row ${isActive ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedPdf(null);
                              if (idx === activeLectureIdx) {
                                handleTogglePlay();
                              } else {
                                if (currentTime > 0) saveCurrentWatchProgress(currentTime, videoDuration);
                                userInitiatedPlayRef.current = true;
                                setActiveLectureIdx(idx);
                                handlePlayVideo();
                              }
                            }}
                          >
                            <div className="playlist-item-left">
                              <div className={`playlist-play-icon-circle ${isActive ? 'active' : ''}`}>
                                {isActive && isPlaying ? (
                                  <Pause size={12} className="play-svg-arrow" />
                                ) : (
                                  <Play size={12} className="play-svg-arrow" />
                                )}
                              </div>
                              <span className="playlist-item-name">{item.title}</span>
                            </div>

                            <div className="playlist-item-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="playlist-item-pct">{item.duration}</span>

                              {/* Mini Circular Progress Ring */}
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
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Dedicated Video Notes Section Card */}
           

            {/* 3. Dynamic Learning Text e-Content Accordion */}
            {(() => {
              const textContentList = currentPlaylist.filter(item => Boolean(item.topicPdf));
              return (
                <div className="mc-watch-expandable-card">
                  <div
                    className="expandable-header"
                    onClick={() => setIsTextContentOpen(!isTextContentOpen)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', background: '#ffffff' }}
                  >
                    <div className="expandable-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00385E', fontWeight: 800 }}>
                      <BookOpen size={16} style={{ color: '#00385E' }} />
                      <span>Learning Text e-Content</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00385E', background: '#f0f7fc', padding: '2px 8px', borderRadius: '999px', border: '1px solid #c9dfef' }}>
                        {textContentList.length} Units
                      </span>
                      <ChevronDown size={16} className={`chevron-exp ${isTextContentOpen ? 'open' : ''}`} style={{ color: '#00385E' }} />
                    </div>
                  </div>

                  {isTextContentOpen && (
                    <div className="expandable-content-body" style={{ padding: '12px 14px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                      {textContentList.length === 0 ? (
                        <div style={{ padding: '16px 12px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
                          No text e-Content found for this course.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {textContentList.map((topicItem, idx) => {
                            const isSelected = selectedPdf?.title === topicItem.title;
                            const pdfUrl = topicItem.topicPdf;
                            return (
                              <div
                                key={topicItem.id || idx}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedPdf(null);
                                  } else {
                                    setSelectedPdf({ url: pdfUrl, title: topicItem.title });
                                    setIsPlaying(false);
                                    if (videoRef.current) videoRef.current.pause();
                                    if (ytPlayerRef.current?.pauseVideo) ytPlayerRef.current.pauseVideo();
                                  }
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
                                {/* Theme White PDF Document Badge */}
                                <div
                                  style={{
                                    width: '32px',
                                    height: '38px',
                                    background: '#ffffff',
                                    borderRadius: '5px',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '0 2px 6px rgba(0, 56, 94, 0.08)',
                                    border: '1.5px solid #00385E',
                                    overflow: 'hidden'
                                  }}
                                >
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      right: 0,
                                      width: '8px',
                                      height: '8px',
                                      background: '#00385E',
                                      borderBottomLeftRadius: '3px'
                                    }}
                                  />
                                  <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#00385E', letterSpacing: '0.04em' }}>PDF</span>
                                </div>

                                {/* Themed Topic Link */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <span
                                    style={{
                                      fontSize: '0.8rem',
                                      fontWeight: 700,
                                      color: isSelected ? '#00385E' : '#334155',
                                      textDecoration: 'none',
                                      textTransform: 'uppercase',
                                      lineHeight: 1.3,
                                      display: 'block',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                    className="mc-topic-pdf-link"
                                  >
                                    {topicItem.title}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '2px', fontWeight: 600 }}>
                                    Unit {idx + 1} • Interactive Study Notes
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 3. Quiz Accordion Section */}
            <div className="mc-watch-expandable-card">
              <div
                className="expandable-header"
                onClick={() => setIsQuizAccordionOpen(!isQuizAccordionOpen)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', background: '#ffffff' }}
              >
                <div className="expandable-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00385E', fontWeight: 800 }}>
                  <HelpCircle size={16} style={{ color: '#00385E' }} />
                  <span>Quiz Assessment</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00385E', background: '#f0f7fc', padding: '2px 8px', borderRadius: '999px', border: '1px solid #c9dfef' }}>
                    Assessment
                  </span>
                  <ChevronDown size={16} className={`chevron-exp ${isQuizAccordionOpen ? 'open' : ''}`} style={{ color: '#00385E' }} />
                </div>
              </div>

              {isQuizAccordionOpen && (
                <div className="expandable-content-body" style={{ padding: '14px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <p style={{ fontSize: '0.84rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                    Benchmark your understanding of <strong>{(currentCourse.title || currentCourse.microcredentialCourseName || 'THIS COURSE').toUpperCase()}</strong> across all units. Complete to qualify for final certification.
                  </p>

                  {/* Eligibility Notice Banner */}
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: isQuizEligible ? '#0369a1' : '#00385E',
                      background: isQuizEligible ? '#e0f2fe' : '#f0f7fc',
                      border: `1.5px solid ${isQuizEligible ? '#bae6fd' : '#c9dfef'}`,
                      borderRadius: '8px',
                      padding: '9px 12px',
                      marginBottom: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      lineHeight: 1.4
                    }}
                  >
                    {isQuizEligible ? (
                      <CheckCircle2 size={15} style={{ color: '#0284c7', flexShrink: 0 }} />
                    ) : (
                      <Lock size={15} style={{ color: '#00385E', flexShrink: 0 }} />
                    )}
                    <span>
                      {quizStatusMessage || (isQuizEligible
                        ? 'You are eligible to attempt this quiz.'
                        : 'Please watch at least 90% of the video to unlock the quiz.')}
                    </span>
                  </div>

                  <button
                    type="button"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #00385E 0%, #005a96 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      padding: '11px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(0,56,94,0.22)',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={handleOpenQuizModal}
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
                    {downloadDocuments.length} {downloadDocuments.length === 1 ? 'Document Available' : 'Documents Available'}
                  </span>
                </div>
              </div>

              {/* Dynamic Document Links from microcredentialStudentDownloadDocumentList */}
              {downloadDocuments.length > 0 ? (
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
              ) : (
                <div style={{ padding: '8px 4px', fontSize: '0.8rem', color: '#64748B' }}>
                  No documents available for download.
                </div>
              )}
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
                  onClick={handleCreateQuestion}
                  disabled={submittingQuestion || !newQuestionText.trim()}
                >
                  {submittingQuestion ? 'Submitting...' : 'Submit Question'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Attempt Details & History Modal */}
        <QuizAttemptDetailsModal
          isOpen={showQuizModal}
          onClose={() => setShowQuizModal(false)}
          onStartQuiz={handleStartQuiz}
          loading={quizAttemptLoading}
          error={quizAttemptError}
          courseTitle={currentCourse.title || currentCourse.microcredentialCourseName || 'Microcredential Course'}
          attemptData={quizAttemptData}
        />

      </div>
    </div>
  );
}
