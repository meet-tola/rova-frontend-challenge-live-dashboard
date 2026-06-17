'use client';

import { useState } from 'react';
import { Delivery } from '@/store/useDeliveryStore';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';

interface InterveneModalProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InterveneModal({ delivery, isOpen, onClose }: InterveneModalProps) {
  // Independent loading states
  const [isReassigning, setIsReassigning] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  if (!isOpen || !delivery) return null;

  // Global disabled tracker if either action is working
  const isAnyLoading = isReassigning || isCanceling;

  const handleReassignDriver = async () => {
    setIsReassigning(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Driver reassigned for delivery ${delivery.id}`);
    setIsReassigning(false);
    onClose();
  };

  const handleCancelDelivery = async () => {
    setIsCanceling(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.error(`Delivery ${delivery.id} cancelled`);
    setIsCanceling(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={isAnyLoading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Intervene on Delivery</h2>
            <button
              onClick={onClose}
              disabled={isAnyLoading}
              className="text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Delivery ID</p>
              <p className="text-lg font-semibold text-slate-900">{delivery.id}</p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-700 font-medium">Status: {delivery.status}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                <strong>Driver:</strong> {delivery.driverName}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Client:</strong> {delivery.clientName}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-6 space-y-3">
            {/* Action Row - Arranged side-by-side */}
            <div className="flex gap-3">
              <button
                onClick={handleReassignDriver}
                disabled={isAnyLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                {isReassigning && <Loader2 className="w-4 h-4 animate-spin" />}
                {isReassigning ? 'Reassigning...' : 'Re-assign Driver'}
              </button>

              <button
                onClick={handleCancelDelivery}
                disabled={isAnyLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                {isCanceling && <Loader2 className="w-4 h-4 animate-spin" />}
                {isCanceling ? 'Cancelling...' : 'Cancel Delivery'}
              </button>
            </div>

            <button
              onClick={onClose}
              disabled={isAnyLoading}
              className="w-full px-4 py-2 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}