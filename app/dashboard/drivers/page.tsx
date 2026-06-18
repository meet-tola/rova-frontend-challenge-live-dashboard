"use client";

import { Users, TrendingUp, AlertCircle } from "lucide-react";

export default function DriversPage() {
  const drivers = [
    {
      id: "1",
      name: "John Smith",
      deliveries: 24,
      rating: 4.8,
      status: "active",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      deliveries: 18,
      rating: 4.9,
      status: "active",
    },
    {
      id: "3",
      name: "Mike Davis",
      deliveries: 31,
      rating: 4.7,
      status: "active",
    },
    {
      id: "4",
      name: "Emily Wilson",
      deliveries: 15,
      rating: 4.6,
      status: "offline",
    },
    {
      id: "5",
      name: "Robert Brown",
      deliveries: 22,
      rating: 4.8,
      status: "active",
    },
    {
      id: "6",
      name: "Jessica Lee",
      deliveries: 28,
      rating: 4.9,
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
        <p className="text-gray-600 mt-1">Manage your delivery drivers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Active Drivers */}
        <div className="group bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-1.5">
            <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide uppercase">
              Active Drivers
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              5
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl transition-colors group-hover:bg-purple-100 shrink-0">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
          </div>
        </div>

        {/* Total Deliveries */}
        <div className="group bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-1.5">
            <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide uppercase">
              Total Deliveries
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              138
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl transition-colors group-hover:bg-blue-100 shrink-0">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
          </div>
        </div>

        {/* Avg. Rating */}
        <div className="group bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-1.5">
            <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide uppercase">
              Avg. Rating
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              4.8
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl transition-colors group-hover:bg-emerald-100 shrink-0">
            <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Driver List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Deliveries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {driver.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {driver.deliveries}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {driver.rating}
                      </span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < Math.floor(driver.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        driver.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {driver.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
