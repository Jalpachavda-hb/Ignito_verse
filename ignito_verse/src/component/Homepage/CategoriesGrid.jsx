// ignitoverse: Section 6 - Categories Grid (Technical vs Non-Technical)
import React from 'react';
import { 
  Code, 
  Database, 
  Cloud, 
  ShieldCheck, 
  HeartPulse, 
  MessageSquare, 
  Compass, 
  FileText, 
  ArrowUpRight, 
  Sparkles,
  Cpu,
  Smile
} from 'lucide-react';
import { categoryDomains } from '../../data/enterpriseData';

const iconMap = {
  Code: Code,
  Database: Database,
  Cloud: Cloud,
  ShieldCheck: ShieldCheck,
  HeartPulse: HeartPulse,
  MessageSquare: MessageSquare,
  Compass: Compass,
  FileText: FileText
};

export default function CategoriesGrid({ onSelectCategory = () => {} }) {
  return (
    <section className="categories-grid-section" id="domains">
      <div className="categories-container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-pill-badge">
            
            <span>DUAL-TRACK CURRICULUM</span>
          </div>
          <h2 className="section-main-title">
            Explore Microcredentials by Domain
          </h2>
          <p className="section-subtitle">
            Balance hard technical engineering proficiencies with vital executive soft skills and mental well-being.
          </p>
        </div>

        {/* Two Columns: Left = Technical, Right = Non-Technical */}
        <div className="dual-domain-layout">
          {/* Column 1: Technical Tracks */}
          <div className="domain-track-box technical-track">
            <div className="track-header">
              <div className="track-icon-badge tech">
                <Cpu size={22} />
              </div>
              <div>
                <h3 className="track-title">Technical Microcredentials</h3>
                <p className="track-sub">Architecture, Cloud, Data, and Cybersecurity</p>
              </div>
            </div>

            <div className="domain-cards-list">
              {categoryDomains.technical.map((item, idx) => {
                const IconComponent = iconMap[item.icon] || Code;
                return (
                  <div 
                    key={idx} 
                    className="domain-card-item"
                    onClick={() => onSelectCategory('Technical')}
                  >
                    <div className="domain-icon-wrap">
                      <IconComponent size={22} />
                    </div>
                    <div className="domain-info-block">
                      <div className="domain-name-row">
                        <h4 className="domain-name">{item.title}</h4>
                        <span className="domain-count-badge">{item.count}</span>
                      </div>
                      <p className="domain-desc">{item.desc}</p>
                    </div>
                    <div className="domain-arrow">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Non-Technical Tracks */}
          <div className="domain-track-box non-technical-track">
            <div className="track-header">
              <div className="track-icon-badge non-tech">
                <Smile size={22} />
              </div>
              <div>
                <h3 className="track-title">Non-Technical & Leadership</h3>
                <p className="track-sub">Communication, Stress Management, and Compliance</p>
              </div>
            </div>

            <div className="domain-cards-list">
              {categoryDomains.nonTechnical.map((item, idx) => {
                const IconComponent = iconMap[item.icon] || MessageSquare;
                return (
                  <div 
                    key={idx} 
                    className="domain-card-item"
                    onClick={() => onSelectCategory('Non-Technical')}
                  >
                    <div className="domain-icon-wrap non-tech-icon">
                      <IconComponent size={22} />
                    </div>
                    <div className="domain-info-block">
                      <div className="domain-name-row">
                        <h4 className="domain-name">{item.title}</h4>
                        <span className="domain-count-badge non-tech-badge">{item.count}</span>
                      </div>
                      <p className="domain-desc">{item.desc}</p>
                    </div>
                    <div className="domain-arrow">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
