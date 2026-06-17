'use client';

import { useEffect, useState } from 'react';
import { useDeliveryStore, Delivery } from '@/store/useDeliveryStore';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilterBar } from '@/components/FilterBar';
import { DeliveryGrid } from '@/components/DeliveryGrid';
import { InterveneModal } from '@/components/InterveneModal';
import { Toaster } from 'sonner';
import { Play, Square } from 'lucide-react';

export default function Home() {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const fetchDeliveries = useDeliveryStore((state) => state.fetchDeliveries);
  const isSimulating = useDeliveryStore((state) => state.isSimulating);
  const startSimulation = useDeliveryStore((state) => state.startSimulation);
  const stopSimulation = useDeliveryStore((state) => state.stopSimulation);

  // Initialize data and start simulation on mount
  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  useEffect(() => {
    startSimulation();
    return () => {
      stopSimulation();
    };
  }, [startSimulation, stopSimulation]);

  const handleIntervene = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  const toggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <button
            onClick={toggleSimulation}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              isSimulating
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isSimulating ? (
              <>
                <Square className="w-4 h-4" />
                Stop Simulation
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Simulation
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DashboardHeader />
        <FilterBar />
        <DeliveryGrid onIntervene={handleIntervene} />
      </div>

      {/* Modal */}
      <InterveneModal
        delivery={selectedDelivery}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Toast Container */}
      <Toaster position="top-right" />
    </main>
  );
}
