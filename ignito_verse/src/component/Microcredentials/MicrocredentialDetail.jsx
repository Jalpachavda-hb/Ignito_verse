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
import {
  getMicrocredentialCourseBindDataList,
  getMicrocredentialCourseDetail,
  getMicroCourseTopicDetail,
  getReviewByMicroCourseId
} from '../../services/microcredentialService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';

export default function MicrocredentialDetail({
  course: initialCourse,
  onBack = () => { },
  onBookDemo = () => { },
  onPreviewVideo = () => { },
  onWatchCourse = () => { }
}) {
  const [courseData, setCourseData] = useState(initialCourse || {});
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [courseNotFound, setCourseNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [topicsList, setTopicsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [likedReviews, setLikedReviews] = useState({});
  const [hasLiked, setHasLiked] = useState({});

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
      const rawCertImg = merged.certificateImage || '';
      const formattedCert = rawCertImg ? formatImageUrl(rawCertImg) : userCertificateImg;

      const learnList = Array.isArray(merged.microCourseLearnOutputList) && merged.microCourseLearnOutputList.length > 0
        ? merged.microCourseLearnOutputList.map(item => item.microCourseLearnDescription || item.learnDescription || item.description || item).filter(Boolean)
        : null;

      const courseTitle = merged.microcredentialCourseName || merged.title || 'Microcredential Course';

      setCourseData({
        ...merged,
        id: merged.microcredentialCourseId || merged.encryptedMicrocredentialCourseId || numericCourseId,
        microcredentialCourseId: merged.microcredentialCourseId || numericCourseId,
        encryptedMicrocredentialCourseId: merged.encryptedMicrocredentialCourseId || encryptedId,
        title: courseTitle,
        microcredentialCourseName: courseTitle,
        courseLevel: merged.courseLevel || 'Intermediate (Level 2)',
        level: merged.courseLevel ? merged.courseLevel.split('(')[0].trim() : 'Intermediate',
        fullLevel: merged.courseLevel || 'Intermediate (Level 2)',
        category: merged.streamName || 'Management',
        streamName: merged.streamName || 'Management',
        price: merged.microcredentialCoursePrice !== undefined ? merged.microcredentialCoursePrice : 5000,
        rating: merged.microcredentialCourseRating || 5,
        duration: merged.microcredentialCourseDuration || '3 Month',
        thumbnail: formattedThumb,
        certificateImage: formattedCert,
        language: merged.language || 'ENGLISH',
        updatedOn: merged.updatedOn || 'August 2026',
        lastUpdated: merged.updatedOn || 'August 2026',
        professorName: merged.professorName || '',
        certificateName: merged.certificateName || courseTitle || 'CERTIFICATE OF COMPLETION',
        about: merged.aboutMicrocredentialCourse || merged.courseAbout || merged.about || `This course introduces comprehensive ${courseTitle} methods and practical tools to develop skills and achieve institutional goals in digital education.`,
        description: merged.microcredentialCourseDescription || merged.courseDescription || merged.description || `${courseTitle} focuses on developing core competencies and industry-verified expertise through practical exercises.`,
        learningOutcomes: learnList,
        materialIncludeList: merged.materialIncludeOutputList || []
      });
      setCourseNotFound(false);
    };

    // Load dynamic topics and reviews using microcredentialCourseId in payload
    const loadExtraDetails = (courseIdNum) => {
      if (!courseIdNum || courseIdNum <= 0) return;

      // 1. Fetch course topic details
      getMicroCourseTopicDetail(courseIdNum, 3)
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
          }
        })
        .catch(() => {});

      // 2. Fetch course reviews
      getReviewByMicroCourseId(courseIdNum, 3)
        .then((rRes) => {
          if (!isMounted) return;
          if (rRes && rRes.success && Array.isArray(rRes.getReviewByMicroCourseList) && rRes.getReviewByMicroCourseList.length > 0) {
            setReviewsList(rRes.getReviewByMicroCourseList);
            const initialLikes = {};
            const initialHasLiked = {};
            rRes.getReviewByMicroCourseList.forEach((rev) => {
              const rId = rev.microcredentialCourseReviewId || rev.id;
              initialLikes[rId] = rev.reviewLikeCount || 0;
              initialHasLiked[rId] = Boolean(rev.isReviewLikedByStudent);
            });
            setLikedReviews(initialLikes);
            setHasLiked(initialHasLiked);
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

  const handleToggleLike = (reviewId) => {
    const isCurrentlyLiked = Boolean(hasLiked[reviewId]);
    setHasLiked(prev => ({
      ...prev,
      [reviewId]: !isCurrentlyLiked
    }));
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: Math.max(0, (prev[reviewId] || 0) + (isCurrentlyLiked ? -1 : 1))
    }));
  };

  const detailedTopics = [
    {
      id: 1,
      title: 'Acute vs Chronic Stress: Brain Chemistry & Cortisol Impact',
      duration: '45 min',
      type: 'Theory',
      icon: Brain
    },
    {
      id: 2,
      title: 'Diaphragmatic & Somatic Breathing for Immediate Vagal Activation',
      duration: '50 min',
      type: 'Practical',
      icon: Activity
    },
    {
      id: 3,
      title: 'Cognitive Reframing: Neuroplasticity & Thought Restructuring',
      duration: '40 min',
      type: 'Case Study',
      icon: Zap
    },
    {
      id: 4,
      title: 'Progressive Muscle Relaxation (PMR) & Somatic Tension Release',
      duration: '55 min',
      type: 'Practical',
      icon: PlayCircle
    },
    {
      id: 5,
      title: 'Mindfulness Integration for High-Performance Workspaces',
      duration: '45 min',
      type: 'Masterclass',
      icon: BookOpen
    },
    {
      id: 6,
      title: 'Executive Daily Reset: 5-Minute Micro-Meditation Protocols',
      duration: '35 min',
      type: 'Workshop',
      icon: Sparkles
    }
  ];

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
                <Star size={14} className="star-icon-filled" />
                <span className="rating-score">{course.rating || course.microcredentialCourseRating || '5'}</span>
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
                <span className="island-tab-badge count-pill">{topicsList.length > 0 ? topicsList.length : 12}</span>
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
                  <span className="island-tab-title">Student Review</span>
                </div>
                <span className="island-tab-badge rating-pill">4.5 ★</span>
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
                <span className="island-tab-badge official-pill">OFFICIAL</span>
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
                  <p className="mc-section-paragraph">
                    {course.about || "This course introduces simple relaxation methods and meditation practices to improve focus, reduce stress, and maintain emotional balance. Students learn breathing techniques, mindfulness practices, and ways to develop a calm and positive approach toward daily challenges."}
                  </p>
                </div>

                {/* Section 2: Description */}
                <div className="mc-card-section">
                  <div className="mc-section-header">
                    <div className="mc-header-icon-box purple-tint">
                      <FileText size={20} />
                    </div>
                    <h2 className="mc-section-title">Description</h2>
                  </div>
                  <p className="mc-section-paragraph">
                    {course.description || "Relaxation Techniques and Meditation focuses on developing mental calmness, emotional balance, and stress management skills through various relaxation practices. This course introduces students to breathing exercises, mindfulness, meditation methods, and techniques for reducing physical and mental tension to handle daily challenges effectively."}
                  </p>
                </div>

                {/* Section 3: What Will You Learn? Box */}
                <div className="mc-learn-box-card">
                  <h3 className="mc-learn-box-heading">What Will You Learn?</h3>
                  <div className="mc-learn-grid-2col">
                    {(course.learningOutcomes || [
                      'Build positive thinking habits and improve overall well-being.',
                      'Understand meditation practices for improving focus and mental clarity.',
                      'Learn breathing exercises to promote calmness and relaxation.',
                      'Understand meditation practices for improving focus and mental clarity.',
                      'Develop mindfulness skills to improve emotional balance and self-awareness.',
                      'Learn effective relaxation techniques to manage daily stress and pressure.'
                    ]).map((outcome, idx) => (
                      <div key={idx} className="mc-learn-item-row">
                        <div className="mc-learn-blue-check">
                          <Check size={12} strokeWidth={3.5} />
                        </div>
                        <span className="mc-learn-item-text">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: MICROCREDENTIALS CONTENT (LUXURY EXECUTIVE DESIGN) */}
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
                <div className="mc-luxury-modules-list">
                  {(topicsList.length > 0 ? topicsList : detailedTopics).map((item, idx) => (
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

              </div>
            )}

            {/* TAB 3: STUDENT REVIEW */}
            {activeTab === 'reviews' && (
              <div className="mc-reviews-creative-card">
                <div className="mc-section-header">
                  <div className="mc-header-icon-box purple-tint">
                    <Star size={20} />
                  </div>
                  <div>
                    <h2 className="mc-section-title">Student Review</h2>
                    <span className="mc-sub-text">Verified student feedback and rating breakdown</span>
                  </div>
                </div>

                {/* Rating Summary & Star Breakdown Grid */}
                <div className="mc-reviews-breakdown-grid">

                  {/* Big Score Box */}
                  <div className="mc-big-score-box">
                    <div className="score-number-display">{course.rating || course.microcredentialCourseRating || '5.0'}</div>
                    <div className="score-stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className="star-icon-filled" />
                      ))}
                    </div>
                    <span className="score-total-count">Total {reviewsList.length > 0 ? `${reviewsList.length} Verified` : '452 Verified'} Ratings</span>
                  </div>

                  {/* 5-Star Distribution Bars */}
                  <div className="mc-rating-bars-stack">
                    {[
                      { stars: 5, pct: 96, count: reviewsList.length > 0 ? `${reviewsList.filter(r => r.reviewInStar === 5).length || reviewsList.length} Ratings` : '434 Ratings' },
                      { stars: 4, pct: 4, count: reviewsList.length > 0 ? `${reviewsList.filter(r => r.reviewInStar === 4).length} Ratings` : '18 Ratings' },
                      { stars: 3, pct: 0, count: '0 Ratings' },
                      { stars: 2, pct: 0, count: '0 Ratings' },
                      { stars: 1, pct: 0, count: '0 Ratings' }
                    ].map((bar, bIdx) => (
                      <div key={bIdx} className="mc-rating-bar-row">
                        <span className="bar-star-label">☆ {bar.stars}</span>
                        <div className="bar-track-line">
                          <div className="bar-fill-line" style={{ width: `${bar.pct}%` }} />
                        </div>
                        <span className="bar-count-label">{bar.count}</span>
                      </div>
                    ))}
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
                              alt={rev.studentName || 'Student'}
                            />
                          </div>
                          <div className="student-author-info">
                            <h4>{rev.studentName || 'Verified Student'}</h4>
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
                          {rev.reviewDescription || "Great course with comprehensive practical modules!"}
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
                  <div className="mc-student-review-item">
                    <div className="student-review-author-row">
                      <div className="student-avatar-wrap">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                          alt="Anjali Sharma"
                        />
                      </div>
                      <div className="student-author-info">
                        <h4>Anjali Sharma</h4>
                        <div className="student-stars-and-date">
                          <div className="student-mini-stars">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={13} className="star-icon-filled" />
                            ))}
                          </div>
                          <span className="review-timestamp">• 3 months ago</span>
                        </div>
                      </div>
                    </div>

                    <p className="student-review-body-text">
                      "I am currently pursuing the course on this platform, and my learning experience has been excellent so far. The course content is well-structured, engaging, and easy to follow, with interactive lessons and assessments that enhance my understanding. I am learning practical techniques to manage daily stress, improve focus, and maintain emotional well-being in both academic and professional life."
                    </p>

                    <div className="student-review-action-row">
                      <button
                        type="button"
                        className={`btn-like-review ${hasLiked['default'] ? 'liked' : ''}`}
                        onClick={() => handleToggleLike('default')}
                      >
                        <ThumbsUp size={14} />
                        <span>Like ({likedReviews['default'] || 2})</span>
                      </button>
                    </div>
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
                  <div className="cert-badge-pill">
                    <Sparkles size={14} />
                    <span>Accredited Credential</span>
                  </div>
                </div>

                {/* Realistic Certificate Image Preview */}
                <div className="mc-certificate-image-canvas">
                  <img
                    src={course.certificateImage || userCertificateImg}
                    alt={`${course.title} Certificate of Completion`}
                    className="mc-certificate-preview-photo"
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
                  Included
                </div>
              </div>

              {/* Row 8: Number of Certificate */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Award size={15} className="inc-icon" />
                  <span>Number of Certificate</span>
                </div>
                <div className="include-val-cell">
                  1
                </div>
              </div>

              {/* Row 9: Certificate Name */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <GraduationCap size={15} className="inc-icon" />
                  <span>Certificate Name</span>
                </div>
                <div className="include-val-cell cert-title-val">
                  {courseData.certificateName || courseData.title || courseData.microcredentialCourseName}
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

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
