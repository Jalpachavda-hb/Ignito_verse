// ignitoverse: Video Player Preview Modal
import React from 'react';
import { X, Play, Volume2, ShieldCheck, Clock } from 'lucide-react';

export default function VideoModal({ isOpen, onClose, lectureTitle, courseTitle, duration, videoUrl }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container video-modal-box">
        <div className="video-modal-header">
          <div className="video-modal-titles">
            <span className="course-tag-pill">{courseTitle || 'Microcredential Lecture'}</span>
            <h3 className="video-lecture-name">{lectureTitle || 'Preview Lecture'}</h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn light-close" 
            onClick={onClose}
            aria-label="Close video"
          >
            <X size={20} />
          </button>
        </div>

        <div className="video-player-frame">
          <video 
            controls 
            autoPlay 
            className="active-video-element"
            poster="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80"
          >
            <source src={videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="video-modal-footer">
          <div className="video-meta-left">
            <span className="meta-badge"><Clock size={13} /> {duration || '15 mins'}</span>
            <span className="meta-badge"><ShieldCheck size={13} /> HD Enterprise Audio/Video</span>
          </div>
          <div className="video-meta-right">
            <span className="video-note">Sample enterprise preview module. Full syllabus unlocked upon enrollment.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
