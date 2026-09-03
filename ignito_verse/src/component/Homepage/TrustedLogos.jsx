import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import tcsImg from '../../assets/home/TCS.jfif';
import hitachiImg from '../../assets/home/HITACHI.png';
import wiproImg from '../../assets/home/WIPRO.png';
import { getHomeTrustedLogoList } from '../../services/homepageService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';

const defaultTrustedCards = [
  { id: 'tcs', image: tcsImg, name: 'TCS' },
  { id: 'hitachi', image: hitachiImg, name: 'Hitachi' },
  { id: 'wipro', image: wiproImg, name: 'Wipro' }
];

export default function TrustedLogos() {
  const [logoList, setLogoList] = useState(defaultTrustedCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);

  // Responsive visible count tracking
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 580) {
        setVisibleCount(1);
      } else if (window.innerWidth < 860) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1180) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch logos from getHomeTrustedLogoList
  useEffect(() => {
    let isMounted = true;

    getHomeTrustedLogoList()
      .then((res) => {
        if (!isMounted) return;

        if (res && res.success && Array.isArray(res.homeTrustedLogoList) && res.homeTrustedLogoList.length > 0) {
          const mappedLogos = res.homeTrustedLogoList
            .map((item, idx) => {
              const rawPath =
                item.filePath ||
                item.homeTrustedLogoImage ||
                item.imagePath ||
                item.logoImage ||
                item.image ||
                item.homeTrustedLogoUrl ||
                item.logoUrl ||
                '';

              const defaultFallback = defaultTrustedCards[idx % defaultTrustedCards.length]?.image;

              return {
                id: item.trustedByLogoId ? `${item.trustedByLogoId}-${idx}` : `logo-${idx}`,
                name: item.companyName || item.title || item.name || `Partner ${idx + 1}`,
                image: rawPath ? formatImageUrl(rawPath) : defaultFallback,
                fallbackImage: defaultFallback
              };
            })
            .filter((item) => Boolean(item.image));

          if (mappedLogos.length > 0) {
            setLogoList(mappedLogos);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to fetch home trusted logo list:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Guarantee seamless infinite looping by cloning the list
  const sliderList = useMemo(() => {
    const list = (logoList && logoList.length > 0) ? logoList : defaultTrustedCards;
    // Triple the list for smooth wrap-around looping
    return [...list, ...list, ...list];
  }, [logoList]);

  const totalLogos = (logoList && logoList.length > 0) ? logoList.length : defaultTrustedCards.length;

  // Seamless jump on transition end
  const handleTransitionEnd = () => {
    if (totalLogos <= 0) return;
    if (currentIndex >= totalLogos) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev % totalLogos);
    } else if (currentIndex < 0) {
      setIsTransitioning(false);
      setCurrentIndex(totalLogos - 1);
    }
  };

  // Auto-advance logo slider every 2.8s (pauses when hovered)
  useEffect(() => {
    if (totalLogos <= visibleCount || isHovered) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 2800);

    return () => clearInterval(timer);
  }, [totalLogos, visibleCount, isHovered]);

  const prevSlide = () => {
    if (totalLogos <= 0) return;
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(totalLogos);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setCurrentIndex(totalLogos - 1);
        });
      });
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const nextSlide = () => {
    if (totalLogos <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const displayDotsCount = Math.min(5, totalLogos);
  const normalizedIndex = totalLogos > 0 ? ((currentIndex % totalLogos) + totalLogos) % totalLogos : 0;
  const activeDot = displayDotsCount > 1 
    ? Math.min(displayDotsCount - 1, Math.floor((normalizedIndex / totalLogos) * displayDotsCount))
    : 0;

  const handleDotClick = (dotIdx) => {
    if (totalLogos <= 0) return;
    setIsTransitioning(true);
    if (displayDotsCount <= 1) {
      setCurrentIndex(0);
      return;
    }
    const targetIdx = Math.round((dotIdx / (displayDotsCount - 1)) * (totalLogos - 1));
    setCurrentIndex(targetIdx);
  };

  return (
    <section className="trusted-canopy-section" id="trusted-organizations">
      <div className="trusted-canopy-container">
        {/* Compact Clean Section Header */}
        <div className="canopy-header-text">
          <div className="b2b-badge">
            <span>TRUSTED BY LEADING ENTERPRISES</span>
          </div>

          <h2 className="canopy-headline">
            Powering Workforce Upskilling at <span className="b2b-blue-text">Global Leaders</span>
          </h2>
        </div>

        {/* Executive Enterprise Logos Infinite Loop Slider */}
        <div
          className="canopy-curved-arch"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="trusted-logo-slider-viewport">
            <div
              ref={trackRef}
              className="trusted-logo-slider-track"
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
                  className="trusted-logo-slide-card"
                  style={{ width: `${100 / sliderList.length}%` }}
                >
                  <div className="canopy-card logo-glass-card" title={item.name}>
                    <div className="card-logo-holder">
                      <img 
                        src={item.image} 
                        alt={item.name || "Trusted Organization Logo"} 
                        className="partner-logo-img" 
                        onError={(e) => {
                          e.target.onerror = null;
                          if (item.fallbackImage) {
                            e.target.src = item.fallbackImage;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Navigation & Pagination Dots (Capped to 5 dots) */}
          {totalLogos > visibleCount && (
            <div className="trusted-logo-controls">
              <button
                type="button"
                className="trusted-logo-nav-btn"
                onClick={prevSlide}
                aria-label="Previous logos"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="trusted-logo-dots-row">
                {Array.from({ length: displayDotsCount }).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    className={`trusted-logo-dot ${activeDot === dotIdx ? 'active' : ''}`}
                    onClick={() => handleDotClick(dotIdx)}
                    aria-label={`Go to logo group ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="trusted-logo-nav-btn"
                onClick={nextSlide}
                aria-label="Next logos"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


