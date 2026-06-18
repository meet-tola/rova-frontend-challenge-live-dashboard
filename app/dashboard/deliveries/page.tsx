"use client";

import { useState } from "react";
import { Delivery } from "@/lib/mockApi";
import { useDeliveries } from "@/hooks/useDeliveries";
import { DeliveriesTable } from "@/components/deliveries-table";
import { DeliveryDetailsModal } from "@/components/delivery-details-modal";
import { InterveneActionModal } from "@/components/intervene-action-modal";

export default function DeliveriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState(false);
  const [selectedExceptionDelivery, setSelectedExceptionDelivery] =
    useState<Delivery | null>(null);
  const [showInterveneModal, setShowInterveneModal] = useState(false);

  // Pass filter states directly to your query hook
  const { data, isLoading } = useDeliveries(
    currentPage,
    50,
    searchQuery,
    statusFilter,
  );

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Deliveries</h1>
        <p className="text-gray-600 mt-1">View and manage all shipments</p>
      </div>

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

      <DeliveryDetailsModal
        delivery={selectedDelivery}
        isOpen={showDetails}
        onClose={handleCloseDetails}
      />
      <DeliveryDetailsModal
        delivery={selectedDelivery}
        isOpen={showDetails}
        onClose={handleCloseDetails}
      />
      <InterveneActionModal
        delivery={selectedExceptionDelivery}
        isOpen={showInterveneModal}
        onClose={handleCloseIntervene}
      />
    </div>
  );
}
