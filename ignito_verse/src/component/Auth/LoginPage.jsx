// IgnitoCaptiq: Modern Executive Login Page with Desk Background & Clean Layout
import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, BarChart2, GraduationCap, Mail, Smartphone, 
  ArrowRight, ArrowLeft, Check,
  LockKeyhole, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import captiqLogoImg from '../../assets/newlg.png';
import loginBgImg from '../../assets/home/loginbg.png';
import { sendStudentLoginOTP, validateStudentLoginOTP } from '../../services/authService';

export default function LoginPage({ 
  onLoginSuccess = () => {}, 
  onNavigateHome = () => {} 
}) {
  // Method Switcher: 'email' | 'mobile'
  const [loginMethod, setLoginMethod] = useState('email');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [step, setStep] = useState('send_otp'); // 'send_otp' | 'verify_otp'
  
  // 4-Digit OTP state & refs
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const otpInputRefs = useRef([]);

  // Backend session details
  const [studentId, setStudentId] = useState(0);
  const [otpId, setOtpId] = useState(0);
  
  // Interaction & Status
  const [focusedField, setFocusedField] = useState(null);
  const [authStage, setAuthStage] = useState('idle'); // 'idle' | 'verifying' | 'granted'
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validation
  const isInputValid = emailOrMobile.trim().length >= (loginMethod === 'email' ? 5 : 7);
  const isOtpValid = otpDigits.every(d => d.trim().length === 1 && /^\d$/.test(d));

  // Auto-focus first box on entering verify_otp
  useEffect(() => {
    if (step === 'verify_otp') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 120);
    }
  }, [step]);

  // Smart Focus & Input Handlers
  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      return;
    }

    const digit = cleaned.slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);

    // Smart Focus: Advance to next box
    if (digit && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        // Backspace Flow: jump back and clear previous
        const next = [...otpDigits];
        next[index - 1] = '';
        setOtpDigits(next);
        otpInputRefs.current[index - 1]?.focus();
      } else {
        const next = [...otpDigits];
        next[index] = '';
        setOtpDigits(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;

    const next = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setOtpDigits(next);

    const focusIdx = Math.min(pasted.length, 3);
    otpInputRefs.current[focusIdx]?.focus();
  };

  // Request OTP
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (authStage !== 'idle') return;

    setErrorMessage('');
    setSuccessMessage('');
    setAuthStage('verifying');

    try {
      const isActuallyEmail = emailOrMobile.includes('@');
      const payload = isActuallyEmail || loginMethod === 'email'
        ? { email: emailOrMobile.trim(), mobileNumber: '' }
        : { email: '', mobileNumber: emailOrMobile.trim() };

      const result = await sendStudentLoginOTP(payload);

      if (result.isSuccess || result.success) {
        setStudentId(result.studentId || 0);
        setOtpId(result.otpId || 0);
        setOtpDigits(['', '', '', '']);
        setStep('verify_otp');
        setAuthStage('idle');
        setSuccessMessage(result.message || 'OTP sent successfully! Please check your inbox / messages.');
      } else {
        setAuthStage('idle');
        setErrorMessage(result.message || result.error || 'Failed to send OTP. Please check your credentials.');
      }
    } catch (err) {
      console.error('[LoginPage] Send OTP Exception:', err);
      setAuthStage('idle');
      setErrorMessage(err.message || 'An error occurred while sending OTP.');
    }
  };

  // Validate OTP
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
        otp: otpDigits.join('')
      });

      if (result.isSuccess || result.success) {
        setAuthStage('granted');
        setTimeout(() => {
          onLoginSuccess(result.user);
        }, 650);
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
    <div className="captiq-desk-viewport">
      
      {/* Top Navigation Bar: Back to Home */}
      <div className="captiq-desk-top-bar">
        <button 
          type="button" 
          className="captiq-back-home-text-btn" 
          onClick={onNavigateHome}
          aria-label="Back to Home"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Dual-Column Card with loginbg.png as background */}
      <div 
        className={`captiq-desk-card ${authStage === 'granted' ? 'card-auth-success' : ''}`}
        style={{ backgroundImage: `url(${loginBgImg})` }}
      >
        
        {/* ========================================================
            LEFT COLUMN: Logo, People. Skills. Real Impact., Features, Motto
            ======================================================== */}
        <div className="captiq-desk-col-left">
          
          {/* Brand Logo */}
          <div className="captiq-desk-brand">
            <img src={captiqLogoImg} alt="ignitoCaptiq" className="brand-logo-img" />
          </div>

          {/* Headline & Description (2 Lines) */}
          <div className="captiq-desk-title-block">
            <h1 className="captiq-people-title">
              <span className="title-first-line">People. Skills.</span>
              <span className="title-real-impact">Real Impact.</span>
            </h1>
            <p className="captiq-people-desc">
              IgnitoCaptiq empowers organizations to build future-ready teams with verified microcredentials and passwordless OTP login.
            </p>
          </div>

          {/* 3 Feature Rows */}
          <div className="captiq-desk-features">
            <div className="feature-pill-item">
              <div className="feature-pill-icon icon-pink">
                <GraduationCap size={18} />
              </div>
              <div className="feature-pill-info">
                <h4>Skill Development</h4>
                <p>Future-ready workforce</p>
              </div>
            </div>

            <div className="feature-pill-item">
              <div className="feature-pill-icon icon-purple">
                <BarChart2 size={18} />
              </div>
              <div className="feature-pill-info">
                <h4>Measurable Outcomes</h4>
                <p>Track progress and impact</p>
              </div>
            </div>

            <div className="feature-pill-item">
              <div className="feature-pill-icon icon-blue">
                <ShieldCheck size={18} />
              </div>
              <div className="feature-pill-info">
                <h4>Secure & Trusted</h4>
                <p>Enterprise-grade authentication</p>
              </div>
            </div>
          </div>

          {/* Handwritten Motto at bottom */}
          <div className="captiq-desk-motto">
            <span className="handwritten-script">
              A Brighter<br/>Learning Tomorrow
            </span>
            <span className="handwritten-line" />
          </div>

        </div>

        {/* ========================================================
            CENTER SPACER: lets desk photo, mug, laptop, books breathe
            ======================================================== */}
        <div className="captiq-desk-center-spacer" aria-hidden="true" />

        {/* ========================================================
            RIGHT COLUMN: Welcome Back Form
            ======================================================== */}
        <div className="captiq-desk-col-right">
          
          <div className="captiq-form-header-bar" />

          {/* Title Area */}
          <div className="captiq-desk-form-heading">
            <h2 className="captiq-right-title">
              Welcome <span className="title-back-accent">Back</span>
            </h2>
            <p className="captiq-right-sub">
              Sign in to continue to your IgnitoCaptiq account
            </p>
          </div>

          {/* Feedback Banners */}
          {successMessage && (
            <div className="captiq-banner-msg banner-success" role="status">
              <CheckCircle2 size={16} strokeWidth={2.4} className="banner-icon" />
              <span className="banner-text">{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="captiq-banner-msg banner-error" role="alert">
              <AlertCircle size={16} strokeWidth={2.4} className="banner-icon" />
              <span className="banner-text">{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Send OTP Mode */}
          {step === 'send_otp' && (
            <form className="captiq-right-form" onSubmit={handleSendOTP}>
              
              {/* Method Switcher Tabs */}
              <div className="method-switcher-row">
                <button
                  type="button"
                  className={`method-pill-btn ${loginMethod === 'email' ? 'active' : ''}`}
                  onClick={() => {
                    setLoginMethod('email');
                    setErrorMessage('');
                  }}
                >
                  <Mail size={16} />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  className={`method-pill-btn ${loginMethod === 'mobile' ? 'active' : ''}`}
                  onClick={() => {
                    setLoginMethod('mobile');
                    setErrorMessage('');
                  }}
                >
                  <Smartphone size={16} />
                  <span>Mobile</span>
                </button>
              </div>

              {/* Input Field */}
              <div className="captiq-field-box">
                <label className="captiq-form-label">
                  {loginMethod === 'email' ? 'Email Address' : 'Mobile Number'}
                </label>
                <div className={`captiq-styled-input-wrap ${focusedField === 'identifier' ? 'has-focus' : ''}`}>
                  <div className="field-icon-lead">
                    {loginMethod === 'email' ? <Mail size={17} /> : <Smartphone size={17} />}
                  </div>
                  <input
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    required
                    placeholder={loginMethod === 'email' ? 'you@company.com' : '+1234567890'}
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    onFocus={() => setFocusedField('identifier')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="username"
                    className="captiq-styled-input"
                  />
                </div>
              </div>

              {/* Primary Action Button (Send OTP) */}
              <button
                type="submit"
                className="captiq-primary-submit-btn"
                disabled={authStage !== 'idle' || !isInputValid}
              >
                {authStage === 'idle' && (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight size={17} />
                  </>
                )}
                {authStage === 'verifying' && <span>Sending OTP...</span>}
                {authStage === 'granted' && (
                  <>
                    <Check size={17} strokeWidth={3} />
                    <span>OTP Sent</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Verify OTP Mode */}
          {step === 'verify_otp' && (
            <form className="captiq-right-form" onSubmit={handleValidateOTP}>
              <div className="captiq-field-box">
                <div className="verify-top-subrow">
                  <label className="captiq-form-label">One-Time Password (4-Digit OTP)</label>
                  <button
                    type="button"
                    className="captiq-text-link"
                    onClick={() => {
                      setStep('send_otp');
                      setOtpDigits(['', '', '', '']);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                  >
                    Change Contact
                  </button>
                </div>

                {/* Exact 4 Dedicated Digit Boxes */}
                <div className="captiq-otp-4box-row" onPaste={handleOtpPaste}>
                  {[0, 1, 2, 3].map((index) => {
                    const val = otpDigits[index] || '';
                    const isFilled = val.length === 1;
                    const isFocused = focusedField === `otp-${index}`;

                    return (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        autoComplete="off"
                        className={`captiq-otp-digit-box ${isFilled ? 'is-filled' : ''} ${isFocused ? 'is-focused' : ''}`}
                        value={val}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onFocus={() => setFocusedField(`otp-${index}`)}
                        onBlur={() => setFocusedField(null)}
                        aria-label={`Digit ${index + 1}`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="resend-row">
                <button
                  type="button"
                  className="captiq-text-link resend-btn"
                  onClick={(e) => {
                    setOtpDigits(['', '', '', '']);
                    handleSendOTP(e);
                  }}
                  disabled={authStage !== 'idle'}
                >
                  <RefreshCw size={13} />
                  <span>Resend OTP</span>
                </button>
              </div>

              <button
                type="submit"
                className="captiq-primary-submit-btn"
                disabled={authStage !== 'idle' || !isOtpValid}
              >
                {authStage === 'idle' && (
                  <>
                    <span>Verify & Sign In</span>
                    <ArrowRight size={17} />
                  </>
                )}
                {authStage === 'verifying' && <span>Verifying OTP...</span>}
                {authStage === 'granted' && (
                  <>
                    <Check size={17} strokeWidth={3} />
                    <span>Access Granted</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Outside Card: Bottom Right Empowering Slogan */}
      <div className="captiq-bottom-right-slogan" aria-hidden="true">
        <span>EMPOWERING</span>
        <span>PEOPLE.</span>
        <span>POWERING</span>
        <span>PROGRESS.</span>
        <div className="slogan-pink-bar" />
      </div>

    </div>
  );
}
