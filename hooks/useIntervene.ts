'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reassignDriver, cancelDelivery } from '@/lib/mockApi';

export function useReassignDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deliveryId, newDriver }: { deliveryId: string; newDriver: string }) =>
      reassignDriver(deliveryId, newDriver),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    },
  });
}

export function useCancelDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deliveryId: string) => cancelDelivery(deliveryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    },
  });
}
