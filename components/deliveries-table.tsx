"use client";

import { Delivery } from "@/lib/mockApi";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";

interface DeliveriesTableProps {
  deliveries: Delivery[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (delivery: Delivery) => void;
  onIntervene?: (delivery: Delivery) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export function DeliveriesTable({
  deliveries,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
  onIntervene,
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: DeliveriesTableProps) {
  const { user } = useAuthStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "in_transit": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "exception": return "bg-red-100 text-red-800";
      case "pending": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatETA = (etaString: string) => {
    try {
      return new Date(etaString).toLocaleDateString("en-US", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch { return etaString; }
  };

  // Switch occurrences of `filteredDeliveries` to `deliveries` in your code!
  const filteredDeliveries = deliveries; 

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Top Header Block */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Recent Shipments
          </h2>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 min-h-9"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            <span className="text-xs sm:text-sm text-gray-600 px-2 whitespace-nowrap">
              {currentPage}/{totalPages}
            </span>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 min-h-9"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Dynamic Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID, Tracking #, or Driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium text-gray-700 transition-all min-h-11 md:min-h-0"
            />
          </div>

          {/* Status Dropdown Trigger Selection */}
          <div className="relative w-full md:w-56">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium text-gray-700 transition-all min-h-11 md:min-h-0 appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="delivered">Delivered</option>
              <option value="in_transit">In Transit</option>
              <option value="scheduled">Scheduled</option>
              <option value="exception">Exception</option>
              <option value="pending">Pending</option>
              <option value="Returned to Sender">Returned to Sender</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500 w-0 h-0" />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Delivery ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Driver Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ETA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className="text-gray-600">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filteredDeliveries.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500 font-medium"
                >
                  No matching shipments found
                </td>
              </tr>
            ) : (
              filteredDeliveries.map((delivery) => (
                <tr
                  key={delivery.id}
                  className={`hover:bg-gray-50/50 transition-colors ${
                    delivery.status === "exception"
                      ? "bg-red-50/40 border-l-4 border-red-500"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                    #{delivery.trackingNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {delivery.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {delivery.driver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                        delivery.status,
                      )}`}
                    >
                      {delivery.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatETA(delivery.eta)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => onViewDetails(delivery)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </Button>
                      {user?.role === "admin" &&
                        delivery.status === "exception" && (
                          <Button
                            onClick={() => onIntervene?.(delivery)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 bg-red-50"
                          >
                            <AlertCircle className="w-4 h-4" />
                            Intervene
                          </Button>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="text-gray-600">Loading...</span>
            </div>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium bg-gray-50/50">
            No matching shipments found
          </div>
        ) : (
          <div className="space-y-4 p-3 bg-gray-50/30">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className={`p-4 rounded-lg border-2 ${
                  delivery.status === "exception"
                    ? "bg-red-50 border-red-500"
                    : "bg-white border-gray-200"
                } hover:shadow-md transition-shadow`}
              >
                <div className="space-y-3">
                  {/* ID & Status Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">
                        Delivery ID
                      </p>
                      <p className="text-sm font-semibold text-purple-600">
                        #{delivery.id}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                        delivery.status,
                      )}`}
                    >
                      {delivery.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Client & Driver Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">
                        Client
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {delivery.clientName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">
                        Driver
                      </p>
                      <p className="text-sm text-gray-700">{delivery.driver}</p>
                    </div>
                  </div>

                  {/* ETA Info */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      ETA
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                      {formatETA(delivery.eta)}
                    </p>
                  </div>

                  {/* Mobile Actions Bound Box */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => onViewDetails(delivery)}
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 min-h-11 rounded-lg bg-white"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </Button>
                    {user?.role === "admin" &&
                      delivery.status === "exception" && (
                        <Button
                          onClick={() => onIntervene?.(delivery)}
                          variant="outline"
                          className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 min-h-11 rounded-lg text-red-600 hover:text-red-700 bg-red-50 border-red-200"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Intervene
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
