// ignitoverse: Executive Microcredential Detail Page with Luxury Floating Island Tabs & Dynamic API Data
import React, { useState, useEffect } from 'react';
import {
  Clock,
  Star,
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
  FileText,
  Award,
  Building2,
  Layers,
  BookOpen,
  Globe,
  DollarSign,
  FileCheck,
  GraduationCap,
  Sparkles,
  Check,
  Play,
  ThumbsUp,
  Share2,
  Calendar,
  Brain,
  ChevronRight,
  Zap,
  Activity,
  AlertCircle,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import userCertificateImg from '../../assets/e47782ae-798b-479b-99e6-428b70bf4a7a.png';
import AuthRequiredModal from '../modals/AuthRequiredModal';
import {
  getMicrocredentialCourseBindDataList,
  getMicrocredentialCourseDetail,
  getMicroCourseTopicDetail,
  getReviewByMicroCourseId,
  getStudentReviewByMicroCorseId,
  getMicroCourseLearnData,
  getMicroCourseMaterialIncludeData,
  ignitoMicroStudentReviewInsert,
  microcredentialStudentReviewLikeInsert,
  getLoggedInStudentId
} from '../../services/microcredentialService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';

export default function MicrocredentialDetail({
  course: initialCourse,
  onBack = () => { },
  onPreviewVideo = () => { },
  onWatchCourse = () => { },
  onNavigate = () => { }
}) {
  const [courseData, setCourseData] = useState(initialCourse || {});
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [courseNotFound, setCourseNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [topicsList, setTopicsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [learnList, setLearnList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [likedReviews, setLikedReviews] = useState({});
  const [hasLiked, setHasLiked] = useState({});
  const [certImgFailed, setCertImgFailed] = useState(false);

  // Authentication Required Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionText, setAuthActionText] = useState('write and submit an employee review');

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewStar, setNewReviewStar] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitMessage, setReviewSubmitMessage] = useState('');
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

  // Fetch full dynamic details from API securely using microcredentialCourseId or encryptedMicrocredentialCourseId
  useEffect(() => {
    let isMounted = true;
    setLoadingDetail(true);
    setCourseNotFound(false);
    setCertImgFailed(false);

    const rawCourseId = initialCourse?.microcredentialCourseId || initialCourse?.courseId || initialCourse?.id;
    const numericCourseId = Number(rawCourseId) || (typeof rawCourseId === 'number' ? rawCourseId : 0);
    const encryptedId = initialCourse?.encryptedMicrocredentialCourseId || initialCourse?.encryptedId || (typeof initialCourse?.id === 'string' ? initialCourse.id : '');

    const applyCourseData = (detailObj = {}, bindObj = {}) => {
      const merged = { ...bindObj, ...detailObj };
      const rawImg = merged.microcredentialCourseIntroImage || merged.introImage || merged.image || merged.thumbnail || '';
      const formattedThumb = rawImg ? formatImageUrl(rawImg) : (initialCourse?.thumbnail || '');
      const rawCertImg = (merged.certificateImage && merged.certificateImage !== 'null' && merged.certificateImage !== 'undefined') ? String(merged.certificateImage).trim() : '';
      const formattedCert = rawCertImg ? formatImageUrl(rawCertImg) : '';

      const directLearn = Array.isArray(merged.microCourseLearnOutputList) && merged.microCourseLearnOutputList.length > 0
        ? merged.microCourseLearnOutputList.map(item => item.microCourseLearnDescription || item.learnDescription || item.microCourseLearn || item.description || item).filter(Boolean)
        : [];

      const courseTitle = merged.microcredentialCourseName || merged.title || 'Microcredential Course';

      if (directLearn.length > 0) {
        setLearnList(directLearn);
      }

      if (Array.isArray(merged.materialIncludeOutputList) && merged.materialIncludeOutputList.length > 0) {
        setMaterialList(merged.materialIncludeOutputList);
      }

      setCourseData({
        ...merged,
        id: merged.microcredentialCourseId || merged.encryptedMicrocredentialCourseId || numericCourseId,
        microcredentialCourseId: merged.microcredentialCourseId || numericCourseId,
        encryptedMicrocredentialCourseId: merged.encryptedMicrocredentialCourseId || encryptedId,
        title: courseTitle,
        microcredentialCourseName: courseTitle,
        courseLevel: merged.courseLevel || '',
        level: merged.courseLevel ? merged.courseLevel.split('(')[0].trim() : '',
        fullLevel: merged.courseLevel || '',
        category: merged.streamName || '',
        streamName: merged.streamName || '',
        price: merged.microcredentialCoursePrice !== undefined ? merged.microcredentialCoursePrice : 0,
        rating: merged.microcredentialCourseRating || 0,
        duration: merged.microcredentialCourseDuration || '',
        thumbnail: formattedThumb,
        certificateImage: formattedCert,
        language: merged.language || 'ENGLISH',
        updatedOn: merged.updatedOn || '',
        lastUpdated: merged.updatedOn || '',
        professorName: merged.professorName || '',
        certificateName: merged.certificateName || '',
        about: merged.aboutMicrocredentialCourse || merged.courseAbout || merged.about || '',
        description: merged.microcredentialCourseDescription || merged.courseDescription || merged.description || '',
        learningOutcomes: directLearn.length > 0 ? directLearn : [],
        materialIncludeList: merged.materialIncludeOutputList || []
      });
      setCourseNotFound(false);
    };

    // Load dynamic topics, reviews, learn items, and materials using microcredentialCourseId in payload
    const loadExtraDetails = (courseIdNum) => {
      if (!courseIdNum || courseIdNum <= 0) return;

      const currentStudentId = getLoggedInStudentId();

      // 1. Fetch course topic details (Tab 2)
      getMicroCourseTopicDetail(courseIdNum, currentStudentId)
        .then((tRes) => {
          if (!isMounted) return;
          if (tRes && tRes.success && Array.isArray(tRes.getMicroCourseTopicDetailList) && tRes.getMicroCourseTopicDetailList.length > 0) {
            const mapped = tRes.getMicroCourseTopicDetailList.map((item, idx) => ({
              id: item.microCourseTopicId || (idx + 1),
              title: item.topicName || item.videoTitle || `Topic ${idx + 1}`,
              duration: item.videoDuration ? `${Math.round(item.videoDuration / 60)} min` : '45 min',
              type: 'Practical',
              rawData: item
            }));
            setTopicsList(mapped);
          } else {
            setTopicsList([]);
          }
        })
        .catch(() => {
          if (isMounted) setTopicsList([]);
        });

      // 2. Fetch course reviews (Tab 3) & check if student already reviewed
      const currentStudentName = (localStorage.getItem('StudentName') || '').trim().toLowerCase();
      const localReviewed = localStorage.getItem(`has_reviewed_course_${courseIdNum}`) === 'true';

      if (localReviewed) {
        setHasSubmittedReview(true);
      }

      if (currentStudentId > 0) {
        getStudentReviewByMicroCorseId(currentStudentId, courseIdNum)
          .then((srRes) => {
            if (!isMounted) return;
            if (srRes && srRes.success && (srRes.reviewInStar > 0 || (srRes.reviewDescription && srRes.reviewDescription.trim()))) {
              setHasSubmittedReview(true);
            }
          })
          .catch(() => {});
      }

      getReviewByMicroCourseId(courseIdNum, currentStudentId)
        .then((rRes) => {
          if (!isMounted) return;
          if (rRes && rRes.success && Array.isArray(rRes.getReviewByMicroCourseList) && rRes.getReviewByMicroCourseList.length > 0) {
            setReviewsList(rRes.getReviewByMicroCourseList);
            const initialLikes = {};
            const initialHasLiked = {};
            let alreadyReviewed = false;
            rRes.getReviewByMicroCourseList.forEach((rev) => {
              const rId = rev.microcredentialCourseReviewId || rev.id;
              initialLikes[rId] = rev.reviewLikeCount || 0;
              initialHasLiked[rId] = Boolean(rev.isReviewLikedByStudent);
              const revStudentId = Number(rev.studentId ?? rev.StudentId ?? 0);
              const revStudentName = (rev.studentName || rev.StudentName || '').trim().toLowerCase();
              if ((currentStudentId > 0 && revStudentId === currentStudentId) || (currentStudentName && revStudentName === currentStudentName)) {
                alreadyReviewed = true;
              }
            });
            setLikedReviews(initialLikes);
            setHasLiked(initialHasLiked);
            if (alreadyReviewed || localReviewed) {
              setHasSubmittedReview(true);
            }
          }
        })
        .catch(() => {});

      // 3. Fetch learn data items (Tab 1 What Will You Learn)
      getMicroCourseLearnData(courseIdNum)
        .then((lRes) => {
          if (!isMounted) return;
          if (lRes && lRes.success && Array.isArray(lRes.microCourseLearnDataList) && lRes.microCourseLearnDataList.length > 0) {
            const list = lRes.microCourseLearnDataList.map(item => item.microCourseLearn || item.learnDescription || item.description).filter(Boolean);
            if (list.length > 0) {
              setLearnList(list);
            }
          }
        })
        .catch(() => {});

      // 4. Fetch materials include data (Sidebar)
      getMicroCourseMaterialIncludeData(courseIdNum)
        .then((mRes) => {
          if (!isMounted) return;
          if (mRes && mRes.success && Array.isArray(mRes.microCourseMaterialIncludeDataList) && mRes.microCourseMaterialIncludeDataList.length > 0) {
            setMaterialList(mRes.microCourseMaterialIncludeDataList);
          }
        })
        .catch(() => {});
    };

    // 1. If numeric course ID is provided (> 0)
    if (numericCourseId > 0) {
      Promise.allSettled([
        getMicrocredentialCourseDetail(numericCourseId),
        getMicrocredentialCourseBindDataList(1, 10, 'UpdatedOn', 'DESC', 0, '', 0, false, '', numericCourseId)
      ])
        .then(([detailRes, bindRes]) => {
          if (!isMounted) return;
          const detailData = (detailRes.status === 'fulfilled' && detailRes.value && detailRes.value.success) ? detailRes.value : null;
          const bindList = (bindRes.status === 'fulfilled' && bindRes.value && bindRes.value.success && Array.isArray(bindRes.value.microcredentialCourseBindDatas))
            ? bindRes.value.microcredentialCourseBindDatas
            : [];
          const bindData = bindList.find(b => Number(b.microcredentialCourseId) === numericCourseId) || bindList[0] || null;

          if (detailData || bindData) {
            applyCourseData(detailData || {}, bindData || {});
            loadExtraDetails(numericCourseId);
          } else if (initialCourse && initialCourse.title && !initialCourse.isPendingValidation) {
            setCourseData(initialCourse);
            setCourseNotFound(false);
          } else {
            setCourseNotFound(true);
          }
        })
        .catch((err) => {
          console.error('Error loading dynamic course detail:', err);
          if (initialCourse && initialCourse.title && !initialCourse.isPendingValidation) {
            setCourseData(initialCourse);
          } else {
            setCourseNotFound(true);
          }
        })
        .finally(() => {
          if (isMounted) setLoadingDetail(false);
        });
    } else if (encryptedId && String(encryptedId).trim()) {
      const rawEnc = String(encryptedId).trim();
      let decodedEnc = rawEnc;
      try {
        decodedEnc = decodeURIComponent(rawEnc).trim();
      } catch (e) {}

      // 2. Query courses list to look up the encrypted course ID securely
      getMicrocredentialCourseBindDataList(1, 100, 'UpdatedOn', 'DESC', 0, '', 0, false, '')
        .then((res) => {
          if (!isMounted) return;
          if (res && res.success && Array.isArray(res.microcredentialCourseBindDatas)) {
            const matchedItem = res.microcredentialCourseBindDatas.find(item => {
              const itemEnc = String(item.encryptedMicrocredentialCourseId || '').trim();
              const itemId = String(item.microcredentialCourseId || '').trim();
              return (
                (itemEnc && (itemEnc === rawEnc || itemEnc === decodedEnc || encodeURIComponent(itemEnc) === rawEnc)) ||
                (itemId && (itemId === rawEnc || itemId === decodedEnc))
              );
            });

            if (matchedItem) {
              const resolvedNumId = Number(matchedItem.microcredentialCourseId) || 0;
              if (resolvedNumId > 0) {
                getMicrocredentialCourseDetail(resolvedNumId)
                  .then((detailRes) => {
                    if (!isMounted) return;
                    const detailData = (detailRes && detailRes.success) ? detailRes : {};
                    applyCourseData(detailData, matchedItem);
                    loadExtraDetails(resolvedNumId);
                  })
                  .catch(() => {
                    if (!isMounted) return;
                    applyCourseData({}, matchedItem);
                    loadExtraDetails(resolvedNumId);
                  });
              } else {
                applyCourseData({}, matchedItem);
              }
            } else if (initialCourse && initialCourse.title && !initialCourse.isPendingValidation) {
              setCourseData(initialCourse);
              setCourseNotFound(false);
            } else {
              setCourseNotFound(true);
            }
          } else if (initialCourse && initialCourse.title && !initialCourse.isPendingValidation) {
            setCourseData(initialCourse);
            setCourseNotFound(false);
          } else {
            setCourseNotFound(true);
          }
        })
        .catch((err) => {
          console.error('Error finding course by encrypted ID:', err);
          if (initialCourse && initialCourse.title && !initialCourse.isPendingValidation) {
            setCourseData(initialCourse);
          } else {
            setCourseNotFound(true);
          }
        })
        .finally(() => {
          if (isMounted) setLoadingDetail(false);
        });
    } else {
      if (initialCourse && initialCourse.title && !initialCourse.isPendingValidation) {
        setCourseData(initialCourse);
        setCourseNotFound(false);
      } else {
        setCourseNotFound(true);
      }
      setLoadingDetail(false);
    }

    return () => {
      isMounted = false;
    };
  }, [initialCourse]);

  const course = courseData || initialCourse || {};
  const hasCertificate = Boolean(
    course.certificateImage &&
    typeof course.certificateImage === 'string' &&
    course.certificateImage.trim() !== '' &&
    course.certificateImage !== 'null' &&
    course.certificateImage !== 'undefined' &&
    !certImgFailed
  );

  // Helper to render dynamic text, bullet points (e.g. '•', '\n-', etc.), or rich HTML safely
  const renderFormattedContent = (rawContent, fallbackText = '') => {
    if (!rawContent || !String(rawContent).trim()) {
      return <p className="mc-section-paragraph">{fallbackText}</p>;
    }

    let text = String(rawContent).trim();

    // Normalize potential HTML breaks/paragraphs to check for bullet formats
    const cleanForBullets = text
      .replace(/<\/?p>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/&bull;/gi, '•')
      .replace(/&#8226;/gi, '•');

    // Check if content contains bullet characters
    if (cleanForBullets.includes('•') || cleanForBullets.includes('\n- ') || cleanForBullets.includes('\n* ')) {
      let intro = '';
      let bullets = [];

      if (cleanForBullets.includes('•')) {
        const parts = cleanForBullets.split('•').map(s => s.trim()).filter(Boolean);
        if (parts.length > 1) {
          const firstPart = parts[0];
          // If the first part does not start with bullet and is an introductory statement
          if (firstPart.endsWith(':') || (!cleanForBullets.startsWith('•') && firstPart.length > 0)) {
            intro = firstPart;
            bullets = parts.slice(1);
          } else {
            bullets = parts;
          }
        } else if (parts.length === 1) {
          bullets = parts;
        }
      } else {
        const lines = cleanForBullets.split('\n').map(l => l.trim()).filter(Boolean);
        lines.forEach((line) => {
          if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
            bullets.push(line.replace(/^[-*•]\s*/, '').trim());
          } else if (bullets.length === 0) {
            intro = intro ? `${intro} ${line}` : line;
          } else {
            bullets.push(line);
          }
        });
      }

      if (bullets.length > 0) {
        return (
          <div className="mc-formatted-content-wrap">
            {intro && <p className="mc-section-paragraph mc-bullet-intro">{intro}</p>}
            <ul className="mc-bullet-points-list">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="mc-bullet-point-item">
                  <span className="mc-bullet-icon-ring">
                    <span className="mc-bullet-icon-core" />
                  </span>
                  <span className="mc-bullet-point-text">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }
    }

    // Check if content contains HTML tags (e.g. <p>, <strong>, <em>, <ul>, <li>, etc.)
    if (/<[a-z][\s\S]*>/i.test(text)) {
      return (
        <div 
          className="mc-rich-html-content"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }

    // Plain text: split by double newlines if multi-paragraph
    const paragraphs = text.split(/\n\s*\n|\r\n\s*\r\n/).map(p => p.trim()).filter(Boolean);
    if (paragraphs.length > 1) {
      return (
        <div className="mc-description-text-stack">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="mc-section-paragraph">{para}</p>
          ))}
        </div>
      );
    }

    return <p className="mc-section-paragraph">{text}</p>;
  };

  // If loading
  if (loadingDetail) {
    return (
      <div className="mc-detail-page-wrapper" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '14px', color: '#00385E' }}>
        <RefreshCw size={28} className="spinner" style={{ animation: 'spin 1s linear infinite', color: '#00385E' }} />
        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>Loading microcredential details...</p>
      </div>
    );
  }

  // If course not found (invalid or tampered URL)
  if (courseNotFound || (!course.title && !course.microcredentialCourseName)) {
    return (
      <div className="mc-detail-page-wrapper" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '48px 36px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0, 56, 94, 0.06)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef2f2', border: '2px solid #fee2e2', color: '#dc2626', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
            <AlertCircle size={32} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#00385E', margin: '0 0 10px 0' }}>
            Microcredential Course Not Found
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 24px 0' }}>
            The course identifier in the URL is invalid or has expired. Please select a valid course from our official catalog.
          </p>
          <button 
            type="button" 
            onClick={onBack}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: '#00385E', 
              color: '#ffffff', 
              fontWeight: 700, 
              fontSize: '0.92rem', 
              padding: '12px 28px', 
              borderRadius: '10px', 
              border: 'none', 
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 56, 94, 0.25)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Browse All Microcredentials</span>
          </button>
        </div>
      </div>
    );
  }

  const handleToggleLike = async (reviewId) => {
    const currentStudentId = getLoggedInStudentId();
    if (!currentStudentId || currentStudentId <= 0) {
      setAuthActionText('like or interact with reviews');
      setIsAuthModalOpen(true);
      return;
    }

    const isCurrentlyLiked = Boolean(hasLiked[reviewId]);
    setHasLiked(prev => ({
      ...prev,
      [reviewId]: !isCurrentlyLiked
    }));
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: Math.max(0, (prev[reviewId] || 0) + (isCurrentlyLiked ? -1 : 1))
    }));

    try {
      const numCourseId = Number(courseData?.microcredentialCourseId || initialCourse?.microcredentialCourseId) || 0;
      const numReviewId = Number(reviewId) || 0;
      if (numReviewId > 0 && numCourseId > 0) {
        await microcredentialStudentReviewLikeInsert(numReviewId, currentStudentId, numCourseId);
      }
    } catch (e) {
      console.warn('Like action error:', e);
    }
  };

  const handleWriteReviewClick = () => {
    const currentStudentId = getLoggedInStudentId();
    if (!currentStudentId || currentStudentId <= 0) {
      setAuthActionText('write and submit an employee review');
      setIsAuthModalOpen(true);
      return;
    }
    setShowReviewForm(prev => !prev);
  };

  const handleSubmitNewReview = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newReviewText.trim()) return;

    const currentStudentId = getLoggedInStudentId();
    if (!currentStudentId || currentStudentId <= 0) {
      setAuthActionText('write and submit an employee review');
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmittingReview(true);
    setReviewSubmitMessage('');

    const numCourseId = Number(courseData?.microcredentialCourseId || initialCourse?.microcredentialCourseId) || 0;
    try {
      const res = await ignitoMicroStudentReviewInsert(currentStudentId, numCourseId, newReviewStar, newReviewText.trim());
      if (res && res.success) {
        const studentName = localStorage.getItem('StudentName') || 'You (Employee)';
        const studentImage = localStorage.getItem('ProfileImage') || '';
        const newlyCreated = {
          microcredentialCourseReviewId: Date.now(),
          studentId: currentStudentId,
          microcredentialCourseId: numCourseId,
          reviewInStar: newReviewStar,
          reviewDescription: newReviewText.trim(),
          studentName: studentName,
          studentProfileImage: studentImage,
          createdOnText: 'Just now',
          isReviewLikedByStudent: false,
          reviewLikeCount: 0
        };
        setReviewsList(prev => [newlyCreated, ...prev]);
        setNewReviewText('');
        setShowReviewForm(false);
        setHasSubmittedReview(true);
        if (numCourseId > 0) {
          localStorage.setItem(`has_reviewed_course_${numCourseId}`, 'true');
        }
        setReviewSubmitMessage('Thank you! Your review has been submitted successfully.');
      } else {
        setReviewSubmitMessage(res?.message || 'Could not submit review. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewSubmitMessage('An error occurred while submitting your review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="mc-detail-page-wrapper">
      <div className="mc-fluid-container mc-main-two-col-grid">

        {/* ========================================================
            LEFT COLUMN (TABS NAVIGATION & CONTENT)
            ======================================================== */}
        <div className="mc-main-left-column">

          {/* 1. Breadcrumbs */}
          <div className="mc-breadcrumb-section">
            <div className="mc-breadcrumb-trail">
              <span className="breadcrumb-item linkable" onClick={onBack}>Home</span>
              <span className="breadcrumb-divider">›</span>
              <span className="breadcrumb-item linkable" onClick={onBack}>Microcredentials</span>
              <span className="breadcrumb-divider">›</span>
              <span className="breadcrumb-item active">{course.title || course.microcredentialCourseName}</span>
            </div>
          </div>

          {/* 2. Hero Header Block */}
          <div className="mc-hero-header-block">
            <div className="mc-category-pill-wrapper">
              <span className="mc-category-capsule-tag">
                <span className="mc-cat-indicator-dot" />
                {(course.streamName || course.category || 'MANAGEMENT').toUpperCase()}
              </span>
            </div>

            <h1 className="mc-hero-title">{course.title || course.microcredentialCourseName}</h1>

            {/* Quick Metadata Stats */}
            <div className="mc-hero-stats-row">
              <div className="mc-rating-badge">
                <Star
                  size={14}
                  className={reviewsList.length > 0 ? "star-icon-filled" : "star-icon-empty"}
                  style={{ color: reviewsList.length > 0 ? '#f59e0b' : '#94a3b8', fill: reviewsList.length > 0 ? '#f59e0b' : 'none' }}
                />
                <span className="rating-score">
                  {reviewsList.length > 0 
                    ? (reviewsList.reduce((acc, cur) => acc + (Number(cur.reviewInStar) || 5), 0) / reviewsList.length).toFixed(1)
                    : 0}
                </span>
              </div>
            </div>
          </div>

          {/* 3. LUXURY FLOATING ISLAND TAB BAR */}
          <div className="mc-island-tabs-container">
            <div className="mc-island-tabs-track">

              {/* Tab 1: Info */}
              <button
                type="button"
                className={`mc-island-tab-item ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <div className="island-tab-circle-icon purple-soft">
                  <Building2 size={19} />
                </div>
                <div className="island-tab-text-group">
                  <span className="island-tab-title">Microcredential Information</span>
                </div>
              </button>

              {/* Tab 2: Content */}
              <button
                type="button"
                className={`mc-island-tab-item ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
              >
                <div className="island-tab-circle-icon blue-soft">
                  <BookOpen size={19} />
                </div>
                <div className="island-tab-text-group">
                  <span className="island-tab-title">Microcredentials Content</span>
                </div>
                <span className="island-tab-badge count-pill">{topicsList.length}</span>
              </button>

              {/* Tab 3: Reviews */}
              <button
                type="button"
                className={`mc-island-tab-item ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <div className="island-tab-circle-icon gold-soft">
                  <Star size={19} />
                </div>
                <div className="island-tab-text-group">
                  <span className="island-tab-title">Employee Reviews</span>
                </div>
                <span className="island-tab-badge rating-pill">
                  {reviewsList.length > 0 
                    ? `${(reviewsList.reduce((acc, cur) => acc + (Number(cur.reviewInStar) || 5), 0) / reviewsList.length).toFixed(1)} ★`
                    : '0 ★'}
                </span>
              </button>

              {/* Tab 4: Certificate */}
              <button
                type="button"
                className={`mc-island-tab-item ${activeTab === 'certificate' ? 'active' : ''}`}
                onClick={() => setActiveTab('certificate')}
              >
                <div className="island-tab-circle-icon teal-soft">
                  <Award size={19} />
                </div>
                <div className="island-tab-text-group">
                  <span className="island-tab-title">Certificate</span>
                </div>
                <span className={`island-tab-badge ${hasCertificate ? 'official-pill' : 'count-pill'}`} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  {hasCertificate ? 'OFFICIAL' : 'N/A'}
                </span>
              </button>

            </div>
          </div>

          {/* Decorative Colorful Node Line */}
          <div className="mc-nodes-accent-line">
            <div className="node-dot blue" />
            <div className="node-dot purple" />
            <div className="node-dot orange" />
            <div className="node-dot teal" />
          </div>

          {/* 4. ACTIVE TAB CONTENT PANES */}
          <div className="mc-single-page-sections-stack">

            {/* TAB 1: MICROCREDENTIAL INFORMATION */}
            {activeTab === 'info' && (
              <>
                {/* Section 1: About Microcredential */}
                <div className="mc-card-section">
                  <div className="mc-section-header">
                    <div className="mc-header-icon-box purple-tint">
                      <Building2 size={20} />
                    </div>
                    <h2 className="mc-section-title">About Microcredential</h2>
                  </div>
                  {renderFormattedContent(course.about, "No about information available for this course.")}
                </div>

                {/* Section 2: Description */}
                <div className="mc-card-section">
                  <div className="mc-section-header">
                    <div className="mc-header-icon-box purple-tint">
                      <FileText size={20} />
                    </div>
                    <h2 className="mc-section-title">Description</h2>
                  </div>
                  {renderFormattedContent(course.description, "No description available for this course.")}
                </div>

                {/* Section 3: What Will You Learn? Box */}
                {learnList.length > 0 ? (
                  <div className="mc-learn-box-card">
                    <h3 className="mc-learn-box-heading">What Will You Learn?</h3>
                    <div className="mc-learn-grid-2col">
                      {learnList.map((outcome, idx) => (
                        <div key={idx} className="mc-learn-item-row">
                          <div className="mc-learn-blue-check">
                            <Check size={12} strokeWidth={3.5} />
                          </div>
                          <span className="mc-learn-item-text">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mc-learn-box-card" style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                    <h3 className="mc-learn-box-heading" style={{ marginBottom: '6px' }}>What Will You Learn?</h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>No specific learning outcomes found for this course.</p>
                  </div>
                )}
              </>
            )}

            {/* TAB 2: MICROCREDENTIALS CONTENT */}
            {activeTab === 'content' && (
              <div className="mc-content-luxury-pane">

                {/* Content Header Banner Card */}
                <div className="mc-content-banner-card">
                  <div className="banner-left-brand">
                    <div className="banner-squircle-icon">
                      <BookOpen size={28} />
                    </div>
                    <div className="banner-title-text">
                      <h2 className="banner-main-heading">Microcredential Content</h2>
                      <p className="banner-sub-desc">Access all learning modules and practical topics included in this microcredential.</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Module Topics List */}
                {topicsList.length > 0 ? (
                  <div className="mc-luxury-modules-list">
                    {topicsList.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="mc-module-luxury-card"
                      >
                        <div className="module-card-left">
                          <div className="module-index-box">{(idx + 1) < 10 ? `0${idx + 1}` : idx + 1}</div>

                          <div className="module-details-text">
                            <h3 className="module-title-headline">{item.title}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: '50px 24px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: '16px',
                    border: '1.5px dashed #cbd5e1',
                    margin: '20px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'rgba(0, 56, 94, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00385E',
                      marginBottom: '14px'
                    }}>
                      <BookOpen size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00385E', margin: '0 0 6px 0' }}>
                      No Course Content Found
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748B', maxWidth: '400px', margin: 0 }}>
                      No topic modules or video lessons have been added to this microcredential course yet.
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: STUDENT REVIEW */}
            {activeTab === 'reviews' && (
              <div className="mc-reviews-creative-card">
                <div className="mc-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="mc-header-icon-box purple-tint">
                      <Star size={20} />
                    </div>
                    <div>
                      <h2 className="mc-section-title">Employee Reviews</h2>
                      <span className="mc-sub-text">Verified employee feedback and rating breakdown</span>
                    </div>
                  </div>
                  {hasSubmittedReview ? (
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      padding: '6px 14px', 
                      background: '#f0fdf4', 
                      color: '#166534', 
                      border: '1px solid #bbf7d0', 
                      borderRadius: '20px', 
                      fontSize: '0.82rem', 
                      fontWeight: 700 
                    }}>
                      <Check size={14} strokeWidth={3} />
                      <span>Review Submitted</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleWriteReviewClick}
                      style={{
                        background: '#00385E',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Star size={14} />
                      <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
                    </button>
                  )}
                </div>

                {/* Interactive Write Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitNewReview} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', margin: '20px 0' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#00385E', fontWeight: 700 }}>Share Your Experience</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>Your Rating:</span>
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setNewReviewStar(starVal)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                        >
                          <Star size={20} fill={starVal <= newReviewStar ? '#f59e0b' : 'none'} color={starVal <= newReviewStar ? '#f59e0b' : '#94a3b8'} />
                        </button>
                      ))}
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00385E', marginLeft: '6px' }}>{newReviewStar} / 5 Stars</span>
                    </div>
                    <textarea
                      rows={3}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Write your honest review about this course, faculty, or topics..."
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                      required
                    />
                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '0.86rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingReview || !newReviewText.trim()}
                        style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#00385E', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '0.86rem', opacity: (isSubmittingReview || !newReviewText.trim()) ? 0.6 : 1 }}
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                )}

                {reviewSubmitMessage && (
                  <div style={{ padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '8px', fontSize: '0.88rem', margin: '14px 0' }}>
                    {reviewSubmitMessage}
                  </div>
                )}

                {/* Rating Summary & Star Breakdown Grid */}
                <div className="mc-reviews-breakdown-grid">

                  {/* Big Score Box */}
                  <div className="mc-big-score-box">
                    <div className="score-number-display">
                      {reviewsList.length > 0 
                        ? (reviewsList.reduce((acc, cur) => acc + (Number(cur.reviewInStar) || 5), 0) / reviewsList.length).toFixed(1)
                        : 0}
                    </div>
                    <div className="score-stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={reviewsList.length > 0 ? "star-icon-filled" : "star-icon-empty"}
                          style={{ color: reviewsList.length > 0 ? '#f59e0b' : '#cbd5e1', fill: reviewsList.length > 0 ? '#f59e0b' : 'none' }}
                        />
                      ))}
                    </div>
                    <span className="score-total-count">Total {reviewsList.length} Verified {reviewsList.length === 1 ? 'Rating' : 'Ratings'}</span>
                  </div>

                  {/* 5-Star Distribution Bars */}
                  <div className="mc-rating-bars-stack">
                    {(() => {
                      const totalC = reviewsList.length || 1;
                      const hasReviews = reviewsList.length > 0;
                      const c5 = reviewsList.filter(r => (Number(r.reviewInStar) || 0) === 5).length;
                      const c4 = reviewsList.filter(r => (Number(r.reviewInStar) || 0) === 4).length;
                      const c3 = reviewsList.filter(r => (Number(r.reviewInStar) || 0) === 3).length;
                      const c2 = reviewsList.filter(r => (Number(r.reviewInStar) || 0) === 2).length;
                      const c1 = reviewsList.filter(r => (Number(r.reviewInStar) || 0) === 1).length;

                      return [
                        { stars: 5, pct: hasReviews ? Math.round((c5 / totalC) * 100) : 0, count: `${c5} Ratings` },
                        { stars: 4, pct: hasReviews ? Math.round((c4 / totalC) * 100) : 0, count: `${c4} Ratings` },
                        { stars: 3, pct: hasReviews ? Math.round((c3 / totalC) * 100) : 0, count: `${c3} Ratings` },
                        { stars: 2, pct: hasReviews ? Math.round((c2 / totalC) * 100) : 0, count: `${c2} Ratings` },
                        { stars: 1, pct: hasReviews ? Math.round((c1 / totalC) * 100) : 0, count: `${c1} Ratings` }
                      ].map((bar, bIdx) => (
                        <div key={bIdx} className="mc-rating-bar-row">
                          <span className="bar-star-label">☆ {bar.stars}</span>
                          <div className="bar-track-line">
                            <div className="bar-fill-line" style={{ width: `${bar.pct}%` }} />
                          </div>
                          <span className="bar-count-label">{bar.count}</span>
                        </div>
                      ));
                    })()}
                  </div>

                </div>

                {/* Verified Student Testimonial List */}
                {reviewsList.length > 0 ? (
                  reviewsList.map((rev, rIdx) => {
                    const revId = rev.microcredentialCourseReviewId || rev.id || rIdx;
                    return (
                      <div key={revId} className="mc-student-review-item" style={{ marginTop: '16px' }}>
                        <div className="student-review-author-row">
                          <div className="student-avatar-wrap">
                            <img
                              src={rev.studentProfileImage ? formatImageUrl(rev.studentProfileImage) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                              alt={rev.studentName || 'Employee'}
                            />
                          </div>
                          <div className="student-author-info">
                            <h4>{rev.studentName || 'Verified Employee'}</h4>
                            <div className="student-stars-and-date">
                              <div className="student-mini-stars">
                                {[...Array(Number(rev.reviewInStar) || 5)].map((_, i) => (
                                  <Star key={i} size={13} className="star-icon-filled" />
                                ))}
                              </div>
                              <span className="review-timestamp">• {rev.createdOnText || 'Recent'}</span>
                            </div>
                          </div>
                        </div>

                        <p className="student-review-body-text">
                          {rev.reviewDescription || "No review text provided."}
                        </p>

                        <div className="student-review-action-row">
                          <button
                            type="button"
                            className={`btn-like-review ${hasLiked[revId] ? 'liked' : ''}`}
                            onClick={() => handleToggleLike(revId)}
                          >
                            <ThumbsUp size={14} />
                            <span>Like ({likedReviews[revId] || 0})</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: '14px',
                    border: '1.5px dashed #cbd5e1',
                    margin: '18px 0 0 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(0, 56, 94, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00385E',
                      marginBottom: '12px'
                    }}>
                      <Star size={26} />
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#00385E', margin: '0 0 6px 0' }}>
                      No Reviews Yet
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#64748B', maxWidth: '380px', margin: '0 0 14px 0' }}>
                      No employee reviews have been submitted for this course yet. Be the first to share your experience!
                    </p>
                    {!hasSubmittedReview && (
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(true)}
                        style={{
                          background: '#00385E',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 18px',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.84rem',
                          cursor: 'pointer'
                        }}
                      >
                        Write the First Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: CERTIFICATE */}
            {activeTab === 'certificate' && (
              <div className="mc-certificate-showcase-card">
                <div className="mc-certificate-header-row">
                  <div className="mc-section-header">
                    <div className="mc-header-icon-box purple-tint">
                      <Award size={20} />
                    </div>
                    <div>
                      <h2 className="mc-section-title">Certificate of Completion</h2>
                      <span className="mc-sub-text">Official accredited credential verifiable on blockchain</span>
                    </div>
                  </div>
                  {hasCertificate && (
                    <div className="cert-badge-pill">
                      <Sparkles size={14} />
                      <span>Accredited Credential</span>
                    </div>
                  )}
                </div>

                {hasCertificate ? (
                  <>
                    {/* Realistic Certificate Image Preview */}
                    <div className="mc-certificate-image-canvas">
                      <img
                        src={course.certificateImage}
                        alt={`${course.title || course.microcredentialCourseName || 'Course'} Certificate of Completion`}
                        className="mc-certificate-preview-photo"
                        onError={() => setCertImgFailed(true)}
                      />
                    </div>

                    {/* Bottom Verification & Share Strip */}
                    <div className="mc-cert-footer-verify-strip">
                      <div className="verify-strip-left">
                        <CheckCircle2 size={16} className="check-green-svg" />
                        <span>Click to verify this accredited certificate authenticity on blockchain</span>
                      </div>
                      <div className="verify-strip-actions">
                        <button
                          type="button"
                          className="btn-cert-share"
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(window.location.href);
                            }
                            alert('Certificate verification link copied!');
                          }}
                        >
                          <Share2 size={13} />
                          <span>Share Certificate</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{
                    padding: '56px 24px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: '16px',
                    border: '1.5px dashed #cbd5e1',
                    margin: '18px 0 10px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(0, 56, 94, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00385E',
                      marginBottom: '16px'
                    }}>
                      <Award size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#00385E', margin: '0 0 8px 0' }}>
                      No Certificate Available
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: '440px', lineHeight: 1.6, margin: 0 }}>
                      No certificate is available for this microcredential course at this time. All course materials, video lectures, and learning resources remain fully accessible.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* ========================================================
            RIGHT COLUMN: STICKY SIDEBAR
            ======================================================== */}
        <div className="mc-main-right-sidebar">

          {/* 1. Video Player Preview Cover Card */}
          <div className="mc-sidebar-video-box">
            <div
              className="mc-video-cover-container"
              onClick={() => onWatchCourse(courseData || initialCourse)}
              title="Click to start watching"
            >
              <img
                src={courseData.thumbnail || initialCourse?.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'}
                alt={courseData.title || initialCourse?.title}
                className="mc-video-cover-img"
              />
              <div className="mc-video-overlay-tint">
                <div className="mc-video-brand-tag">{(courseData.streamName || courseData.category || 'IGNITOVERSE').toUpperCase()}</div>
                <div className="mc-video-headline-text">
                  <h3>{(courseData.title || courseData.microcredentialCourseName || 'MICROCREDENTIAL COURSE').toUpperCase()}</h3>
                </div>
                <div className="mc-glass-play-button">
                  <Play size={24} className="play-icon-triangle" />
                </div>
              </div>
            </div>

            {/* Watch Video Dedicated Button */}
            <div className="mc-sidebar-watch-btn-wrapper">
              <button
                type="button"
                className="mc-btn-watch-full"
                onClick={() => onWatchCourse(courseData || initialCourse)}
              >
                <PlayCircle size={18} />
                <span>Watch Video</span>
              </button>
            </div>
          </div>

          {/* 2. "Microcredential Includes" Table Card */}
          <div className="mc-sidebar-card-box">
            <h3 className="mc-sidebar-card-title">Microcredential Includes</h3>

            <div className="mc-includes-table">

              {/* Row 1: Level */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Layers size={15} className="inc-icon" />
                  <span>Level</span>
                </div>
                <div className="include-val-cell">
                  {courseData.courseLevel || courseData.fullLevel || courseData.level || 'Beginner (Level 1)'}
                </div>
              </div>

              {/* Row 2: Duration */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Clock size={15} className="inc-icon" />
                  <span>Duration</span>
                </div>
                <div className="include-val-cell">
                  {courseData.duration || courseData.microcredentialCourseDuration || '2 Month'}
                </div>
              </div>

              {/* Row 3: Fees */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <DollarSign size={15} className="inc-icon" />
                  <span>Microcredential Fees</span>
                </div>
                <div className="include-val-cell bold-price">
                  {courseData.price !== undefined && courseData.price !== null ? `₹ ${Number(courseData.price).toLocaleString()}/-` : '₹ 5000/-'}
                </div>
              </div>

              {/* Row 4: Format */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <FileText size={15} className="inc-icon" />
                  <span>Format</span>
                </div>
                <div className="include-val-cell">
                  {courseData.format || 'Multiple Choice'}
                </div>
              </div>

              {/* Row 5: Language */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Globe size={15} className="inc-icon" />
                  <span>Language</span>
                </div>
                <div className="include-val-cell">
                  {courseData.language || 'ENGLISH'}
                </div>
              </div>

              {/* Row 6: Prerequisites */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <ShieldCheck size={15} className="inc-icon" />
                  <span>Prerequisites</span>
                </div>
                <div className="include-val-cell">
                  {courseData.prerequisites || 'None'}
                </div>
              </div>

              {/* Row 7: Exam & Certificate */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <FileCheck size={15} className="inc-icon" />
                  <span>Exam & Certificate</span>
                </div>
                <div className="include-val-cell">
                  {hasCertificate ? 'Included' : 'Not Included'}
                </div>
              </div>

              {/* Row 8: Number of Certificate */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Award size={15} className="inc-icon" />
                  <span>Number of Certificate</span>
                </div>
                <div className="include-val-cell">
                  {hasCertificate ? '1' : '0'}
                </div>
              </div>

              {/* Row 9: Certificate Name */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <GraduationCap size={15} className="inc-icon" />
                  <span>Certificate Name</span>
                </div>
                <div className="include-val-cell cert-title-val">
                  {hasCertificate ? (courseData.certificateName || courseData.title || courseData.microcredentialCourseName) : 'Not Available'}
                </div>
              </div>

              {/* Row 10: Exam Format */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <BookOpen size={15} className="inc-icon" />
                  <span>Exam Format</span>
                </div>
                <div className="include-val-cell">
                  {courseData.examDetails?.format || courseData.examFormat || 'Multiple Choice'}
                </div>
              </div>

              {/* Row 11: Certification Skill Level */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Sparkles size={15} className="inc-icon" />
                  <span>Certification Skill Level</span>
                </div>
                <div className="include-val-cell">
                  {courseData.skillLevel || courseData.courseLevel || courseData.level || 'Beginner-Friendly'}
                </div>
              </div>

              {/* Row 12: Certificate Type */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Award size={15} className="inc-icon" />
                  <span>Certificate</span>
                </div>
                <div className="include-val-cell">
                  {courseData.certificateType || 'Certificate of completion'}
                </div>
              </div>

              {/* Dynamic Materials from API */}
              {materialList.map((mat, mIdx) => {
                const matText = mat.materialInclude || mat.title || (typeof mat === 'string' ? mat : '');
                if (!matText) return null;
                return (
                  <div key={mIdx} className="mc-include-row">
                    <div className="include-key-cell">
                      <CheckCircle2 size={15} className="inc-icon" />
                      <span>{matText}</span>
                    </div>
                    <div className="include-val-cell">
                      Included
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>

      </div>

      {/* Authentication Required Modal */}
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={() => {
          setIsAuthModalOpen(false);
          onNavigate('login');
        }}
        courseTitle={courseData.title || courseData.microcredentialCourseName || ''}
        actionText={authActionText}
      />
    </div>
  );
}
