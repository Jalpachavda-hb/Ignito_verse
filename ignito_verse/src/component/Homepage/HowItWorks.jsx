// ignitoverse: Section 5 - How Ignitoverse Works for Enterprises (Exact Proportions & Floating Above-Card Stepper)
import React from 'react';
import { UserCheck, Video, HelpCircle, Award } from 'lucide-react';
import cardWatermark from '../../assets/home/card.png';

const stepsData = [
  {
    step: '01',
    tag: 'STREAMLINED PORTALS',
    title: 'Assign & Enroll',
    desc: 'HR and L&D teams bulk-assign microcredentials based on roles, skills, or business goals in just a few clicks.',
    icon: UserCheck
  },
  {
    step: '02',
    tag: 'SELF-PACED LEARNING',
    title: 'Learn on Demand',
    desc: 'Employees access bite-sized videos, real-world labs, cheat sheets, and practical assessments you can watch and re-take.',
    icon: Video
  },
  {
    step: '03',
    tag: 'PROCTORED & SECURE ASSESSMENT',
    title: 'Attempt MCQ Exam',
    desc: 'Learners complete industry-aligned MCQ assessments designed to test genuine problem-solving ability, not rote memorization.',
    icon: HelpCircle
  },
  {
    step: '04',
    tag: 'DIGITAL CREDENTIALS',
    title: 'Verify & Certify',
    desc: 'Graduates receive cryptographically signed, verifiable digital certificates automatically logged into the company LMS/HRMS.',
    icon: Award
  }
];

export default function HowItWorks({ onBookDemo = () => {} }) {
  return (
    <section className="how-it-works-section" id="how-it-works">
      {/* Corner Constellation Watermarks */}
      <img src={cardWatermark} alt="" className="how-watermark-bottom-right" aria-hidden="true" />

      <div className="how-container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="b2b-badge">
            <span>SEAMLESS WORKFLOW</span>
          </div>

          <h2 className="section-main-title">
            How Ignitoverse Works for <span className="b2b-blue-text">Enterprises</span>
          </h2>

          <p className="section-subtitle">
            A friction-free learning pipeline designed to take employees from enrollment to verifiable certification in under 3 weeks.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="how-timeline-wrapper">
          <div className="how-steps-grid">
            {stepsData.map((stepItem, idx) => {
              const StepIcon = stepItem.icon;
              const isLastStep = idx === stepsData.length - 1;
              return (
                <div key={idx} className="how-step-card-col">
                  {/* Stepper Node & Connector Row (Sits ABOVE card border) */}
                  <div className="step-stepper-node-row">
                    {/* Enlarged Hexagon Stage */}
                    <div className="step-hexagon-stage">
                      <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="node-hex-svg">
                        {/* Outer Dashed Hexagon with Mild Color matching SS */}
                        <path 
                          d="M55 5 L100 31 L100 79 L55 105 L10 79 L10 31 Z" 
                          stroke="#a8cbfa" 
                          strokeWidth="1.8" 
                          strokeDasharray="5 4" 
                          fill="rgba(240, 247, 255, 0.65)" 
                        />
                        <defs>
                          <linearGradient id={`hexGrad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#00385E" />
                          </linearGradient>
                          <filter id={`hexShadow-${idx}`} x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#00385E" floodOpacity="0.28" />
                          </filter>
                        </defs>
                        {/* Inner Solid Hexagon */}
                        <path 
                          d="M55 21 L83 37 L83 73 L55 89 L27 73 L27 37 Z" 
                          fill={`url(#hexGrad-${idx})`} 
                          filter={`url(#hexShadow-${idx})`} 
                        />
                      </svg>

                      {/* Icon */}
                      <div className="step-hex-icon-overlay">
                        <StepIcon size={26} className="step-icon-svg" />
                      </div>
                    </div>

                    {/* Integrated Connector Line Floating Above Card Top Border */}
                    <div className={`stepper-connector-line ${isLastStep ? 'is-last-line' : ''}`}>
                      <span className="step-dot" />
                      <span className="step-dash" />
                      <span className="step-num">{stepItem.step}</span>
                      {!isLastStep && (
                        <>
                          <span className="step-dash" />
                          <span className="step-dot" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Body (Starts below the connector line so line never touches card border) */}
                  <div className="step-card-box">
                    <span className="step-tag-label">{stepItem.tag}</span>
                    <h3 className="step-title">{stepItem.title}</h3>
                    <p className="step-desc">{stepItem.desc}</p>
                    <div className="step-bottom-bar" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
