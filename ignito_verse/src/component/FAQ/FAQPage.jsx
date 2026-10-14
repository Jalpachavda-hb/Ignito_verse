// ignitoverse: FAQ Page - Numbered Accordion & Refined Hero
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import './faq.css';

const MASTER_FAQS = [
  {
    id: 'f1',
    q: 'How do I enroll in an Ignitoverse training module?',
    a: 'You can browse our Training Modules catalog, select a course to view the syllabus, faculty details, and preview content. Click on "Enroll Now" and complete the registration process. If you are not logged in, you can create a free student account in seconds.'
  },
  {
    id: 'f2',
    q: 'Are the training module completion certificates verifiable?',
    a: 'Yes, absolutely. Every certificate issued by Ignitoverse includes a unique cryptographic serial number and an instant QR verification code recognized by top corporate recruiters and academic credit committees.'
  },
  {
    id: 'f3',
    q: 'Can enterprises request tailored training cohorts for their teams?',
    a: 'Yes, our enterprise solutions team specializes in custom learning paths, private cohort tracking, skill benchmarking, and hands-on capstone project evaluations tailored to your specific organizational technology stack.'
  },
  {
    id: 'f4',
    q: 'How are quizzes and assessments graded?',
    a: 'Quizzes are auto-graded algorithmically upon submission. You receive an instant score breakdown, question-by-question explanations, and performance feedback to reinforce your understanding.'
  },
  {
    id: 'f5',
    q: 'Is my learning data and certificate history securely stored?',
    a: 'Yes, your student profile, completed modules, quiz scores, and verification keys are encrypted and stored in secure cloud infrastructure ensuring complete privacy and lifetime accessibility.'
  },
  {
    id: 'f6',
    q: 'What is the SWAYAM 4-Quadrant pedagogy framework?',
    a: 'Our courses strictly follow the national SWAYAM 4-Quadrant structure: Quadrant 1 (Video Lectures), Quadrant 2 (Specially Prepared Reading Material & eBooks), Quadrant 3 (Self-Assessment Quizzes & Practice Tests), and Quadrant 4 (Interactive Discussion Forum & Doubt Clearing).'
  }
];

export default function FAQPage() {
  const [openFaqIds, setOpenFaqIds] = useState(new Set(['f1'])); // Open first item by default

  const toggleFaq = (id) => {
    setOpenFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="faq-page-container">
      {/* 1. HERO SECTION WITH FAQ.PNG BACKGROUND */}
      <section className="faq-hero-light">
        <div className="faq-hero-container">
          <div className="faq-hero-inner">
           

            {/* Heading (Line 1: Frequently Asked, Line 2: Questions) */}
            <h1 className="faq-hero-main-title">
              <span className="faq-title-line1">Frequently Asked</span>
              <span className="faq-title-line2 gradient-pink-purple">Questions</span>
            </h1>

            {/* Subtitle */}
            <p className="faq-hero-main-subtitle">
              Find answers about training modules, certificates, the SWAYAM 4-Quadrant framework, and more.
            </p>
          </div>
        </div>
      </section>

      {/* 2. ACCORDION QUESTIONS LIST */}
      <section className="faq-list-section">
        <div className="faq-number-stack">
          {MASTER_FAQS.map((faq, index) => {
            const isOpen = openFaqIds.has(faq.id);
            // Number badge format: 01, 02, 03... (Matches Reference)
            const numberFormatted = String(index + 1).padStart(2, '0');

            return (
              <div key={faq.id} className={`faq-card-modern ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-trigger-btn"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                >
                  <div className="faq-trigger-left">
                    {/* Left Number Badge */}
                    <div className="faq-number-badge" aria-hidden="true">
                      {numberFormatted}
                    </div>

                    {/* Question Heading */}
                    <h3 className="faq-question-heading">
                      {faq.q}
                    </h3>
                  </div>

                  {/* Right Circular Toggle Button */}
                  <div className="faq-round-toggle-btn" aria-hidden="true">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Open Answer Body */}
                {isOpen && (
                  <div className="faq-body-container">
                    <div className="faq-divider-line" />
                    <p className="faq-answer-paragraph">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

