// ignitoverse: Executive Learner Profile & Portal (Creative Design with profilebg.png)
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, BookOpen, Clock,
  Check, ArrowRight, PlayCircle, Building2,
  Briefcase, Sparkles, Calendar, Star
} from 'lucide-react';
import profileBgImg from '../../assets/profilebg.png';
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
  onExploreCatalog = () => { },
  onViewCourse = () => { }
}) {
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
    } catch { }
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
                  src={'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
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
            COURSES IN PROGRESS (Enrolled Courses)
            ======================================================== */}
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
                const level = c.courseLevel || 'Intermediate';
                const stream = c.streamName || 'Management';

                return (
                  <div key={courseId} className="profile-inprogress-card">
                    {/* Top: Full-Width Thumbnail with Badges */}
                    <div className="profile-inprogress-thumb-box">
                      <img
                        src={thumb}
                        alt={title}
                        className="profile-inprogress-thumb-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      {stream && (
                        <span className="profile-inprogress-category-badge">{stream}</span>
                      )}
                      <span className="profile-inprogress-percent-tag">{progressPct}%</span>
                    </div>

                    {/* Card Content Body */}
                    <div className="profile-inprogress-info">
                      <div className="profile-inprogress-level-badge">{level}</div>
                      <h3 className="profile-inprogress-title" title={title}>{title}</h3>

                      <div className="profile-inprogress-meta-line">
                        <span><Clock size={14} style={{ color: '#0284C7' }} /> {duration}</span>
                        <span><Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} /> {rating}</span>
                      </div>

                      {/* Progress Bar Container */}
                      <div className="profile-inprogress-progress-container">
                        <div className="profile-inprogress-progress-labels">
                          <span>Course Progress</span>
                          <span style={{ color: '#00385E' }}>{progressPct}%</span>
                        </div>
                        <div className="profile-inprogress-progress-bar-track">
                          <div
                            className="profile-inprogress-progress-bar-fill"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Enrollment & Expiry Dates */}
                      {(c.enrollmentDate || c.expiryDate) && (
                        <div className="profile-inprogress-dates-block">
                          {c.enrollmentDate && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span style={{ color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Calendar size={13} style={{ color: '#0284C7' }} /> Enrolled On
                              </span>
                              <strong style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.74rem' }}>
                                {c.enrollmentDate}
                              </strong>
                            </div>
                          )}
                          {c.expiryDate && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span style={{ color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Clock size={13} style={{ color: '#e11d48' }} /> Expires On
                              </span>
                              <strong style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.74rem' }}>
                                {c.expiryDate}
                              </strong>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Bottom Action Button */}
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
                        <PlayCircle size={16} />
                        <span>Continue Learning</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

