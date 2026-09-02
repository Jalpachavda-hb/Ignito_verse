// ignitoverse: Executive Enterprise Interactive Login Page
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, TrendingUp, GraduationCap, Mail, Lock, 
  ArrowRight, Eye, EyeOff, BookOpen, ArrowLeft, Check, CheckCircle2,
  LockKeyhole, Sparkles
} from 'lucide-react';
import logoImg from '../../assets/Ignitoverse Logo.png';
import loginMainImg from '../../assets/home/login_main.png';
import loginBadgeImg from '../../assets/login_page.png';

export default function LoginPage({ 
  onLoginSuccess = () => {}, 
  onNavigateHome = () => {} 
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Interaction & Focus States
  const [focusedField, setFocusedField] = useState(null); // 'email' | 'password' | null
  const [authStage, setAuthStage] = useState('idle'); // 'idle' | 'verifying' | 'granted'
  
  // Validation
  const isEmailValid = email.length > 3 && email.includes('@') && email.includes('.');

  // Canvas & Background Particle Mesh
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate Elegant Light Particles
    const particleCount = Math.min(Math.max(Math.floor((width * height) / 9500), 80), 130);
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 0.9 + 1.4, // Delicate 1.4px to 2.3px dots
        color: i % 3 === 0 ? 'rgba(56, 189, 248, ' : i % 3 === 1 ? 'rgba(96, 165, 250, ' : 'rgba(125, 211, 252, '
      });
    }

    let mouse = { x: -1000, y: -1000, radius: 200 };

    const handleCanvasMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleCanvasMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleCanvasMouseMove);
    window.addEventListener('mouseleave', handleCanvasMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Smooth wrap/bounce boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw soft, light particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.65)';
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.25)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow for lines

        // Connect nearby particles with subtle light lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.24;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.95;
            ctx.stroke();
          }
        }

        // Connect particles to mouse cursor with soft light glow
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.radius) {
          const malpha = (1 - mdist / mouse.radius) * 0.42;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${malpha})`;
          ctx.lineWidth = 1.15;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleCanvasMouseMove);
      window.removeEventListener('mouseleave', handleCanvasMouseLeave);
    };
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (authStage !== 'idle') return;

    // Stage 1: Verifying credentials
    setAuthStage('verifying');

    setTimeout(() => {
      // Stage 2: Access Granted
      setAuthStage('granted');

      setTimeout(() => {
        onLoginSuccess({
          name: email ? email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Saurabh Mukherjee',
          email: email || 'saurabh.mukherjee@enterprise.com',
          role: 'Senior Java Architect',
          company: 'Enterprise Learning Cohort',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          empId: 'EMP-94021'
        });
      }, 700);
    }, 1100);
  };

  return (
    <div className="executive-login-wrapper">
      {/* Background Interactive Canvas Particle Layer */}
      <canvas ref={canvasRef} className="executive-canvas-layer" />

      {/* Top Floating Back Button with Animated Arrow */}
      <div className="login-floating-top-bar">
        <button 
          type="button" 
          className="executive-back-btn" 
          onClick={onNavigateHome}
          aria-label="Back to Home"
        >
          <ArrowLeft size={16} className="back-arrow-icon" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Centered Dual-Panel Box */}
      <div className={`executive-container-box ${authStage === 'granted' ? 'box-auth-granted' : ''}`}>
        
        {/* LEFT PANEL: Deep Navy Brand & Dynamic Security Shield */}
        <div className={`executive-box-left ${focusedField === 'password' ? 'shield-mode-active' : ''} ${authStage === 'granted' ? 'shield-mode-granted' : ''}`}>
          <div className="executive-box-glow" aria-hidden="true" />
          
          {/* Top-Right Molecular Lattice Pattern */}
          <div className="executive-network-pattern" aria-hidden="true">
            <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="network-svg">
              <path d="M220 20 L270 50 L270 110 L220 140 L170 110 L170 50 Z" stroke="#24B7F5" strokeWidth="1.2" strokeOpacity="0.25" />
              <path d="M270 50 L310 75 L310 135 L270 160 L220 140" stroke="#24B7F5" strokeWidth="1.2" strokeOpacity="0.2" />
              <path d="M170 110 L120 140 L120 200 L170 230 L220 200 L220 140" stroke="#24B7F5" strokeWidth="1.2" strokeOpacity="0.22" />
              
              <line x1="220" y1="20" x2="250" y2="5" stroke="#24B7F5" strokeWidth="1.2" strokeOpacity="0.18" />
              <line x1="170" y1="50" x2="130" y2="30" stroke="#24B7F5" strokeWidth="1.2" strokeOpacity="0.18" />
              
              <circle cx="220" cy="20" r="4.5" fill="#24B7F5" fillOpacity="0.6" />
              <circle cx="270" cy="50" r="5" fill="#24B7F5" fillOpacity="0.75" />
              <circle cx="270" cy="110" r="4.5" fill="#24B7F5" fillOpacity="0.6" />
              <circle cx="220" cy="140" r="6" fill="#1769FF" fillOpacity="0.85" />
              <circle cx="170" cy="110" r="5" fill="#24B7F5" fillOpacity="0.7" />
              <circle cx="170" cy="50" r="4" fill="#24B7F5" fillOpacity="0.5" />
              <circle cx="120" cy="140" r="5" fill="#24B7F5" fillOpacity="0.65" />
            </svg>
          </div>

          <div className="executive-left-content">
            {/* Top Brand Lockup */}
            <div className="executive-brand-row">
              <div className="executive-brand-emblem">
                <BookOpen size={17} />
              </div>
              <div className="executive-brand-text">
                <div className="executive-brand-title">
                  <span>Ignito</span><span className="cyan-highlight">Verse</span>
                </div>
                <span className="executive-brand-sub">Enterprise Learning Platform</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="executive-headline-area">
              <h1 className="executive-main-title">
                Enterprise Learning.
                <span className="executive-cyan-gradient">Measurable Impact.</span>
              </h1>
              <p className="executive-desc">
                Ignitoverse empowers organizations to build future-ready teams with verified microcredentials and measurable learning outcomes.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="executive-features-stack">
              <div className="executive-feature-card">
                <div className="feature-card-icon">
                  <ShieldCheck size={18} />
                </div>
                <div className="feature-card-info">
                  <h4>Trusted & Secure</h4>
                  <p>Enterprise-grade security with SOC 2 Type II compliance.</p>
                </div>
              </div>

              <div className="executive-feature-card">
                <div className="feature-card-icon">
                  <TrendingUp size={18} />
                </div>
                <div className="feature-card-info">
                  <h4>Measurable Outcomes</h4>
                  <p>Track progress, verify skills, and drive real business impact.</p>
                </div>
              </div>

              <div className="executive-feature-card">
                <div className="feature-card-icon">
                  <GraduationCap size={18} />
                </div>
                <div className="feature-card-info">
                  <h4>Industry-Aligned Learning</h4>
                  <p>Role-aligned learning paths backed by industry experts.</p>
                </div>
              </div>
            </div>

            {/* Interactive 3D Security Shield Platform */}
            <div className="executive-shield-stage">
              <div className="shield-ambient-pulse" aria-hidden="true" />
              <img 
                src={loginMainImg} 
                alt="Enterprise Security Shield" 
                className="executive-shield-illustration" 
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Executive White Form Panel */}
        <div className="executive-box-right">
          <div className="executive-form-container">
            
            {/* Header Badge Image */}
            <div className="executive-card-shield-badge">
              <img 
                src={loginBadgeImg} 
                alt="Security Shield Emblem" 
                className="login-card-badge-img" 
              />
            </div>

            {/* Title & Tagline */}
            <h2 className="executive-card-heading">Welcome Back</h2>
            <p className="executive-card-subheading">Access your IgnitoVerse account</p>

            {/* Form */}
            <form className="executive-login-form" onSubmit={handleSubmit}>
              
              {/* Email Address */}
              <div className="executive-field-group">
                <label htmlFor="exec-email" className="executive-label">
                  Email
                </label>
                <div className={`executive-input-wrapper ${focusedField === 'email' ? 'field-focused' : ''}`}>
                  <input
                    type="email"
                    id="exec-email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="email"
                    className="executive-input"
                  />
                  <div className="input-trailing-icon">
                    {isEmailValid ? (
                      <CheckCircle2 size={17} className="valid-email-check" />
                    ) : (
                      <Mail size={17} className="default-input-icon" />
                    )}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="executive-field-group">
                <div className="password-header-row">
                  <label htmlFor="exec-pwd" className="executive-label">
                    Password
                  </label>
                  <a 
                    href="#forgot" 
                    className="executive-forgot-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className={`executive-input-wrapper ${focusedField === 'password' ? 'field-focused' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="exec-pwd"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="current-password"
                    className="executive-input"
                  />
                  <button
                    type="button"
                    className="input-eye-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="executive-remember-row">
                <label className="executive-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="exec-native-chk"
                  />
                  <span className="exec-chk-box">
                    {rememberMe && <Check size={12} strokeWidth={3.5} />}
                  </span>
                  <span className="exec-chk-text">Remember this device</span>
                </label>
              </div>

              {/* Multi-Stage Dynamic Sign In CTA */}
              <button 
                type="submit" 
                className={`executive-cta-button ${authStage}`}
                disabled={authStage !== 'idle'}
              >
                {authStage === 'idle' && (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={17} className="cta-arrow-icon" />
                  </>
                )}
                {authStage === 'verifying' && (
                  <>
                    <span className="spinner-dot" />
                    <span>Verifying credentials...</span>
                  </>
                )}
                {authStage === 'granted' && (
                  <>
                    <Check size={18} strokeWidth={3} className="granted-check" />
                    <span>Access Granted</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
