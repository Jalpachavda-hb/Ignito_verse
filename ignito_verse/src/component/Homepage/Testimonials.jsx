// ignitoverse: Section 9 - Enterprise Testimonials Slider (Refined Quotes & Numbers Removed)
import React, { useState, useEffect } from 'react';
import { Star, Building2, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { clientTestimonials } from '../../data/enterpriseData';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // Responsive visible count tracking
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1180) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, clientTestimonials.length - visibleCount);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-container">
        {/* Centered Section Header */}
        <div className="section-header-center">
          <div className="b2b-badge">
            <ShieldCheck size={14} className="badge-icon-blue" />
            <span>ENTERPRISE PROOF</span>
          </div>

          <h2 className="section-main-title">
            Trusted by Leaders in <br />
            <span className="b2b-blue-text">Corporate Talent & Engineering</span>
          </h2>

          <p className="section-subtitle">
            Hear how senior directors and CLOs scale skills, reduce time-to-productivity, and elevate team performance with Ignitoverse.
          </p>
        </div>

        {/* Testimonials Slider Track Stage */}
        <div className="testimonials-slider-viewport">
          <div 
            className="testimonials-slider-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              width: `${(clientTestimonials.length / visibleCount) * 100}%`
            }}
          >
            {clientTestimonials.map((item) => (
              <div 
                key={item.id} 
                className="testimonial-card-slide"
                style={{ width: `${100 / clientTestimonials.length}%` }}
              >
                <div className="testimonial-reference-card">
                  {/* Top Row: Proper Curly Double Quotes Badge & 5 Solid Stars */}
                  <div className="testi-card-top-row">
                    <div className="testi-quote-badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#00385E" className="quote-svg-shape">
                        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                      </svg>
                    </div>

                    <div className="testi-stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#00385E" color="#00385E" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Body */}
                  <p className="testi-quote-text">
                    "{item.quote}"
                  </p>

                  {/* Subtle Separator Divider */}
                  <div className="testi-card-divider" />

                  {/* Author Profile Block */}
                  <div className="testi-author-row">
                    <img 
                      src={item.avatar} 
                      alt={item.name} 
                      className="testi-avatar-img"
                      loading="lazy" 
                    />
                    <div className="testi-author-info">
                      <h4 className="testi-author-name">{item.name}</h4>
                      <p className="testi-author-role">{item.role}</p>
                      <span className="testi-author-company">
                        <Building2 size={13} className="company-icon-svg" />
                        <span>{item.company}</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom Solid Blue Accent Bar */}
                  <div className="testi-bottom-accent-bar" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Centered Controls: Prev Button ── Pagination Dots ── Next Button */}
        <div className="testimonials-bottom-controls">
          <button 
            type="button" 
            className="testi-nav-btn" 
            onClick={prevSlide}
            aria-label="Previous Testimonials"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="testimonials-dots-row">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                className={`testi-dot ${currentIndex === dotIdx ? 'active' : ''}`}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>

          <button 
            type="button" 
            className="testi-nav-btn" 
            onClick={nextSlide}
            aria-label="Next Testimonials"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
