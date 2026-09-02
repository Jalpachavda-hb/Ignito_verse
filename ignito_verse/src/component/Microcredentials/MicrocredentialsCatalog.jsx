// ignitoverse: Clean Enterprise Microcredentials Catalog Page (Clean Background & Homepage Card UI)
import React, { useState, useMemo } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import { microcredentialsData } from '../../data/microcredentials';
import CourseCard from './CourseCard';

// Catalog dataset with enriched card metadata
const catalogCoursesList = [
  ...microcredentialsData,
  {
    id: 'mc-sales-potential',
    title: 'Maximizing Your Sales Potential Tips',
    level: 'Intermediate',
    category: 'Non-Technical',
    domain: 'Business & Sales',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    description: 'Master enterprise B2B deal negotiation, consultative sales pipelines, objection handling, and executive closing strategies.',
    lecturesCount: 14,
    studentsCount: '11,400',
  },
  {
    id: 'mc-web-dev',
    title: 'Web Development Fully Complete Guideline',
    level: 'Beginner',
    category: 'Technical',
    domain: 'Software Engineering',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    description: 'Comprehensive guideline to modern HTML5, CSS3, modern JavaScript ES6+, React architecture, and responsive layouts.',
    lecturesCount: 22,
    studentsCount: '34,200',
  },
  {
    id: 'mc-social-media',
    title: 'Strategic Social Media & Marketing Policy',
    level: 'Expert',
    category: 'Non-Technical',
    domain: 'Marketing & Brand',
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    description: 'Establish enterprise brand authority, compliance guardrails, crisis PR workflows, and data-driven marketing attribution.',
    lecturesCount: 16,
    studentsCount: '8,900',
  },
  {
    id: 'mc-business-everything',
    title: 'Everything You Need to Know About Business',
    level: 'All Levels',
    category: 'Non-Technical',
    domain: 'Business & Management',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    description: 'Fundamental cross-functional enterprise literacy covering P&L finance, operational efficiency, HR strategy, and agile delivery.',
    lecturesCount: 18,
    studentsCount: '21,500',
  },
  {
    id: 'mc-data-science',
    title: 'Data Science: Complete Data Science',
    level: 'Beginner',
    category: 'Technical',
    domain: 'Data & AI',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    description: 'End-to-end data science foundations covering exploratory data analysis, statistical modeling, machine learning, and business storytelling.',
    lecturesCount: 26,
    studentsCount: '29,800',
  },
  {
    id: 'mc-sales-admin',
    title: 'Sales Administrator Certification Practice',
    level: 'Intermediate',
    category: 'Non-Technical',
    domain: 'Business & Sales',
    thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80',
    description: 'CRM data hygiene, sales workflow automation, territory forecasting, and proctored certification exam practice scenarios.',
    lecturesCount: 12,
    studentsCount: '7,300',
  },
  {
    id: 'mc-diversity-building',
    title: 'Exploring Diversity Building Learning',
    level: 'Expert',
    category: 'Non-Technical',
    domain: 'Executive Leadership',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    description: 'Strategic DEI framework implementation, unconscious bias mitigation, and psychological safety in multinational engineering teams.',
    lecturesCount: 15,
    studentsCount: '12,600',
  },
  {
    id: 'mc-spanish-language',
    title: 'Spanish Language: Beginner to Fluent',
    level: 'All Levels',
    category: 'Non-Technical',
    domain: 'Language & Culture',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    description: 'Corporate Spanish communication for global teams, international business vocabulary, and cultural etiquette.',
    lecturesCount: 20,
    studentsCount: '15,100',
  }
];

export default function MicrocredentialsCatalog({ 
  onViewDetails = () => {}, 
  onPreviewVideo = () => {},
  initialCategory = 'All'
}) {
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categoriesList = useMemo(() => {
    const categoriesSet = new Set();
    categoriesSet.add('All');
    categoriesSet.add('Technical');
    categoriesSet.add('Non-Technical');
    catalogCoursesList.forEach(course => {
      if (course.domain) categoriesSet.add(course.domain);
    });
    return Array.from(categoriesSet);
  }, []);

  const filteredCourses = useMemo(() => {
    return catalogCoursesList.filter((course) => {
      const matchesLevel = 
        selectedLevel === 'All' ||
        (selectedLevel === 'Beginner' && (course.level?.toLowerCase().includes('beginner') || course.level === 'All' || course.level === 'All Levels')) ||
        (selectedLevel === 'Intermediate' && course.level?.toLowerCase().includes('intermediate')) ||
        (selectedLevel === 'Expert' && (course.level?.toLowerCase().includes('expert') || course.level?.toLowerCase().includes('advanced'))) ||
        (selectedLevel === 'All Levels' && (course.level === 'All' || course.level === 'All Levels'));

      const matchesCategory = 
        selectedCategory === 'All' || 
        course.category === selectedCategory || 
        course.domain === selectedCategory;

      return matchesLevel && matchesCategory;
    });
  }, [selectedLevel, selectedCategory]);

  return (
    <div className="catalog-page-container">
      <div className="catalog-clean-container">
        {/* Section Header */}
        <div className="section-header-center">
          <h1 className="section-main-title">
            Explore Certified <span className="b2b-blue-text">Microcredentials</span>
          </h1>

          <p className="section-subtitle">
            Industry-aligned technical architectures and professional leadership masterclasses with proctored MCQ benchmarking.
          </p>
        </div>

        {/* Clean 2-Filter Bar (Skill Level & Category) */}
        <div className="catalog-two-filters-bar">
          {/* Filter 1: Skill Level */}
          <div className="catalog-filter-select-wrapper">
            <label className="filter-select-label">Skill Level</label>
            <div className="custom-select-box">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                aria-label="Filter by Skill Level"
              >
                <option value="All">All Skill Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert / Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
              <ChevronDown size={16} className="select-chevron-icon" />
            </div>
          </div>

          {/* Filter 2: Category */}
          <div className="catalog-filter-select-wrapper">
            <label className="filter-select-label">Category</label>
            <div className="custom-select-box">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by Category"
              >
                <option value="All">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Non-Technical">Non-Technical</option>
                {categoriesList
                  .filter(cat => !['All', 'Technical', 'Non-Technical'].includes(cat))
                  .map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                }
              </select>
              <ChevronDown size={16} className="select-chevron-icon" />
            </div>
          </div>
        </div>

        {/* 4-Column Course Cards Grid (Exact Homepage Card UI & Grid) */}
        {filteredCourses.length > 0 ? (
          <div className="featured-courses-grid catalog-courses-clean-grid">
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
            <h3>No courses found for selected filters</h3>
            <p>Try selecting a different skill level or category.</p>
            <button 
              type="button" 
              className="btn-reset-empty"
              onClick={() => {
                setSelectedLevel('All');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
