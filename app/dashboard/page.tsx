"use client";

import { useState } from "react";
import { Delivery } from "@/lib/mockApi";
import { useDeliveries } from "@/hooks/useDeliveries";
import { DeliveriesTable } from "@/components/deliveries-table";
import { DeliveryDetailsModal } from "@/components/delivery-details-modal";
import { InterveneActionModal } from "@/components/intervene-action-modal";
import { TrendingUp, Package, CheckCircle, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedExceptionDelivery, setSelectedExceptionDelivery] = useState<Delivery | null>(null);
  const [showInterveneModal, setShowInterveneModal] = useState(false);

  // Pass filter states directly to your query hook
  const { data, isLoading } = useDeliveries(currentPage, 50, searchQuery, statusFilter);

  const deliveries = data?.data || [];
  const totalPages = data?.totalPages || 1;

  // Make sure resetting filters drops you back to page 1
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedDelivery(null);
  };

  const handleIntervene = (delivery: Delivery) => {
    setSelectedExceptionDelivery(delivery);
    setShowInterveneModal(true);
  };

  const handleCloseIntervene = () => {
    setShowInterveneModal(false);
    setSelectedExceptionDelivery(null);
  };

  const stats = {
    total: data?.total || 0,
    delivered: deliveries.filter((d) => d.status === "delivered").length,
    inTransit: deliveries.filter((d) => d.status === "in_transit").length,
    pending: deliveries.filter((d) => d.status === "pending" || d.status === "exception").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Welcome to RySwift Dispatch Management System
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="group bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-1.5">
            <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide uppercase">Total Shipments</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{stats.total}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl transition-colors group-hover:bg-purple-100 shrink-0">
            <Package className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
          </div>
        </div>

        <div className="group bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-1.5">
            <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide uppercase">Delivered</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{stats.delivered}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl transition-colors group-hover:bg-emerald-100 shrink-0">
            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
          </div>
        </div>

        <div className="group bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-1.5">
            <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide uppercase">In Transit</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{stats.inTransit}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl transition-colors group-hover:bg-blue-100 shrink-0">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
          </div>
        </div>

        <div className="group bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-1.5">
            <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide uppercase">Pending</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{stats.pending}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl transition-colors group-hover:bg-amber-100 shrink-0">
            <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Deliveries Table */}
      <DeliveriesTable
        deliveries={deliveries}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onIntervene={handleIntervene}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusChange}
      />

      <DeliveryDetailsModal delivery={selectedDelivery} isOpen={showDetails} onClose={handleCloseDetails} />
      <InterveneActionModal delivery={selectedExceptionDelivery} isOpen={showInterveneModal} onClose={handleCloseIntervene} />
    </div>
  );
}