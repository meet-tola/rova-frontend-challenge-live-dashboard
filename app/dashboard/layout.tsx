'use client';

import { Sidebar } from "@/components/sidebar";
import { SessionWarningModal } from "@/components/session-warning-modal";
import { useRequireAuth } from "@/hooks/useAuth";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useAuthStore } from "@/stores/authStore";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isHydrated } = useRequireAuth();
  const { showWarning, countdownSeconds, setShowWarning } = useSessionManager();
  const { updateActivityTime } = useAuthStore();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebarCollapsed") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  const handleContinueSession = () => {
    updateActivityTime();
    setShowWarning(false);
  };

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(prev => !prev)} 
      />

      <div
        className={`pt-16 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <main className="flex-1 w-full p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      <SessionWarningModal
        isOpen={showWarning}
        countdownSeconds={countdownSeconds}
        onContinue={handleContinueSession}
      />
    </div>
  );
}