"use client";

import { useState } from "react";
import { Delivery } from "@/lib/mockApi";
import { useReassignDriver, useCancelDelivery } from "@/hooks/useIntervene";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { X, ShieldAlert, UserCheck, Ban } from "lucide-react";

const AVAILABLE_DRIVERS = [
  "John Smith",
  "Sarah Johnson",
  "Mike Davis",
  "Emily Wilson",
  "Robert Brown",
  "Jessica Lee",
];

interface InterveneActionModalProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InterveneActionModal({
  delivery,
  isOpen,
  onClose,
}: InterveneActionModalProps) {
  const [selectedDriver, setSelectedDriver] = useState("");
  const { mutate: reassign, isPending: isReassigning } = useReassignDriver();
  const { mutate: cancel, isPending: isCanceling } = useCancelDelivery();

  if (!isOpen || !delivery) return null;

  const handleReassign = () => {
    if (!selectedDriver) {
      toast.error("Please select a driver before reassignment.");
      return;
    }

    reassign(
      { deliveryId: delivery.id, newDriver: selectedDriver },
      {
        onSuccess: () => {
          toast.success(`Driver reassigned to ${selectedDriver}`);
          onClose();
        },
        onError: () => {
          toast.error("Failed to update driver assignment.");
        },
      },
    );
  };

  const handleCancel = () => {
    cancel(delivery.id, {
      onSuccess: () => {
        toast.success(`Delivery ${delivery.id} successfully cancelled`);
        onClose();
      },
      onError: () => {
        toast.error("Failed to cancel this shipment.");
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-150 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header Block */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Exception Intervention
              </span>
              <h2 className="text-base font-semibold text-gray-900 mt-0.5">
                Resolve Dispatch Issue
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors min-w-10 min-h-10 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase">
                Tracking Number
              </p>
              <p className="font-mono font-bold text-gray-800 mt-0.5 truncate">
                {delivery.trackingNumber}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase">
                Assigned Driver
              </p>
              <p className="font-semibold text-gray-800 mt-0.5 truncate">
                {delivery.driver}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Reassign Route to Alternate Driver
            </label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-base font-medium text-gray-700 transition-all min-h-12"
            >
              <option value="">Select driver...</option>
              {AVAILABLE_DRIVERS.map((driver) => (
                <option key={driver} value={driver}>
                  {driver}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Operational Footer Actions - Fluid Touch Optimization */}
        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleReassign}
            disabled={isReassigning || isCanceling || !selectedDriver}
            className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm py-3 min-h-11.5 rounded-lg flex items-center justify-center gap-2 transition-colors order-1 sm:order-2 shadow-sm"
          >
            <UserCheck className="w-4 h-4" />
            <span>{isReassigning ? "Updating..." : "Reassign Driver"}</span>
          </Button>

          <Button
            onClick={handleCancel}
            disabled={isCanceling || isReassigning}
            variant="outline"
            className="w-full sm:flex-1 border-gray-200 hover:bg-red-50 text-red-600 hover:text-red-700 text-sm py-3 min-h-11.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors order-2 sm:order-1"
          >
            <Ban className="w-4 h-4" />
            <span>{isCanceling ? "Cancelling..." : "Cancel Delivery"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
