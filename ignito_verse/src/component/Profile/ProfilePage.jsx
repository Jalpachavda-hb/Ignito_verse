// ignitoverse: Integrated Learner Profile & Portal (Dashboard, Certificates, Verify, Settings)
import React, { useState } from 'react';
import { 
  User, LayoutDashboard, Award, ShieldCheck, Settings, 
  BookOpen, Clock, CheckCircle2, Search, Download, 
  ExternalLink, ArrowRight, Bell, Lock, Building2, PlayCircle
} from 'lucide-react';
import CertificateVerification from '../Verification/CertificateVerification';

export default function ProfilePage({ 
  user = {
    name: 'Saurabh Mukherjee',
    email: 'saurabh.mukherjee@enterprise.com',
    role: 'Senior Java Architect',
    company: 'Enterprise Learning Cohort',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    empId: 'EMP-94021'
  },
  initialTab = 'dashboard',
  onExploreCatalog = () => {},
  onViewCourse = () => {}
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // In-progress courses data
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

  // Completed earned certificates
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
        {/* User Hero Banner */}
        <div className="profile-hero-card">
          <div className="profile-hero-left">
            <img src={user.avatar} alt={user.name} className="profile-avatar-large" />
            <div className="profile-hero-info">
              <div className="profile-name-row">
                <h1 className="profile-user-name">{user.name}</h1>
                <span className="profile-badge-active">Active Learner</span>
              </div>
              <p className="profile-user-role">{user.role} • {user.company}</p>
              <span className="profile-user-empid">Employee ID: {user.empId} • {user.email}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="profile-metrics-summary">
            <div className="metric-pill">
              <span className="metric-num">3</span>
              <span className="metric-lbl">In Progress</span>
            </div>
            <div className="metric-pill">
              <span className="metric-num">2</span>
              <span className="metric-lbl">Certificates</span>
            </div>
            <div className="metric-pill">
              <span className="metric-num">27.5h</span>
              <span className="metric-lbl">Learning Time</span>
            </div>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="profile-tabs-nav">
          <button 
            type="button" 
            className={`profile-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>My Dashboard</span>
          </button>

          <button 
            type="button" 
            className={`profile-tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            <Award size={18} />
            <span>My Certificates</span>
          </button>

          <button 
            type="button" 
            className={`profile-tab-btn ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => setActiveTab('verify')}
          >
            <ShieldCheck size={18} />
            <span>Verify Certificate</span>
          </button>

          <button 
            type="button" 
            className={`profile-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>

        {/* Tab 1: My Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="profile-tab-content">
            <div className="section-title-row">
              <div>
                <h2 className="profile-section-heading">Courses in Progress</h2>
                <p className="profile-section-sub">Pick up right where you left off in your assigned enterprise tracks.</p>
              </div>
              <button type="button" className="btn-explore-catalog-link" onClick={onExploreCatalog}>
                <span>Browse More Courses</span>
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="dashboard-courses-grid">
              {enrolledCourses.map((c) => (
                <div key={c.id} className="dashboard-course-card">
                  <div className="dashboard-thumb-box">
                    <img src={c.thumbnail} alt={c.title} className="dashboard-thumb-img" />
                    <span className="dashboard-progress-badge">{c.progress}% Complete</span>
                  </div>

                  <div className="dashboard-card-body">
                    <h3 className="dashboard-course-title">{c.title}</h3>
                    
                    <div className="dashboard-progress-bar-track">
                      <div className="dashboard-progress-bar-fill" style={{ width: `${c.progress}%` }} />
                    </div>

                    <div className="dashboard-meta-row">
                      <span><CheckCircle2 size={14} className="meta-icon-blue" /> {c.completedLessons}</span>
                      <span><Clock size={14} className="meta-icon-blue" /> {c.timeSpent}</span>
                    </div>

                    <button 
                      type="button" 
                      className="btn-continue-learning"
                      onClick={() => onViewCourse(c)}
                    >
                      <PlayCircle size={16} />
                      <span>Continue Learning</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: My Certificates */}
        {activeTab === 'certificates' && (
          <div className="profile-tab-content">
            <div className="section-title-row">
              <div>
                <h2 className="profile-section-heading">Earned Microcredential Certificates</h2>
                <p className="profile-section-sub">Cryptographically signed digital credentials verified by Ignitoverse skill standards.</p>
              </div>
            </div>

            <div className="certificates-grid">
              {earnedCertificates.map((cert) => (
                <div key={cert.id} className="certificate-card-box">
                  <div className="cert-card-header">
                    <div className="cert-award-icon">
                      <Award size={24} />
                    </div>
                    <span className="cert-status-badge">{cert.status}</span>
                  </div>

                  <h3 className="cert-title">{cert.title}</h3>
                  <div className="cert-id-tag">ID: {cert.certId}</div>

                  <div className="cert-details-list">
                    <div className="cert-detail-item">
                      <span className="cert-lbl">Issued To:</span>
                      <span className="cert-val">{user.name}</span>
                    </div>
                    <div className="cert-detail-item">
                      <span className="cert-lbl">Date of Issue:</span>
                      <span className="cert-val">{cert.issueDate}</span>
                    </div>
                    <div className="cert-detail-item">
                      <span className="cert-lbl">Exam Score:</span>
                      <span className="cert-val score-highlight">{cert.score}</span>
                    </div>
                  </div>

                  <div className="cert-actions-row">
                    <button type="button" className="btn-download-cert">
                      <Download size={15} />
                      <span>Download PDF</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn-verify-cert"
                      onClick={() => setActiveTab('verify')}
                    >
                      <ShieldCheck size={15} />
                      <span>Verify Credential</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Verify Certificate */}
        {activeTab === 'verify' && (
          <div className="profile-tab-content">
            <CertificateVerification />
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="profile-tab-content">
            <div className="settings-container-grid">
              <div className="settings-card-box">
                <h3 className="settings-box-title"><User size={18} /> Employee Profile</h3>
                <div className="settings-form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue={user.name} className="settings-input" />
                  </div>
                  <div className="form-group">
                    <label>Enterprise Email</label>
                    <input type="email" defaultValue={user.email} disabled className="settings-input disabled" />
                  </div>
                  <div className="form-group">
                    <label>Role / Designation</label>
                    <input type="text" defaultValue={user.role} className="settings-input" />
                  </div>
                  <div className="form-group">
                    <label>Organization Cohort</label>
                    <input type="text" defaultValue={user.company} disabled className="settings-input disabled" />
                  </div>
                </div>
              </div>

              <div className="settings-card-box">
                <h3 className="settings-box-title"><Bell size={18} /> Notification & Learning Preferences</h3>
                <div className="settings-toggle-list">
                  <label className="toggle-item">
                    <input type="checkbox" defaultChecked />
                    <span>Email notification for weekly microcredential cohort milestones</span>
                  </label>
                  <label className="toggle-item">
                    <input type="checkbox" defaultChecked />
                    <span>Proctored assessment ready alerts and retake cooldown reminders</span>
                  </label>
                  <label className="toggle-item">
                    <input type="checkbox" defaultChecked />
                    <span>Automatic sync of earned credentials to corporate LMS</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
