"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Truck,
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Deliveries", href: "/dashboard/deliveries", icon: Truck },
    { label: "Drivers", href: "/dashboard/drivers", icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Navbar */}
      <div
        className={`fixed top-0 h-16 bg-white border-b border-gray-200 z-60 transition-all duration-300 left-0 right-0 ${
          isCollapsed ? "lg:left-20" : "lg:left-64"
        }`}
      >
        {/* ... navbar content same as before ... */}
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-gray-50 rounded-lg"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <h1 className="text-lg font-bold text-purple-600 lg:hidden absolute left-1/2 -translate-x-1/2">
            RySwift
          </h1>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay + Mobile Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:hidden left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-2xl z-55 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Mobile content remains the same */}
        <div className="flex flex-col h-full">
          <div className="flex-1 py-6 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 h-11 px-4 rounded-lg text-sm font-medium transition-all pointer-events-auto ${
                      active
                        ? "bg-purple-50 text-purple-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Logged in
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-55 transition-all duration-300 shadow-sm ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center px-4 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <Image
              src="/favicon.svg"
              alt="RySwift Logo"
              width={32}
              height={32}
              className="shrink-0"
            />
            {!isCollapsed && (
              <h1 className="font-bold text-purple-600 text-xl">RySwift</h1>
            )}
          </div>

          <button
            onClick={onToggle}
            className={`p-1.5 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors shrink-0 ${isCollapsed ? "ml-auto" : ""}`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav + User Info - same as before */}
        <div className="flex-1 overflow-y-auto py-6 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-lg transition-all text-sm font-medium h-11 cursor-pointer select-none pointer-events-auto ${
                    isCollapsed ? "justify-center px-0" : "px-4 gap-3"
                  } ${
                    active
                      ? "bg-purple-50 text-purple-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <div
            className={`bg-gray-50 rounded-xl transition-all ${isCollapsed ? "p-2 text-center" : "p-3"}`}
          >
            {isCollapsed ? (
              <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
                {user?.name?.charAt(0) || "U"}
              </span>
            ) : (
              <>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Logged in
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
