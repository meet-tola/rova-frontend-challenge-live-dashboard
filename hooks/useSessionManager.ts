'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';

const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes
const WARNING_DURATION = 10 * 1000; // 10 seconds

export function useSessionManager() {
  const { isAuthenticated, updateActivityTime } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => {
      updateActivityTime();

      // Clear existing timers
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);

      setShowWarning(false);
      setCountdownSeconds(0);

      // Set new inactivity timer
      timerRef.current = setTimeout(() => {
        setShowWarning(true);
        setCountdownSeconds(WARNING_DURATION / 1000);

        // Start countdown
        let remaining = WARNING_DURATION / 1000;
        countdownRef.current = setInterval(() => {
          remaining--;
          setCountdownSeconds(remaining);

          if (remaining <= 0 && countdownRef.current) {
            clearInterval(countdownRef.current);
          }
        }, 1000);
      }, INACTIVITY_TIMEOUT);
    };

    // Listen for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Initial timer
    handleActivity();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });

      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isAuthenticated, updateActivityTime]);

  return {
    showWarning,
    countdownSeconds,
    setShowWarning,
  };
}
