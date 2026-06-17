"use client";

import { memo } from "react";
import { Delivery, UserRole } from "@/store/useDeliveryStore";
import { AlertCircle } from "lucide-react";

interface DeliveryRowProps {
  delivery: Delivery;
  userRole?: UserRole;
  onIntervene?: (delivery: Delivery) => void;
}

const statusColors = {
  Pending: "bg-slate-100 text-slate-700",
  "In Transit": "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Exception: "bg-red-100 text-red-700",
};

const rowColors = {
  Pending: "hover:bg-slate-50",
  "In Transit": "hover:bg-blue-50",
  Delivered: "hover:bg-green-50",
  Exception: "hover:bg-red-50 border-l-4 border-red-500",
};

export const DeliveryRow = memo(function DeliveryRow({
  delivery,
  userRole = "Admin",
  onIntervene,
}: DeliveryRowProps) {
  const eta = new Date(delivery.eta);

  return (
    <div
      className={`grid grid-cols-[150px_1fr_180px_150px_150px_150px] gap-0 items-center border-b border-slate-200 transition-colors ${rowColors[delivery.status]}`}
    >
      <div className="px-6 py-4 text-sm font-medium text-slate-900 truncate">
        {delivery.id}
      </div>
      <div className="px-6 py-4 text-sm text-slate-600 truncate">
        {delivery.clientName}
      </div>
      <div className="px-6 py-4 text-sm text-slate-600 truncate">
        {delivery.driverName}
      </div>
      <div className="px-6 py-4 text-sm whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[delivery.status]}`}
        >
          {delivery.status}
        </span>
      </div>
      <div className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
        {eta.toLocaleDateString()}
      </div>
      <div className="px-6 py-4 text-sm flex justify-end items-center whitespace-nowrap">
        {delivery.status === "Exception" && userRole === "Admin" ? (
          <button
            onClick={() => onIntervene?.(delivery)}
            className="inline-flex items-center gap-2 px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" />
            Intervene
          </button>
        ) : (
          <span className="text-slate-400 text-xs px-2">—</span>
        )}
      </div>
    </div>
  );
});
