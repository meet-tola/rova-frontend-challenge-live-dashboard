"use client";

import { useMemo } from "react";
import { useDeliveryStore, Delivery } from "@/store/useDeliveryStore";
import { DeliveryRowList } from "./DeliveryRowList";
import { Loader2 } from "lucide-react";

interface DeliveryGridProps {
  onIntervene: (delivery: Delivery) => void;
}

export function DeliveryGrid({ onIntervene }: DeliveryGridProps) {
  const isLoading = useDeliveryStore((state) => state.isLoading);
  const deliveries = useDeliveryStore((state) => state.deliveries);
  const filters = useDeliveryStore((state) => state.filters);
  const userRole = useDeliveryStore((state) => state.filters.userRole);

  const filteredDeliveries = useMemo(() => {
    if (deliveries.length === 0) return [];

    return deliveries.filter((delivery) => {
      const statusMatch =
        filters.status === "All" || delivery.status === filters.status;
      const searchMatch =
        filters.searchTerm === "" ||
        delivery.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        delivery.driverName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [deliveries, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-slate-600">Loading deliveries...</p>
        </div>
      </div>
    );
  }

  if (filteredDeliveries.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <p className="text-slate-500">No deliveries found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
      <div className="overflow-x-auto w-full">
        <div className="w-full min-w-212.5">
          {/* Table Header */}
          <div className="grid grid-cols-[150px_1fr_180px_150px_150px_150px] gap-0 bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <div className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Delivery ID
            </div>
            <div className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Client
            </div>
            <div className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Driver
            </div>
            <div className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Status
            </div>
            <div className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              ETA
            </div>
            <div className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Action
            </div>
          </div>

          {/* Change Virtualization by changing enableVirtualization boolean */}
          <DeliveryRowList
            deliveries={filteredDeliveries}
            onIntervene={onIntervene}
            userRole={userRole}
            maxHeight="max-h-[500px]"
            enableVirtualization={false}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-sm text-slate-600">
        Showing {filteredDeliveries.length} of {deliveries.length} deliveries
      </div>
    </div>
  );
}
