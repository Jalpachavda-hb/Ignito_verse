import React, { useState } from 'react';
import { 
  GraduationCap, Lightbulb,
  Goal, Eye, Users, BookOpen, Award, Building2,
  Play, Sparkles, Check
} from 'lucide-react';
import './aboutUs.css';

const VALUE_PROPS = [
  {
    id: 'accessible',
    icon: GraduationCap,
    title: 'Accessible Learning',
    description: 'Quality education for every learner, everywhere.',
    theme: 'indigo'
  },
  {
    id: 'industry',
    icon: Lightbulb,
    title: 'Industry Relevant',
    description: 'Practical skills aligned with real-world needs.',
    theme: 'purple'
  },
  {
    id: 'ai-support',
    icon: Users,
    title: 'AI-Powered Support',
    description: 'Personalized learning with intelligent guidance.',
    theme: 'cyan'
  },
  {
    id: 'career',
    icon: Award,
    title: 'Career Growth',
    description: 'Verified credentials for better opportunities.',
    theme: 'amber'
  }
];

export default function AboutUsPage({
  onExploreCatalog = () => {},
  onContact = () => {}
}) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <div className="about-page-container">
      {/* 1. HERO BANNER (WITH ABOUTUS.PNG BACKGROUND) */}
      <section className="about-hero-section">
        <div className="about-hero-container">
          <div className="about-hero-content">
            <div className="about-badge">
              <Sparkles size={13} className="about-badge-icon" />
              <span>ABOUT IGNITOVERSE | IGNITOCAPTIQ</span>
            </div>

            <h1 className="about-hero-title">
              Empowering Industry-Ready Professionals
            </h1>

            <p className="about-hero-subtitle">
              Ignitoverse is a SaaS-based, AI-enabled learning ecosystem designed to bridge the gap between academic learning and real-world industry demands through verifiable training modules, practical labs and expert-led content.
            </p>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPS (4 HIGHLIGHT CARDS) */}
      <section className="about-values-section">
        <div className="about-values-grid">
          {VALUE_PROPS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="about-value-item">
                <div className={`about-value-icon-box ${item.theme}`}>
                  <Icon size={28} strokeWidth={2.2} />
                </div>
                <h3 className="about-value-title">{item.title}</h3>
                <p className="about-value-desc">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. OUR MISSION & OUR VISION (2 LARGE GRADIENT CARDS) */}
      <section className="about-mission-vision-section">
        <div className="mission-vision-grid">
          {/* Left Card: Our Mission */}
          <div className="mission-card">
            <div className="mv-card-header">
              <div className="mv-icon-box mission">
                <Goal size={26} strokeWidth={2.2} />
              </div>
              <h2 className="mv-card-title">Our Mission</h2>
            </div>
            
            <p className="mv-card-body">
              To empower learners worldwide with accessible, industry-aligned training modules and intelligent AI mentoring knowledge into real-world engineering and managerial capability.
            </p>

            <div className="mv-tags-row">
              <span className="mv-tag">Practical Focus</span>
              <span className="mv-tag">Industry Syllabi</span>
              <span className="mv-tag">Accessible Learning</span>
            </div>
          </div>

          {/* Right Card: Our Vision */}
          <div className="vision-card">
            <div className="mv-card-header">
              <div className="mv-icon-box vision">
                <Eye size={26} strokeWidth={2.2} />
              </div>
              <h2 className="mv-card-title">Our Vision</h2>
            </div>

            <p className="mv-card-body">
              To become the premier global digital learning infrastructure where students, universities, and leading enterprises converge to co-create verifiable career credentials and lifelong upskilling.
            </p>

            <div className="mv-tags-row">
              <span className="mv-tag">Borderless Ecosystem</span>
              <span className="mv-tag">Verifiable Trust</span>
              <span className="mv-tag">Lifelong Mobility</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLOATING IMPACT STATS BAR */}
      <div className="about-stats-container">
        <div className="about-stats-grid">
          <div className="about-stat-item">
            <div className="stat-icon-wrapper blue">
              <Users size={24} />
            </div>
            <div>
              <div className="stat-num">50,000+</div>
              <div className="stat-label">Active Learners</div>
            </div>
          </div>

          <div className="about-stat-item">
            <div className="stat-icon-wrapper purple">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="stat-num">120+</div>
              <div className="stat-label">Training Modules</div>
            </div>
          </div>

          <div className="about-stat-item">
            <div className="stat-icon-wrapper emerald">
              <Award size={24} />
            </div>
            <div>
              <div className="stat-num">98.4%</div>
              <div className="stat-label">Assessment Success</div>
            </div>
          </div>

          <div className="about-stat-item">
            <div className="stat-icon-wrapper amber">
              <Building2 size={24} />
            </div>
            <div>
              <div className="stat-num">45+</div>
              <div className="stat-label">Industry Partners</div>
            </div>
          </div>
        </div>
      </div>


      {/* 6. BRIDGING THE GAP BETWEEN CLASSROOM AND CAREER */}
      <section className="about-classroom-career-section">
        <div className="classroom-career-grid">
          {/* Left Column: Photo Frame with Watch Video Badge */}
          <div className="career-photo-col">
            <div className="career-photo-frame">
              <img 
                src="/assets/office/classroom_career_students.jpg" 
                alt="Students and junior developers collaborating at IgnitoCaptiq"
                className="career-photo-img"
              />
              
              {/* Top Right Sparkle Badge */}
              <div className="career-sparkle-badge" aria-hidden="true">
                <Sparkles size={18} className="sparkle-icon" />
              </div>

              {/* Bottom Left Video Glass Badge */}
            
            </div>
          </div>

          {/* Right Column: Why IgnitoCaptiq & 3 Key Features */}
          <div className="career-text-col">
            <div className="why-pill-badge">
              <span>WHY IGNITOCAPTIQ</span>
            </div>

            <h2 className="career-section-title">
              Bridging the Gap Between Classroom and Career
            </h2>

            <p className="career-section-desc">
              We bring together academic learning, hands-on practice, and industry mentorship to create a seamless pathway from education to employment.
            </p>

            <div className="career-checklist">
              {/* Item 1 */}
              <div className="career-check-item">
                <div className="check-icon-circle">
                  <Check size={16} />
                </div>
                <div className="check-content">
                  <h4 className="check-title">Continuous Skill Verification</h4>
                  <p className="check-desc">
                    Real-time assessment engines with algorithmic proctoring.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="career-check-item">
                <div className="check-icon-circle">
                  <Check size={16} />
                </div>
                <div className="check-content">
                  <h4 className="check-title">AI Captiq Assistant</h4>
                  <p className="check-desc">
                    24/7 intelligent contextual tutor answering complex programming & technical queries.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="career-check-item">
                <div className="check-icon-circle">
                  <Check size={16} />
                </div>
                <div className="check-content">
                  <h4 className="check-title">Enterprise Career Pathways</h4>
                  <p className="check-desc">
                    Verified credentials recognized directly by tier-1 hiring partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
