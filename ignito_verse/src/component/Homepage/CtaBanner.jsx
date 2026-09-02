// ignitoverse: Section 10 - Enterprise Conversion CTA Banner
import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Headphones, Calendar } from 'lucide-react';

export default function CtaBanner({ onBookDemo = () => {}, onContact = () => {} }) {
  return (
    <section className="cta-banner-section">
      <div className="cta-banner-container">
        <div className="cta-banner-glow" />
        
        <div className="cta-banner-content">
          <div className="cta-badge">
            <Sparkles size={14} />
            <span>ACCELERATE YOUR WORKFORCE TODAY</span>
          </div>

          <h2 className="cta-banner-title">
            Ready to Bring Ignitoverse Microcredentials <br />
            to Your Organization?
          </h2>

          <p className="cta-banner-desc">
            Empower your engineers, managers, and corporate teams with short, certified technical & non-technical microcredentials with verified enterprise credentials.
          </p>

          <div className="cta-banner-buttons">
            <button 
              type="button" 
              className="cta-primary-btn"
              onClick={onBookDemo}
            >
              <Calendar size={17} />
              <span>Book an Enterprise Demo</span>
              <ArrowRight size={17} />
            </button>

            <button 
              type="button" 
              className="cta-secondary-btn"
              onClick={onContact}
            >
              <Headphones size={17} />
              <span>Contact Sales Team</span>
            </button>
          </div>

          <div className="cta-trust-tags">
            <span>✓ Volume discounts for 50+ seats</span>
            <span>✓ Dedicated Customer Success Manager</span>
            <span>✓ Full LMS / SSO integration</span>
          </div>
        </div>
      </div>
    </section>
  );
}
