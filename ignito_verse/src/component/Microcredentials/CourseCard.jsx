// ignitoverse: Nori Course Card Component (Circular Price Badge Removed)
import React from 'react';
import { FileText, User } from 'lucide-react';

export default function CourseCard({ course, onViewDetails = () => { }, onPreviewVideo = () => { } }) {
  if (!course) return null;

  const levelText = course.level || 'Intermediate';

  return (
    <div className="course-item-inner" onClick={() => onViewDetails(course)}>
      {/* Thumbnail Stage with Level Pill */}
      <div className="thumbnail">
        <span className="course-level">{levelText}</span>

        <a
          className="course-thumb"
          href={`#${course.id}`}
          onClick={(e) => { e.preventDefault(); onViewDetails(course); }}
        >
          <img
            decoding="async"
            src={course.thumbnail}
            alt={course.title}
            className="course-thumb-image"
            loading="lazy"
          />
        </a>
      </div>

      {/* Card Content Inner */}
      <div className="inner">
        {/* Course Title with Underline */}
        <h3 className="post-title">
          <a
            href={`#${course.id}`}
            onClick={(e) => { e.preventDefault(); onViewDetails(course); }}
          >
            {course.title}
          </a>
        </h3>

        <div className="clearfix" />

        {/* Course Description */}
        <p className="content">
          Course Description: {course.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do'}
        </p>

        {/* Meta Stats Row */}
        <ul className="course-meta">
          <li>
            <FileText size={13} className="meta-svg-icon" />
            <span>{course.lecturesCount || 0} Lessons</span>
          </li>
          <li>
            <User size={13} className="meta-svg-icon" />
            <span>{course.studentsCount ? `${course.studentsCount}` : '0'} Students</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
