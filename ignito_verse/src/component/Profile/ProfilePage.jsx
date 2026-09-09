// ignitoverse: Executive Learner Profile & Portal (Creative Design with profilebg.png)
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Award, ShieldCheck, BookOpen, Clock, 
  Check, Download, ArrowRight, PlayCircle, Building2, 
  Briefcase, Sparkles, User as UserIcon, Calendar, TrendingUp,
  Star, Layers
} from 'lucide-react';
import profileBgImg from '../../assets/profilebg.png';
import badgesImg from '../../assets/badges.png';
import { getStudentEnrolledMicrocredentialCourse } from '../../services/profileService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';

export default function ProfilePage({ 
  user = {
    name: 'Enterprise User',
    email: 'enterprise.user@ignitoverse.com',
    role: 'Executive Learner',
    company: 'IgnitoVerse Enterprise',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    empId: 'EMP-1001'
  },
  initialTab = 'dashboard',
  onExploreCatalog = () => {},
  onViewCourse = () => {}
}) {
  const [activeTab, setActiveTab] = useState(
    ['dashboard', 'certificates'].includes(initialTab) ? initialTab : 'dashboard'
  );

  // Synchronize when initialTab changes via router / URL hash
  useEffect(() => {
    if (initialTab && ['dashboard', 'certificates'].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.history.pushState({}, '', `/profile/${tabId}`);
  };

  const [apiEnrolledCourses, setApiEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Helper to extract studentId from session storage / user context
  const getSessionStudentId = () => {
    const storedStudentId = localStorage.getItem('StudentId');
    if (storedStudentId && !isNaN(Number(storedStudentId)) && Number(storedStudentId) > 0) {
      return Number(storedStudentId);
    }
    if (user && (user.studentId || user.id || user.empId)) {
      const parsedId = Number(user.studentId || user.id || user.empId);
      if (!isNaN(parsedId) && parsedId > 0) {
        return parsedId;
      }
    }
    try {
      const rawUser = localStorage.getItem('ignito_auth_user');
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser);
        const parsedId = Number(parsedUser.studentId || parsedUser.id || parsedUser.empId || 0);
        if (!isNaN(parsedId) && parsedId > 0) return parsedId;
      }
    } catch {}
    return 0;
  };

  // Fetch student enrolled microcredentials from backend API using session studentId (enrolledMode: 1 default)
  useEffect(() => {
    let isMounted = true;
    async function fetchEnrolledCourses() {
      try {
        setLoadingCourses(true);
        const studentId = getSessionStudentId();
        const res = await getStudentEnrolledMicrocredentialCourse(studentId, 1);
        if (isMounted && res.success && Array.isArray(res.getStudentEnrolledMicrocredentialCourseList)) {
          setApiEnrolledCourses(res.getStudentEnrolledMicrocredentialCourseList);
        }
      } catch (err) {
        console.error('Error in fetchEnrolledCourses:', err);
      } finally {
        if (isMounted) setLoadingCourses(false);
      }
    }
    fetchEnrolledCourses();
    return () => { isMounted = false; };
  }, [user]);

  const displayedEnrolledCourses = apiEnrolledCourses;


  // Completed earned certificates matching user screenshot
  const earnedCertificates = [
    {
      id: 'cert-1',
      certId: 'IGN-2026-94821',
      title: 'Certified Java Enterprise Microservice Specialist (CJEMS)',
      issueDate: 'August 14, 2026',
      score: '92%',
      authority: 'Ignitoverse Global Skill Standards',
      status: 'VERIFIED & ACTIVE'
    },
    {
      id: 'cert-2',
      certId: 'IGN-2026-78103',
      title: 'Certified Cloud & DevOps Fundamentals (CCDF)',
      issueDate: 'July 28, 2026',
      score: '88%',
      authority: 'Ignitoverse Cloud Skill Standards',
      status: 'VERIFIED & ACTIVE'
    }
  ];

  return (
    <div className="profile-page-wrapper">
      <div className="profile-page-container">
        
        {/* ========================================================
            CREATIVE EXECUTIVE LEARNER HERO CARD (WITH profilebg.png)
            ======================================================== */}
        <div 
          className="profile-creative-hero-card"
          style={{ backgroundImage: `url(${profileBgImg})` }}
        >
          <div className="profile-creative-hero-content">
            {/* Left: User Identity Details */}
            <div className="profile-user-identity-block">
              <div className="profile-avatar-creative-wrapper">
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'} 
                  alt={user.name} 
                  className="profile-avatar-creative" 
                />
                <div className="profile-avatar-status-badge" title="Verified Active Learner">
                  <ShieldCheck size={14} />
                </div>
              </div>

              <div className="profile-user-creative-details">
                <div className="profile-user-title-row">
                  <h1 className="profile-user-name-title">{user.name || 'Enterprise User'}</h1>
                  <span className="profile-enterprise-chip">
                    <Check size={12} strokeWidth={3} /> ACTIVE LEARNER
                  </span>
                </div>
                
                <div className="profile-user-meta-chips">
                  <span className="user-meta-chip">
                    <Briefcase size={13} className="meta-chip-icon" /> {user.role || 'Executive Learner'}
                  </span>
                  <span className="user-meta-chip">
                    <Building2 size={13} className="meta-chip-icon" /> {user.company || 'IgnitoVerse Enterprise'}
                  </span>
                  <span className="user-meta-chip empid-chip">
                    ID: {user.empId || 'EMP-1001'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            FOCUSED SEGMENTED NAVIGATION (My Dashboard & My Certificates)
            ======================================================== */}
        <div className="profile-segmented-nav-wrapper">
          <div className="profile-segmented-nav">
            <button 
              type="button" 
              className={`profile-segment-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('dashboard')}
            >
              <LayoutDashboard size={18} className="profile-segment-icon" />
              <span>My Dashboard</span>
              <span className="segment-count-badge">{displayedEnrolledCourses.length}</span>
            </button>

            <button 
              type="button" 
              className={`profile-segment-btn ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => handleTabChange('certificates')}
            >
              <Award size={18} className="profile-segment-icon" />
              <span>My Certificates</span>
              <span className="segment-count-badge">{earnedCertificates.length}</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            SECTION 1: MY CERTIFICATES (Top Section in Dashboard & Tab)
            ======================================================== */}
        {(activeTab === 'dashboard' || activeTab === 'certificates') && (
          <div className="profile-section-block">
            <div className="profile-block-header-row">
              <div className="profile-block-title-group">
                <div className="profile-block-icon-badge purple">
                  <Award size={22} />
                </div>
                <div className="profile-block-text-col">
                  <h2 className="profile-block-heading">My Certificates</h2>
                  <p className="profile-block-sub">Your achievements and verified credentials</p>
                </div>
              </div>
              
              {activeTab === 'dashboard' && (
                <button 
                  type="button" 
                  className="btn-block-action-link"
                  onClick={() => setActiveTab('certificates')}
                >
                  <span>View All Certificates</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>

            <div className="profile-cert-grid-2col">
              {earnedCertificates.map((cert) => (
                <div key={cert.id} className="profile-cert-card-box">
                  {/* Badges Watermark Image on top right */}
                  <img 
                    src={badgesImg} 
                    alt="Badge Watermark" 
                    className="profile-cert-badge-watermark-img" 
                    aria-hidden="true"
                  />

                  {/* Top Header Row with Icon on Left + Details beside */}
                  <div className="profile-cert-top-row">
                    <div className="profile-cert-badge-square">
                      <Award size={26} />
                    </div>

                    <div className="profile-cert-heading-col">
                      <span className="profile-cert-active-tag">
                        <Check size={12} strokeWidth={3} /> {cert.status}
                      </span>
                      <h3 className="profile-cert-title">{cert.title}</h3>
                      <div className="profile-cert-id-tag">ID: {cert.certId}</div>
                    </div>
                  </div>

                  {/* 3-Column Metadata Box with Vertical Divider Lines */}
                  <div className="profile-cert-meta-container">
                    <div className="cert-meta-col">
                      <div className="cert-meta-col-icon purple">
                        <UserIcon size={14} />
                      </div>
                      <div className="cert-meta-col-text">
                        <span className="cert-meta-label">Issued To</span>
                        <strong className="cert-meta-val">{user.name || 'Enterprise User'}</strong>
                      </div>
                    </div>

                    <div className="cert-meta-col">
                      <div className="cert-meta-col-icon purple">
                        <Calendar size={14} />
                      </div>
                      <div className="cert-meta-col-text">
                        <span className="cert-meta-label">Date of Issue</span>
                        <strong className="cert-meta-val">{cert.issueDate}</strong>
                      </div>
                    </div>

                    <div className="cert-meta-col">
                      <div className="cert-meta-col-icon green">
                        <TrendingUp size={14} />
                      </div>
                      <div className="cert-meta-col-text">
                        <span className="cert-meta-label">Exam Score</span>
                        <strong className="cert-meta-val score-green-val">{cert.score}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Full-width Download PDF button */}
                  <button type="button" className="btn-card-download-pdf">
                    <Download size={15} />
                    <span>Download PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            SECTION 2: COURSES IN PROGRESS (Dashboard View)
            ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="profile-section-block">
            <div className="profile-block-header-row">
              <div className="profile-block-title-group">
                <div className="profile-block-icon-badge blue">
                  <BookOpen size={20} />
                </div>
                <div className="profile-block-text-col">
                  <h2 className="profile-block-heading">Courses in Progress</h2>
                  <p className="profile-block-sub">Pick up right where you left off in your enterprise tracks</p>
                </div>
              </div>

              <button 
                type="button" 
                className="btn-block-action-link"
                onClick={onExploreCatalog}
              >
                <span>Browse More Courses</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {loadingCourses ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <p>Loading your enrolled microcredential courses...</p>
              </div>
            ) : displayedEnrolledCourses.length === 0 ? (
              <div 
                className="profile-empty-courses-card" 
                style={{
                  textAlign: 'center',
                  padding: '3rem 1.5rem',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px dashed #cbd5e1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  margin: '1rem 0'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.25rem'
                }}>
                  <BookOpen size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  No Enrolled Courses Found
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '460px', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                  You haven't enrolled in any microcredential courses yet. Browse our executive course catalog to start learning!
                </p>
                <button 
                  type="button"
                  className="btn-card-continue-learning"
                  style={{ width: 'auto', padding: '0.65rem 1.5rem', fontSize: '0.875rem' }}
                  onClick={onExploreCatalog}
                >
                  <Sparkles size={15} />
                  <span>Explore Course Catalog</span>
                </button>
              </div>
            ) : (
              <div className="profile-inprogress-grid-3col">
                {displayedEnrolledCourses.map((c, idx) => {
                  const title = c.microcredentialCourseName || c.title || 'Microcredential Course';
                  const courseId = c.microcredentialCourseId || c.id || idx;
                  const thumb = formatImageUrl(c.microcredentialCourseIntroImage) || c.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80';
                  const progressPct = c.progress || (idx === 0 ? 90 : 65);
                  const duration = c.microcredentialCourseDuration || c.timeSpent || '3 Month';
                  const rating = c.microcredentialCourseRating || '5.00';
                  const level = c.courseLevel || c.streamName || 'Intermediate';

                  return (
                    <div key={courseId} className="profile-inprogress-card">
                      {/* Card Top: Thumbnail + Details */}
                      <div className="profile-inprogress-top">
                        <div className="profile-inprogress-thumb-box">
                          <img src={thumb} alt={title} className="profile-inprogress-thumb-img" />
                          <span className="profile-inprogress-percent-tag">{progressPct}%</span>
                        </div>

                        <div className="profile-inprogress-info">
                          <div className="profile-inprogress-level-badge" style={{ fontSize: '0.72rem', color: '#00385E', fontWeight: 700, marginBottom: '2px' }}>
                            {level}
                          </div>
                          <h3 className="profile-inprogress-title" title={title}>{title}</h3>
                          
                          <div className="profile-inprogress-meta-line">
                            <span><Clock size={13} className="meta-icon-indigo" /> {duration}</span>
                            <span><Star size={13} style={{ color: '#f59e0b', fill: '#f59e0b' }} /> {rating}</span>
                          </div>

                          <div className="profile-inprogress-progress-bar-track">
                            <div 
                              className="profile-inprogress-progress-bar-fill" 
                              style={{ width: `${progressPct}%` }} 
                            />
                          </div>

                          {/* Enrollment & Expiry Dates */}
                          {(c.enrollmentDate || c.expiryDate) && (
                            <div 
                              className="profile-inprogress-dates-block" 
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '8px',
                                padding: '8px 10px',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                marginTop: '10px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.73rem'
                              }}
                            >
                              {c.enrollmentDate && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <span style={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Calendar size={12} style={{ color: '#2563eb' }} /> Enrolled On
                                  </span>
                                  <strong style={{ color: '#1e293b', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {c.enrollmentDate}
                                  </strong>
                                </div>
                              )}
                              {c.expiryDate && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <span style={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={12} style={{ color: '#e11d48' }} /> Expires On
                                  </span>
                                  <strong style={{ color: '#1e293b', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {c.expiryDate}
                                  </strong>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Bottom Button */}
                      <button 
                        type="button" 
                        className="btn-card-continue-learning"
                        onClick={() => onViewCourse({
                          id: courseId,
                          microcredentialCourseId: courseId,
                          encryptedMicrocredentialCourseId: c.encryptedMicrocredentialCourseId || '',
                          title: title,
                          name: title,
                          thumbnail: thumb,
                          category: c.streamName || 'Management',
                          level: level,
                          duration: duration,
                          rating: rating,
                          ...c
                        })}
                      >
                        <PlayCircle size={15} />
                        <span>Continue Learning</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

