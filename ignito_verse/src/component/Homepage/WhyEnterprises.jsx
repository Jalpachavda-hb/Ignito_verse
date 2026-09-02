// ignitoverse: Section 7 - Why Enterprises Choose Us
import React from 'react';
import { Users2, LayoutDashboard, ShieldCheck, Layers, ArrowRight, Sparkles, Check } from 'lucide-react';
import { whyEnterprisesChooseUs } from '../../data/enterpriseData';

const iconMap = {
  Users2: Users2,
  LayoutDashboard: LayoutDashboard,
  ShieldCheck: ShieldCheck,
  Layers: Layers
};

export default function WhyEnterprises({ onBookDemo = () => {} }) {
  return (
    <section className="why-enterprise-section" id="why-enterprises">
      <div className="why-container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-pill-badge">
            <Sparkles size={14} />
            <span>BUILT FOR SCALE</span>
          </div>
          <h2 className="section-main-title">
            Why Enterprise L&D Leaders Choose Ignitoverse
          </h2>
          <p className="section-subtitle">
            Enterprise-grade governance, seamless LMS integration, and automated certification reporting built to satisfy strict corporate IT and audit criteria.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="why-cards-grid">
          {whyEnterprisesChooseUs.map((feature, idx) => {
            const IconComponent = iconMap[feature.icon] || ShieldCheck;
            return (
              <div key={idx} className="why-card-box">
                <div className="why-icon-container">
                  <IconComponent size={26} />
                </div>

                <h3 className="why-card-title">{feature.title}</h3>
                <p className="why-card-desc">{feature.desc}</p>

                <div className="why-feature-check">
                  <Check size={16} className="check-green" />
                  <span>Enterprise SLA & Dedicated CSM</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Callout */}
        <div className="enterprise-compare-banner">
          <div className="compare-content">
            <h3>Standardize Skills Across 50 to 50,000+ Learners</h3>
            <p>Get a custom enterprise tier with volume seat licensing, dedicated LMS webhooks, and customized learning blueprints.</p>
          </div>
          <button type="button" className="btn-compare-demo" onClick={onBookDemo}>
            <span>Talk to an Enterprise Specialist</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
