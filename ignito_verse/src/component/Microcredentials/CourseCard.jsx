// ignitoverse: Modern Course Card (Clean Image, Title, Description, and Bottom Level Tag)
import React from 'react';

export default function CourseCard({ 
  course, 
  onViewDetails = () => {}, 
  onPreviewVideo = () => {} 
}) {
  if (!course) return null;

  const levelText = course.level || (course.courseLevel ? course.courseLevel.split('(')[0].trim() : 'Intermediate');

  return (
    <div className="nori-modern-course-card" onClick={() => onViewDetails(course)}>
      
      {/* 1. Clean Thumbnail Stage (Badges removed from image) */}
      <div className="modern-card-thumb-container clean-thumb">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80'}
          alt={course.title}
          className="modern-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      {/* 2. Card Body Content */}
      <div className="modern-card-body">
        
        {/* Course Title */}
        <h3 className="modern-card-title">
          {course.title}
        </h3>

        {/* Bottom Course Level Tag */}
        <div className="modern-card-bottom-row">
          <span className="modern-card-level-bottom-tag">
            {levelText}
          </span>
        </div>

      </div>

    </div>
  );
}
