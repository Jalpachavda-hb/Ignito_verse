// ignitoverse: Contact Us Page - Matches Exact Target Mockup Design
import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, 
  User, Send, CheckCircle2, ChevronDown, 
  ListFilter, MessageSquare
} from 'lucide-react';
import './contactUs.css';

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Course & Certification Details',
  'Enterprise Training Solution',
  'University / Academic Partnership',
  'Technical Support',
  'Billing & Subscriptions'
];

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="contact-page-wrapper">
      {/* Decorative Organic Purple Corner Backgrounds */}
      <div className="contact-decor-top-left" aria-hidden="true" />
      <div className="contact-decor-bottom-right" aria-hidden="true" />

      {/* 1. TOP HEADER SECTION */}
      <div className="contact-header-container">
       

        <h1 className="contact-main-heading">
          Contact <span className="contact-highlight-pink">Us</span>
        </h1>

        <p className="contact-header-desc">
          We're here to help! Reach out to us for any questions, support or collaboration
          opportunities. Our team will get back to you as soon as possible.
        </p>
      </div>

      {/* 2. TWO-COLUMN MAIN CONTENT CONTAINER */}
      <div className="contact-content-grid">
        {/* LEFT COLUMN: Our Office & Find Us on Map */}
        <div className="contact-left-col">
          {/* Card 1: Our Office */}
          <div className="contact-card our-office-card">
            <h2 className="contact-card-title">Our Office</h2>
            <p className="contact-card-subtitle">
              Visit our office or get in touch through the details below.
            </p>

            <div className="office-details-list">
              {/* Address */}
              <div className="office-detail-item">
                <div className="office-icon-box">
                  <MapPin size={20} className="office-icon" />
                </div>
                <div className="office-text-content">
                  <span className="office-label">Address</span>
                  <p className="office-value">
                    Hackberry Softech Private Limited<br />
                    Gota, Ahmedabad, Gujarat, India - 382481
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="office-detail-item">
                <div className="office-icon-box">
                  <Phone size={20} className="office-icon" />
                </div>
                <div className="office-text-content">
                  <span className="office-label">Phone</span>
                  <a href="tel:+919876543210" className="office-value-link">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="office-detail-item">
                <div className="office-icon-box">
                  <Mail size={20} className="office-icon" />
                </div>
                <div className="office-text-content">
                  <span className="office-label">Email</span>
                  <a href="mailto:support@ignitocaptia.com" className="office-value-link">
                    support@ignitocaptia.com
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="office-detail-item">
                <div className="office-icon-box">
                  <Clock size={20} className="office-icon" />
                </div>
                <div className="office-text-content">
                  <span className="office-label">Working Hours</span>
                  <p className="office-value">
                    Monday - Saturday<br />
                    9:30 AM - 6:30 PM (IST)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Find Us on Map */}
          <div className="contact-card find-map-card">
            <h2 className="contact-card-title">Find Us on Map</h2>
            <div className="map-embed-container">
              <iframe
                title="Google Map - Gota, Ahmedabad"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14678.8359483323067!2d72.5369687758778!3d23.09707907912234!2m3!1f0!2f0!3f0!3m2!1i1024!2f786!4f13.1!3m3!1m2!1s0x395e8321287e02e3%3A0xe212c47890e0c017!2sGota%2C%20Ahmedabad%2C%20Gujarat%20382481!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        
        <div className="contact-right-col">
          <div className="contact-card send-message-card">
            {/* Top Right Decorative Wave & Dots */}
            <div className="card-corner-wave" aria-hidden="true" />
            <div className="card-corner-dots" aria-hidden="true">
              <svg width="90" height="48" viewBox="0 0 90 48" fill="none">
                <pattern id="dot-grid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="4" r="2.2" fill="#c084fc" opacity="0.45" />
                </pattern>
                <rect width="90" height="48" fill="url(#dot-grid)" />
              </svg>
            </div>

            <h2 className="contact-card-title message-title">Send us a Message</h2>
            <p className="contact-card-subtitle message-subtitle">
              Fill out the form below and our team will assist you shortly.
            </p>

            {submitted ? (
              <div className="form-success-state">
                <CheckCircle2 size={48} className="success-icon" />
                <h3 className="success-title">Message Sent Successfully!</h3>
                <p className="success-text">
                  Thank you, <strong>{formData.fullName}</strong>. Our team has received your message and will get back to you at <strong>{formData.email}</strong> shortly.
                </p>
                <button 
                  type="button" 
                  onClick={handleResetForm}
                  className="btn-send-another"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {/* Row 1: Full Name & Email */}
                <div className="form-grid-row">
                  <div className="form-field">
                    <label className="field-label">
                      Full Name <span className="field-star">*</span>
                    </label>
                    <div className="field-input-box">
                      <User size={18} className="field-icon" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">
                      Email Address <span className="field-star">*</span>
                    </label>
                    <div className="field-input-box">
                      <Mail size={18} className="field-icon" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="field-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone Number & Subject */}
                <div className="form-grid-row">
                  <div className="form-field">
                    <label className="field-label">
                      Phone Number
                    </label>
                    <div className="field-input-box">
                      <Phone size={18} className="field-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">
                      Subject <span className="field-star">*</span>
                    </label>
                    <div className="field-input-box field-select-box">
                      <ListFilter size={18} className="field-icon" />
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="field-select"
                      >
                        <option value="" disabled>Select a subject</option>
                        {SUBJECT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={17} className="select-arrow-icon" />
                    </div>
                  </div>
                </div>

                {/* Row 3: Message */}
                <div className="form-field">
                  <label className="field-label">
                    Message <span className="field-star">*</span>
                  </label>
                  <div className="field-textarea-box">
                    <MessageSquare size={18} className="field-textarea-icon" />
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Write your message here..."
                      className="field-textarea"
                    />
                  </div>
                </div>

                {/* Row 4: Send Message Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-send-message"
                >
                  <Send size={18} className="send-btn-icon" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
