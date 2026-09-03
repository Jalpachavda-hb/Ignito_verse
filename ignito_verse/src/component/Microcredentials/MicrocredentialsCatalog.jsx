// ignitoverse: Executive Certified Microcredentials Catalog Page
import React, { useState, useEffect, useMemo } from 'react';
import { Award, BookOpen } from 'lucide-react';
import CourseCard from './CourseCard';
import { getMicrocredentialCourseBindDataList } from '../../services/microcredentialService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';
import mheroBg from '../../assets/home/mhero-bg.png';

export default function MicrocredentialsCatalog({
  onViewDetails = () => { },
  onPreviewVideo = () => { }
}) {
  const [coursesList, setCoursesList] = useState([]);
  const [levelList, setLevelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('All');

  useEffect(() => {
    let isMounted = true;
    getMicrocredentialCourseBindDataList(1, 50, 'UpdatedOn', 'DESC', 0, '', 0, false, '')
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success) {
          if (Array.isArray(res.courseLevelCount)) {
            setLevelList(res.courseLevelCount);
          }

          if (Array.isArray(res.microcredentialCourseBindDatas) && res.microcredentialCourseBindDatas.length > 0) {
            const mapped = res.microcredentialCourseBindDatas.map((item, idx) => {
              const rawImg = item.microcredentialCourseIntroImage || item.introImage || item.image || item.thumbnail || '';
              const formattedThumb = rawImg ? formatImageUrl(rawImg) : '';
              return {
                id: item.encryptedMicrocredentialCourseId || item.microcredentialCourseId || `mc-${idx}`,
                courseId: item.microcredentialCourseId,
                microcredentialCourseId: item.microcredentialCourseId,
                encryptedId: item.encryptedMicrocredentialCourseId,
                encryptedMicrocredentialCourseId: item.encryptedMicrocredentialCourseId,
                title: item.microcredentialCourseName || 'Microcredential Course',
                level: item.courseLevel ? item.courseLevel.split('(')[0].trim() : 'All Levels',
                courseLevel: item.courseLevel || 'Intermediate',
                fullLevel: item.courseLevel || 'Intermediate',
                category: item.streamName || 'Management',
                streamName: item.streamName || 'Management',
                domain: item.streamName || 'Management',
                price: item.microcredentialCoursePrice,
                rating: item.microcredentialCourseRating || 5,
                duration: item.microcredentialCourseDuration || '3 Month',
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
        }
      })
      .catch((err) => {
        console.error('Error fetching catalog courses:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter courses by level
  const filteredCourses = useMemo(() => {
    if (selectedLevel === 'All') return coursesList;

    return coursesList.filter((course) => {
      return (
        course.courseLevel === selectedLevel ||
        course.fullLevel === selectedLevel ||
        course.level === selectedLevel ||
        (course.courseLevel && course.courseLevel.toLowerCase().includes(selectedLevel.toLowerCase()))
      );
    });
  }, [coursesList, selectedLevel]);

  return (
    <div className="catalog-luxury-wrapper">
      {/* 1. Full Width Hero Header Banner with mhero-bg.png spanning edge-to-edge */}
      <section 
        className="catalog-hero-full-width-banner"
        style={{ backgroundImage: `url(${mheroBg})` }}
      >
        <div className="catalog-hero-full-inner-container">
          <div className="catalog-hero-content-left">
            <div className="catalog-hero-cert-badge">
              <Award size={15} className="cert-badge-ribbon-icon" />
              <span>CERTIFIED MICROCREDENTIALS</span>
            </div>

            <h1 className="catalog-hero-main-title">
              Master High-Impact Skills <br />
              <span className="purple-gradient-text">Industry-Recognized Credentials</span>
            </h1>

            <p className="catalog-hero-desc">
              Accelerate your professional growth and organizational leadership through specialized, accredited microcredentials designed with enterprise partners.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Content Section (Tabs & Course Cards) */}
      <section className="catalog-main-body-section">
        <div className="catalog-body-container">
          {/* Filter Pills Tabs Bar (All Programs, Level 1, Level 2) */}
          <div className="catalog-tabs-bar-row">
            <div className="catalog-tabs-pills-list">
              <button
                type="button"
                className={`catalog-pill-btn ${selectedLevel === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedLevel('All')}
              >
                <span>All Programs</span>
                <span className="pill-count-circle">{coursesList.length}</span>
              </button>

              {levelList.map((lvl) => (
                <button
                  key={lvl.levelValue ?? lvl.levelName}
                  type="button"
                  className={`catalog-pill-btn ${selectedLevel === lvl.levelName ? 'active' : ''}`}
                  onClick={() => setSelectedLevel(lvl.levelName)}
                >
                  <span>{lvl.levelName}</span>
                  {lvl.courseCount && (
                    <span className="pill-count-circle">{lvl.courseCount}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="catalog-showing-counter">
              Showing <strong>{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'Program' : 'Programs'}
            </div>
          </div>

          {/* Course Cards Grid */}
          {filteredCourses.length > 0 ? (
            <div className={`catalog-exact-grid ${filteredCourses.length < 3 ? `grid-count-${filteredCourses.length}` : ''}`}>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onViewDetails={onViewDetails}
                  onPreviewVideo={onPreviewVideo}
                />
              ))}
            </div>
          ) : (
            <div className="catalog-empty-state">
              <BookOpen size={48} className="empty-icon" />
              <h3>No courses found</h3>
              <p>Try selecting a different skill level or view all programs.</p>
              <button
                type="button"
                className="btn-reset-empty"
                onClick={() => {
                  setSelectedLevel('All');
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
