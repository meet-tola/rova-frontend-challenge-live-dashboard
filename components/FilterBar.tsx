"use client";

import { useDeliveryStore, DeliveryStatus } from "@/store/useDeliveryStore";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function FilterBar() {
  const filters = useDeliveryStore((state) => state.filters);
  const setFilterStatus = useDeliveryStore((state) => state.setFilterStatus);
  const setSearchTerm = useDeliveryStore((state) => state.setSearchTerm);

  const statuses: Array<DeliveryStatus | "All"> = [
    "All",
    "Pending",
    "In Transit",
    "Delivered",
    "Exception",
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
        {/* Status Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Status
          </label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilterStatus(value as DeliveryStatus | "All")
            }
          >
            {/* Added explicit border and focus ring fallbacks */}
            <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            {/* Added forced light-mode classes to prevent dark portal bug */}
            <SelectContent className="bg-white border border-slate-200 text-slate-900 shadow-md">
              {statuses.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer"
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Search
          </label>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            {/* Added explicit outline ring on focus */}
            <Input
              type="text"
              placeholder="Delivery ID or Driver Name..."
              value={filters.searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* TODO: Role Filter */}
        {/* <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Role</label>
          <Select value={filters.userRole || 'Admin'} onValueChange={(value) => setUserRole(value as UserRole)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Dispatcher">Dispatcher</SelectItem>
              <SelectItem value="Driver">Driver</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>
    </div>
  );
}
