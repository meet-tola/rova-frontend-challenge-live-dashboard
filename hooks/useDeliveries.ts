'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDeliveries } from '@/lib/mockApi';

export function useDeliveries(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['deliveries', page, limit],
    queryFn: () => fetchDeliveries(page, limit),
    staleTime: 2 * 1000, // 2 seconds
    refetchInterval: 5 * 1000, // Auto-refetch every 5 seconds
  });
}
