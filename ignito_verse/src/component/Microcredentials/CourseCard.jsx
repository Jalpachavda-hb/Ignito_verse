// ignitoverse: Nori Course Card Component (Exact Matching Reference Design)
import React from 'react';
import { ArrowRight, Users, Sparkles } from 'lucide-react';

export default function CourseCard({ course, onViewDetails = () => { }, onPreviewVideo = () => { } }) {
  if (!course) return null;

  const levelText = course.level || (course.courseLevel ? course.courseLevel.split('(')[0].trim() : 'Intermediate');

  const getShortDesc = (c) => {
    if (c.title?.toLowerCase().includes('stress')) {
      return 'Learn proven strategies to manage stress, improve focus, and enhance well-being.';
    }
    if (c.title?.toLowerCase().includes('relax') || c.title?.toLowerCase().includes('meditation')) {
      return 'Discover simple yet powerful techniques to relax your mind and body.';
    }
    return c.description || 'Master high-impact skills with industry-verified microcredentials.';
  };

  return (
    <div className="ref-course-card" onClick={() => onViewDetails(course)}>
      {/* Thumbnail Stage with Level Pill */}
      <div className="ref-card-thumb-container">
        <span className="ref-level-pill">{levelText}</span>

        <img
          decoding="async"
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
          alt={course.title}
          className="ref-card-thumb-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      {/* Card Content Body */}
      <div className="ref-card-body">
        <div className="ref-card-main-info-row">
          <div className="ref-card-icon-squircle">
            {course.title?.toLowerCase().includes('stress') ? (
              <Users size={20} className="squircle-icon-purple" />
            ) : (
              <Sparkles size={20} className="squircle-icon-purple" />
            )}
          </div>

          <div className="ref-card-texts">
            <h3 className="ref-card-title">{course.title}</h3>
            <p className="ref-card-desc">{getShortDesc(course)}</p>
          </div>

          <div className="ref-card-action-btn">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
