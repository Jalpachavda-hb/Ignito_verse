import React, { useEffect } from 'react';
import { X, ShieldCheck, Clock } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&enablejsapi=1` : '';
}

export default function VideoModal({ 
  isOpen, 
  onClose, 
  lectureTitle, 
  courseTitle, 
  duration, 
  videoUrl, 
  poster 
}) {
  // Lock background scroll across entire page when video modal is open
  useBodyScrollLock(isOpen, 'VideoModal');

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ytEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" style={{ animation: 'fadeInModal 0.25s ease forwards' }}>
      <div 
        className="modal-backdrop" 
        onClick={onClose} 
        title="Click to close video preview"
      />
      <div className="modal-container video-modal-box">
        <div className="video-modal-header">
          <div className="video-modal-titles">
            <span className="course-tag-pill">{courseTitle || 'Microcredential Course'}</span>
            <h3 className="video-lecture-name">{lectureTitle || `${courseTitle || 'Microcredential'} - Introduction`}</h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn light-close" 
            onClick={onClose}
            aria-label="Close video preview"
            title="Close video"
          >
            <X size={20} />
          </button>
        </div>

        <div className="video-player-frame" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000000' }}>
          {ytEmbedUrl ? (
            <iframe
              src={ytEmbedUrl}
              title={lectureTitle || 'Course Introduction Video'}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video 
              controls 
              autoPlay 
              playsInline
              className="active-video-element"
              poster={poster || ''}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            >
              <source src={videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className="video-modal-footer">
          <div className="video-meta-left">
            <span className="meta-badge"><Clock size={13} /> {duration || 'Preview'}</span>
            <span className="meta-badge"><ShieldCheck size={13} /> HD Enterprise Audio/Video</span>
          </div>
          <div className="video-meta-right">
            <span className="video-note">Course introduction preview. Full syllabus unlocked upon enrollment.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
