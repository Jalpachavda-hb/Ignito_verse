import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Users,
  BookOpen,
  Building2,
  Plus
} from 'lucide-react';
import heroBgImg from '../../assets/home/hero-bg.png';
import heroForegroundImg from '../../assets/home/hero-image.png';
import { getHomePageData } from '../../services/homepageService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';
import './home.css';

// Dynamic stats for Modern Organizations
const defaultStats = [
  {
    id: 1,
    value: '1,245,000+',
    label: 'Active Learners',
    icon: Users
  },
  {
    id: 2,
    value: '10K+',
    label: 'Courses Delivered',
    icon: BookOpen
  },
  {
    id: 3,
    value: '500+',
    label: 'Organizations',
    icon: Building2
  }
];

export default function Herosetion({
  badgeText = 'FOR MODERN ORGANIZATIONS',
  titlePart1 = 'Empower People.',
  titlePart2 = 'Elevate Performance.',
  description = "Ignito Verse helps organizations build a culture of continuous learning with training that's relevant, measurable, and future-ready.",
  primaryBtnText = 'Book a Demo',
  secondaryBtnText = 'Explore Solutions',
  onBookDemo,
  onExploreSolutions,
  onPrimaryClick,
  onSecondaryClick,
  stats = defaultStats,
  completionRate = '93%',
  completionLabel = 'Course Completion',
  completionSubtext = 'This Month',
  heroData: propHeroData = null
}) {
  const [apiHeroData, setApiHeroData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propHeroData) {
      setLoading(true);
      getHomePageData()
        .then((res) => {
          debugger;
          if (res && res.success) {
            const sectionData = res.homePageSectionDataList?.[0] || null;
            const bindData = res.homePageDataBindList?.[0] || null;
            setApiHeroData({ sectionData, bindData });
          }
        })
        .catch((err) => {
          console.error('Failed to fetch dynamic hero section data:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [propHeroData]);

  const activeHeroData = propHeroData || apiHeroData;

  // Dynamically resolve values from getHomePageData() backend response or fallback to default props
  const dynamicBadge = activeHeroData?.sectionData?.homeSlogan || activeHeroData?.bindData?.homeSloganTwo || badgeText;
  const dynamicDescription = activeHeroData?.sectionData?.homeDescription || activeHeroData?.bindData?.homeDescriptionTwo || description;

  const apiTitle = activeHeroData?.sectionData?.homeTitle || activeHeroData?.bindData?.homeTitleTwo;
  let dynamicTitlePart1 = titlePart1;
  let dynamicTitlePart2 = titlePart2;

  if (apiTitle && titlePart1 === 'Empower People.') {
    const words = apiTitle.trim().split(' ');
    if (words.length > 2) {
      const mid = Math.ceil(words.length / 2);
      dynamicTitlePart1 = words.slice(0, mid).join(' ');
      dynamicTitlePart2 = words.slice(mid).join(' ');
    } else {
      dynamicTitlePart1 = apiTitle;
      dynamicTitlePart2 = '';
    }
  }

  const rawBannerPath = activeHeroData?.sectionData?.homeBannerImage || activeHeroData?.bindData?.homeBannerImageTwo;
  const dynamicHeroImg = rawBannerPath ? formatImageUrl(rawBannerPath) : heroForegroundImg;

  const handleDemo = onBookDemo || onPrimaryClick || (() => console.log('Book a Demo Clicked'));
  const handleSolutions = onExploreSolutions || onSecondaryClick || (() => console.log('Explore Solutions Clicked'));

  return (
    <section
      className="b2b-hero-section"
      style={{ backgroundImage: `url(${heroBgImg})` }}
    >
      <div className="b2b-hero-container">
        {/* Left Side: Dynamic Text & Action Elements */}
        <div className="b2b-hero-content">
          {/* Organization Pill Badge */}
          <div className="b2b-badge">
            <span>{dynamicBadge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="b2b-headline">
            {dynamicTitlePart1} <br />
            {dynamicTitlePart2 && (
              <span className="b2b-blue-text">{dynamicTitlePart2}</span>
            )}
          </h1>

          {/* Subtitle / Description */}
          <p className="b2b-description">
            {dynamicDescription}
          </p>

          {/* CTA Buttons */}
          <div className="b2b-cta-group">
            <button
              type="button"
              className="b2b-btn btn-demo"
              onClick={handleDemo}
            >
              <span>{primaryBtnText}</span>
              <ArrowRight size={17} className="btn-arrow" />
            </button>

            <button
              type="button"
              className="b2b-btn btn-solutions"
              onClick={handleSolutions}
            >
              <span>{secondaryBtnText}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Foreground Collage Image & Floating Metric Card */}
        <div className="b2b-hero-visual-wrapper">
          <img
            src={dynamicHeroImg}
            alt={apiTitle || "Empower People Elevate Performance - Modern Training"}
            className="b2b-hero-foreground-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = heroForegroundImg;
            }}
          />

          {/* Floating Course Completion 93% Metric Card */}
          <div className="floating-metric-card" aria-label="Course Completion Statistics">
            <div className="metric-card-header">
              <div className="metric-plus-icon">
                <Plus size={15} strokeWidth={3} />
              </div>
              <span className="metric-header-title">{completionLabel}</span>
            </div>

            <div className="metric-stat-body">
              <h2 className="metric-stat-number">{completionRate}</h2>
              <p className="metric-stat-sub">{completionSubtext}</p>
            </div>

            {/* SVG Sparkline Wave Chart */}
            <div className="metric-chart-container">
              <svg
                viewBox="0 0 160 48"
                className="metric-sparkline-svg"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="chartFillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gradient Area under curve */}
                <path
                  d="M 5 36 Q 25 36 35 28 T 65 30 T 95 18 T 125 24 T 152 10 L 152 48 L 5 48 Z"
                  fill="url(#chartFillGradient)"
                />

                {/* Curve Line */}
                <path
                  d="M 5 36 Q 25 36 35 28 T 65 30 T 95 18 T 125 24 T 152 10"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dot at end of curve */}
                <circle cx="152" cy="10" r="3.5" fill="#2563eb" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

