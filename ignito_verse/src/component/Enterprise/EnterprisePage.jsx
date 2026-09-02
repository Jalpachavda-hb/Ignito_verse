// ignitoverse: For Enterprises Dedicated Page
import React from 'react';
import { 
  Building2, 
  Users2, 
  ShieldCheck, 
  Layers, 
  BarChart3, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Zap,
  Clock,
  TrendingUp
} from 'lucide-react';
import { trustedEnterprises } from '../../data/enterpriseData';

export default function EnterprisePage({ onBookDemo = () => {} }) {
  return (
    <div className="enterprise-page-wrapper">
      {/* Enterprise Hero */}
      <section className="enterprise-hero-block">
        <div className="detail-container">
          <div className="ent-badge">
            <Sparkles size={14} />
            <span>ENTERPRISE WORKFORCE TRANSFORMATION</span>
          </div>

          <h1 className="ent-hero-title">
            The Upskilling Operating System for <br />
            <span className="gradient-text">Forward-Thinking Enterprises</span>
          </h1>

          <p className="ent-hero-sub">
            Built for engineering leaders, CLOs, and talent directors at scale. Train 50 to 50,000+ employees with bite-sized video microcredentials, proctored MCQ benchmarking, and automated compliance tracking.
          </p>

          <div className="ent-hero-cta-row">
            <button type="button" className="ent-btn-primary" onClick={onBookDemo}>
              <span>Schedule an Enterprise Discovery Session</span>
              <ArrowRight size={16} />
            </button>
            <button type="button" className="ent-btn-secondary" onClick={onBookDemo}>
              <span>Download Enterprise Capability Deck (PDF)</span>
            </button>
          </div>

          {/* Mini Logos Strip */}
          <div className="ent-client-strip">
            <p>TRUSTED ACROSS GLOBAL DELIVERY TEAMS AT</p>
            <div className="client-pills">
              {trustedEnterprises.slice(0, 5).map((c, i) => (
                <span key={i} className="client-pill-name">{c.name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Enterprise Value */}
      <section className="enterprise-features-section">
        <div className="detail-container">
          <div className="section-header-center">
            <h2 className="section-main-title">Why Leading Enterprises Partner with Ignitoverse</h2>
            <p className="section-subtitle">
              We solve the core dilemma of corporate L&D: how to verify and elevate skills quickly without disrupting project billability.
            </p>
          </div>

          <div className="ent-features-grid">
            <div className="ent-feature-card">
              <div className="feature-icon-circle blue">
                <Users2 size={24} />
              </div>
              <h3>Bulk Licensing & Automated Sync</h3>
              <p>Instantly deploy 10,000+ licenses. Integrates with Workday, Darwinbox, SuccessFactors, Okta, and Azure Active Directory for automated user lifecycle provisioning.</p>
              <ul className="ent-check-list">
                <li><CheckCircle2 size={15} /> SAML 2.0 / OAuth SSO</li>
                <li><CheckCircle2 size={15} /> Auto-provisioning via SCIM</li>
                <li><CheckCircle2 size={15} /> Departmental cost-center allocation</li>
              </ul>
            </div>

            <div className="ent-feature-card">
              <div className="feature-icon-circle purple">
                <BarChart3 size={24} />
              </div>
              <h3>Real-Time L&D Analytics & Dashboards</h3>
              <p>Granular visibility for managers and HR leads. Monitor real-time cohort progression, assessment scores, drop-off hotspots, and skill distribution heatmaps.</p>
              <ul className="ent-check-list">
                <li><CheckCircle2 size={15} /> Cohort completion forecasting</li>
                <li><CheckCircle2 size={15} /> Automated weekly manager digests</li>
                <li><CheckCircle2 size={15} /> Custom exportable CSV & API streams</li>
              </ul>
            </div>

            <div className="ent-feature-card">
              <div className="feature-icon-circle green">
                <ShieldCheck size={24} />
              </div>
              <h3>Proctored Exams & Verifiable Badges</h3>
              <p>Eliminate credential fraud. Every certificate features cryptographic QR codes verifiable in real-time by clients, auditors, and project staffing managers.</p>
              <ul className="ent-check-list">
                <li><CheckCircle2 size={15} /> Proctored scenario-based MCQs</li>
                <li><CheckCircle2 size={15} /> Tamper-proof digital certificates</li>
                <li><CheckCircle2 size={15} /> LinkedIn credential 1-click sharing</li>
              </ul>
            </div>

            <div className="ent-feature-card">
              <div className="feature-icon-circle orange">
                <Layers size={24} />
              </div>
              <h3>Custom Learning Tracks & Co-Branding</h3>
              <p>Tailor syllabus modules directly to your internal coding conventions, frameworks, and compliance policies with your organization's logo on all certificates.</p>
              <ul className="ent-check-list">
                <li><CheckCircle2 size={15} /> White-label certificates & portal</li>
                <li><CheckCircle2 size={15} /> Custom client project onboarding tracks</li>
                <li><CheckCircle2 size={15} /> Dedicated instructional design support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA Bar */}
      <section className="enterprise-bottom-cta">
        <div className="detail-container">
          <div className="ent-cta-box">
            <h2>Ready to Elevate Your Engineering & Leadership Bench?</h2>
            <p>Join 500+ global enterprises. Speak with an enterprise talent specialist for a customized cohort quote.</p>
            <button type="button" className="ent-btn-large" onClick={onBookDemo}>
              <span>Book an Enterprise Platform Demo</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
