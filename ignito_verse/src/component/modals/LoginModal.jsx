// ignitoverse: Professional Clean Login Modal (Email & Password Only)
import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onLoginSuccess({
        name: email ? email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Saurabh Mukherjee',
        email: email || 'saurabh.mukherjee@enterprise.com',
        role: 'Senior Java Architect',
        company: 'Enterprise Learning Cohort',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        empId: 'EMP-94021'
      });
      onClose();
    }, 700);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container login-modal professional-login-box">
        {/* Close Button */}
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Clean Modal Header */}
        <div className="login-modal-header clean-header">
          <h2 className="modal-title">Sign In to Ignitoverse</h2>
          <p className="modal-subtitle">Enter your email and password to access your dashboard.</p>
        </div>

        {/* Authentication Form */}
        {isSuccess ? (
          <div className="login-success-state">
            <div className="login-spinner" />
            <p>Signing in...</p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="login-email">
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                id="login-email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="label-with-link">
                <label htmlFor="login-pwd">
                  <Lock size={14} /> Password
                </label>
                <a href="#forgot" className="form-link" onClick={(e) => e.preventDefault()}>Forgot password?</a>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-pwd"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="btn-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-submit-btn">
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
