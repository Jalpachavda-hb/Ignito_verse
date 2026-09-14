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
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Video,
  Download,
  MoreVertical,
  BarChart2
} from 'lucide-react';
import AuthRequiredModal from '../modals/AuthRequiredModal';
import {
  getMicrocredentialCourseBindDataList,
  getMicrocredentialCourseDetail,
  getMicrocredentialModuleByCourseId,
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
  const [failedModuleImages, setFailedModuleImages] = useState({});

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

      // 1. Fetch course modules (Tab 2)
      getMicrocredentialModuleByCourseId(courseIdNum)
        .then((mRes) => {
          if (!isMounted) return;
          if (mRes && mRes.success && Array.isArray(mRes.microcredentialModuleList) && mRes.microcredentialModuleList.length > 0) {
            const mapped = mRes.microcredentialModuleList.map((item, idx) => {
              const rawImg = item.moduleBannerImage || item.bannerImage || item.image || '';
              const formattedImg = rawImg ? formatImageUrl(rawImg) : '';
              return {
                id: item.microcredentialModuleMasterId || item.id || (idx + 1),
                microcredentialModuleMasterId: item.microcredentialModuleMasterId || item.id || (idx + 1),
                title: item.moduleName || item.title || `Module ${idx + 1}`,
                moduleName: item.moduleName || item.title || `Module ${idx + 1}`,
                description: item.moduleDescription || item.description || '',
                moduleDescription: item.moduleDescription || item.description || '',
                bannerImage: formattedImg,
                moduleBannerImage: formattedImg,
                image: formattedImg,
                rawData: item
              };
            });
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
    course.certificateImage !== 'undefined'
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
              <span className="breadcrumb-item linkable" onClick={onBack}>My Learning</span>
              <span className="breadcrumb-divider">›</span>
              <span className="breadcrumb-item active">{course.title || course.microcredentialCourseName}</span>
            </div>
          </div>

          {/* 2. Hero Header Block */}
          <div className="mc-hero-header-block">
            <h1 className="mc-hero-title">{course.title || course.microcredentialCourseName}</h1>

            {/* Quick Rating Row */}
            <div className="mc-hero-stats-row">
              <div className="mc-hero-rating-clean">
                <Star size={16} className="star-icon-filled" style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                <span className="rating-bold-score">
                  {reviewsList.length > 0 
                    ? (reviewsList.reduce((acc, cur) => acc + (Number(cur.reviewInStar) || 5), 0) / reviewsList.length).toFixed(1)
                    : '5.0'}
                </span>
                <span className="rating-review-count">
                  ({reviewsList.length > 0 ? reviewsList.length : 1} Verified {reviewsList.length === 1 || reviewsList.length === 0 ? 'Review' : 'Reviews'})
                </span>
              </div>
            </div>

            {/* Course Subtitle / Tagline */}
            <p className="mc-hero-tagline-text">
              {course.description || course.about || 'Learn practical techniques to manage stress, improve focus, and maintain emotional well-being in both academic and professional life.'}
            </p>
          </div>

          {/* 3. INTEGRATED TOP BAR (5 EQUAL VISUAL ITEMS DIVIDED BY VERTICAL LINES) */}
          <div className="mc-integrated-topbar">
            {/* Item 1: Microcredential Information Tab */}
            <button
              type="button"
              className={`mc-topbar-item-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <div className="mc-item-icon-circle purple-soft">
                <Building2 size={17} />
              </div>
              <span className="mc-item-btn-text">Microcredential Information</span>
            </button>

            <div className="mc-topbar-sep-line" />

            {/* Item 2: Microcredentials Content Tab */}
            <button
              type="button"
              className={`mc-topbar-item-btn ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <div className="mc-item-icon-circle blue-soft">
                <BookOpen size={17} />
              </div>
              <span className="mc-item-btn-text">Microcredentials Content</span>
              <span className="mc-item-count-badge">{topicsList.length}</span>
            </button>

            <div className="mc-topbar-sep-line" />

            {/* Item 3: Duration Meta */}
            <div className="mc-topbar-item-cell">
              <div className="mc-item-icon-circle blue-soft">
                <Clock size={17} />
              </div>
              <div className="mc-item-stacked-text">
                <span className="item-label-bold">Duration</span>
                <span className="item-value-bold">{course.duration || course.microcredentialCourseDuration || '2 Hours'}</span>
              </div>
            </div>

            <div className="mc-topbar-sep-line" />

            {/* Item 4: Level Meta */}
            <div className="mc-topbar-item-cell">
              <div className="mc-item-icon-circle purple-soft">
                <BarChart2 size={17} />
              </div>
              <div className="mc-item-stacked-text">
                <span className="item-label-bold">Level</span>
                <span className="item-value-bold">{course.level || course.courseLevel?.split('(')[0]?.trim() || 'Beginner'}</span>
              </div>
            </div>

            <div className="mc-topbar-sep-line" />

            {/* Item 5: Language Meta */}
            <div className="mc-topbar-item-cell">
              <div className="mc-item-icon-circle blue-soft">
                <Globe size={17} />
              </div>
              <div className="mc-item-stacked-text">
                <span className="item-label-bold">Language</span>
                <span className="item-value-bold">{course.language || 'English'}</span>
              </div>
            </div>
          </div>

          {/* 4. ACTIVE TAB CONTENT PANES */}
          <div className="mc-single-page-sections-stack">

            {/* TAB 1: MICROCREDENTIAL INFORMATION */}
            {activeTab === 'info' && (
              <>
                {/* About This Course */}
                <div className="mc-card-section-box">
                  <div className="mc-card-header-row">
                    <div className="mc-card-header-icon blue-squircle">
                      <FileText size={18} />
                    </div>
                    <h2 className="mc-card-header-title">About This Course</h2>
                  </div>
                  <div className="mc-card-body-paragraph">
                    {renderFormattedContent(course.about || course.description, "This course provides a comprehensive understanding of stress, its causes, and its effects on mental and physical health. You will learn practical techniques to manage stress, improve focus, and maintain emotional well-being in both academic and professional life. With interactive lessons and real-world examples, this course will help you build healthier habits and a more balanced lifestyle.")}
                  </div>
                </div>

                {/* What Will You Learn? Box (if present) */}
                {learnList.length > 0 && (
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
                  <div className="mc-luxury-modules-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {topicsList.map((item, idx) => {
                      const moduleImg = item.moduleBannerImage || item.bannerImage || item.image || (item.rawData && item.rawData.moduleBannerImage ? formatImageUrl(item.rawData.moduleBannerImage) : '');
                      const itemKey = item.id || item.microcredentialModuleMasterId || idx;
                      const isImgFailed = Boolean(failedModuleImages[itemKey]);
                      const showImage = Boolean(moduleImg && !isImgFailed);

                      return (
                        <div
                          key={itemKey}
                          className="mc-module-luxury-card"
                          onClick={() => onWatchCourse({
                            ...(courseData || initialCourse),
                            microcredentialModuleMasterId: item.microcredentialModuleMasterId || item.id,
                            selectedModuleMasterId: item.microcredentialModuleMasterId || item.id,
                            selectedModuleId: item.microcredentialModuleMasterId || item.id,
                            selectedModule: item,
                            ...item
                          })}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '20px',
                            padding: '18px 24px',
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1.5px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: '0 2px 10px rgba(0, 56, 94, 0.03)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.borderColor = '#00385E';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 56, 94, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 56, 94, 0.03)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1, minWidth: 0 }}>
                            {/* Module Index or Banner Photo */}
                            {showImage ? (
                              <div style={{
                                width: '72px',
                                height: '52px',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                flexShrink: 0,
                                background: '#f1f5f9',
                                border: '1px solid #e2e8f0'
                              }}>
                                <img
                                  src={moduleImg}
                                  alt={item.moduleName || item.topicName || `Module ${idx + 1}`}
                                  onError={() => {
                                    setFailedModuleImages(prev => ({ ...prev, [itemKey]: true }));
                                  }}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </div>
                            ) : (
                              <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, rgba(0, 56, 94, 0.08) 0%, rgba(2, 132, 199, 0.12) 100%)',
                                color: '#00385E',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '1.05rem',
                                flexShrink: 0,
                                border: '1.5px solid rgba(0, 56, 94, 0.15)'
                              }}>
                                {String(idx + 1).padStart(2, '0')}
                              </div>
                            )}

                            {/* Module Text Info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 }}>
                              <h4 style={{
                                fontSize: '1.02rem',
                                fontWeight: 700,
                                color: '#00385E',
                                margin: 0,
                                lineHeight: 1.35
                              }}>
                                {item.moduleName || item.topicName || item.title || `Module ${idx + 1}`}
                              </h4>
                              {(item.moduleDescription || item.description) && (
                                <p style={{
                                  fontSize: '0.86rem',
                                  color: '#64748B',
                                  margin: 0,
                                  lineHeight: 1.45,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}>
                                  {item.moduleDescription || item.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div style={{ flexShrink: 0 }}>
                            <button
                              type="button"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                color: '#00385E',
                                fontWeight: 700,
                                fontSize: '0.84rem',
                                padding: '8px 18px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <PlayCircle size={15} />
                              <span>Explore Module</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: '14px',
                    border: '1.5px dashed #cbd5e1',
                    color: '#64748b'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.92rem' }}>No modules available for this course yet.</p>
                  </div>
                )}

              </div>
            )}

            {/* EMPLOYEE REVIEWS SECTION (ALWAYS VISIBLE UNDER COURSE OVERVIEW) */}
            <div className="mc-card-section-box mc-reviews-creative-card">
              <div className="mc-card-header-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="mc-card-header-icon blue-squircle">
                    <Star size={18} />
                  </div>
                  <div>
                    <h2 className="mc-card-header-title">Employee Reviews</h2>
                    <p className="mc-card-header-subtitle">Verified employee feedback and rating breakdown</p>
                  </div>
                </div>
              </div>

              {/* Rating Summary & Star Breakdown Grid */}
              <div className="mc-reviews-breakdown-grid">
                {/* Big Score Box */}
                <div className="mc-big-score-box">
                  <div className="score-number-display">
                    {reviewsList.length > 0 
                      ? (reviewsList.reduce((acc, cur) => acc + (Number(cur.reviewInStar) || 5), 0) / reviewsList.length).toFixed(1)
                      : '5.0'}
                  </div>
                  <div className="score-stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={17}
                        className="star-icon-filled"
                        style={{ color: '#f59e0b', fill: '#f59e0b' }}
                      />
                    ))}
                  </div>
                  <span className="score-total-count">
                    Total {reviewsList.length > 0 ? reviewsList.length : 1} Verified {reviewsList.length === 1 || reviewsList.length === 0 ? 'Rating' : 'Ratings'}
                  </span>
                </div>

                {/* 5-Star Distribution Bars */}
                <div className="mc-rating-bars-stack">
                  {(() => {
                    const totalC = reviewsList.length > 0 ? reviewsList.length : 1;
                    const c5 = reviewsList.length > 0 ? reviewsList.filter(r => (Number(r.reviewInStar) || 0) === 5).length : 1;
                    const c4 = reviewsList.length > 0 ? reviewsList.filter(r => (Number(r.reviewInStar) || 0) === 4).length : 0;
                    const c3 = reviewsList.length > 0 ? reviewsList.filter(r => (Number(r.reviewInStar) || 0) === 3).length : 0;
                    const c2 = reviewsList.length > 0 ? reviewsList.filter(r => (Number(r.reviewInStar) || 0) === 2).length : 0;
                    const c1 = reviewsList.length > 0 ? reviewsList.filter(r => (Number(r.reviewInStar) || 0) === 1).length : 0;

                    return [
                      { stars: 5, pct: Math.round((c5 / totalC) * 100), count: `${c5} Ratings` },
                      { stars: 4, pct: Math.round((c4 / totalC) * 100), count: `${c4} Ratings` },
                      { stars: 3, pct: Math.round((c3 / totalC) * 100), count: `${c3} Ratings` },
                      { stars: 2, pct: Math.round((c2 / totalC) * 100), count: `${c2} Ratings` },
                      { stars: 1, pct: Math.round((c1 / totalC) * 100), count: `${c1} Ratings` }
                    ].map((bar, bIdx) => (
                      <div key={bIdx} className="mc-rating-bar-row">
                        <span className="bar-star-label">★ {bar.stars}</span>
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
                  const revName = rev.studentName || 'Verified Employee';
                  const initials = revName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AS';
                  return (
                    <div key={revId} className="mc-student-review-item">
                      <div className="student-review-author-row">
                        <div className="author-identity-group">
                          <div className="student-avatar-wrap">
                            <span className="student-avatar-initials">{initials}</span>
                          </div>
                          <div className="student-author-info">
                            <h4 className="student-name-heading">{revName}</h4>
                            <div className="student-stars-and-date">
                              <div className="student-mini-stars">
                                {[...Array(Number(rev.reviewInStar) || 5)].map((_, i) => (
                                  <Star key={i} size={13} className="star-icon-filled" style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                                ))}
                              </div>
                              <span className="review-timestamp">• {rev.createdOnText || '3 months ago'}</span>
                            </div>
                          </div>
                        </div>
                        <MoreVertical size={18} className="review-more-icon" />
                      </div>

                      <p className="student-review-body-text">
                        {rev.reviewDescription || "I am currently pursuing the Stress Management course on this LMS, and my learning experience has been excellent so far. The course content is well-structured, engaging, and easy to follow, with interactive lessons and assessments that enhance my understanding. I am learning practical techniques to manage stress, improve focus, and maintain emotional well-being in both academic and professional life. Overall, this course is helping me build valuable skills that I can apply in my daily life."}
                      </p>

                      <div className="student-review-action-row">
                        <button
                          type="button"
                          className={`btn-like-pill ${hasLiked[revId] ? 'liked' : ''}`}
                          onClick={() => handleToggleLike(revId)}
                        >
                          <ThumbsUp size={13} />
                          <span>Like ({likedReviews[revId] || 2})</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="mc-student-review-item">
                  <div className="student-review-author-row">
                    <div className="author-identity-group">
                      <div className="student-avatar-wrap">
                        <span className="student-avatar-initials">AS</span>
                      </div>
                      <div className="student-author-info">
                        <h4 className="student-name-heading">Anjali Sharma</h4>
                        <div className="student-stars-and-date">
                          <div className="student-mini-stars">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={13} className="star-icon-filled" style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                            ))}
                          </div>
                          <span className="review-timestamp">• 3 months ago</span>
                        </div>
                      </div>
                    </div>
                    <MoreVertical size={18} className="review-more-icon" />
                  </div>

                  <p className="student-review-body-text">
                    I am currently pursuing the Stress Management course on this LMS, and my learning experience has been excellent so far. The course content is well-structured, engaging, and easy to follow, with interactive lessons and assessments that enhance my understanding. I am learning practical techniques to manage stress, improve focus, and maintain emotional well-being in both academic and professional life. Overall, this course is helping me build valuable skills that I can apply in my daily life.
                  </p>

                  <div className="student-review-action-row">
                    <button
                      type="button"
                      className="btn-like-pill"
                      onClick={() => handleToggleLike('sample-1')}
                    >
                      <ThumbsUp size={13} />
                      <span>Like (2)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ========================================================
            RIGHT COLUMN: STICKY SIDEBAR
            ======================================================== */}
        <div className="mc-main-right-sidebar">

          {/* 1. Video Player Preview Cover Card */}
          <div className="mc-sidebar-video-box">
            <div className="mc-video-cover-container">
              <img
                src={courseData.thumbnail || initialCourse?.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'}
                alt={courseData.title || initialCourse?.title}
                className="mc-video-cover-img"
              />
              <div className="mc-video-overlay-tint">
                <div className="mc-video-brand-tag">{(courseData.streamName || courseData.category || 'MANAGEMENT').toUpperCase()}</div>
                <div className="mc-video-headline-text">
                  <h3>{(courseData.title || courseData.microcredentialCourseName || 'STRESS MANAGEMENT').toUpperCase()}</h3>
                  <p className="mc-video-sub-tagline">A Healthier Mind A Brighter You</p>
                </div>
                <div className="mc-glass-play-button">
                  <Play size={24} className="play-icon-triangle" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. "Course Details" Table Card (Clean non-repetitive rows) */}
          <div className="mc-sidebar-card-box">
            <h3 className="mc-sidebar-card-title">Course Details</h3>

            <div className="mc-includes-table">
              {/* Row 1: Level */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Layers size={15} className="inc-icon" />
                  <span>Level</span>
                </div>
                <div className="include-val-cell">
                  {courseData.courseLevel || courseData.fullLevel || courseData.level || 'Beginner'}
                </div>
              </div>

              {/* Row 2: Duration */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Clock size={15} className="inc-icon" />
                  <span>Duration</span>
                </div>
                <div className="include-val-cell">
                  {courseData.duration || courseData.microcredentialCourseDuration || '2 Hours'}
                </div>
              </div>

              {/* Row 3: Fees */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <DollarSign size={15} className="inc-icon" />
                  <span>Microcredential Fees</span>
                </div>
                <div className="include-val-cell bold-price">
                  {courseData.price !== undefined && courseData.price !== null && Number(courseData.price) > 0
                    ? `₹ ${Number(courseData.price).toLocaleString()}/-`
                    : 'Free'}
                </div>
              </div>

              {/* Row 4: Format */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <FileText size={15} className="inc-icon" />
                  <span>Format</span>
                </div>
                <div className="include-val-cell">
                  {courseData.format || 'Online'}
                </div>
              </div>

              {/* Row 5: Language */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Globe size={15} className="inc-icon" />
                  <span>Language</span>
                </div>
                <div className="include-val-cell">
                  {courseData.language || 'English'}
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
            </div>
          </div>

          {/* 3. Certificate Showcase Card */}
          <div className="mc-sidebar-card-box mc-sidebar-cert-card">
            <div className="mc-sidebar-cert-header">
              <div className="mc-header-icon-box blue-tint">
                <Award size={18} />
              </div>
              <div>
                <h4 className="mc-sidebar-cert-title">Certificate</h4>
                <p className="mc-sidebar-cert-subtitle">Earn a verifiable certificate upon successful completion of this course.</p>
              </div>
            </div>

            <div className="mc-official-cert-box">
              <div className="official-cert-left">
                <div className="official-check-circle">
                  <Check size={13} strokeWidth={3.5} />
                </div>
                <div>
                  <div className="official-cert-name">Official Certificate</div>
                  <div className="official-cert-tag">Get certified and showcase your skills</div>
                </div>
              </div>
              <ChevronRight size={18} className="official-arrow-icon" />
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
