import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import tcsImg from '../../assets/home/TCS.jfif';
import hitachiImg from '../../assets/home/HITACHI.png';
import wiproImg from '../../assets/home/WIPRO.png';
import { getHomeTrustedLogoList } from '../../services/homepageService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';

const defaultTrustedCards = [
  { id: 'tcs', image: tcsImg },
  { id: 'hitachi', image: hitachiImg },
  { id: 'wipro', image: wiproImg }
];

export default function TrustedLogos() {
  const [logoList, setLogoList] = useState(defaultTrustedCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

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

  // Guarantee enough items for continuous smooth auto-sliding
  const effectiveLogoList = useMemo(() => {
    if (!logoList || logoList.length === 0) return [];
    if (logoList.length < 6) {
      return [...logoList, ...logoList, ...logoList];
    }
    return logoList;
  }, [logoList]);

  const maxIndex = Math.max(0, effectiveLogoList.length - visibleCount);

  // Reset index if it exceeds maxIndex
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [maxIndex, currentIndex]);

  // Auto-advance logo slider every 2.5s (pauses when hovered)
  useEffect(() => {
    if (maxIndex <= 0 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 2500);

    return () => clearInterval(timer);
  }, [maxIndex, isHovered]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="trusted-canopy-section" id="trusted-organizations">
      <div className="trusted-canopy-container">
        {/* Top Pill Badge matching Hero Section */}
        <div className="b2b-badge">
          <span>TRUSTED BY LEADING ORGANIZATIONS</span>
        </div>

        {/* Section Header */}
        <div className="canopy-header-text">
          <h2 className="canopy-headline">
            Partnering with Global Leaders <br />
            to Build <span className="b2b-blue-text">Smarter Workforces</span>
          </h2>

          <p className="canopy-description">
            Ignito Verse is trusted by forward-thinking organizations worldwide to deliver <strong className="highlight-text-blue">impactful learning</strong> and drive <strong className="highlight-text-blue">measurable results</strong>.
          </p>
        </div>

        {/* Executive Enterprise Logos Slider (Image Only & Auto-Sliding) */}
        <div
          className="canopy-curved-arch"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="trusted-logo-slider-viewport">
            <div
              className="trusted-logo-slider-track"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                width: `${(effectiveLogoList.length / visibleCount) * 100}%`
              }}
            >
              {effectiveLogoList.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="trusted-logo-slide-card"
                  style={{ width: `${100 / effectiveLogoList.length}%` }}
                >
                  <div className="canopy-card logo-only-card">
                    <div className="card-logo-holder">
                      <img 
                        src={item.image} 
                        alt="Trusted Organization Logo" 
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

          {/* Slider Navigation & Pagination */}
          {effectiveLogoList.length > visibleCount && (
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
                {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    className={`trusted-logo-dot ${currentIndex === dotIdx ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
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


