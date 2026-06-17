'use client';

import { useDeliveryStore } from '@/store/useDeliveryStore';
import { Package, TrendingUp, AlertCircle } from 'lucide-react';

export function DashboardHeader() {
  const deliveries = useDeliveryStore((state) => state.deliveries);

  const stats = {
    total: deliveries.length,
    inTransit: deliveries.filter((d) => d.status === 'In Transit').length,
    exceptions: deliveries.filter((d) => d.status === 'Exception').length,
  };

  const metrics = [
    {
      label: 'Total Deliveries',
      value: stats.total,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'In Transit',
      value: stats.inTransit,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Exceptions',
      value: stats.exceptions,
      icon: AlertCircle,
      color: 'bg-red-50 text-red-600',
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Live Dispatch Dashboard</h1>
        <p className="text-slate-500 mt-1">Real-time delivery monitoring and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
              </div>
              <div className={`${color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
