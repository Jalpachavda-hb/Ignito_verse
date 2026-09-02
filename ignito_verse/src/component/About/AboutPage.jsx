// ignitoverse: About Us Page
import React from 'react';
import { ShieldCheck, Target, Award, Users2, Sparkles, Building2, BookOpen, ArrowRight } from 'lucide-react';
import { impactStats } from '../../data/enterpriseData';

export default function AboutPage({ onBookDemo = () => {}, onExploreCatalog = () => {} }) {
  return (
    <div className="about-page-wrapper">
      {/* About Hero */}
      <section className="about-hero-block">
        <div className="detail-container">
          <div className="about-badge-pill">
            <Sparkles size={14} />
            <span>OUR MISSION & PURPOSE</span>
          </div>

          <h1 className="about-hero-headline">
            Bridging the Enterprise Skill Gap <br />
            with <span className="gradient-text">High-Velocity Microcredentials</span>
          </h1>

          <p className="about-hero-description">
            Ignitoverse was founded on a simple insight: today's enterprise technology landscape shifts every 6 months, while legacy corporate training programs take quarters to update. We built the fast-track credentialing infrastructure that modern organizations rely on.
          </p>
        </div>
      </section>

      {/* Core Values / Mission Cards */}
      <section className="about-values-section">
        <div className="detail-container">
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon-box">
                <Target size={26} />
              </div>
              <h3>Actionable Micro-Curricula</h3>
              <p>We eliminate fluff. Every module delivers tangible code patterns, architectural guidelines, or executive coping strategies directly applicable on day one.</p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <ShieldCheck size={26} />
              </div>
              <h3>Rigorous Competency Benchmarks</h3>
              <p>Our proctored MCQ evaluations test actual problem-solving and scenario analysis, ensuring that an Ignitoverse credential represents verified skill proficiency.</p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <Users2 size={26} />
              </div>
              <h3>Human Well-being & Performance</h3>
              <p>Technical mastery without mental resilience causes burnout. We are the first enterprise platform to seamlessly integrate stress management alongside deep-tech tracks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Band in About */}
      <section className="about-stats-band">
        <div className="detail-container">
          <div className="about-stats-grid">
            {impactStats.map((stat, idx) => (
              <div key={idx} className="about-stat-box">
                <h2>{stat.value}</h2>
                <p>{stat.label}</p>
                <span>{stat.sublabel}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic & Industry Advisory Council */}
      <section className="about-council-section">
        <div className="detail-container">
          <div className="section-header-center">
            <h2 className="section-main-title">Governed by Global Industry & Academic Leaders</h2>
            <p className="section-subtitle">
              Our curriculum boards feature principal architects, former Fortune 500 tech leaders, and corporate psychology researchers.
            </p>
          </div>

          <div className="council-grid">
            <div className="council-card">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" 
                alt="Dr. Rajesh Verma" 
                className="council-img"
              />
              <h4>Dr. Rajesh Verma</h4>
              <p className="council-role">Chief Academic Officer</p>
              <span className="council-org">Ex-Oracle Principal Architect</span>
            </div>

            <div className="council-card">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" 
                alt="Dr. Sarah Lin" 
                className="council-img"
              />
              <h4>Dr. Sarah Lin</h4>
              <p className="council-role">Head of Behavioral Science</p>
              <span className="council-org">Cognitive Behavioral Researcher</span>
            </div>

            <div className="council-card">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80" 
                alt="Elena Rostova" 
                className="council-img"
              />
              <h4>Elena Rostova</h4>
              <p className="council-role">Cloud Curriculum Director</p>
              <span className="council-org">AWS Solutions Champion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Action */}
      <section className="about-bottom-cta">
        <div className="detail-container">
          <div className="about-cta-content">
            <h2>Ready to Transform Your Organization's Learning Culture?</h2>
            <div className="about-btn-group">
              <button type="button" className="btn-about-demo" onClick={onBookDemo}>
                <span>Book an Enterprise Demo</span>
                <ArrowRight size={16} />
              </button>
              <button type="button" className="btn-about-catalog" onClick={onExploreCatalog}>
                <span>Explore Catalog</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
