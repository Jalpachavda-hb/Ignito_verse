// ignitoverse: Section 11 - Enterprise Footer (Self-contained SVG Social Icons)
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '../../assets/Ignitoverse Logo.png';
import cardWatermark from '../../assets/home/card.png';

export default function Footer() {
  return (
    <footer className="enterprise-footer-section">
      {/* Right Corner Ambient Constellation Watermark */}
      <img src={cardWatermark} alt="" className="footer-ambient-watermark" aria-hidden="true" />

      <div className="footer-main-container">
        {/* Top 2-Column Content Row */}
        <div className="footer-two-col-grid">
          {/* Left Column: Brand, Mission & Social Links */}
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              {logoImg ? (
                <img src={logoImg} alt="Ignitoverse" className="footer-brand-logo-img" />
              ) : (
                <div className="footer-brand-badge-icon">
                  <span className="badge-letter">I</span>
                </div>
              )}
              <div className="footer-brand-titles">
                <h3 className="footer-brand-title">Ignitoverse</h3>
                <span className="footer-brand-subtitle">Enterprise Learning</span>
              </div>
            </div>

            <p className="footer-mission-text">
              Helping enterprises build future-ready teams with verified microcredentials and measurable learning outcomes.
            </p>

            <div className="footer-social-row">
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social-circle" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              {/* Twitter / X */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-circle" aria-label="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social-circle" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Email */}
              <a href="mailto:enterprise@ignitoverse.com" className="footer-social-circle" aria-label="Email">
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Right Column: Get in Touch */}
          <div className="footer-contact-col">
            <h4 className="footer-get-touch-title">Get in Touch</h4>

            <div className="footer-contact-list">
              <a href="mailto:enterprise@ignitoverse.com" className="footer-contact-item">
                <Mail size={17} className="contact-item-icon" />
                <span>enterprise@ignitoverse.com</span>
              </a>

              <a href="tel:+917940620200" className="footer-contact-item">
                <Phone size={17} className="contact-item-icon" />
                <span>+91 79 4062 0200</span>
              </a>

              <div className="footer-contact-item">
                <MapPin size={17} className="contact-item-icon" />
                <span>Ahmedabad, Gujarat, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Copyright */}
        <div className="footer-copyright-row">
          <p className="footer-copyright-text">
            © 2025 Ignitoverse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
