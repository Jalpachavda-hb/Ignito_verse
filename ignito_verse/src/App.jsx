// ignitoverse: Enterprise Microcredential Platform Master Application Router
import React, { useState, useEffect } from 'react';
import Navbar from './component/navbar/Navbar';
import Footer from './component/footer/Footer';
import HomePage from './component/Homepage/HomePage';
import MicrocredentialsCatalog from './component/Microcredentials/MicrocredentialsCatalog';
import MicrocredentialDetail from './component/Microcredentials/MicrocredentialDetail';
import MicrocredentialWatchPage from './component/Microcredentials/MicrocredentialWatchPage';
import QuizPage from './component/Quiz/QuizPage';
import ProfilePage from './component/Profile/ProfilePage';
import LoginPage from './component/Auth/LoginPage';
import VideoModal from './component/modals/VideoModal';
import AuthRequiredModal from './component/modals/AuthRequiredModal';
import { microcredentialsData } from './data/microcredentials';
import { getSavedUserSession, logoutUser } from './services/authService';
import { getLoggedInStudentId } from './services/microcredentialService';
import './Global.css';

/**
 * Parses current URL pathname or legacy hash into route and parameters
 */
function parseCurrentRoute() {
  // Check pathname first (e.g. /microcredentials, /microcredentials/1, /watch/1, /profile/certificates)
  let path = window.location.pathname.replace(/^\/+/, '');
  
  // If user entered via legacy hash (e.g. #microcredentials, /#microcredentials, or #), sanitize and migrate to clean path
  if (window.location.hash) {
    const legacyHash = window.location.hash.replace(/^#\/?/, '');
    if (legacyHash) {
      path = legacyHash;
      window.history.replaceState({}, '', `/${legacyHash}`);
    } else {
      window.history.replaceState({}, '', window.location.pathname || '/');
    }
  }

  const routeStr = path || 'home';
  const parts = routeStr.split('/');
  const rawPage = parts[0] || 'home';
  const rawParam = parts.slice(1).join('/') || '';
  let param = rawParam;
  try {
    param = decodeURIComponent(rawParam);
  } catch (e) {
    param = rawParam;
  }

  if (rawPage === 'microcredentials' && param) {
    return { page: 'detail', param };
  }
  if (rawPage === 'detail') {
    return { page: 'detail', param };
  }
  if (rawPage === 'watch') {
    return { page: 'watch', param };
  }
  if (rawPage === 'quiz') {
    return { page: 'quiz', param };
  }
  if (rawPage === 'profile') {
    return { page: 'profile', param: param || 'dashboard' };
  }
  if (rawPage === 'microcredentials') {
    return { page: 'microcredentials', param: '' };
  }
  if (rawPage === 'login') {
    return { page: 'login', param: '' };
  }
  return { page: 'home', param: '' };
}

/**
 * Resolves course data from ID (numeric or encrypted string) or sessionStorage
 */
function resolveSelectedCourse(courseId) {
  if (!courseId) {
    try {
      const stored = sessionStorage.getItem('ignito_selected_course');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  }

  const cleanId = String(courseId).trim();
  const numId = Number(cleanId);

  // 1. Try matching from static catalog data
  if (!isNaN(numId) && numId > 0) {
    const found = microcredentialsData.find(c => Number(c.microcredentialCourseId) === numId || Number(c.id) === numId);
    if (found) return found;
  }

  const foundByEnc = microcredentialsData.find(c => 
    String(c.encryptedMicrocredentialCourseId || '').trim() === cleanId || 
    String(c.id || '').trim() === cleanId
  );
  if (foundByEnc) return foundByEnc;

  // 2. Try restoring cached dynamic course from sessionStorage
  try {
    const stored = sessionStorage.getItem('ignito_selected_course');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (
        String(parsed.id || '').trim() === cleanId || 
        String(parsed.microcredentialCourseId || '').trim() === cleanId || 
        String(parsed.encryptedMicrocredentialCourseId || '').trim() === cleanId
      ) {
        return parsed;
      }
    }
  } catch (e) {}

  // 3. Return descriptor object with exact courseId for dynamic validation
  return {
    id: cleanId,
    microcredentialCourseId: (!isNaN(numId) && numId > 0) ? numId : 0,
    encryptedMicrocredentialCourseId: cleanId,
    isPendingValidation: true
  };
}

export default function App() {
  // Authentication state
  const [user, setUser] = useState(() => getSavedUserSession());

  // Initialize navigation state immediately from the current URL on first load / refresh (clean paths without #)
  const initialRoute = parseCurrentRoute();
  const [activePage, setActivePage] = useState(initialRoute.page);
  const [profileTab, setProfileTab] = useState(initialRoute.page === 'profile' ? (initialRoute.param || 'dashboard') : 'dashboard');
  const [selectedCourse, setSelectedCourse] = useState(() => resolveSelectedCourse(initialRoute.param));
  const [catalogCategory, setCatalogCategory] = useState('All');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authCourseTitle, setAuthCourseTitle] = useState('');
  const [pendingWatchCourse, setPendingWatchCourse] = useState(null);
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    lectureTitle: '',
    courseTitle: '',
    duration: '',
    videoUrl: ''
  });

  // Synchronize route and handle browser Back/Forward & URL changes across page refreshes
  useEffect(() => {
    const syncRouteFromUrl = () => {
      const { page, param } = parseCurrentRoute();
      setActivePage(page);

      if (page === 'profile') {
        setProfileTab(param || 'dashboard');
      } else if (page === 'detail' || page === 'watch' || page === 'quiz') {
        if (param) {
          const resolved = resolveSelectedCourse(param);
          setSelectedCourse(resolved);
        }
        if (page === 'watch') {
          const currentUser = user || getSavedUserSession();
          const currentStudentId = getLoggedInStudentId();
          if (!currentUser && (!currentStudentId || currentStudentId <= 0)) {
            setActivePage('detail');
            setAuthCourseTitle(selectedCourse?.title || selectedCourse?.microcredentialCourseName || '');
            setIsAuthModalOpen(true);
          }
        }
      }
    };

    // Run on mount
    syncRouteFromUrl();

    window.addEventListener('popstate', syncRouteFromUrl);
    window.addEventListener('hashchange', syncRouteFromUrl);
    return () => {
      window.removeEventListener('popstate', syncRouteFromUrl);
      window.removeEventListener('hashchange', syncRouteFromUrl);
    };
  }, [user]);

  const handleNavigate = (pageId, subParam = '') => {
    let targetPath = `/${pageId}`;

    if (pageId === 'home') {
      targetPath = '/';
    } else if (pageId === 'profile') {
      const tab = subParam || 'dashboard';
      setProfileTab(tab);
      targetPath = `/profile/${tab}`;
    } else if (pageId === 'detail') {
      const courseId = subParam?.microcredentialCourseId || subParam?.encryptedMicrocredentialCourseId || subParam?.id || (typeof subParam === 'string' ? subParam : '') || selectedCourse?.microcredentialCourseId || selectedCourse?.encryptedMicrocredentialCourseId || selectedCourse?.id || '';
      targetPath = courseId ? `/microcredentials/${courseId}` : '/microcredentials';
    } else if (pageId === 'watch') {
      const courseId = subParam?.microcredentialCourseId || subParam?.encryptedMicrocredentialCourseId || subParam?.id || (typeof subParam === 'string' ? subParam : '') || selectedCourse?.microcredentialCourseId || selectedCourse?.encryptedMicrocredentialCourseId || selectedCourse?.id || '';
      targetPath = courseId ? `/watch/${courseId}` : '/microcredentials';
    } else if (pageId === 'quiz') {
      const courseId = subParam?.microcredentialCourseId || subParam?.encryptedMicrocredentialCourseId || subParam?.id || (typeof subParam === 'string' ? subParam : '') || selectedCourse?.microcredentialCourseId || selectedCourse?.encryptedMicrocredentialCourseId || selectedCourse?.id || '';
      targetPath = courseId ? `/quiz/${courseId}` : '/quiz';
    }

    window.history.pushState({}, '', targetPath);
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToLogin = () => {
    setIsAuthModalOpen(false);
    handleNavigate('login');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (pendingWatchCourse) {
      const courseObj = pendingWatchCourse;
      setPendingWatchCourse(null);
      const courseId = courseObj?.microcredentialCourseId || courseObj?.encryptedMicrocredentialCourseId || courseObj?.id || '';
      window.history.pushState({}, '', courseId ? `/watch/${courseId}` : '/microcredentials');
      setActivePage('watch');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActivePage('home');
      window.history.pushState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setActivePage('home');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCourseDetails = (course) => {
    const courseObj = course || selectedCourse;
    setSelectedCourse(courseObj);
    try {
      sessionStorage.setItem('ignito_selected_course', JSON.stringify(courseObj));
    } catch (e) {}

    const courseId = courseObj?.microcredentialCourseId || courseObj?.encryptedMicrocredentialCourseId || courseObj?.id || '';
    window.history.pushState({}, '', courseId ? `/microcredentials/${courseId}` : '/microcredentials');
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWatchCourse = (course) => {
    const courseObj = course || selectedCourse;
    setSelectedCourse(courseObj);
    try {
      sessionStorage.setItem('ignito_selected_course', JSON.stringify(courseObj));
    } catch (e) {}

    // Check if user/student is logged in
    const currentUser = user || getSavedUserSession();
    const currentStudentId = getLoggedInStudentId();
    if (!currentUser && (!currentStudentId || currentStudentId <= 0)) {
      setAuthCourseTitle(courseObj?.title || courseObj?.microcredentialCourseName || '');
      setPendingWatchCourse(courseObj);
      setIsAuthModalOpen(true);
      return;
    }

    const courseId = courseObj?.microcredentialCourseId || courseObj?.encryptedMicrocredentialCourseId || courseObj?.id || '';
    window.history.pushState({}, '', courseId ? `/watch/${courseId}` : '/microcredentials');
    setActivePage('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHome = (cat) => {
    setCatalogCategory(cat);
    handleNavigate('microcredentials');
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
      {/* 1. Top Navbar */}
      {activePage !== 'login' && (
        <Navbar 
          activePage={activePage === 'detail' || activePage === 'watch' || activePage === 'quiz' ? 'microcredentials' : activePage}
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
            onPreviewVideo={handleOpenVideoPreview}
            onWatchCourse={handleWatchCourse}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'watch' && (
          <MicrocredentialWatchPage 
            course={selectedCourse}
            onBack={() => handleViewCourseDetails(selectedCourse)}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'quiz' && (
          <QuizPage 
            course={selectedCourse}
            onBack={() => handleNavigate(selectedCourse ? 'watch' : 'microcredentials', selectedCourse)}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage 
            user={user}
            initialTab={profileTab}
            onExploreCatalog={() => handleNavigate('microcredentials')}
            onViewCourse={handleWatchCourse}
          />
        )}

        {activePage === 'login' && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Footer */}
      {activePage !== 'login' && (
        <Footer 
          onNavigate={handleNavigate}
        />
      )}

      {/* Interactive Modals */}
      <VideoModal 
        isOpen={videoModal.isOpen}
        onClose={handleCloseVideo}
        lectureTitle={videoModal.lectureTitle}
        courseTitle={videoModal.courseTitle}
        duration={videoModal.duration}
        videoUrl={videoModal.videoUrl}
      />

      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleProceedToLogin}
        courseTitle={authCourseTitle}
      />
    </div>
  );
}

