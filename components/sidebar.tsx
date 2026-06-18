/* eslint-disable react-hooks/set-state-in-effect */
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
  UserSquare2,
  Receipt,
  LifeBuoy,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isHydrated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  // Base navigation configuration mapping
  const allNavItems = useMemo(() => [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, adminOnly: true },
    { label: "Deliveries", href: "/dashboard/deliveries", icon: Truck, adminOnly: false },
    { label: "Drivers", href: "/dashboard/drivers", icon: Users, adminOnly: true },
    { label: "Customers", href: "/dashboard/customers", icon: UserSquare2, adminOnly: true },
    { label: "Billing & Invoice", href: "/dashboard/billing", icon: Receipt, adminOnly: true },
  ], []);

  const secondaryNavItems = useMemo(() => [
    { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
    { label: "Account", href: "/dashboard/account", icon: UserCircle },
  ], []);

  // Filter main core tabs based on the logged-in user's role status safely
  const visibleNavItems = useMemo(() => {
    if (!isHydrated || !user) {
      return allNavItems.filter((item) => !item.adminOnly);
    }
    const isAdmin = user.role === "admin";
    return allNavItems.filter((item) => !item.adminOnly || isAdmin);
  }, [allNavItems, user, isHydrated]);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  if (!isHydrated) {
    return (
      <div className="fixed inset-y-0 left-0 w-20 lg:w-64 bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Top Navbar */}
      <div
        className={`fixed top-0 h-16 bg-white border-b border-gray-200 z-40 transition-all duration-300 left-0 right-0 ${
          isCollapsed ? "lg:left-20" : "lg:left-64"
        }`}
      >
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-gray-50 rounded-lg min-w-10 min-h-10 flex items-center justify-center transition-colors"
          >
            {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
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
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 min-w-10 min-h-10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar drawer overlay drawer */}
      <aside
        className={`fixed lg:hidden left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-45 transform transition-transform duration-300 flex flex-col justify-between overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="py-4 px-3 flex-1 space-y-6">
          {/* Main Workspace Cluster */}
          <nav className="space-y-1.5">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 h-12 px-4 rounded-lg text-sm font-medium transition-all ${
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

          {/* Secondary Sub-Category Breakout Group */}
          <div className="pt-2">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Other
            </p>
            <nav className="space-y-1.5">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 h-12 px-4 rounded-lg text-sm font-medium transition-all ${
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
        </div>

        {/* Mobile Profile Block Metadata */}
        <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Logged in
            </p>
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </aside>

      {/* Desktop layout */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-45 transition-all duration-300 shadow-xs ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Top Header */}
        <div className="h-16 border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <Image
              src="/favicon.svg"
              alt="RySwift Logo"
              width={32}
              height={32}
              className="shrink-0"
            />
            {!isCollapsed && <h1 className="font-bold text-purple-600 text-xl tracking-tight">RySwift</h1>}
          </div>

          <button
            onClick={onToggle}
            className={`p-1.5 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors shrink-0 ${
              isCollapsed ? "ml-auto" : ""
            }`}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Content scrolling navigational list groups */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-thin">
          
          {/* Main Primary Scope Nav links */}
          <nav className="space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-lg transition-all text-sm font-medium h-11 select-none ${
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

          {/* Sub-group breakout utilities category divider */}
          <div>
            {!isCollapsed ? (
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Other
              </p>
            ) : (
              <hr className="my-4 border-gray-100" />
            )}
            
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-lg transition-all text-sm font-medium h-11 select-none ${
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
        </div>

        {/* Profile Footer Panel Context identifier layout block */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
          <div
            className={`bg-gray-50 rounded-xl transition-all ${
              isCollapsed ? "p-2 text-center flex items-center justify-center min-h-10" : "p-3"
            }`}
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
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}