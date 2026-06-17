'use client';

import { useRef } from 'react';
import { useVirtualizerHook } from '@/hooks/useVirtualizer';
import { DeliveryRow } from './DeliveryRow';
import { Delivery, UserRole } from '@/store/useDeliveryStore';

interface DeliveryRowListProps {
  deliveries: Delivery[];
  onIntervene: (delivery: Delivery) => void;
  userRole: UserRole;
  maxHeight?: string;
  enableVirtualization?: boolean;
}

export function DeliveryRowList({
  deliveries,
  onIntervene,
  userRole,
  maxHeight = 'max-h-[500px]',
  enableVirtualization = true,
}: DeliveryRowListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pass items securely to the virtualizer hook
  const { parentRef, virtualItems, paddingTop, totalSize } = useVirtualizerHook({
    items: deliveries,
    overscan: 5,
    estimateSize: 53, 
  });

  if (deliveries.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No deliveries to display
      </div>
    );
  }

  return (
    <div
      ref={enableVirtualization ? parentRef : containerRef}
      className={`overflow-y-auto block ${maxHeight}`}
      style={{ position: 'relative' }}
    >
      <div className="w-full" style={{ height: `${totalSize}px`, position: 'relative' }}>
        
        <div style={{ transform: `translateY(${paddingTop}px)` }}>
          {virtualItems.map((vi) => {
            const delivery = deliveries[vi.index];
            if (!delivery) return null;

            return (
              <DeliveryRow
                key={`virtual-${vi.index}-${delivery.id}`}
                delivery={delivery}
                userRole={userRole}
                onIntervene={onIntervene}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}