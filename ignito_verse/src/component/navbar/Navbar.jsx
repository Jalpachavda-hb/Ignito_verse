// ignitoverse: Simplified Clean Navbar (Home, Microcredentials & Profile / Log In)
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Menu, X, LogIn, ChevronDown, User, 
  LogOut, Calendar 
} from 'lucide-react';
import logoImg from '../../assets/newlg.png';
import './navbar.css';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'microcredentials', label: 'Microcredentials' }
];

export default function Navbar({
  activePage = 'home',
  user = null,
  onNavigate = () => {},
  onLogin = () => {},
  onLogout = () => {}
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (pageId, e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileSubNav = (tabId, e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    onNavigate('profile', tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const drawerElement = (
    <>
      {/* Backdrop Overlay for Right-Side Mobile Drawer */}
      <div 
        className={`navbar-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Right-Side Slide Mobile Drawer */}
      <div 
        className={`navbar-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Drawer Header: Logo + Close Button */}
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-logo">
            {logoImg ? (
              <img src={logoImg} alt="IgnitoCaptiq" className="mobile-drawer-brand-img" />
            ) : (
              <div className="brand-fallback-text">
                <span className="brand-title">IGNITO</span>
                <span className="brand-sub">VERSE</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="mobile-drawer-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="mobile-drawer-inner">
          <ul className="mobile-drawer-links">
            {navItems.map((item) => (
              <li key={item.id} className="mobile-nav-li">
                <a
                  href={item.id === 'home' ? '/' : `/${item.id}`}
                  className={`mobile-drawer-link ${activePage === item.id ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(item.id, e)}
                >
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Blue Card with Profile & Logout or Login */}
          <div className="mobile-blue-card">
            {user ? (
              <div className="mobile-user-profile-actions">
                <button
                  type="button"
                  className="mobile-btn-profile"
                  onClick={(e) => handleProfileSubNav('dashboard', e)}
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button
                  type="button"
                  className="mobile-btn-logout"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="mobile-btn-login"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogin();
                }}
              >
                <LogIn size={16} />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <header className={`full-navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="full-navbar-layout">
        {/* Brand Logo */}
        <div className="navbar-brand-section">
          <a 
            href="/" 
            className="navbar-logo-link" 
            onClick={(e) => handleLinkClick('home', e)}
            aria-label="Ignitoverse Home"
          >
            {logoImg ? (
              <img src={logoImg} alt="IgnitoCaptiq" className="navbar-brand-img" />
            ) : (
              <div className="brand-fallback-text">
                <span className="brand-title">IGNITO</span>
                <span className="brand-sub">VERSE</span>
              </div>
            )}
          </a>
        </div>

        {/* Center: Minimal 2 Links Navigation */}
        <nav className="navbar-navigation" aria-label="Main Navigation">
          <ul className="navbar-menu-items">
            {navItems.map((item) => (
              <li key={item.id} className="menu-item-wrapper">
                <a
                  href={item.id === 'home' ? '/' : `/${item.id}`}
                  className={`menu-item-link ${activePage === item.id ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(item.id, e)}
                >
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Action: Log In Button OR Profile Dropdown */}
        <div className="navbar-blue-accent-section">
          <div className="blue-section-actions">
            {user ? (
              /* Logged In: Profile ▾ Dropdown */
              <div className="profile-dropdown-container" ref={dropdownRef}>
                <button
                  type="button"
                  className="navbar-profile-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  aria-expanded={profileDropdownOpen}
                >
                  <img 
                    src={'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'} 
                    alt={user.name} 
                    className="navbar-user-avatar" 
                  />
                  <span className="navbar-user-name">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={15} className={`profile-chevron ${profileDropdownOpen ? 'open' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <div className="dropdown-user-header">
                      <p className="dropdown-name">{user.name}</p>
                      <span className="dropdown-email">{user.email}</span>
                    </div>

                    <div className="dropdown-divider" />

                    <a 
                      href="/profile" 
                      className="dropdown-item"
                      onClick={(e) => handleProfileSubNav('dashboard', e)}
                    >
                      <User size={16} className="dropdown-icon" />
                      <span>Profile</span>
                    </a>

                    <a 
                      href="/profile" 
                      className="dropdown-item"
                      onClick={(e) => handleProfileSubNav('calendar', e)}
                    >
                      <Calendar size={16} className="dropdown-icon" />
                      <span>Calendar</span>
                    </a>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="dropdown-item logout-item"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                    >
                      <LogOut size={16} className="dropdown-icon text-red" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Not Logged In: Log In Button */
              <button
                type="button"
                className="action-btn-login"
                onClick={onLogin}
              >
                <LogIn size={15} className="login-icon-svg" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(true)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Render Drawer via React Portal directly into body */}
      {typeof document !== 'undefined' ? createPortal(drawerElement, document.body) : null}
    </header>
  );
}
