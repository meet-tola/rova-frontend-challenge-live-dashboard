'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDeliveries } from '@/lib/mockApi';

export function useDeliveries(
  page: number = 1, 
  limit: number = 50, 
  searchQuery: string = "", 
  statusFilter: string = "all"
) {
  return useQuery({
    queryKey: ['deliveries', page, limit, searchQuery, statusFilter],
    queryFn: () => fetchDeliveries(page, limit, searchQuery, statusFilter),
    staleTime: 2 * 1000, // 2 seconds
    refetchInterval: 5 * 1000, // Auto-refetch every 5 seconds
  });
}