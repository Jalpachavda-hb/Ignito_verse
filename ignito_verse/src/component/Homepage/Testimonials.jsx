// ignitoverse: Section 9 - Enterprise Testimonials (Real Dynamic API Data)
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Star, Building2, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { getTestimonialReviewLists } from '../../services/homepageService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';

export default function Testimonials({ dynamicTestimonials = null }) {
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);

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

  // Fetch dynamic testimonial reviews from API
  useEffect(() => {
    if (dynamicTestimonials && Array.isArray(dynamicTestimonials) && dynamicTestimonials.length > 0) {
      setTestimonialsData(dynamicTestimonials);
      setLoading(false);
      return;
    }

    let isMounted = true;
    getTestimonialReviewLists()
      .then((res) => {
        if (!isMounted) return;
        const list = res?.testimonialReview || res?.testimonialReviewLists;
        if (res && res.success && Array.isArray(list) && list.length > 0) {
          const mapped = list.map((item, idx) => {
            const rawPath = item.reviewerImagePath || item.clientImage || item.image || item.avatar || '';
            const formattedUrl = rawPath ? formatImageUrl(rawPath) : '';
            return {
              id: item.testimonialReviewMasterId || item.id || `testi-${idx}`,
              quote: (item.reviewDescription || item.quote || item.testimonial || '').trim(),
              name: item.reviewerName || item.clientName || item.name || 'Enterprise Learner',
              role: item.reviewerDesignation || item.designation || item.role || 'Enterprise Partner',
              company: item.companyName || item.company || '',
              stars: Number(item.reviewInStar || item.rating || 5),
              reviewerImagePath: formattedUrl,
              avatar: formattedUrl
            };
          });

          setTestimonialsData(mapped);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch dynamic testimonials:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dynamicTestimonials]);

  const totalItems = testimonialsData.length;
  const showSlider = totalItems > 3;

  // Tripled list for seamless infinite circular sliding (only when slider is enabled)
  const sliderList = useMemo(() => {
    if (!showSlider || testimonialsData.length === 0) return testimonialsData;
    return [...testimonialsData, ...testimonialsData, ...testimonialsData];
  }, [showSlider, testimonialsData]);

  // Seamless wrap-around on transition end
  const handleTransitionEnd = () => {
    if (!showSlider || totalItems <= 0) return;
    if (currentIndex >= totalItems) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev % totalItems);
    } else if (currentIndex < 0) {
      setIsTransitioning(false);
      setCurrentIndex(totalItems - 1);
    }
  };

  // Auto-slide timer (only when slider is enabled, every 4s, pauses on hover)
  useEffect(() => {
    if (!showSlider || isHovered) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(timer);
  }, [showSlider, isHovered]);

  const prevSlide = () => {
    if (totalItems <= 0) return;
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(totalItems);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setCurrentIndex(totalItems - 1);
        });
      });
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const nextSlide = () => {
    if (totalItems <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // Capped dots calculation (max 5 dots)
  const displayDotsCount = Math.min(5, totalItems);
  const normalizedIndex = totalItems > 0 ? ((currentIndex % totalItems) + totalItems) % totalItems : 0;
  const activeDot = displayDotsCount > 1 
    ? Math.min(displayDotsCount - 1, Math.floor((normalizedIndex / totalItems) * displayDotsCount))
    : 0;

  const handleDotClick = (dotIdx) => {
    if (totalItems <= 0) return;
    setIsTransitioning(true);
    if (displayDotsCount <= 1) {
      setCurrentIndex(0);
      return;
    }
    const targetIdx = Math.round((dotIdx / (displayDotsCount - 1)) * (totalItems - 1));
    setCurrentIndex(targetIdx);
  };

  const renderCardContent = (item) => {
    const starCount = Math.max(1, Math.min(5, item.stars || 5));
    const initials = item.name ? item.name.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'U';
    const imgSrc = item.reviewerImagePath || item.avatar;

    return (
      <div className="testimonial-reference-card">
        {/* Top Row: Proper Curly Double Quotes Badge & Solid Stars */}
        <div className="testi-card-top-row">
          <div className="testi-quote-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#00385E" className="quote-svg-shape">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
            </svg>
          </div>

          <div className="testi-stars-row">
            {[...Array(starCount)].map((_, sIdx) => (
              <Star key={sIdx} size={16} fill="#00385E" color="#00385E" />
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
          {imgSrc ? (
            <img 
              src={imgSrc} 
              alt={item.name} 
              className="testi-avatar-img"
              loading="lazy" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div 
            className="testi-avatar-initials"
            style={{ display: imgSrc ? 'none' : 'flex' }}
          >
            {initials}
          </div>

          <div className="testi-author-info">
            <h4 className="testi-author-name">{item.name}</h4>
            <p className="testi-author-role">{item.role}</p>
            {item.company && (
              <span className="testi-author-company">
                <Building2 size={13} className="company-icon-svg" />
                <span>{item.company}</span>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Solid Blue Accent Bar */}
        <div className="testi-bottom-accent-bar" />
      </div>
    );
  };

  if (!loading && totalItems === 0) {
    return null;
  }

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

        {/* If <= 3 items: Clean Static Centered Grid */}
        {!showSlider ? (
          <div className="testimonials-grid-static">
            {testimonialsData.map((item) => (
              <div key={item.id} className="testimonial-card-static">
                {renderCardContent(item)}
              </div>
            ))}
          </div>
        ) : (
          /* If > 3 items: Infinite Loop Slider */
          <>
            <div 
              className="testimonials-slider-viewport"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div 
                ref={trackRef}
                className="testimonials-slider-track"
                onTransitionEnd={handleTransitionEnd}
                style={{
                  transform: `translateX(-${currentIndex * (100 / sliderList.length)}%)`,
                  transition: isTransitioning ? 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                  width: `${(sliderList.length / visibleCount) * 100}%`
                }}
              >
                {sliderList.map((item, idx) => (
                  <div 
                    key={`${item.id}-${idx}`} 
                    className="testimonial-card-slide"
                    style={{ width: `${100 / sliderList.length}%` }}
                  >
                    {renderCardContent(item)}
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
                {Array.from({ length: displayDotsCount }).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    className={`testi-dot ${activeDot === dotIdx ? 'active' : ''}`}
                    onClick={() => handleDotClick(dotIdx)}
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
          </>
        )}
      </div>
    </section>
  );
}
