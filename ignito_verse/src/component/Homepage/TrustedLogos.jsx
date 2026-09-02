import React from 'react';
import tcsImg from '../../assets/home/TCS.jfif';
import hitachiImg from '../../assets/home/HITACHI.png';
import wiproImg from '../../assets/home/WIPRO.png';

const trustedCards = [
  {
    id: 'tcs',
    name: 'Tata Consultancy Services',
    industry: 'IT & Consulting',
    image: tcsImg
  },
  {
    id: 'hitachi',
    name: 'Hitachi',
    industry: 'Industrial & Technology',
    image: hitachiImg
  },
  {
    id: 'wipro',
    name: 'Wipro',
    industry: 'Digital Transformation',
    image: wiproImg
  }
];

export default function TrustedLogos() {
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

        {/* 3 Executive Enterprise Cards with Images */}
        <div className="canopy-curved-arch">
          <div className="trusted-three-cards-grid">
            {trustedCards.map((item) => (
              <div key={item.id} className="canopy-card" title={item.name}>
                <div className="card-logo-holder">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="partner-logo-img" 
                  />
                </div>
                <span className="card-industry-label">{item.industry}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
