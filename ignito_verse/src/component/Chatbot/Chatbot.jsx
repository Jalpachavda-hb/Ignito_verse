import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Mail, 
  Award,
  Calendar,
  Video,
  FileText,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { askCaptiqAI } from '../../services/platformAgentService';
import { getSavedUserSession } from '../../services/authService';
import { getLoggedInStudentId } from '../../services/microcredentialService';
import './Chatbot.css';

// Mascot image URL as specified in requirements
const MASCOT_URL = 'https://industrial-training.s3.ap-south-1.amazonaws.com/Logos/ignitoCaptiq-mascot.png';
const SESSION_STORAGE_KEY = 'ignito_captiq_chat_messages';

// Quick action buttons for instant queries
const QUICK_ACTIONS = [
  { id: 'about', label: 'About Ignito Captio', icon: Sparkles, query: 'What is ignitoCaptiq and what platform capabilities does it offer?' },
  { id: 'courses', label: 'Explore Courses & Fees', icon: BookOpen, query: 'What microcredentials do you offer and what are the course fees?' },
  { id: 'quizzes', label: 'Quizzes & Scorecards', icon: Award, query: 'Where can I access microcredential quizzes, attempts, and scorecards?' },
  { id: 'masterclasses', label: 'Live Masterclasses', icon: Video, query: 'Where can I find live masterclass recordings and meeting links?' }
];

/**
 * Maps FontAwesome or keyword icon classes to Lucide icons
 */
function resolveActionIcon(iconClass = '', title = '') {
  const c = (iconClass + ' ' + title).toLowerCase();

  if (c.includes('graduation') || c.includes('microcredential') || c.includes('course') || c.includes('cap')) {
    return GraduationCap;
  }
  if (c.includes('award') || c.includes('quiz') || c.includes('certif') || c.includes('trophy')) {
    return Award;
  }
  if (c.includes('calendar') || c.includes('event') || c.includes('schedule')) {
    return Calendar;
  }
  if (c.includes('video') || c.includes('play') || c.includes('recording') || c.includes('masterclass')) {
    return Video;
  }
  if (c.includes('book') || c.includes('note') || c.includes('file') || c.includes('doc')) {
    return FileText;
  }
  if (c.includes('mail') || c.includes('contact') || c.includes('help') || c.includes('support')) {
    return Mail;
  }
  return ArrowRight;
}

/**
 * Helper to safely sanitize and format response text (supports basic HTML & Markdown bold/newlines)
 */
function formatBotHtml(rawText = '') {
  if (!rawText) return '';
  let formatted = String(rawText).trim();

  // If response doesn't contain HTML tags, convert markdown bold and newlines
  if (!formatted.includes('<p>') && !formatted.includes('<div>') && !formatted.includes('<br')) {
    formatted = formatted
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');
    formatted = `<p>${formatted}</p>`;
  } else {
    // If it has markdown bold inside HTML, convert it too
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  }

  return formatted;
}

export default function Chatbot({ onNavigate = () => {}, user = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not restore Captiq chat session:', e);
    }
    return [
      {
        id: 'init-1',
        sender: 'bot',
        text: "<p>Hello! 👋 I'm <b>Captiq</b>, your official Ignito Captio AI Platform Guide.</p><p>How can I assist your learning journey today? Ask me anything about microcredentials, course fees, quizzes, certificates, or live masterclasses!</p>",
        time: getCurrentTime(),
        showQuickActions: true,
        suggestedActions: [
          { title: 'Explore Microcredentials', url: '/Home/Microcredentials', iconClass: 'fa-solid fa-graduation-cap' }
        ]
      }
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Persist messages in sessionStorage for guest session continuity
  useEffect(() => {
    try {
      if (messages && messages.length > 0) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
      }
    } catch (e) {
      console.warn('Failed to persist Captiq session:', e);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen, messages, isTyping]);

  /**
   * Resolves logged-in student info or guest defaults
   */
  const resolveUserInfo = () => {
    const activeUser = user || getSavedUserSession();
    const studentId = Number(activeUser?.studentId || activeUser?.id || getLoggedInStudentId() || 0) || 0;
    const isLoggedIn = studentId > 0;
    const userRole = isLoggedIn ? (activeUser?.role || 'Student') : 'Guest';

    return {
      studentId,
      userRole,
      isLoggedIn
    };
  };

  /**
   * Sends user query to Captiq AI Agent
   */
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      time: getCurrentTime()
    };

    // Update state with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    // Resolve user context & multi-turn history
    const { studentId, userRole } = resolveUserInfo();
    const currentPageUrl = typeof window !== 'undefined' 
      ? (window.location.pathname + window.location.hash || 'Home') 
      : 'Home';

    // Format conversation history for multi-turn context
    const conversationHistory = updatedMessages.slice(-8).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: String(m.text || '').replace(/<[^>]*>?/gm, '').trim()
    }));

    try {
      const result = await askCaptiqAI(text, {
        currentPageUrl,
        userRole,
        studentId,
        conversationHistory
      });

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: result.responseText || "I'm here to help you navigate Ignito Captio.",
        suggestedActions: result.suggestedActions || [],
        time: getCurrentTime()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Captiq message handling error:', err);
      const fallbackMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "I'm temporarily unable to reach the platform guide. Please check your internet connection or browse our course catalog directly.",
        suggestedActions: [
          { title: 'Microcredentials Catalog', url: '/Home/Microcredentials', iconClass: 'fa-solid fa-graduation-cap' }
        ],
        time: getCurrentTime()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Routes navigation when user clicks an action button
   */
  const handleActionClick = (action) => {
    if (!action || !action.url) return;
    const url = action.url.trim();

    // Map common backend URLs to SPA routes
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('microcredential') || lowerUrl.includes('course') || lowerUrl === '/home/microcredentials') {
      if (typeof onNavigate === 'function') {
        onNavigate('microcredentials');
      } else {
        window.location.href = '/microcredentials';
      }
    } else if (lowerUrl.includes('#quizzes') || lowerUrl.includes('quiz')) {
      if (typeof onNavigate === 'function') {
        onNavigate('profile', 'quizzes');
      } else {
        window.location.href = '/profile/quizzes';
      }
    } else if (lowerUrl.includes('#calendar') || lowerUrl.includes('calendar') || lowerUrl.includes('schedule')) {
      if (typeof onNavigate === 'function') {
        onNavigate('profile', 'calendar');
      } else {
        window.location.href = '/profile/calendar';
      }
    } else if (lowerUrl.includes('#certificates') || lowerUrl.includes('certificate')) {
      if (typeof onNavigate === 'function') {
        onNavigate('profile', 'certificates');
      } else {
        window.location.href = '/profile/certificates';
      }
    } else if (lowerUrl.includes('mylearning') || lowerUrl.includes('profile')) {
      if (typeof onNavigate === 'function') {
        onNavigate('profile', 'dashboard');
      } else {
        window.location.href = '/profile';
      }
    } else if (lowerUrl.includes('login') || lowerUrl.includes('register')) {
      if (typeof onNavigate === 'function') {
        onNavigate('login');
      } else {
        window.location.href = '/login';
      }
    } else if (lowerUrl === '/' || lowerUrl === '/home' || lowerUrl === '#') {
      if (typeof onNavigate === 'function') {
        onNavigate('home');
      } else {
        window.location.href = '/';
      }
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {}

    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'bot',
        text: "<p>Conversation refreshed! 👋 I'm <b>Captiq</b>, your Ignito Captio AI Platform Guide.</p><p>How can I assist you right now?</p>",
        time: getCurrentTime(),
        showQuickActions: true,
        suggestedActions: [
          { title: 'Explore Microcredentials', url: '/Home/Microcredentials', iconClass: 'fa-solid fa-graduation-cap' }
        ]
      }
    ]);
    setIsTyping(false);
  };

  return (
    <div className="ignito-chatbot-root">
      {/* Floating Chatbot Trigger Button */}
      <div className="ignito-chatbot-float-wrapper">
        <button
          type="button"
          className="ignito-chatbot-float-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Captiq Assistant" : "Open Captiq Assistant"}
          title={isOpen ? "Close Assistant" : "Chat with Captiq AI Guide"}
        >
          {/* Subtle glowing pulse ring */}
          <div className="ignito-chatbot-pulse-ring" />

          {/* Mascot Image */}
          <img
            src={MASCOT_URL}
            alt="Ignito Captio Mascot"
            className="ignito-chatbot-mascot-img"
            onError={(e) => {
              e.currentTarget.src = '/mascot.png';
            }}
          />

          {/* Unread badge indicator */}
          {!isOpen && hasUnread && (
            <div className="ignito-chatbot-badge-tooltip">
              <span className="ignito-chatbot-badge-dot" />
              <span>Ask Captiq AI</span>
            </div>
          )}
        </button>
      </div>

      {/* Chatbot Window */}
      <div className={`ignito-chat-window ${isOpen ? 'open' : 'closed'}`} role="dialog" aria-modal="true">
        {/* Header */}
        <div className="ignito-chat-header">
          <div className="ignito-header-brand">
            <div className="ignito-header-avatar-wrap">
              <img
                src={MASCOT_URL}
                alt="Captiq Assistant Mascot"
                className="ignito-header-avatar"
                onError={(e) => {
                  e.currentTarget.src = '/mascot.png';
                }}
              />
              <span className="ignito-header-online-dot" title="Captiq Online" />
            </div>
            <div className="ignito-header-info">
              <span className="ignito-header-title">Captiq AI Assistant</span>
              <span className="ignito-header-tagline">Ignito Captio Platform Guide</span>
            </div>
          </div>

          <div className="ignito-header-actions">
            <button
              type="button"
              className="ignito-header-btn"
              onClick={handleResetChat}
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              className="ignito-header-btn"
              onClick={() => setIsOpen(false)}
              title="Close chat"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="ignito-quick-actions-bar">
          {QUICK_ACTIONS.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                className="ignito-quick-btn"
                onClick={() => handleSendMessage(action.query)}
                disabled={isTyping}
              >
                <IconComponent size={14} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Feed */}
        <div className="ignito-chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`ignito-msg-row ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              {msg.sender === 'bot' && (
                <div className="ignito-msg-avatar">
                  <img
                    src={MASCOT_URL}
                    alt="Bot Avatar"
                    onError={(e) => {
                      e.currentTarget.src = '/mascot.png';
                    }}
                  />
                </div>
              )}

              <div className="ignito-msg-content-wrap">
                <div className={msg.sender === 'user' ? 'ignito-bubble-user' : 'ignito-bubble-bot'}>
                  {msg.sender === 'bot' ? (
                    <div 
                      className="ignito-bot-rich-content"
                      dangerouslySetInnerHTML={{ __html: formatBotHtml(msg.text) }} 
                    />
                  ) : (
                    msg.text
                  )}

                  {/* Suggested Action Buttons from Captiq AI */}
                  {Array.isArray(msg.suggestedActions) && msg.suggestedActions.length > 0 && (
                    <div className="ignito-suggested-actions">
                      {msg.suggestedActions.map((action, idx) => {
                        const ActionIcon = resolveActionIcon(action.iconClass, action.title);
                        return (
                          <button
                            key={`action-${idx}-${action.title}`}
                            type="button"
                            className="ignito-action-btn"
                            onClick={() => handleActionClick(action)}
                          >
                            <span className="ignito-action-icon">
                              <ActionIcon size={14} />
                            </span>
                            <span>{action.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Welcome quick actions (initial state) */}
                  {msg.showQuickActions && (
                    <div className="ignito-inline-actions">
                      {QUICK_ACTIONS.map((action) => {
                        const IconComponent = action.icon;
                        return (
                          <button
                            key={`inline-${action.id}`}
                            type="button"
                            className="ignito-quick-btn"
                            onClick={() => handleSendMessage(action.query)}
                            disabled={isTyping}
                          >
                            <IconComponent size={13} />
                            <span>{action.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <span className="ignito-msg-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="ignito-msg-row bot">
              <div className="ignito-msg-avatar">
                <img
                  src={MASCOT_URL}
                  alt="Bot Avatar"
                  onError={(e) => {
                    e.currentTarget.src = '/mascot.png';
                  }}
                />
              </div>
              <div className="ignito-msg-content-wrap">
                <div className="ignito-typing-bubble">
                  <span className="ignito-typing-text">Captiq is analyzing</span>
                  <div className="ignito-typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="ignito-chat-input-area">
          <input
            ref={inputRef}
            type="text"
            className="ignito-chat-input-field"
            placeholder="Ask Captiq about courses, fees, quizzes, calendar..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            aria-label="Type your question for Captiq"
          />

          <button
            type="button"
            className="ignito-chat-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
            title="Send"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
