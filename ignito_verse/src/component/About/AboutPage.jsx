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

      {/* 3. Academic & Industry Advisory Council */}
      <section className="about-council-section">
        <div className="detail-container">
          <div className="council-header">
            <h2>Guided by Global Industry Veterans</h2>
            <p>Our curriculum is reviewed and accredited alongside chief learning officers and engineering architects from top global firms.</p>
          </div>

          <div className="council-grid">
            <div className="council-card">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" 
                alt="Dr. Aris Thorne" 
                className="council-img"
              />
              <h4>Dr. Aris Thorne</h4>
              <p className="council-role">Chair, Microcredential Standards</p>
              <span className="council-org">Ex-MIT Sloan Fellow</span>
            </div>

            <div className="council-card">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" 
                alt="Devin Vance" 
                className="council-img"
              />
              <h4>Devin Vance</h4>
              <p className="council-role">VP Enterprise Talent Architecture</p>
              <span className="council-org">Former CLO, Fintech Global</span>
            </div>

            <div className="council-card">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80" 
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
              <button type="button" className="btn-about-catalog" onClick={onExploreCatalog} style={{ padding: '14px 28px', fontSize: '1rem' }}>
                <span>Explore Microcredentials Catalog</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
