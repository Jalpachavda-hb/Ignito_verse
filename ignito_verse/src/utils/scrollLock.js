// src/utils/scrollLock.js
// Enterprise Universal Body & Document Scroll Lock Manager

const activeLocks = new Set();
let previousBodyOverflow = '';
let previousHtmlOverflow = '';
let previousBodyPaddingRight = '';

/**
 * Locks background scrolling across both html and body elements.
 * Supports multiple concurrent locks (e.g. nested or sequential modals).
 * Also compensates for scrollbar width to prevent layout jump.
 * 
 * @param {string} lockId Unique identifier for the modal or locker
 */
export function lockScroll(lockId = 'default') {
  if (typeof document === 'undefined') return;

  if (activeLocks.size === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousHtmlOverflow = document.documentElement.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;

    // Calculate vertical scrollbar width to prevent page content shifting
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  activeLocks.add(lockId);
}

/**
 * Unlocks background scrolling for a specific lockId.
 * Only restores original overflow when all locks have been released.
 * 
 * @param {string} lockId Unique identifier for the modal or locker
 */
export function unlockScroll(lockId = 'default') {
  if (typeof document === 'undefined') return;

  activeLocks.delete(lockId);

  if (activeLocks.size === 0) {
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    document.documentElement.style.overflow = previousHtmlOverflow || '';
    document.body.style.overflow = previousBodyOverflow || '';
    document.body.style.paddingRight = previousBodyPaddingRight || '';
  }
}

/**
 * Forcibly resets and unlocks scrolling regardless of active locks.
 */
export function forceUnlockAllScroll() {
  if (typeof document === 'undefined') return;
  activeLocks.clear();
  document.documentElement.classList.remove('modal-open');
  document.body.classList.remove('modal-open');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}
