// ignitoverse: Section 4 - Featured Microcredentials Preview (Dynamic API Data)
import React, { useState, useEffect } from 'react';
import { Edit3, ChevronRight } from 'lucide-react';
import arrowImg from '../../assets/home/Arrow.webp';
import noriBg01 from '../../assets/home/nori-background-01.png';
import CourseCard from '../Microcredentials/CourseCard';
import { getMicrocredentialCourseBindDataList } from '../../services/microcredentialService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';

export default function FeaturedSection({
  onViewDetails = () => { },
  onViewAll = () => { },
  onPreviewVideo = () => { }
}) {
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Fetch maximum 8 courses for the homepage preview
    getMicrocredentialCourseBindDataList(1, 8, 'UpdatedOn', 'DESC', 0, '', 0, false, '')
      .then((res) => {
        if (!isMounted) return;

        if (res && res.success && Array.isArray(res.microcredentialCourseBindDatas) && res.microcredentialCourseBindDatas.length > 0) {
          const mapped = res.microcredentialCourseBindDatas.slice(0, 8).map((item, idx) => {
            const rawImg = item.microcredentialCourseIntroImage || item.introImage || item.image || item.thumbnail || '';
            const formattedThumb = rawImg ? formatImageUrl(rawImg) : '';
            return {
              id: item.encryptedMicrocredentialCourseId || item.microcredentialCourseId || `mc-${idx}`,
              courseId: item.microcredentialCourseId,
              encryptedId: item.encryptedMicrocredentialCourseId,
              title: item.microcredentialCourseName || 'Microcredential Course',
              level: item.courseLevel ? item.courseLevel.split('(')[0].trim() : 'All Levels',
              fullLevel: item.courseLevel || 'Intermediate',
              price: item.microcredentialCoursePrice,
              rating: item.microcredentialCourseRating || 5,
              duration: item.microcredentialCourseDuration || '',
              streamName: item.streamName || '',
              language: item.language || 'ENGLISH',
              thumbnail: formattedThumb,
              description: item.courseDescription || item.description || `Master ${item.microcredentialCourseName || 'essential skills'} with industry-verified microcredentials.`,
              lecturesCount: item.lecturesCount || item.lectureCount || 0,
              studentsCount: item.studentsCount || item.studentCount || 0,
              rawData: item
            };
          });

          setCoursesList(mapped);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch featured courses for homepage:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!loading && coursesList.length === 0) {
    return null;
  }

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

        {/* Course Cards Grid (Up to 8 cards, centered when < 4 courses) */}
        <div className={`featured-courses-grid ${coursesList.length < 4 ? `centered-count-${coursesList.length}` : ''}`}>
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
