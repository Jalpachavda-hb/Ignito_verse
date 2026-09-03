// ignitoverse: Executive Certified Microcredentials Catalog Page
import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import CourseCard from './CourseCard';
import { getMicrocredentialCourseBindDataList } from '../../services/microcredentialService';
import { formatImageUrl } from '../../dto/output/homepageOutputs';
import mcbg from '../../assets/mcbg.jpg';

export default function MicrocredentialsCatalog({
  onViewDetails = () => { },
  onPreviewVideo = () => { },
  onNavigate = () => { }
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
    <div className="mc-catalog-page-wrapper">
      
      {/* 1. Full-Width Hero Header Banner with mcbg.jpg */}
      <section 
        className="mc-catalog-hero-banner"
        style={{ backgroundImage: `url(${mcbg})` }}
      >
        <div className="mc-catalog-hero-overlay" />
        <div className="mc-catalog-hero-inner">
          {/* Breadcrumb Trail */}
          <div className="mc-catalog-hero-breadcrumb">
            <span className="crumb-link" onClick={() => onNavigate('home')}>HOME</span>
            <span className="crumb-slash">/</span>
            <span className="crumb-current">MICROCREDENTIALS</span>
          </div>

          {/* Hero Centered Heading */}
          <h1 className="mc-catalog-hero-heading">
            Microcredentials
          </h1>
        </div>
      </section>

      {/* 2. Main Content Section in Curved Top Container */}
      <section className="mc-catalog-curved-sheet">
        <div className="mc-catalog-container">
          
          {/* Top Row: Results Counter & Level Tabs */}
          <div className="mc-catalog-header-bar">
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

            <div className="mc-catalog-count-text">
              We found <strong>{filteredCourses.length}</strong> courses available for you
            </div>
          </div>

          {/* 3. Full-Width 4-Column Course Cards Grid */}
          {filteredCourses.length > 0 ? (
            <div className="catalog-courses-clean-grid">
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
