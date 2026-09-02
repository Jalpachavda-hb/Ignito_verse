// ignitoverse: Executive Microcredential Detail Page (Single Page Continuous Flow)
import React, { useState } from 'react';
import { 
  Clock, 
  Star, 
  CheckCircle2, 
  PlayCircle, 
  ShieldCheck, 
  FileText, 
  Award, 
  HelpCircle, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Calendar, 
  Layers, 
  BookOpen, 
  Globe, 
  DollarSign, 
  FileCheck, 
  GraduationCap, 
  Sparkle, 
  Check, 
  Play, 
  Link, 
  MessageCircle 
} from 'lucide-react';
import meditationImg from '../../assets/home/meditaion.png';

export default function MicrocredentialDetail({ 
  course, 
  onBack = () => {}, 
  onBookDemo = () => {}, 
  onPreviewVideo = () => {} 
}) {
  const [expandedModule, setExpandedModule] = useState('mod-1');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!course) return null;

  const toggleModule = (modId) => {
    setExpandedModule(expandedModule === modId ? null : modId);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="mc-detail-page-wrapper">
      <div className="mc-fluid-container mc-main-two-col-grid">
        
        {/* ========================================================
            LEFT COLUMN (SINGLE CONTINUOUS FLOW)
            ======================================================== */}
        <div className="mc-main-left-column">
          
          {/* 1. Breadcrumbs */}
          <div className="mc-breadcrumb-section">
            <div className="mc-breadcrumb-trail">
              <span className="breadcrumb-item linkable" onClick={onBack}>Home</span>
              <span className="breadcrumb-divider">›</span>
              <span className="breadcrumb-item linkable" onClick={onBack}>Microcredentials</span>
              <span className="breadcrumb-divider">›</span>
              <span className="breadcrumb-item active">{course.title}</span>
            </div>
          </div>

          {/* 2. Hero Header Block (Title & Rating + Meditation Image) */}
          <div className="mc-hero-split-card">
            
            {/* Left Hero Text Side */}
            <div className="mc-hero-text-content">
              <div className="mc-category-badge">
                {course.category ? course.category.toUpperCase() : 'MANAGEMENT'}
              </div>

              <h1 className="mc-hero-title">{course.title}</h1>

              {/* Stats Bar (Rating & Last Updated) */}
              <div className="mc-hero-stats-row">
                <div className="mc-rating-badge">
                  <Star size={14} className="star-icon-filled" />
                  <span className="rating-score">{course.rating || '4.5'}</span>
                </div>
                <div className="mc-stat-divider" />
                <div className="mc-stat-item">
                  <Calendar size={15} className="mc-stat-icon" />
                  <span>Last updated {course.lastUpdated || '05 August 2026'}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Meditation Image */}
            <div className="mc-hero-visual-side">
              <img 
                src={meditationImg} 
                alt="Meditation & Relaxation" 
                className="mc-hero-meditation-photo"
              />
            </div>

          </div>

          {/* 3. CONTINUOUS SINGLE PAGE CONTENT FLOW (NO TABS) */}
          <div className="mc-single-page-sections-stack">
            
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

            {/* Section 2: What Will You Learn? Box */}
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

            {/* Section 4: Curriculum & Video Masterclasses */}
            <div className="mc-card-section">
              <div className="mc-section-header">
                <div className="mc-header-icon-box purple-tint">
                  <BookOpen size={20} />
                </div>
                <h2 className="mc-section-title">Curriculum & Video Masterclasses</h2>
              </div>
              
              <div className="mc-curriculum-accordion">
                {(course.modules || [
                  {
                    id: 'rt-mod-1',
                    title: 'Module 1: Foundations of Relaxation & Breathwork',
                    duration: '2h 15m',
                    lectures: [
                      { title: 'Understanding Tension Triggers & Diaphragmatic Breathing', duration: '30m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                      { title: 'Mind-Body Connection & Somatic Calmness', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
                    ]
                  },
                  {
                    id: 'rt-mod-2',
                    title: 'Module 2: Meditation Practices for Focus & Clarity',
                    duration: '2h 45m',
                    lectures: [
                      { title: 'Guided Mindfulness for Emotional Regulation', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                      { title: 'Daily Stress Reset & 5-Minute Meditation Routines', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
                    ]
                  }
                ]).map((mod, mIdx) => {
                  const isOpen = expandedModule === (mod.id || `mod-${mIdx}`);
                  const currentModId = mod.id || `mod-${mIdx}`;
                  return (
                    <div key={currentModId} className={`mc-accordion-item ${isOpen ? 'open' : ''}`}>
                      <div 
                        className="mc-accordion-header"
                        onClick={() => toggleModule(currentModId)}
                      >
                        <div className="mc-accordion-title-left">
                          <span className="mc-module-num">0{mIdx + 1}</span>
                          <h4>{mod.title}</h4>
                        </div>
                        <div className="mc-accordion-header-right">
                          <span className="mc-mod-duration"><Clock size={13} /> {mod.duration}</span>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>

                      {isOpen && (
                        <div className="mc-lectures-tray">
                          {mod.lectures?.map((lec, lIdx) => (
                            <div key={lIdx} className="mc-lecture-entry">
                              <div className="mc-lecture-left">
                                <PlayCircle size={17} className="play-icon-blue" />
                                <span>{lec.title}</span>
                              </div>
                              <div className="mc-lecture-right">
                                <span className="lec-dur-text">{lec.duration}</span>
                                <button 
                                  type="button" 
                                  className="btn-preview-tag"
                                  onClick={() => onPreviewVideo({
                                    lectureTitle: lec.title,
                                    courseTitle: course.title,
                                    duration: lec.duration,
                                    videoUrl: lec.videoUrl
                                  })}
                                >
                                  Preview
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Learner Reviews & Ratings */}
            <div className="mc-card-section">
              <div className="mc-section-header">
                <div className="mc-header-icon-box purple-tint">
                  <Star size={20} />
                </div>
                <h2 className="mc-section-title">Learner Reviews & Ratings</h2>
              </div>
              <div className="mc-reviews-summary-strip">
                <div className="big-rating-number">4.5</div>
                <div className="stars-large">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="star-icon-filled" />
                  ))}
                </div>
                <span className="total-reviews-count">Based on 452 verified corporate learner reviews</span>
              </div>
            </div>

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
              onClick={() => onPreviewVideo({
                lectureTitle: course.modules?.[0]?.lectures?.[0]?.title || '6 Relaxation Techniques Overview',
                courseTitle: course.title,
                duration: '15 mins',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
              })}
            >
              <img 
                src={course.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'} 
                alt={course.title} 
                className="mc-video-cover-img"
              />
              <div className="mc-video-overlay-tint">
                <div className="mc-video-brand-tag">NISPAHD</div>
                <div className="mc-video-headline-text">
                  <h3>6 RELAXATION TECHNIQUES</h3>
                  <p>TO RELIEVE STRESS</p>
                </div>
                <div className="mc-glass-play-button">
                  <Play size={24} className="play-icon-triangle" />
                </div>
              </div>
            </div>

            {/* Apply Now Primary Button */}
            <div className="mc-sidebar-apply-btn-wrapper">
              <button 
                type="button" 
                className="mc-btn-apply-full"
                onClick={onBookDemo}
              >
                Apply Now
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
                  {course.level || 'Beginner (Level 1)'}
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
                  ₹ 5000/-
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
                  {course.language || 'English'}
                </div>
              </div>

              {/* Row 6: Prerequisites */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <ShieldCheck size={15} className="inc-icon" />
                  <span>Prerequisites</span>
                </div>
                <div className="include-val-cell">
                  {course.prerequisites ? 'None' : 'None'}
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
                  {course.certificateName || course.title}
                </div>
              </div>

              {/* Row 10: Exam Format */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <BookOpen size={15} className="inc-icon" />
                  <span>Exam Format</span>
                </div>
                <div className="include-val-cell">
                  {course.examDetails?.format || 'Multiple Choice'}
                </div>
              </div>

              {/* Row 11: Certification Skill Level */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Sparkle size={15} className="inc-icon" />
                  <span>Certification Skill Level</span>
                </div>
                <div className="include-val-cell">
                  {course.skillLevel || 'Beginner-Friendly'}
                </div>
              </div>

              {/* Row 12: Update */}
              <div className="mc-include-row">
                <div className="include-key-cell">
                  <Calendar size={15} className="inc-icon" />
                  <span>Update</span>
                </div>
                <div className="include-val-cell">
                  {course.lastUpdated || '05 August 2026'}
                </div>
              </div>

              {/* Row 13: Certificate */}
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
