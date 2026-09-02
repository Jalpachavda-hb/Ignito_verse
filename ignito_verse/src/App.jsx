// ignitoverse: Enterprise Microcredential Platform Master Application Router
import React, { useState, useEffect } from 'react';
import Navbar from './component/navbar/Navbar';
import Footer from './component/footer/Footer';
import HomePage from './component/Homepage/HomePage';
import MicrocredentialsCatalog from './component/Microcredentials/MicrocredentialsCatalog';
import MicrocredentialDetail from './component/Microcredentials/MicrocredentialDetail';
import MicrocredentialWatchPage from './component/Microcredentials/MicrocredentialWatchPage';
import ProfilePage from './component/Profile/ProfilePage';
import LoginPage from './component/Auth/LoginPage';
import BookDemoModal from './component/modals/BookDemoModal';
import VideoModal from './component/modals/VideoModal';
import { microcredentialsData } from './data/microcredentials';
import { getSavedUserSession, logoutUser } from './services/authService';
import './Global.css';

export default function App() {
  // Authentication state: loaded from persistent session storage
  const [user, setUser] = useState(() => getSavedUserSession());

  // Navigation state: 'home' | 'microcredentials' | 'detail' | 'profile' | 'login'
  const [activePage, setActivePage] = useState('home');
  const [profileTab, setProfileTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(microcredentialsData[0]);
  const [catalogCategory, setCatalogCategory] = useState('All');

  // Modals state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    lectureTitle: '',
    courseTitle: '',
    duration: '',
    videoUrl: ''
  });

  // Handle URL Hash navigation
  useEffect(() => {
    const handleHash = () => {
      const fullHash = window.location.hash.replace('#', '');
      const [page, sub] = fullHash.split('/');

      if (['home', 'microcredentials', 'login'].includes(page)) {
        setActivePage(page);
      } else if (page === 'profile') {
        if (user) {
          setActivePage('profile');
          if (sub) setProfileTab(sub);
        } else {
          setActivePage('login');
        }
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [user]);

  const handleNavigate = (pageId, subTab = 'dashboard') => {
    if (pageId === 'profile') {
      if (!user) {
        setActivePage('login');
        window.location.hash = 'login';
        return;
      }
      setActivePage('profile');
      setProfileTab(subTab);
      window.location.hash = `profile/${subTab}`;
    } else {
      setActivePage(pageId);
      window.location.hash = pageId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActivePage('home');
    window.location.hash = 'home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setActivePage('home');
    window.location.hash = 'home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCourseDetails = (course) => {
    setSelectedCourse(course);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHome = (cat) => {
    setCatalogCategory(cat);
    setActivePage('microcredentials');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVideoPreview = (videoPayload) => {
    if (videoPayload.thumbnail && !videoPayload.lectureTitle) {
      setVideoModal({
        isOpen: true,
        lectureTitle: videoPayload.modules?.[0]?.lectures?.[0]?.title || `${videoPayload.title} - Module 1`,
        courseTitle: videoPayload.title,
        duration: videoPayload.modules?.[0]?.lectures?.[0]?.duration || '15 mins',
        videoUrl: videoPayload.modules?.[0]?.lectures?.[0]?.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'
      });
    } else {
      setVideoModal({
        isOpen: true,
        lectureTitle: videoPayload.lectureTitle,
        courseTitle: videoPayload.courseTitle,
        duration: videoPayload.duration,
        videoUrl: videoPayload.videoUrl
      });
    }
  };

  const handleCloseVideo = () => {
    setVideoModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="ignito-app">
      {/* 1. Top Navbar (Hidden on dedicated Login page for maximum focus) */}
      {activePage !== 'login' && (
        <Navbar 
          activePage={activePage === 'detail' ? 'microcredentials' : activePage}
          user={user}
          onNavigate={handleNavigate}
          onLogin={() => handleNavigate('login')}
          onLogout={handleLogout}
        />
      )}

      {/* Main Page View Switcher */}
      <main className="main-content-flow">
        {activePage === 'home' && (
          <HomePage 
            onBookDemo={() => setIsDemoModalOpen(true)}
            onExploreCatalog={() => handleNavigate('microcredentials')}
            onViewDetails={handleViewCourseDetails}
            onSelectCategory={handleSelectCategoryFromHome}
            onPreviewVideo={handleOpenVideoPreview}
            onContact={() => handleNavigate('microcredentials')}
          />
        )}

        {activePage === 'microcredentials' && (
          <MicrocredentialsCatalog 
            initialCategory={catalogCategory}
            onViewDetails={handleViewCourseDetails}
            onPreviewVideo={handleOpenVideoPreview}
          />
        )}

        {activePage === 'detail' && (
          <MicrocredentialDetail 
            course={selectedCourse}
            onBack={() => handleNavigate('microcredentials')}
            onBookDemo={() => setIsDemoModalOpen(true)}
            onPreviewVideo={handleOpenVideoPreview}
            onWatchCourse={() => handleNavigate('watch')}
          />
        )}

        {activePage === 'watch' && (
          <MicrocredentialWatchPage 
            course={selectedCourse}
            onBack={() => handleNavigate('detail')}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'profile' && user && (
          <ProfilePage 
            user={user}
            initialTab={profileTab}
            onExploreCatalog={() => handleNavigate('microcredentials')}
            onViewCourse={handleViewCourseDetails}
          />
        )}

        {activePage === 'login' && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Footer (Hidden on dedicated Login page) */}
      {activePage !== 'login' && (
        <Footer 
          onNavigate={handleNavigate}
          onBookDemo={() => setIsDemoModalOpen(true)}
        />
      )}

      {/* Interactive Modals */}
      <BookDemoModal 
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      <VideoModal 
        isOpen={videoModal.isOpen}
        onClose={handleCloseVideo}
        lectureTitle={videoModal.lectureTitle}
        courseTitle={videoModal.courseTitle}
        duration={videoModal.duration}
        videoUrl={videoModal.videoUrl}
      />
    </div>
  );
}
