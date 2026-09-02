// ignitoverse: Section 4 - Featured Microcredentials Preview (Identical to Reference SS)
import React from 'react';
import { Edit3, ChevronRight } from 'lucide-react';
import arrowImg from '../../assets/home/Arrow.webp';
import noriBg01 from '../../assets/home/nori-background-01.png';
import noriPost2 from '../../assets/home/nori-post-2-720x720.webp';
import CourseCard from '../Microcredentials/CourseCard';

export default function FeaturedSection({
  onViewDetails = () => { },
  onViewAll = () => { },
  onPreviewVideo = () => { }
}) {
  // 8 courses exactly matching the reference screenshot
  const coursesList = [
    {
      id: 'mc-sales-potential',
      title: 'Maximizing Your Sales Potential Tips',
      level: 'Intermediate',
      priceBadge: 'FREE',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      lecturesCount: 0,
      studentsCount: 0,
    },
    {
      id: 'mc-web-dev',
      title: 'Web Development Fully Complete Guideline',
      level: 'Beginner',
      priceBadge: 'FREE',
      thumbnail: noriPost2 || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      lecturesCount: 0,
      studentsCount: 0,
    },
    {
      id: 'mc-social-media',
      title: 'Strategic Social Media & Marketing Policy',
      level: 'Expert',
      priceBadge: 'FREE',
      thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      lecturesCount: 0,
      studentsCount: 0,
    },
    {
      id: 'mc-business-everything',
      title: 'Everything You Need to Know About Business',
      level: 'All',
      priceBadge: 'FREE',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      lecturesCount: 0,
      studentsCount: 0,
    },
    {
      id: 'mc-data-science',
      title: 'Data Science: Complete Data Science',
      level: 'Beginner',
      priceBadge: '$29',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      lecturesCount: 0,
      studentsCount: 0,
    },
    {
      id: 'mc-sales-admin',
      title: 'Sales Administrator Certification Practice',
      level: 'Intermediate',
      priceBadge: 'FREE',
      thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      lecturesCount: 0,
      studentsCount: 0,
    },
    {
      id: 'mc-diversity-building',
      title: 'Exploring Diversity Building Learning',
      level: 'Expert',
      priceBadge: 'FREE',
      thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      lecturesCount: 0,
      studentsCount: 0,
    },
    {
      id: 'mc-spanish-language',
      title: 'Spanish Language: Beginner to Fluent',
      level: 'All',
      priceBadge: 'FREE',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      lecturesCount: 0,
      studentsCount: 0,
    }
  ];

  return (
    <section className="featured-courses-section" id="featured-microcredentials">
      <div className="featured-full-wrapper">
        {/* Top Checkered Background Watermark Pattern */}
        <div
          className="nori-header-bg-watermark"
          style={{ backgroundImage: `url(${noriBg01})` }}
          aria-hidden="true"
        />

        {/* Decorative Hand-Drawn Doodle Arrow */}
        <div className="doodle-arrow-left" aria-hidden="true">
          <img src={arrowImg} alt="" className="nori-arrow-img" />
        </div>

        {/* Section Header */}
        <div className="featured-header-simple">
          <div className="section-popular-badge">
            <Edit3 size={13} className="badge-sparkle-icon" />
            <span>POPULAR COURSES</span>
          </div>

          <h2 className="section-main-title">
            Pick a course to get started
          </h2>

          <p className="section-subtitle">
            A curated collection of amazing courses, chosen based on popularity and ratings by students. Welcome to our diverse and dynamic course catalog.
          </p>
        </div>

        {/* 8 Course Cards in 4-Column Grid (414px x 482px model) */}
        <div className="featured-courses-grid">
          {coursesList.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onViewDetails={onViewDetails}
              onPreviewVideo={onPreviewVideo}
            />
          ))}
        </div>

        {/* Overlapping Centered Browse More Courses Button */}
        <div className="featured-bottom-floating-action">
          <button
            type="button"
            className="btn-browse-more-courses"
            onClick={onViewAll}
          >
            <span>Browse More Courses</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
