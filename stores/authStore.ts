import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'user';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  lastActivityTime: number;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateActivityTime: () => void;
  getLastActivityTime: () => number;
}

// Mock user credentials
const DEMO_USERS = {
  admin: {
    id: '1',
    email: 'admin@ryswift.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    name: 'Admin User',
  },
  user: {
    id: '2',
    email: 'user@ryswift.com',
    password: 'user123',
    role: 'user' as UserRole,
    name: 'Regular User',
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      lastActivityTime: Date.now(),

      login: async (email: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        let foundUser: User | null = null;

        if (email === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
          foundUser = { ...DEMO_USERS.admin };
        } else if (email === DEMO_USERS.user.email && password === DEMO_USERS.user.password) {
          foundUser = { ...DEMO_USERS.user };
        }

        if (foundUser) {
          set({
            user: foundUser,
            isAuthenticated: true,
            lastActivityTime: Date.now(),
            isHydrated: true,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isHydrated: true,
          lastActivityTime: Date.now(),
        });
      },

      updateActivityTime: () => set({ lastActivityTime: Date.now() }),
      getLastActivityTime: () => get().lastActivityTime,
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);