// ignitoverse: Section 3 - What We Offer (3 Core Pillars)
import React from 'react';
import { Award, ShieldCheck, BarChart3, ArrowRight, Check } from 'lucide-react';
import { valuePillars } from '../../data/enterpriseData';
import cardWatermark from '../../assets/home/card.png';

export default function WhatWeOffer({ onLearnMore = () => {} }) {
  const getPillarIcon = (idx) => {
    if (idx === 0) return <Award size={26} strokeWidth={2.2} />;
    if (idx === 1) return <ShieldCheck size={26} strokeWidth={2.2} />;
    return <BarChart3 size={26} strokeWidth={2.2} />;
  };

  return (
    <section className="pillars-section" id="pillars">
      <div className="pillars-container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="b2b-badge">
            <span>THE IGNITOVERSE ADVANTAGE</span>
          </div>

          <h2 className="section-main-title">
            Engineered for Fast, Measurable <br />
            <span className="b2b-blue-text">Workforce Upskilling</span>
          </h2>

          <p className="section-subtitle">
            Traditional multi-month courses pull employees away from client projects. Ignitoverse delivers short, certified microcredentials built around actual enterprise tech stacks and workplace demands.
          </p>
        </div>

        {/* 3 Core Value Pillar Cards */}
        <div className="pillars-grid">
          {valuePillars.map((pillar, idx) => (
            <div key={pillar.id} className="pillar-card">
              {/* Top Row: Number & Icon Box */}
              <div className="pillar-top-row">
                <span className="pillar-number">{pillar.number}</span>
                <div className="pillar-icon-box">
                  {getPillarIcon(idx)}
                </div>
              </div>

              {/* Card Titles & Descriptions */}
              <div className="pillar-body">
                <h3 className="pillar-title">{pillar.title}</h3>
                <span className="pillar-subtitle">{pillar.subtitle}</span>
                <p className="pillar-desc">{pillar.description}</p>
              </div>

              {/* Highlight Checklist */}
              <div className="pillar-highlights-list">
                {pillar.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="pillar-highlight-item">
                    <div className="pillar-check-circle">
                      <Check size={11} strokeWidth={3.5} />
                    </div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Footer CTA Link */}
              <div className="pillar-footer-action">
                <button 
                  type="button" 
                  className="pillar-action-link"
                  onClick={onLearnMore}
                >
                  <span>Explore Capabilities</span>
                  <ArrowRight size={16} className="pillar-arrow-icon" />
                </button>
              </div>

              {/* Bottom Navy Accent Line */}
              <div className="pillar-bottom-bar" />

              {/* Hexagonal Constellation Watermark Image */}
              <img 
                src={cardWatermark} 
                alt="" 
                className="pillar-bg-card-img" 
                aria-hidden="true" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
