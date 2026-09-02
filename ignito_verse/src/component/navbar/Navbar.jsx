// ignitoverse: Simplified Clean Navbar (Home, Microcredentials & Profile / Log In)
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, LogIn, ChevronDown, User, LayoutDashboard, 
  Award, ShieldCheck, Settings, LogOut 
} from 'lucide-react';
import logoImg from '../../assets/Ignitoverse Logo.png';
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

  const handleLinkClick = (pageId, e) => {
    e.preventDefault();
    onNavigate(pageId);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileSubNav = (tabId, e) => {
    e.preventDefault();
    onNavigate('profile', tabId);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`full-navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="full-navbar-layout">
        {/* Brand Logo */}
        <div className="navbar-brand-section">
          <a 
            href="#home" 
            className="navbar-logo-link" 
            onClick={(e) => handleLinkClick('home', e)}
            aria-label="Ignitoverse Home"
          >
            {logoImg ? (
              <img src={logoImg} alt="Ignitoverse Enterprise Learning" className="navbar-brand-img" />
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
                  href={`#${item.id}`}
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
                    src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'} 
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
                      href="#profile/dashboard" 
                      className="dropdown-item"
                      onClick={(e) => handleProfileSubNav('dashboard', e)}
                    >
                      <LayoutDashboard size={16} className="dropdown-icon" />
                      <span>My Dashboard</span>
                    </a>

                    <a 
                      href="#profile/certificates" 
                      className="dropdown-item"
                      onClick={(e) => handleProfileSubNav('certificates', e)}
                    >
                      <Award size={16} className="dropdown-icon" />
                      <span>My Certificates</span>
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
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`navbar-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-inner">
          <ul className="mobile-drawer-links">
            {navItems.map((item) => (
              <li key={item.id} className="mobile-nav-li">
                <a
                  href={`#${item.id}`}
                  className={`mobile-drawer-link ${activePage === item.id ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(item.id, e)}
                >
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mobile-blue-card">
            {user ? (
              <div className="mobile-user-profile-actions">
                <button
                  type="button"
                  className="mobile-btn-login"
                  onClick={(e) => handleProfileSubNav('dashboard', e)}
                >
                  <User size={16} />
                  <span>My Profile & Dashboard</span>
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
    </header>
  );
}
