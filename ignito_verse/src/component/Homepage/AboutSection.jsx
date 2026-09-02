import React from 'react';
import { 
  Users, 
  Globe, 
  Award, 
  Headphones, 
  ChevronRight, 
  ArrowUpRight, 
  Sparkles,
  BookOpen
} from 'lucide-react';

const featureList = [
  {
    id: 1,
    title: 'Processional Tutors',
    desc: 'Experience education platform for success of our online learning.',
    icon: Users
  },
  {
    id: 2,
    title: '80+ Online Courses',
    desc: 'Experience education platform for success of our online learning.',
    icon: Globe
  },
  {
    id: 3,
    title: 'Top Instructors',
    desc: 'Experience education platform for success of our online learning.',
    icon: Award
  },
  {
    id: 4,
    title: 'Educator help',
    desc: 'Experience education platform for success of our online learning.',
    icon: Headphones
  }
];

const promoCards = [
  {
    id: 1,
    title: 'Remote Learning',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    link: '#remote-learning'
  },
  {
    id: 2,
    title: 'Know more About us',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    link: '#about-us'
  },
  {
    id: 3,
    title: 'How can we help?',
    image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&auto=format&fit=crop&q=80',
    link: '#help'
  }
];

export default function AboutSection({
  onMoreAboutClick = () => console.log('More About clicked')
}) {
  return (
    <section className="about-company-section">
      <div className="about-company-container">
        {/* Top Split Area: Left Headline + Right 2x2 Feature Grid */}
        <div className="about-top-grid">
          {/* Left Column: Heading & CTA */}
          <div className="about-left-content">
            <div className="about-pill-badge">
              <Sparkles size={14} className="badge-sparkle-icon" />
              <span>ABOUT COMPANY</span>
            </div>

            <h2 className="about-main-title">
              Providing online classes <br />
              for remote learning
            </h2>

            <p className="about-subtitle">
              Online courses have revolutionized the way people learn by offering flexibility and a wide range of subjects for every interest.
            </p>

            <button 
              type="button" 
              className="about-btn-more"
              onClick={onMoreAboutClick}
            >
              <span>More About</span>
              <ChevronRight size={17} className="btn-arrow-right" />
            </button>
          </div>

          {/* Right Column: 2x2 Feature Grid */}
          <div className="about-features-grid">
            {featureList.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} className="feature-item-box">
                  <div className="feature-icon-wrapper">
                    <IconComponent size={26} className="feature-svg-icon" />
                  </div>
                  <div className="feature-text-block">
                    <h4 className="feature-box-title">{item.title}</h4>
                    <p className="feature-box-desc">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Area: 3 Interactive Promo Image Cards */}
        <div className="about-promo-cards-grid">
          {promoCards.map((card) => (
            <a key={card.id} href={card.link} className="promo-card-item">
              <div className="promo-card-content">
                <h3 className="promo-card-title">{card.title}</h3>
                <div className="promo-arrow-circle">
                  <ArrowUpRight size={18} />
                </div>
              </div>
              <div className="promo-image-wrapper">
                <img src={card.image} alt={card.title} className="promo-img" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
