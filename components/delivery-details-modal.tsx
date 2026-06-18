'use client';

import { Delivery } from '@/lib/mockApi';
import { Button } from '@/components/ui/button';
import { X, Truck, User, Calendar, Navigation } from 'lucide-react';

interface DeliveryDetailsModalProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors: Record<Delivery['status'], string> = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  in_transit: 'bg-amber-50 text-amber-700 border-amber-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-gray-50 text-gray-600 border-gray-200',
  exception: 'bg-red-50 text-red-700 border-red-200',
};

export function DeliveryDetailsModal({ delivery, isOpen, onClose }: DeliveryDetailsModalProps) {
  if (!isOpen || !delivery) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-100 p-4">
      {/* Container Cards */}
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col">
        
        {/* Simple Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shipment Details</span>
            <h2 className="text-base font-semibold text-gray-900 mt-0.5">{delivery.trackingNumber}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Status Badge Row */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Status</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusColors[delivery.status]}`}>
              {delivery.status.replace('_', ' ')}
            </span>
          </div>

          {/* Simple Route/Location Path */}
          <div className="relative border-l-2 border-dashed border-gray-200 pl-4 ml-2 my-2 space-y-4">
            <div className="relative">
              <div className="absolute -left-5.75 top-0.5 bg-white p-0.5 rounded-full border border-gray-300">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
              </div>
              <p className="text-[11px] font-medium text-gray-400 uppercase">Pickup</p>
              <p className="text-sm font-medium text-gray-800">{delivery.pickup}</p>
            </div>
            <div className="relative">
              <div className="absolute -left-5.75 top-0.5 bg-white p-0.5 rounded-full border border-gray-300">
                <div className="w-2 h-2 rounded-full bg-green-600" />
              </div>
              <p className="text-[11px] font-medium text-gray-400 uppercase">Destination</p>
              <p className="text-sm font-medium text-gray-800">{delivery.delivery}</p>
            </div>
          </div>

          {/* Core Properties Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 text-sm">
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
                <User className="w-3.5 h-3.5" />
                <span className="text-xs">Driver</span>
              </div>
              <p className="font-medium text-gray-800">{delivery.driver}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
                <Truck className="w-3.5 h-3.5" />
                <span className="text-xs">Vehicle</span>
              </div>
              <p className="font-medium text-gray-800">{delivery.vehicle}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs">Expected ETA</span>
              </div>
              <p className="font-medium text-gray-800">{delivery.expectedDelivery}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
                <Navigation className="w-3.5 h-3.5" />
                <span className="text-xs">Current Location</span>
              </div>
              <p className="font-medium text-purple-600 truncate">{delivery.currentLocation}</p>
            </div>
          </div>

          {/* Minimal Progress Indicator */}
          <div className="space-y-1.5 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-gray-400">Transit Progress</span>
              <span className="text-gray-700">{delivery.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${delivery.progress}%` }} 
              />
            </div>
          </div>

        </div>

        {/* Minimal Footer Footer Row */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="text-xs h-9 px-4 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg"
          >
            Dismiss
          </Button>
        </div>

      </div>
    </div>
  );
}