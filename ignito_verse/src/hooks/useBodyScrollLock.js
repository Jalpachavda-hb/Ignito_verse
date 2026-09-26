// src/hooks/useBodyScrollLock.js
import { useEffect, useId } from 'react';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

/**
 * React hook to lock document body and root scroll while a modal or dialog is open.
 * Automatically unlocks on modal close or component unmount.
 * 
 * @param {boolean} isLocked Whether the scroll should be locked (usually isOpen state)
 * @param {string} customId Optional custom ID for tracking the lock source
 */
export function useBodyScrollLock(isLocked = true, customId = '') {
  const autoId = useId();
  const lockId = customId || autoId;

  useEffect(() => {
    if (!isLocked) return;
    lockScroll(lockId);
    return () => {
      unlockScroll(lockId);
    };
  }, [isLocked, lockId]);
}

export default useBodyScrollLock;
