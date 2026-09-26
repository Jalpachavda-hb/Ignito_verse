// src/utils/modalWatcher.js
import { lockScroll, unlockScroll } from './scrollLock';

const MODAL_SELECTORS = [
  '.modal-overlay',
  '.quiz-modal-overlay',
  '.quiz-result-modal-overlay',
  '.quiz-confirm-modal-overlay',
  '.mc-modal-overlay',
  '.qr-modal-overlay',
  '.calendar-modal-backdrop',
  '[role="dialog"][aria-modal="true"]:not(.ignito-chat-window)',
  '.video-modal-box',
  '.auth-required-modal'
].join(',');

/**
 * Automatically observes the entire DOM for any modal elements appearing or disappearing.
 * Ensures that whenever ANY modal is opened anywhere in the whole website,
 * the background screen scroll is 100% locked.
 */
export function initGlobalModalWatcher() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  let isAutoLocked = false;
  const OBSERVER_LOCK_ID = '__global_dom_modal_watcher__';

  const checkAndSyncScrollLock = () => {
    try {
      const candidates = document.querySelectorAll(MODAL_SELECTORS);
      let hasVisibleModal = false;

      for (let i = 0; i < candidates.length; i++) {
        const el = candidates[i];
        // Exclude floating chatbot window
        if (el.classList.contains('ignito-chat-window') || el.closest('.ignito-chat-window')) {
          continue;
        }
        // If element is in DOM and not explicitly hidden
        const style = window.getComputedStyle(el);
        if (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0'
        ) {
          hasVisibleModal = true;
          break;
        }
      }

      if (hasVisibleModal && !isAutoLocked) {
        isAutoLocked = true;
        lockScroll(OBSERVER_LOCK_ID);
      } else if (!hasVisibleModal && isAutoLocked) {
        isAutoLocked = false;
        unlockScroll(OBSERVER_LOCK_ID);
      }
    } catch (e) {
      // In case of any query error, ignore safely
    }
  };

  const observer = new MutationObserver(() => {
    checkAndSyncScrollLock();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden', 'aria-modal']
  });

  // Run immediately on initialization
  checkAndSyncScrollLock();

  return () => {
    observer.disconnect();
    if (isAutoLocked) {
      isAutoLocked = false;
      unlockScroll(OBSERVER_LOCK_ID);
    }
  };
}
