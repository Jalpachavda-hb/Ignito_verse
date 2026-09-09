// ignitoverse: Executive Enterprise Interactive Login Page with OTP Authentication
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, TrendingUp, GraduationCap, Mail, Phone, 
  ArrowRight, BookOpen, ArrowLeft, Check, CheckCircle2,
  LockKeyhole, Sparkles, RefreshCw
} from 'lucide-react';
import logoImg from '../../assets/Ignitoverse Logo.png';
import loginMainImg from '../../assets/home/login_main.png';
import loginBadgeImg from '../../assets/login_page.png';
import { sendStudentLoginOTP, validateStudentLoginOTP } from '../../services/authService';

export default function LoginPage({ 
  onLoginSuccess = () => {}, 
  onNavigateHome = () => {} 
}) {
  // Login Mode & Step State
  const [step, setStep] = useState('send_otp'); // 'send_otp' | 'verify_otp'
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [otp, setOtp] = useState('');
  
  // OTP Session Details from Backend
  const [studentId, setStudentId] = useState(0);
  const [otpId, setOtpId] = useState(0);
  
  // Interaction & Focus States
  const [focusedField, setFocusedField] = useState(null); // 'identifier' | 'otp' | null
  const [authStage, setAuthStage] = useState('idle'); // 'idle' | 'verifying' | 'granted'
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Validation
  const isEmail = emailOrMobile.includes('@');
  const isInputValid = emailOrMobile.trim().length >= 4;
  const isOtpValid = otp.trim().length >= 4;

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

  // Handle Requesting OTP
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (authStage !== 'idle') return;

    setErrorMessage('');
    setSuccessMessage('');
    setAuthStage('verifying');

    try {
      const payload = isEmail 
        ? { email: emailOrMobile.trim(), mobileNumber: '' } 
        : { email: '', mobileNumber: emailOrMobile.trim() };

      const result = await sendStudentLoginOTP(payload);

      if (result.isSuccess || result.success) {
        setStudentId(result.studentId || 0);
        setOtpId(result.otpId || 0);
        setStep('verify_otp');
        setAuthStage('idle');
        setSuccessMessage(result.message || 'OTP sent successfully! Please check your inbox/SMS.');
      } else {
        setAuthStage('idle');
        setErrorMessage(result.message || result.error || 'Failed to send OTP. Please check your Email or Mobile Number.');
      }
    } catch (err) {
      console.error('[LoginPage] Send OTP Exception:', err);
      setAuthStage('idle');
      setErrorMessage(err.message || 'An error occurred while sending OTP.');
    }
  };

  // Handle Validating OTP & Logging In
  const handleValidateOTP = async (e) => {
    if (e) e.preventDefault();
    if (authStage !== 'idle') return;

    setErrorMessage('');
    setSuccessMessage('');
    setAuthStage('verifying');

    try {
      const result = await validateStudentLoginOTP({
        studentId,
        otpId,
        otp: otp.trim()
      });

      if (result.isSuccess || result.success) {
        setAuthStage('granted');
        setTimeout(() => {
          onLoginSuccess(result.user);
        }, 700);
      } else {
        setAuthStage('idle');
        setErrorMessage(result.message || result.error || 'Invalid OTP. Please check and try again.');
      }
    } catch (err) {
      console.error('[LoginPage] Validate OTP Exception:', err);
      setAuthStage('idle');
      setErrorMessage(err.message || 'An error occurred while validating OTP.');
    }
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
        <div className={`executive-box-left ${focusedField === 'otp' ? 'shield-mode-active' : ''} ${authStage === 'granted' ? 'shield-mode-granted' : ''}`}>
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
                Ignitoverse empowers organizations to build future-ready teams with verified microcredentials and passwordless OTP login.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="executive-features-stack">
              <div className="executive-feature-card">
                <div className="feature-card-icon">
                  <ShieldCheck size={18} />
                </div>
                <div className="feature-card-info">
                  <h4>Trusted & Secure OTP</h4>
                  <p>Enterprise-grade passwordless authentication.</p>
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
            <h2 className="executive-card-heading">
              {step === 'send_otp' ? 'Student Login' : 'Enter Verification OTP'}
            </h2>
            <p className="executive-card-subheading">
              {step === 'send_otp' 
                ? 'Sign in via One-Time Password (OTP)' 
                : `We sent a code to ${emailOrMobile}`}
            </p>

            {/* Success Banner */}
            {successMessage && (
              <div 
                style={{
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  color: '#4ade80',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div 
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Send OTP Form */}
            {step === 'send_otp' && (
              <form className="executive-login-form" onSubmit={handleSendOTP}>
                <div className="executive-field-group">
                  <label htmlFor="exec-identifier" className="executive-label">
                    Email or Mobile Number
                  </label>
                  <div className={`executive-input-wrapper ${focusedField === 'identifier' ? 'field-focused' : ''}`}>
                    <input
                      type="text"
                      id="exec-identifier"
                      required
                      placeholder="student@company.com or +1234567890"
                      value={emailOrMobile}
                      onChange={(e) => setEmailOrMobile(e.target.value)}
                      onFocus={() => setFocusedField('identifier')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="username"
                      className="executive-input"
                    />
                    <div className="input-trailing-icon">
                      {isEmail ? (
                        <Mail size={17} className="default-input-icon" />
                      ) : (
                        <Phone size={17} className="default-input-icon" />
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`executive-cta-button ${authStage}`}
                  disabled={authStage !== 'idle' || !isInputValid}
                >
                  {authStage === 'idle' && (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight size={17} className="cta-arrow-icon" />
                    </>
                  )}
                  {authStage === 'verifying' && (
                    <>
                      <span className="spinner-dot" />
                      <span>Sending OTP...</span>
                    </>
                  )}
                  {authStage === 'granted' && (
                    <>
                      <Check size={18} strokeWidth={3} className="granted-check" />
                      <span>OTP Sent</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Validate OTP Form */}
            {step === 'verify_otp' && (
              <form className="executive-login-form" onSubmit={handleValidateOTP}>
                <div className="executive-field-group">
                  <div className="password-header-row">
                    <label htmlFor="exec-otp" className="executive-label">
                      One-Time Password (OTP)
                    </label>
                    <button 
                      type="button" 
                      className="executive-forgot-link"
                      onClick={() => {
                        setStep('send_otp');
                        setOtp('');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      Change Contact
                    </button>
                  </div>
                  <div className={`executive-input-wrapper ${focusedField === 'otp' ? 'field-focused' : ''}`}>
                    <input
                      type="text"
                      id="exec-otp"
                      required
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      onFocus={() => setFocusedField('otp')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="one-time-code"
                      className="executive-input"
                      maxLength={10}
                    />
                    <div className="input-trailing-icon">
                      <LockKeyhole size={17} className="default-input-icon" />
                    </div>
                  </div>
                </div>

                <div className="executive-remember-row" style={{ justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="executive-forgot-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={handleSendOTP}
                    disabled={authStage !== 'idle'}
                  >
                    <RefreshCw size={12} /> Resend OTP
                  </button>
                </div>

                <button 
                  type="submit" 
                  className={`executive-cta-button ${authStage}`}
                  disabled={authStage !== 'idle' || !isOtpValid}
                >
                  {authStage === 'idle' && (
                    <>
                      <span>Verify & Sign In</span>
                      <ArrowRight size={17} className="cta-arrow-icon" />
                    </>
                  )}
                  {authStage === 'verifying' && (
                    <>
                      <span className="spinner-dot" />
                      <span>Verifying OTP...</span>
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
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
