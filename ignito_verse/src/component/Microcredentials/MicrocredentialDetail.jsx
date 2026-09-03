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
  Activity
} from 'lucide-react';
import userCertificateImg from '../../assets/e47782ae-798b-479b-99e6-428b70bf4a7a.png';
import { getMicrocredentialCourseBindDataList } from '../../services/microcredentialService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';

export default function MicrocredentialDetail({
  course: initialCourse,
  onBack = () => { },
  onBookDemo = () => { },
  onPreviewVideo = () => { },
  onWatchCourse = () => { }
}) {
  const [courseData, setCourseData] = useState(initialCourse || {});
  const [activeTab, setActiveTab] = useState('info');
  const [likedReviews, setLikedReviews] = useState({ review1: 2 });
  const [hasLiked, setHasLiked] = useState({ review1: false });

  // Fetch full dynamic details from API using microcredentialCourseId
  useEffect(() => {
    const rawCourseId = initialCourse?.microcredentialCourseId || initialCourse?.courseId || initialCourse?.id;
    const numericCourseId = Number(rawCourseId) || (typeof rawCourseId === 'number' ? rawCourseId : 0);

    if (numericCourseId > 0) {
      getMicrocredentialCourseBindDataList(1, 10, 'UpdatedOn', 'DESC', 0, '', 0, false, '', numericCourseId)
        .then((res) => {
          if (res && res.success && Array.isArray(res.microcredentialCourseBindDatas) && res.microcredentialCourseBindDatas.length > 0) {
            const apiItem = res.microcredentialCourseBindDatas[0];
            const rawImg = apiItem.microcredentialCourseIntroImage || apiItem.introImage || apiItem.image || apiItem.thumbnail || '';
            const formattedThumb = rawImg ? formatImageUrl(rawImg) : (initialCourse?.thumbnail || '');

            setCourseData((prev) => ({
              ...(prev || {}),
              ...apiItem,
              id: apiItem.encryptedMicrocredentialCourseId || apiItem.microcredentialCourseId,
              microcredentialCourseId: apiItem.microcredentialCourseId,
              encryptedMicrocredentialCourseId: apiItem.encryptedMicrocredentialCourseId,
              title: apiItem.microcredentialCourseName || prev?.title || 'Microcredential Course',
              courseLevel: apiItem.courseLevel || prev?.courseLevel || 'Intermediate (Level 2)',
              level: apiItem.courseLevel ? apiItem.courseLevel.split('(')[0].trim() : (prev?.level || 'Intermediate'),
              fullLevel: apiItem.courseLevel || prev?.fullLevel || 'Intermediate (Level 2)',
              category: apiItem.streamName || prev?.category || 'Management',
              streamName: apiItem.streamName || prev?.streamName || 'Management',
              price: apiItem.microcredentialCoursePrice !== undefined ? apiItem.microcredentialCoursePrice : prev?.price,
              rating: apiItem.microcredentialCourseRating || prev?.rating || 5,
              duration: apiItem.microcredentialCourseDuration || prev?.duration || '3 Month',
              thumbnail: formattedThumb,
              language: apiItem.language || prev?.language || 'ENGLISH',
              updatedOn: apiItem.updatedOn || prev?.updatedOn || 'August 2026',
              lastUpdated: apiItem.updatedOn || prev?.lastUpdated || 'August 2026',
              professorName: apiItem.professorName || prev?.professorName || '',
              certificateName: apiItem.microcredentialCourseName || prev?.certificateName || 'STRESS MANAGEMENT',
              about: apiItem.courseAbout || apiItem.about || prev?.about || `This course introduces comprehensive ${apiItem.microcredentialCourseName || 'learning'} methods and practical tools to develop skills and achieve institutional goals in digital education.`,
              description: apiItem.courseDescription || apiItem.description || prev?.description || `${apiItem.microcredentialCourseName || 'This program'} focuses on developing core competencies and industry-verified expertise through practical exercises.`
            }));
          }
        })
        .catch((err) => {
          console.error('Error loading dynamic course detail:', err);
        });
    } else if (initialCourse) {
      setCourseData(initialCourse);
    }
  }, [initialCourse]);

  const course = courseData || initialCourse || {};

  if (!course || (!course.title && !course.microcredentialCourseName)) return null;

  const handleToggleLike = (reviewId) => {
    setHasLiked(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: prev[reviewId] + (hasLiked[reviewId] ? -1 : 1)
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
              <div className="mc-stat-divider" />
              <div className="mc-stat-item">
                <Calendar size={15} className="mc-stat-icon" />
                <span>Last updated {course.updatedOn || course.lastUpdated || 'August 2026'}</span>
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
                <span className="island-tab-badge count-pill">12</span>
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
                  {detailedTopics.map((item) => (
                    <div
                      key={item.id}
                      className="mc-module-luxury-card"
                    >
                      <div className="module-card-left">
                        <div className="module-index-box">0{item.id}</div>

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
                    <div className="score-number-display">5.0</div>
                    <div className="score-stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className="star-icon-filled" />
                      ))}
                    </div>
                    <span className="score-total-count">Total 452 Verified Ratings</span>
                  </div>

                  {/* 5-Star Distribution Bars */}
                  <div className="mc-rating-bars-stack">
                    {[
                      { stars: 5, pct: 96, count: '434 Ratings' },
                      { stars: 4, pct: 4, count: '18 Ratings' },
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

                {/* Verified Student Testimonial */}
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
                      className={`btn-like-review ${hasLiked.review1 ? 'liked' : ''}`}
                      onClick={() => handleToggleLike('review1')}
                    >
                      <ThumbsUp size={14} />
                      <span>Like ({likedReviews.review1})</span>
                    </button>
                  </div>
                </div>
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
              onClick={() => onWatchCourse(course)}
              title="Click to start watching"
            >
              <img
                src={course.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'}
                alt={course.title}
                className="mc-video-cover-img"
              />
              <div className="mc-video-overlay-tint">
                <div className="mc-video-brand-tag">{(course.streamName || course.category || 'IGNITOVERSE').toUpperCase()}</div>
                <div className="mc-video-headline-text">
                  <h3>{(course.title || course.microcredentialCourseName || 'MICROCREDENTIAL COURSE').toUpperCase()}</h3>
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
                onClick={() => onWatchCourse(course)}
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
                  {course.courseLevel || course.fullLevel || course.level || 'Beginner (Level 1)'}
                </div>
              </div>

              {/* Row 2: Duration */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Clock size={15} className="inc-icon" />
                  <span>Duration</span>
                </div>
                <div className="include-val-cell">
                  {course.duration || '2 Month'}
                </div>
              </div>

              {/* Row 3: Fees */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <DollarSign size={15} className="inc-icon" />
                  <span>Microcredential Fees</span>
                </div>
                <div className="include-val-cell bold-price">
                  {course.price !== undefined && course.price !== null ? `₹ ${Number(course.price).toLocaleString()}/-` : '₹ 5000/-'}
                </div>
              </div>

              {/* Row 4: Format */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <FileText size={15} className="inc-icon" />
                  <span>Format</span>
                </div>
                <div className="include-val-cell">
                  {course.format || 'Multiple Choice'}
                </div>
              </div>

              {/* Row 5: Language */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Globe size={15} className="inc-icon" />
                  <span>Language</span>
                </div>
                <div className="include-val-cell">
                  {course.language || 'ENGLISH'}
                </div>
              </div>

              {/* Row 6: Prerequisites */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <ShieldCheck size={15} className="inc-icon" />
                  <span>Prerequisites</span>
                </div>
                <div className="include-val-cell">
                  {course.prerequisites || 'None'}
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
                  {course.certificateName || course.title || course.microcredentialCourseName}
                </div>
              </div>

              {/* Row 10: Exam Format */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <BookOpen size={15} className="inc-icon" />
                  <span>Exam Format</span>
                </div>
                <div className="include-val-cell">
                  {course.examDetails?.format || course.examFormat || 'Multiple Choice'}
                </div>
              </div>

              {/* Row 11: Certification Skill Level */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Sparkles size={15} className="inc-icon" />
                  <span>Certification Skill Level</span>
                </div>
                <div className="include-val-cell">
                  {course.skillLevel || course.courseLevel || course.level || 'Beginner-Friendly'}
                </div>
              </div>

              {/* Row 12: Certificate Type */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Award size={15} className="inc-icon" />
                  <span>Certificate</span>
                </div>
                <div className="include-val-cell">
                  {course.certificateType || 'Certificate of completion'}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
