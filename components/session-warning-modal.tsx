'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

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
    router.push('/auth/login');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3 text-warning">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-900">Session Timeout</h2>
        </div>

        <p className="text-gray-700">
          You have been inactive for 3 minutes. Your session will expire in{' '}
          <span className="font-bold text-orange-600">{countdownSeconds}</span>{' '}
          seconds.
        </p>

        <p className="text-sm text-gray-600">
          Click &quot;Continue&quot; to stay logged in or you will be automatically logged out.
        </p>

        <div className="flex gap-3">
          <Button
            onClick={handleLogout}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Continue
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
