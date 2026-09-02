// ignitoverse: Contact & Enterprise Inquiry Page
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Building2, User, Send, CheckCircle, Sparkles, Clock, Globe } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '51-200',
    subject: 'Enterprise Demo & Pricing',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page-wrapper">
      {/* Header */}
      <section className="contact-hero-block">
        <div className="detail-container">
          <div className="contact-badge-pill">
            <Sparkles size={14} />
            <span>GLOBAL ENTERPRISE DESK</span>
          </div>
          <h1 className="contact-main-headline">
            Get in Touch with our Enterprise Team
          </h1>
          <p className="contact-subtitle">
            Have questions regarding bulk licensing, SAML SSO, or custom learning tracks? Our solution architects respond within 4 business hours.
          </p>
        </div>
      </section>

      {/* Grid: Left = Info & Offices, Right = Form */}
      <section className="contact-content-section">
        <div className="detail-container contact-split-grid">
          {/* Left Info Panel */}
          <div className="contact-info-panel">
            <div className="info-card">
              <h3>Enterprise Sales & Partnerships</h3>
              <p>Schedule a platform walkthrough, request seat quotes, or discuss customized syllabus co-creation.</p>
              
              <div className="contact-methods-list">
                <div className="contact-method-row">
                  <div className="method-icon-wrap">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="method-label">Enterprise Inquiries</span>
                    <strong className="method-val">enterprise@ignitoverse.com</strong>
                  </div>
                </div>

                <div className="contact-method-row">
                  <div className="method-icon-wrap">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="method-label">Direct Corporate Hotline</span>
                    <strong className="method-val">+91 (080) 4122-8900</strong>
                  </div>
                </div>

                <div className="contact-method-row">
                  <div className="method-icon-wrap">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="method-label">Response Commitment</span>
                    <strong className="method-val">Guaranteed within 4 hours (Mon-Sat)</strong>
                  </div>
                </div>

                <div className="contact-method-row">
                  <div className="method-icon-wrap">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="method-label">Global Headquarters</span>
                    <strong className="method-val">Cyber City Tech Zone, Hyderabad & Bengaluru, India</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Lead Form */}
          <div className="contact-form-panel">
            {!submitted ? (
              <form className="enterprise-contact-form" onSubmit={handleSubmit}>
                <h3 className="form-heading">Send Us an Enterprise Inquiry</h3>

                <div className="form-row-dual">
                  <div className="form-group">
                    <label htmlFor="c-name"><User size={14} /> Full Name *</label>
                    <input
                      type="text"
                      id="c-name"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-email"><Mail size={14} /> Corporate Work Email *</label>
                    <input
                      type="email"
                      id="c-email"
                      required
                      placeholder="vikram@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-dual">
                  <div className="form-group">
                    <label htmlFor="c-company"><Building2 size={14} /> Company Name *</label>
                    <input
                      type="text"
                      id="c-company"
                      required
                      placeholder="e.g. Tata Consultancy Services"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-team">Learner Cohort Size</label>
                    <select
                      id="c-team"
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    >
                      <option value="1-50">1 - 50 employees</option>
                      <option value="51-200">51 - 200 employees</option>
                      <option value="201-1000">201 - 1,000 employees</option>
                      <option value="1000+">1,000+ Enterprise Tier</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="c-message">How can our enterprise team assist you?</label>
                  <textarea
                    id="c-message"
                    rows="4"
                    required
                    placeholder="Tell us about your team's upskilling requirements, timelines, or specific microcredentials of interest..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-send-inquiry">
                  <span>Submit Inquiry to Enterprise Team</span>
                  <Send size={16} />
                </button>
              </form>
            ) : (
              <div className="contact-success-box">
                <CheckCircle size={48} className="success-icon" />
                <h3>Thank you for reaching out!</h3>
                <p>
                  Your message has been assigned to a Senior Enterprise Architect. We will contact you at <strong>{formData.email}</strong> shortly.
                </p>
                <button 
                  type="button" 
                  className="btn-new-msg"
                  onClick={() => setSubmitted(false)}
                >
                  Send another inquiry
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
