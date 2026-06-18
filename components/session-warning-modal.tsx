"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface SessionWarningModalProps {
  isOpen: boolean;
  countdownSeconds: number;
  onContinue: () => void;
}

export function SessionWarningModal({
  isOpen,
  countdownSeconds,
  onContinue,
}: SessionWarningModalProps) {
  const router = useRouter();
  const { logout } = useAuthStore();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3 text-warning">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-900">Session Timeout</h2>
        </div>

        <p className="text-gray-700">
          You have been inactive for 3 minutes. Your session will expire in{" "}
          <span className="font-bold text-orange-600">{countdownSeconds}</span>{" "}
          seconds.
        </p>

        <p className="text-sm text-gray-600">
          Click &quot;Continue&quot; to stay logged in or you will be
          automatically logged out.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={onContinue}
            className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm py-3 min-h-11.5 rounded-lg flex items-center justify-center transition-colors order-1 sm:order-2"
          >
            Continue
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full sm:flex-1 border-gray-200 hover:bg-red-50 text-red-600 hover:text-red-700 text-sm py-3 min-h-11.5 rounded-lg flex items-center justify-center font-medium transition-colors order-2 sm:order-1"
          >
            Logout
          </Button>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-orange-600 h-full transition-all duration-100"
            style={{
              width: `${(countdownSeconds / 10) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
