// ignitoverse: Section 8 - Single Horizontal Enterprise Impact Bar (Exact Reference Match)
import React from 'react';
import { TrendingUp, Target, Zap, Briefcase, Star } from 'lucide-react';
import cardWatermark from '../../assets/home/card.png';

export default function ImpactBand() {
  return (
    <section className="impact-band-section" id="impact-metrics">
      <div className="impact-horizontal-bar">
        {/* Subtle Constellation Ambient Watermarks */}
        <img src={cardWatermark} alt="" className="impact-corner-watermark left-wm" aria-hidden="true" />
        <img src={cardWatermark} alt="" className="impact-corner-watermark right-wm" aria-hidden="true" />

        {/* 1. Left Headline & Description Column */}
        <div className="impact-intro-col">
          <div className="impact-trend-icon-circle">
            <TrendingUp size={20} className="impact-trend-svg" />
          </div>

          <div className="impact-intro-text">
            <h2 className="impact-heading">
              Real Impact on Enterprise <br />
              <span className="impact-cyan-text">Productivity & Retention</span>
            </h2>

            <p className="impact-desc">
              Quantifiable ROI and verified skill outcomes measured across Fortune 500 engineering, L&D, and digital leadership cohorts.
            </p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="impact-col-divider" aria-hidden="true" />

        {/* 2. 4 Compact Glass Stat Cards */}
        <div className="impact-cards-row">
          {/* Card 1: 94% */}
          <div className="impact-stat-card">
            <div className="stat-card-icon-circle">
              <Target size={18} className="stat-card-svg" />
            </div>
            <h3 className="stat-card-value">94%</h3>
            <h4 className="stat-card-title">Course Completion Rate</h4>
            <p className="stat-card-subtitle">vs 15% industry MOOC average</p>
            <div className="stat-card-bar-track">
              <div className="stat-card-bar-fill fill-94" />
            </div>
          </div>

          {/* Card 2: 3.5x */}
          <div className="impact-stat-card">
            <div className="stat-card-icon-circle">
              <Zap size={18} className="stat-card-svg" />
            </div>
            <h3 className="stat-card-value">3.5x</h3>
            <h4 className="stat-card-title">Faster Upskilling Cycle</h4>
            <p className="stat-card-subtitle">than modular certification</p>
            <div className="stat-card-bar-track">
              <div className="stat-card-bar-fill fill-85" />
            </div>
          </div>

          {/* Card 3: 500+ */}
          <div className="impact-stat-card">
            <div className="stat-card-icon-circle">
              <Briefcase size={18} className="stat-card-svg" />
            </div>
            <h3 className="stat-card-value">500+</h3>
            <h4 className="stat-card-title">Enterprises Upskilled</h4>
            <p className="stat-card-subtitle">including Fortune 500 tech leaders</p>
            <div className="stat-card-bar-track">
              <div className="stat-card-bar-fill fill-90" />
            </div>
          </div>

          {/* Card 4: 4.92 / 5 */}
          <div className="impact-stat-card">
            <div className="stat-card-top-header">
              <div className="stat-card-icon-circle">
                <Star size={18} className="stat-card-svg star-color" />
              </div>
              <div className="stat-five-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
            </div>
            <h3 className="stat-card-value">4.92 / 5</h3>
            <h4 className="stat-card-title">Average Learner Rating</h4>
            <p className="stat-card-subtitle">Over 1M+ verified evaluations</p>
            <div className="stat-card-bar-track">
              <div className="stat-card-bar-fill fill-98" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
