// ignitoverse: Executive Learner Profile & Portal (Creative Design with profilebg.png)
import React, { useState } from 'react';
import { 
  LayoutDashboard, Award, ShieldCheck, BookOpen, Clock, 
  Check, Download, ArrowRight, PlayCircle, Building2, 
  Briefcase, Sparkles, User as UserIcon, Calendar, TrendingUp
} from 'lucide-react';
import profileBgImg from '../../assets/profilebg.png';
import badgesImg from '../../assets/badges.png';

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

  // In-progress courses data matching user screenshot
  const enrolledCourses = [
    {
      id: 'mc-java-enterprise',
      title: 'Java Enterprise Architecture & Spring Boot',
      progress: 68,
      completedLessons: '16/24 Lessons',
      timeSpent: '12h 30m',
      lastActive: 'Yesterday',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'mc-python-data',
      title: 'Python for Enterprise Data Analytics & Automation',
      progress: 40,
      completedLessons: '8/20 Lessons',
      timeSpent: '6h 15m',
      lastActive: '3 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'mc-stress-management',
      title: 'Workplace Stress Management & Executive Resilience',
      progress: 90,
      completedLessons: '14/16 Lessons',
      timeSpent: '9h 00m',
      lastActive: '5 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'
    }
  ];

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
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} className="profile-segment-icon" />
              <span>My Dashboard</span>
              <span className="segment-count-badge">3</span>
            </button>

            <button 
              type="button" 
              className={`profile-segment-btn ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              <Award size={18} className="profile-segment-icon" />
              <span>My Certificates</span>
              <span className="segment-count-badge">2</span>
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

            <div className="profile-inprogress-grid-3col">
              {enrolledCourses.map((c) => (
                <div key={c.id} className="profile-inprogress-card">
                  {/* Card Top: Thumbnail + Details */}
                  <div className="profile-inprogress-top">
                    <div className="profile-inprogress-thumb-box">
                      <img src={c.thumbnail} alt={c.title} className="profile-inprogress-thumb-img" />
                      <span className="profile-inprogress-percent-tag">{c.progress}%</span>
                    </div>

                    <div className="profile-inprogress-info">
                      <h3 className="profile-inprogress-title">{c.title}</h3>
                      
                      <div className="profile-inprogress-meta-line">
                        <span><BookOpen size={13} className="meta-icon-indigo" /> {c.completedLessons}</span>
                        <span><Clock size={13} className="meta-icon-indigo" /> {c.timeSpent}</span>
                      </div>

                      <div className="profile-inprogress-progress-bar-track">
                        <div 
                          className="profile-inprogress-progress-bar-fill" 
                          style={{ width: `${c.progress}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Button */}
                  <button 
                    type="button" 
                    className="btn-card-continue-learning"
                    onClick={() => onViewCourse(c)}
                  >
                    <PlayCircle size={15} />
                    <span>Continue Learning</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
