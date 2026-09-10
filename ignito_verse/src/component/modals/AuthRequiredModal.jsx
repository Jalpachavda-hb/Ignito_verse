// ignitoverse: Professional Authentication Required Modal
import React from 'react';
import { X, Lock, ShieldCheck, PlayCircle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthRequiredModal({
  isOpen,
  onClose,
  onLogin = () => {},
  courseTitle = '',
  actionText = 'watch this video lecture'
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container auth-required-modal" style={{ maxWidth: '520px', padding: '36px 32px', borderRadius: '20px' }}>
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Header with Glowing Brand Icon */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0, 56, 94, 0.1) 0%, rgba(14, 165, 233, 0.15) 100%)',
            border: '2px solid rgba(0, 56, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00385E',
            boxShadow: '0 8px 24px rgba(0, 56, 94, 0.08)'
          }}>
            <Lock size={28} strokeWidth={2.2} />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            background: '#e0f2fe',
            color: '#0369a1',
            borderRadius: '20px',
            fontSize: '0.76rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '10px'
          }}>
            <Sparkles size={13} />
            <span>Employee Access Required</span>
          </div>

          <h2 style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#00385E',
            margin: '0 0 8px 0',
            lineHeight: 1.3
          }}>
            Please Sign In to Continue
          </h2>

          <p style={{
            fontSize: '0.9rem',
            color: '#64748b',
            lineHeight: 1.55,
            margin: 0
          }}>
            {courseTitle ? (
              <>To watch <strong>{courseTitle}</strong> and sync your learning progress, please log in with your employee credentials.</>
            ) : (
              <>To {actionText}, track your watch progress, and earn an accredited certificate, please log in with your employee credentials.</>
            )}
          </p>
        </div>

        {/* Feature Benefits List */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '16px 18px',
          marginBottom: '26px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 500 }}>
                <strong>HD Video Lectures:</strong> Complete full modules with interactive playback
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 500 }}>
                <strong>Progress Sync:</strong> Automatically track your percentage and quiz eligibility
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 500 }}>
                <strong>Verified Certificate:</strong> Earn industry-recognized credentials on completion
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={onLogin}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #00385E 0%, #005a96 100%)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(0, 56, 94, 0.25)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 56, 94, 0.35)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 56, 94, 0.25)'; }}
          >
            <span>Sign In to Employee Account</span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#64748b',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#64748b'; }}
          >
            Cancel & Browse Courses
          </button>
        </div>
      </div>
    </div>
  );
}
