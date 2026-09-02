// ignitoverse: Enterprise Book a Demo Modal
import React, { useState } from 'react';
import { X, CheckCircle, Building2, Mail, User, Phone, Sparkles, ArrowRight } from 'lucide-react';

export default function BookDemoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    teamSize: '51-200',
    domainInterest: 'Technical & Non-Technical',
    phone: '',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container demo-modal">
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <div className="demo-modal-content">
            <div className="demo-modal-header">
              <div className="demo-badge">
                <Sparkles size={14} />
                <span>FOR ENTERPRISES & HR/L&D TEAMS</span>
              </div>
              <h2 className="modal-title">Book a 1-on-1 Enterprise Demo</h2>
              <p className="modal-subtitle">
                See how Ignitoverse microcredentials help enterprises like TCS & Hitachi certify technical and soft skills at scale.
              </p>
            </div>

            <form className="demo-form" onSubmit={handleSubmit}>
              <div className="form-row-dual">
                <div className="form-group">
                  <label htmlFor="fullName">
                    <User size={14} /> Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="e.g. Rahul Mehta"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="workEmail">
                    <Mail size={14} /> Work Email *
                  </label>
                  <input
                    type="email"
                    id="workEmail"
                    name="workEmail"
                    required
                    placeholder="e.g. rahul@company.com"
                    value={formData.workEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row-dual">
                <div className="form-group">
                  <label htmlFor="companyName">
                    <Building2 size={14} /> Organization / Company *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    placeholder="e.g. Tata Consultancy Services"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <Phone size={14} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row-dual">
                <div className="form-group">
                  <label htmlFor="teamSize">Learner / Employee Count</label>
                  <select
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                  >
                    <option value="1-50">1 - 50 employees</option>
                    <option value="51-200">51 - 200 employees</option>
                    <option value="201-1000">201 - 1,000 employees</option>
                    <option value="1000+">1,000+ Enterprise</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="domainInterest">Primary Skill Domain</label>
                  <select
                    id="domainInterest"
                    name="domainInterest"
                    value={formData.domainInterest}
                    onChange={handleChange}
                  >
                    <option value="Technical & Non-Technical">Technical & Non-Technical (All)</option>
                    <option value="Technical Only">Technical (Java, Python, Cloud, DevOps, Cyber)</option>
                    <option value="Non-Technical Only">Non-Technical (Stress Mgmt, Comms, Leadership)</option>
                    <option value="Custom Enterprise Paths">Custom Project Tracks & Compliance</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Specific Upskilling Objectives (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="2"
                  placeholder="e.g. Standardizing Spring Boot microservices across 300 developers..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="demo-submit-btn">
                <span>Schedule Enterprise Demo</span>
                <ArrowRight size={16} />
              </button>

              <p className="form-disclaimer">
                🔒 Enterprise SLA & NDA compliant. We never share your corporate email.
              </p>
            </form>
          </div>
        ) : (
          <div className="demo-success-view">
            <div className="success-icon-badge">
              <CheckCircle size={48} className="success-svg" />
            </div>
            <h3>Enterprise Demo Scheduled!</h3>
            <p>
              Thank you, <strong>{formData.fullName}</strong>. An Ignitoverse enterprise solution architect will contact you at <strong>{formData.workEmail}</strong> within 4 business hours to share platform access and customized cohort pricing.
            </p>
            <div className="success-summary-box">
              <div><strong>Organization:</strong> {formData.companyName}</div>
              <div><strong>Team Size:</strong> {formData.teamSize} learners</div>
              <div><strong>Track:</strong> {formData.domainInterest}</div>
            </div>
            <button type="button" className="btn-success-close" onClick={handleReset}>
              Done & Return to Platform
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
