/* eslint-disable @typescript-eslint/no-explicit-any */
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface UseVirtualizerOptions {
  items: any[];
  overscan?: number;
  estimateSize?: number;
}

export const useVirtualizerHook = ({
  items,
  overscan = 10,
  estimateSize = 60,
}: UseVirtualizerOptions) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  // Track item counts and size recalculations safely
  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start ?? 0 : 0;
  const paddingBottom =
    virtualItems.length > 0 ? totalSize - (virtualItems[virtualItems.length - 1]?.end ?? 0) : 0;

  return {
    parentRef,
    virtualItems,
    paddingTop,
    paddingBottom,
    totalSize,
  };
};