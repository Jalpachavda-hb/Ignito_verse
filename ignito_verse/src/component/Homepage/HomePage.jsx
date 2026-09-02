// ignitoverse: Complete 11-Section Enterprise Homepage
import React from 'react';
import Herosetion from './Herosetion';
import TrustedLogos from './TrustedLogos';
import WhatWeOffer from './WhatWeOffer';
import FeaturedSection from './FeaturedSection';
import HowItWorks from './HowItWorks';
// import CategoriesGrid from './CategoriesGrid';
// import WhyEnterprises from './WhyEnterprises';
import ImpactBand from './ImpactBand';
import Testimonials from './Testimonials';
// import CtaBanner from './CtaBanner';

export default function HomePage({
  onBookDemo = () => {},
  onExploreCatalog = () => {},
  onViewDetails = () => {},
  onSelectCategory = () => {},
  onPreviewVideo = () => {},
  onContact = () => {}
}) {
  return (
    <div className="home-page-flow">
      {/* 1. Hero Section (Single section with 4 internal elements & stats strip) */}
      <Herosetion 
        onBookDemo={onBookDemo}
        onExploreCatalog={onExploreCatalog}
      />

      {/* 2. Trusted By Logo Strip */}
      <TrustedLogos />

      {/* 3. What We Offer (3 Core Pillars) */}
      <WhatWeOffer 
        onLearnMore={onExploreCatalog}
      />

      {/* 4. Featured Microcredentials (Course List Preview + View All link) */}
      <FeaturedSection 
        onViewDetails={onViewDetails}
        onViewAll={onExploreCatalog}
        onPreviewVideo={onPreviewVideo}
      />

      {/* 5. How It Works (4 Steps: Enroll → Learn → MCQ Exam → Certified) */}
      <HowItWorks 
        onBookDemo={onBookDemo}
      />

      {/* 6. Categories Grid (Technical vs Non-Technical Domains) */}
      {/* <CategoriesGrid 
        onSelectCategory={onSelectCategory}
      /> */}

      {/* 7. Why Enterprises Choose Us (Bulk SSO, Dashboards, Compliance, Custom Paths) */}
      {/* <WhyEnterprises 
        onBookDemo={onBookDemo}
      /> */}

      {/* 8. Stats / Impact Band */}
      <ImpactBand />

      {/* 9. Testimonials (Quotes from L&D leaders) */}
      <Testimonials />

      {/* 10. Enterprise Conversion CTA Banner */}
      {/* <CtaBanner 
        onBookDemo={onBookDemo}
        onContact={onContact}
      /> */}
    </div>
  );
}
