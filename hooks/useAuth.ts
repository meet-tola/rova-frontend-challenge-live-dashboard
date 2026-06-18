'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  return { user, isAuthenticated, isHydrated };
}

export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    // Only redirect after hydration is complete
    if (isHydrated && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  return { isAuthenticated, isHydrated };
}