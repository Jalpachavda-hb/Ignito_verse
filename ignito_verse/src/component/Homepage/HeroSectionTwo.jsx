import React, { useState, useEffect } from 'react';
import { ChevronRight, Edit3 } from 'lucide-react';
import arrowDeco from '../../assets/home/Arrow02.webp';
import sunDeco from '../../assets/home/verse-icon-01.webp';
import starDeco from '../../assets/home/verse-icon-02.webp';
import img1 from '../../assets/home/verse-img-01.webp';
import img2 from '../../assets/home/verse-img-02.webp';
import img3 from '../../assets/home/verse-img-03.webp';

const defaultImages = [
  { id: 'img-1', src: img1, alt: 'Students Studying in Library' },
  { id: 'img-2', src: img2, alt: 'Student with Laptop and Books' },
  { id: 'img-3', src: img3, alt: 'Graduation Cap Toss' }
];

export default function HeroSectionTwo({
  title = 'Empower',
  highlightText = 'People',
  titleSuffix = 'ElevatePerformance.',
  subtitle = "We offer a wide range of courses, from short certifications to comprehensive diplomas, designed to help you achieve your academic and professional goals.",
  primaryBtnText = 'Find Courses',
  secondaryBtnText = 'MAKE APPOINTMENT',
  onPrimaryClick = () => console.log('Find Courses clicked'),
  onSecondaryClick = () => console.log('Make Appointment clicked')
}) {
  // Step index from 0 to 2
  const [step, setStep] = useState(0);

  // Auto carousel rotation every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Determine each photo's dynamic slot ('slot-left', 'slot-center', 'slot-right')
  // This allows CSS transforms to smoothly glide the elements between positions
  const getSlotClass = (photoIndex) => {
    const pos = (photoIndex - step + 3) % 3;
    if (pos === 0) return 'slot-left';
    if (pos === 1) return 'slot-center';
    return 'slot-right';
  };

  return (
    <section className="courses-hero-wrapper">
      <div className="courses-hero-card">
        {/* Giant Watermark Background Text with Continuous Scrolling Animation */}
        <div className="watermark-bg-text" aria-hidden="true">
          <div className="watermark-marquee-track">
            <span>IGNITOVERSE </span>
            <span>IGNITOVERSE </span>
            <span>IGNITOVERSE </span>
            <span>IGNITOVERSE </span>
          </div>
        </div>

        {/* Decorative Stickers & Doodles */}
        {arrowDeco && (
          <img 
            src={arrowDeco} 
            alt="" 
            className="deco-sticker sticker-arrow" 
            aria-hidden="true" 
          />
        )}
        {starDeco && (
          <img 
            src={starDeco} 
            alt="" 
            className="deco-sticker sticker-star" 
            aria-hidden="true" 
          />
        )}
        {sunDeco && (
          <img 
            src={sunDeco} 
            alt="" 
            className="deco-sticker sticker-sun" 
            aria-hidden="true" 
          />
        )}

        {/* Top Header & Titles */}
        <div className="courses-hero-header">
          <h1 className="courses-main-heading">
            {title}{' '}
            <mark className="highlight-pill">
              <span className="highlight-txt">
                <svg className="highlight-brush-svg" viewBox="0 0 500 150" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M15.2,133.3L15.2,133.3c121.9-7.6,244-9.9,366.1-6.8c34.6,0.9,69.1,2.3,103.7,4" fill="none" stroke="#4f46e5" strokeWidth="60" strokeLinecap="round" />
                </svg>
                {highlightText}
              </span>
            </mark>{' '}
            With <br />
            {titleSuffix}
          </h1>

          <p className="courses-sub-desc">
            {subtitle}
          </p>

          {/* CTA Button */}
          <div className="courses-cta-group">
            <button 
              type="button" 
              className="btn-find-courses"
              onClick={onPrimaryClick}
            >
              <span>{primaryBtnText}</span>
              <ChevronRight size={17} className="btn-chevron" />
            </button>
          </div>
        </div>

        {/* Bottom Interactive Composition Stage with Smooth 3D Carousel Glide */}
        <div className="courses-stage-composition">
          {/* Center: 3 Smooth Gliding Oval Bubble Photos */}
          <div className="stage-center-photos">
            {defaultImages.map((img, index) => {
              const slotClass = getSlotClass(index);
              return (
                <div 
                  key={img.id} 
                  className={`oval-photo-wrap ${slotClass}`}
                >
                  <img src={img.src} alt={img.alt} className="oval-img" />
                </div>
              );
            })}
          </div>

          {/* Right Feature: Circular Rotating Badge */}
          <div className="stage-right-badge">
            <div className="rotating-stamp-container">
              {/* Circular SVG Text */}
              <svg viewBox="0 0 200 200" className="rotating-text-svg">
                <path
                  id="circlePath"
                  d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
                  fill="none"
                />
                <text className="circle-svg-text">
                  <textPath href="#circlePath" startOffset="0%" textLength="439" lengthAdjust="spacingAndGlyphs">
                    • BEST RATED COURSES • NORI • ONLINE COURSES • PERSO •
                  </textPath>
                </text>
              </svg>
              
              {/* Center Pen Icon */}
              <div className="stamp-center-icon">
                <svg width="32" height="32" viewBox="0 0 51 51" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M36.204 1.044C32.02 2.814 5.66 31.155 4.514 35.116c-.632 2.182-1.75 5.516-2.483 7.409-3.024 7.805-1.54 9.29 6.265 6.265 1.893-.733 5.227-1.848 7.41-2.477 3.834-1.105 4.473-1.647 19.175-16.27 0 0 10.63-10.546 15.21-15.125C53 8.997 42.021-1.418 36.203 1.044Zm7.263 5.369c3.56 3.28 4.114 4.749 2.643 6.995l-1.115 1.7-4.586-4.543-4.585-4.544 1.42-1.157C39.311 3.18 40.2 3.4 43.467 6.413ZM37.863 13.3l4.266 4.304-11.547 11.561-11.547 11.561-4.48-4.446-4.481-4.447 11.404-11.418c6.273-6.28 11.566-11.42 11.762-11.42.197 0 2.277 1.938 4.623 4.305ZM12.016 39.03l3.54 3.584-3.562 1.098-5.316 1.641c-1.665.516-1.727.455-1.211-1.21l1.614-5.226c1.289-4.177.685-4.191 4.935.113Z"></path>
                </svg>
              </div>
            </div>

            <p className="stamp-sub-text">
              Explore wide-range of <br /> online courses
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
