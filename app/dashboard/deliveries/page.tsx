'use client';

import { useState } from 'react';
import { Delivery } from '@/lib/mockApi';
import { useDeliveries } from '@/hooks/useDeliveries';
import { DeliveriesTable } from '@/components/deliveries-table';
import { DeliveryDetailsModal } from '@/components/delivery-details-modal';

export default function DeliveriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);

  const { data, isLoading } = useDeliveries(currentPage, 20);

  const deliveries = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedDelivery(null);
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
        isLoading={isLoading}
      />

      <DeliveryDetailsModal
        delivery={selectedDelivery}
        isOpen={showDetails}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
